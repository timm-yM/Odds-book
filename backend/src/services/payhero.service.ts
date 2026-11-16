import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

const BASE_URL = 'https://backend.payhero.co.ke';

export type PayHeroStatus = 'QUEUED' | 'SUCCESS' | 'FAILED';

export interface StkPushResult {
  reference: string;
  checkoutRequestId: string;
}

export interface TransactionStatus {
  status: PayHeroStatus;
  mpesaReceipt?: string;
}

function authHeader(): string {
  const token = Buffer.from(`${env.payheroUsername}:${env.payheroPassword}`).toString('base64');
  return `Basic ${token}`;
}

/** Accepts 07XXXXXXXX, 01XXXXXXXX, 7XXXXXXXX, +2547XXXXXXXX, 2547XXXXXXXX. Returns 07XXXXXXXX / 01XXXXXXXX. */
export function normalizeKenyanPhone(input: string): string | null {
  const digits = input.replace(/[\s\-()+]/g, '');
  let local: string;
  if (/^254[17]\d{8}$/.test(digits)) local = `0${digits.slice(3)}`;
  else if (/^0[17]\d{8}$/.test(digits)) local = digits;
  else if (/^[17]\d{8}$/.test(digits)) local = `0${digits}`;
  else return null;
  return local;
}

async function payheroFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { Authorization: authHeader(), 'Content-Type': 'application/json', ...(init.headers ?? {}) },
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    throw new ApiError(502, 'Could not reach the payment provider. Please try again.');
  }

  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const msg = (body.error_message as string) || (body.message as string) || 'Payment provider rejected the request';
    console.error('[payhero] error', res.status, JSON.stringify(body));
    throw new ApiError(res.status === 401 || res.status === 403 ? 502 : 400, msg);
  }
  return body as T;
}

/** Sends the M-Pesa PIN prompt to the customer's phone. */
export async function initiateStkPush(params: {
  amount: number;
  phoneNumber: string;
  externalReference: string;
  customerName?: string;
}): Promise<StkPushResult> {
  const callbackUrl = `${env.apiUrl}/api/payments/payhero/callback?token=${encodeURIComponent(env.payheroCallbackSecret)}`;

  const data = await payheroFetch<{ success?: boolean; reference?: string; CheckoutRequestID?: string }>(
    '/api/v2/payments',
    {
      method: 'POST',
      body: JSON.stringify({
        amount: Math.round(params.amount), // Pay Hero expects whole shillings
        phone_number: params.phoneNumber,
        channel_id: env.payheroChannelId,
        provider: 'm-pesa',
        external_reference: params.externalReference,
        customer_name: params.customerName,
        callback_url: callbackUrl,
      }),
    }
  );

  if (!data.reference) throw new ApiError(502, 'Payment provider did not return a reference');
  return { reference: data.reference, checkoutRequestId: data.CheckoutRequestID ?? '' };
}

/** Source of truth for a payment. We never trust the callback body on its own - we re-check here. */
export async function getTransactionStatus(reference: string): Promise<TransactionStatus> {
  const data = await payheroFetch<{ status?: string; provider_reference?: string; third_party_reference?: string }>(
    `/api/v2/transaction-status?reference=${encodeURIComponent(reference)}`,
    { method: 'GET' }
  );
  const status = (data.status ?? 'QUEUED').toUpperCase();
  return {
    status: status === 'SUCCESS' ? 'SUCCESS' : status === 'FAILED' ? 'FAILED' : 'QUEUED',
    mpesaReceipt: data.provider_reference || data.third_party_reference || undefined,
  };
}
