import { env } from '../config/env';
import * as pesaflux from './pesaflux.service';
import * as payhero from './payhero.service';

export type PaymentProvider = 'pesaflux' | 'payhero';

export interface PaymentCheck {
  status: 'SUCCESS' | 'FAILED' | 'QUEUED';
  receipt?: string;
  amount?: number;
}

export { normalizeKenyanPhone } from './payhero.service';

/** Sends the M-Pesa prompt through the configured provider. */
export async function startPayment(params: {
  amount: number;
  phoneNumber: string;
  orderId: string;
  customerName?: string;
}): Promise<{ provider: PaymentProvider; reference: string; checkoutRequestId: string }> {
  if (env.paymentProvider === 'payhero') {
    const r = await payhero.initiateStkPush({
      amount: params.amount,
      phoneNumber: params.phoneNumber,
      externalReference: params.orderId,
      customerName: params.customerName,
    });
    return { provider: 'payhero', ...r };
  }
  const r = await pesaflux.initiateStkPush({
    amount: params.amount,
    phoneNumber: params.phoneNumber,
    externalReference: params.orderId,
  });
  return { provider: 'pesaflux', ...r };
}

/** Asks the provider that created the order (not whatever is configured now) for the real payment result. */
export async function checkPayment(provider: PaymentProvider, reference: string): Promise<PaymentCheck> {
  if (provider === 'payhero') {
    const r = await payhero.getTransactionStatus(reference);
    return { status: r.status === 'QUEUED' ? 'QUEUED' : r.status, receipt: r.mpesaReceipt };
  }
  return pesaflux.getTransactionStatus(reference);
}
