import { Request, Response } from 'express';
import { z } from 'zod';
import { Pick } from '../models/Pick';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { env, isStripeEnabled } from '../config/env';
import { createCheckoutSession } from '../services/stripe.service';

const checkoutSchema = z.object({ pickId: z.string().min(1) });

function computeSplit(amount: number) {
  const platformFee = Math.round(amount * (env.platformFeePercent / 100) * 100) / 100;
  const sellerPayout = Math.round((amount - platformFee) * 100) / 100;
  return { platformFee, sellerPayout };
}

/**
 * Starts (or instantly completes) a purchase for a pick.
 * - Free picks: completed immediately, no payment involved.
 * - Paid picks with Stripe configured: creates a pending order + Stripe Checkout session, returns a redirect url.
 * - Paid picks without Stripe configured (demo mode): completed immediately so the app is fully testable out of the box.
 */
export const checkout = asyncHandler(async (req: Request, res: Response) => {
  const { pickId } = checkoutSchema.parse(req.body);
  const pick = await Pick.findById(pickId);
  if (!pick) throw ApiError.notFound('Pick not found');

  if (String(pick.seller) === String(req.user!._id)) {
    throw ApiError.badRequest('You cannot buy your own pick');
  }

  const existing = await Order.findOne({ pick: pick._id, buyer: req.user!._id });
  if (existing?.status === 'completed') {
    return res.status(200).json({ success: true, data: { alreadyUnlocked: true, order: existing } });
  }

  if (pick.price === 0) {
    const order =
      existing ??
      (await Order.create({
        pick: pick._id,
        buyer: req.user!._id,
        seller: pick.seller,
        amount: 0,
        platformFee: 0,
        sellerPayout: 0,
        currency: pick.currency,
        status: 'completed',
        paymentMethod: 'free',
      }));
    if (existing) {
      existing.status = 'completed';
      await existing.save();
    }
    pick.purchaseCount += 1;
    await pick.save();
    return res.status(200).json({ success: true, data: { redirect: false, order } });
  }

  const { platformFee, sellerPayout } = computeSplit(pick.price);

  if (isStripeEnabled) {
    const order =
      existing ??
      (await Order.create({
        pick: pick._id,
        buyer: req.user!._id,
        seller: pick.seller,
        amount: pick.price,
        platformFee,
        sellerPayout,
        currency: pick.currency,
        status: 'pending',
        paymentMethod: 'stripe',
      }));

    const { url, sessionId } = await createCheckoutSession(pick, String(order._id));
    order.stripeSessionId = sessionId;
    await order.save();

    return res.status(200).json({ success: true, data: { redirect: true, url } });
  }

  // Demo mode - no Stripe keys configured, complete the purchase immediately.
  const order =
    existing ??
    (await Order.create({
      pick: pick._id,
      buyer: req.user!._id,
      seller: pick.seller,
      amount: pick.price,
      platformFee,
      sellerPayout,
      currency: pick.currency,
      status: 'completed',
      paymentMethod: 'manual',
    }));
  if (existing) {
    existing.status = 'completed';
    existing.amount = pick.price;
    existing.platformFee = platformFee;
    existing.sellerPayout = sellerPayout;
    await existing.save();
  }

  pick.purchaseCount += 1;
  await pick.save();
  await User.findByIdAndUpdate(pick.seller, { $inc: { walletBalance: sellerPayout } });

  res.status(200).json({ success: true, data: { redirect: false, order, demoMode: true } });
});

export const myPurchases = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({ buyer: req.user!._id, status: 'completed' })
    .populate({ path: 'pick', populate: { path: 'seller', select: 'name avatarColor' } })
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: orders });
});

export const mySales = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({ seller: req.user!._id, status: 'completed' })
    .populate('pick', 'homeTeam awayTeam market price')
    .populate('buyer', 'name avatarColor')
    .sort({ createdAt: -1 });

  const totalRevenue = orders.reduce((sum, o) => sum + o.sellerPayout, 0);
  res.status(200).json({ success: true, data: { orders, totalRevenue, salesCount: orders.length } });
});
