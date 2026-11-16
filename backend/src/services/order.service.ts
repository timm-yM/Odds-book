import { Order, IOrder } from '../models/Order';
import { Pick } from '../models/Pick';
import { User } from '../models/User';
import { getTransactionStatus } from './payhero.service';

/** Marks a pending order completed exactly once (safe if callback + polling race each other). */
async function completeOrder(orderId: string, mpesaReceipt?: string): Promise<IOrder | null> {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, status: 'pending' },
    { status: 'completed', mpesaReceipt, failureReason: undefined },
    { new: true }
  );
  if (order) {
    await Pick.findByIdAndUpdate(order.pick, { $inc: { purchaseCount: 1 } });
    await User.findByIdAndUpdate(order.seller, { $inc: { walletBalance: order.sellerPayout } });
  }
  return order ?? Order.findById(orderId);
}

async function failOrder(orderId: string, reason: string): Promise<IOrder | null> {
  await Order.updateOne({ _id: orderId, status: 'pending' }, { status: 'failed', failureReason: reason });
  return Order.findById(orderId);
}

/** Asks Pay Hero for the real result of a pending order and updates it. Returns the fresh order. */
export async function reconcileOrder(order: IOrder): Promise<IOrder> {
  if (order.status !== 'pending' || order.paymentMethod !== 'mpesa' || !order.payheroReference) return order;

  const result = await getTransactionStatus(order.payheroReference);
  if (result.status === 'SUCCESS') return (await completeOrder(String(order._id), result.mpesaReceipt)) ?? order;
  if (result.status === 'FAILED') return (await failOrder(String(order._id), 'Payment was cancelled or failed')) ?? order;
  return order;
}
