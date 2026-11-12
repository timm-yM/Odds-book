import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Pick } from '../models/Pick';
import { User } from '../models/User';
import { constructWebhookEvent } from '../services/stripe.service';
import { asyncHandler } from '../utils/asyncHandler';

export const stripeWebhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;

  let event;
  try {
    event = constructWebhookEvent(req.body, signature);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    return res.status(400).send(`Webhook Error: ${message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as { id: string };
    const order = await Order.findOne({ stripeSessionId: session.id });

    if (order && order.status !== 'completed') {
      order.status = 'completed';
      await order.save();
      await Pick.findByIdAndUpdate(order.pick, { $inc: { purchaseCount: 1 } });
      await User.findByIdAndUpdate(order.seller, { $inc: { walletBalance: order.sellerPayout } });
    }
  }

  res.status(200).json({ received: true });
});
