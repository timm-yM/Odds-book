import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { asyncHandler } from '../utils/asyncHandler';
import { env } from '../config/env';
import { reconcileOrder } from '../services/order.service';

/**
 * Pay Hero posts the payment result here after the customer enters (or cancels) their M-Pesa PIN.
 * We do NOT trust the body: we only use it to find the order, then re-verify with Pay Hero's
 * transaction-status endpoint. Always answers 200 so Pay Hero does not keep retrying.
 */
export const payheroCallback = asyncHandler(async (req: Request, res: Response) => {
  if (!env.payheroCallbackSecret || req.query.token !== env.payheroCallbackSecret) {
    return res.status(401).json({ received: false });
  }

  const payload = (req.body ?? {}) as Record<string, any>;
  const inner = (payload.response ?? payload) as Record<string, any>;
  const externalRef = inner.ExternalReference ?? inner.external_reference;
  const checkoutId = inner.CheckoutRequestID;
  const reference = inner.reference;

  const order =
    (externalRef && (await Order.findById(String(externalRef)).catch(() => null))) ||
    (reference && (await Order.findOne({ payheroReference: String(reference) }))) ||
    (checkoutId && (await Order.findOne({ checkoutRequestId: String(checkoutId) })));

  if (order) {
    try {
      await reconcileOrder(order);
    } catch (err) {
      console.error('[payhero] callback reconcile failed', err);
    }
  }

  res.status(200).json({ received: true });
});
