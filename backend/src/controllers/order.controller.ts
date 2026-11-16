import { Request, Response } from 'express';
import { z } from 'zod';
import { Pick } from '../models/Pick';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { env, isPayHeroEnabled } from '../config/env';
import { initiateStkPush, normalizeKenyanPhone } from '../services/payhero.service';
import { reconcileOrder } from '../services/order.service';

const checkoutSchema = z.object({
  pickId: z.string().min(1),
  phoneNumber: z.string().optional(),
});

function computeSplit(amount: number) {
  const platformFee = Math.round(amount * (env.platformFeePercent / 100) * 100) / 100;
  const sellerPayout = Math.round((amount - platformFee) * 100) / 100;
  return { platformFee, sellerPayout };
}

/**
 * Starts (or instantly completes) a purchase for a pick.
 * - Free picks: completed immediately, no payment involved.
 * - Paid picks with Pay Hero configured: creates a pending order and sends an M-Pesa STK Push to the
 *   buyer's phone. The frontend then polls GET /orders/:id/status until it flips to completed/failed.
 * - Paid picks without Pay Hero keys (demo mode): completed immediately so the app is testable out of the box.
 */
export const checkout = asyncHandler(async (req: Request, res: Response) => {
  const { pickId, phoneNumber } = checkoutSchema.parse(req.body);
  const pick = await Pick.findById(pickId);
  if (!pick) throw ApiError.notFound('Pick not found');

  if (String(pick.seller) === String(req.user!._id)) {
    throw ApiError.badRequest('You cannot buy your own pick');
  }

  const existing = await Order.findOne({ pick: pick._id, buyer: req.user!._id });
  if (existing?.status === 'completed') {
    return res.status(200).json({ success: true, data: { alreadyUnlocked: true, order: existing } });
  }

  // ---- Free pick ----
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
    return res.status(200).json({ success: true, data: { pending: false, order } });
  }

  const { platformFee, sellerPayout } = computeSplit(pick.price);

  // ---- Paid pick via M-Pesa (Pay Hero) ----
  if (isPayHeroEnabled) {
    if (existing?.status === 'pending' && existing.updatedAt.getTime() > Date.now() - 60_000) {
      // A prompt was sent <1 min ago - don't spam the customer's phone, just keep waiting on it.
      return res.status(200).json({ success: true, data: { pending: true, orderId: String(existing._id) } });
    }

    const phone = normalizeKenyanPhone(phoneNumber ?? '');
    if (!phone) throw ApiError.badRequest('Enter a valid Safaricom number, e.g. 0712 345 678');

    const order =
      existing ??
      (await Order.create({
        pick: pick._id,
        buyer: req.user!._id,
        seller: pick.seller,
        amount: pick.price,
        platformFee,
        sellerPayout,
        currency: 'KES',
        status: 'pending',
        paymentMethod: 'mpesa',
        phoneNumber: phone,
      }));

    order.amount = pick.price;
    order.platformFee = platformFee;
    order.sellerPayout = sellerPayout;
    order.status = 'pending';
    order.paymentMethod = 'mpesa';
    order.phoneNumber = phone;
    order.failureReason = undefined;

    const stk = await initiateStkPush({
      amount: pick.price,
      phoneNumber: phone,
      externalReference: String(order._id),
      customerName: req.user!.name,
    });
    order.payheroReference = stk.reference;
    order.checkoutRequestId = stk.checkoutRequestId;
    await order.save();

    return res.status(200).json({ success: true, data: { pending: true, orderId: String(order._id) } });
  }

  // ---- Demo mode: no Pay Hero keys configured, complete immediately ----
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

  res.status(200).json({ success: true, data: { pending: false, order, demoMode: true } });
});

/** Polled by the frontend after an STK push. Re-checks with Pay Hero while the order is still pending. */
export const orderStatus = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findOne({ _id: req.params.id, buyer: req.user!._id });
  if (!order) throw ApiError.notFound('Order not found');

  const fresh = await reconcileOrder(order).catch(() => order);
  res.status(200).json({
    success: true,
    data: { status: fresh.status, mpesaReceipt: fresh.mpesaReceipt, failureReason: fresh.failureReason },
  });
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
