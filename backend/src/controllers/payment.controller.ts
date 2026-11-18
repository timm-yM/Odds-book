import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { Order, IOrder } from '../models/Order';
import { asyncHandler } from '../utils/asyncHandler';
import { env } from '../config/env';
import { reconcileOrder } from '../services/order.service';

/**
 * Payment webhook (PesaFlux and Pay Hero). The provider calls this after the customer enters or cancels
 * their M-Pesa PIN. We do NOT trust the body: it is only used to find the order, which is then re-verified
 * with the provider's status API. Always answers 200 so the provider does not keep retrying.
 */
export const paymentWebhook = asyncHandler(async (req: Request, res: Response) => {
  if (!env.paymentWebhookSecret || req.query.token !== env.paymentWebhookSecret) {
    return res.status(401).json({ received: false });
  }

  const body = (req.body ?? {}) as Record<string, any>;
  const inner = (body.response ?? body) as Record<string, any>; // Pay Hero nests under `response`

  // Our order id comes back as PesaFlux "TransactionReference" / Pay Hero "ExternalReference"
  const orderIdCandidate = String(inner.TransactionReference ?? inner.ExternalReference ?? inner.external_reference ?? '');
  const providerRefs = [inner.TransactionID, inner.reference, inner.transaction_request_id].filter(Boolean).map(String);
  const checkoutId = inner.CheckoutRequestID ? String(inner.CheckoutRequestID) : '';

  let order: IOrder | null = null;
  if (isValidObjectId(orderIdCandidate)) order = await Order.findById(orderIdCandidate);
  if (!order && providerRefs.length) order = await Order.findOne({ paymentReference: { $in: providerRefs } });
  if (!order && checkoutId) order = await Order.findOne({ checkoutRequestId: checkoutId });

  if (order) {
    try {
      await reconcileOrder(order);
    } catch (err) {
      console.error('[payment] webhook reconcile failed', err);
    }
  }

  res.status(200).json({ received: true });
});
