import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

const BASE_URL = 'https://api.pesaflux.co.ke/v1';

/** PesaFlux accepts 2547XXXXXXXX or 07XXXXXXXX. We always send the 254 form. */
export function toMsisdn(local: string): string {
  return local.startsWith('0') ? `254${local.slice(1)}` : local;
}

async function pesafluxPost<T>(path: string, payload: Record<string, unknown>): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: env.pesafluxApiKey, email: env.pesafluxEmail, ...payload }),
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    throw new ApiError(502, 'Could not reach the payment provider. Please try again.');
  }

  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    console.error('[pesaflux] http error', res.status, JSON.stringify(body));
    throw new ApiError(502, 'The payment provider rejected the request. Please try again.');
  }
  return body as T;
}

/** Sends the M-Pesa PIN prompt. `reference` is our order id so webhooks can be matched back to it. */
export async function initiateStkPush(params: {
  amount: number;
  phoneNumber: string; // 07XXXXXXXX
  externalReference: string;
}): Promise<{ reference: string; checkoutRequestId: string }> {
  // Note: PesaFlux spells the message field "massage" in its API responses.
  const data = await pesafluxPost<{ success?: string | number; massage?: string; message?: string; transaction_request_id?: string }>(
    '/initiatestk',
    {
      amount: Math.round(params.amount),
      msisdn: toMsisdn(params.phoneNumber),
      reference: params.externalReference,
    }
  );

  if (String(data.success) !== '200' || !data.transaction_request_id) {
    console.error('[pesaflux] initiate failed', JSON.stringify(data));
    throw new ApiError(400, data.massage || data.message || 'Could not send the M-Pesa prompt. Check the number and try again.');
  }
  return { reference: data.transaction_request_id, checkoutRequestId: '' };
}

export interface PesafluxStatus {
  status: 'SUCCESS' | 'FAILED' | 'QUEUED';
  receipt?: string;
  amount?: number;
}

/** Source of truth for a payment. Webhook bodies are never trusted on their own. */
export async function getTransactionStatus(transactionRequestId: string): Promise<PesafluxStatus> {
  const data = await pesafluxPost<{
    TransactionStatus?: string;
    TransactionReceipt?: string;
    TransactionAmount?: string | number;
  }>('/transactionstatus', { transaction_request_id: transactionRequestId });

  const s = String(data.TransactionStatus ?? '').toLowerCase();
  const amount = data.TransactionAmount !== undefined ? Number(data.TransactionAmount) : undefined;

  if (s === 'completed' || s === 'success' || s === 'successful') {
    return { status: 'SUCCESS', receipt: data.TransactionReceipt || undefined, amount: Number.isFinite(amount) ? amount : undefined };
  }
  if (/fail|cancel|expire|timeout|reject|insufficient/.test(s)) return { status: 'FAILED' };
  return { status: 'QUEUED' };
}
