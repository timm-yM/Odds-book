import Stripe from 'stripe';
import { env, isStripeEnabled } from '../config/env';
import { IPick } from '../models/Pick';

let stripeClient: Stripe | null = null;

function getClient(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(env.stripeSecretKey, { apiVersion: '2024-06-20' });
  }
  return stripeClient;
}

export { isStripeEnabled };

export interface CheckoutSessionResult {
  url: string;
  sessionId: string;
}

export async function createCheckoutSession(pick: IPick, orderId: string): Promise<CheckoutSessionResult> {
  const stripe = getClient();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: (pick.currency || 'usd').toLowerCase(),
          product_data: {
            name: `${pick.homeTeam} vs ${pick.awayTeam} - ${pick.market}`,
            description: `${pick.league} · ${pick.sport} pick on ODDSBOOK`,
          },
          unit_amount: Math.round(pick.price * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { orderId, pickId: String(pick._id) },
    success_url: `${env.clientUrl}/picks/${pick._id}?checkout=success`,
    cancel_url: `${env.clientUrl}/picks/${pick._id}?checkout=cancelled`,
  });

  return { url: session.url ?? '', sessionId: session.id };
}

export function constructWebhookEvent(rawBody: Buffer, signature: string): Stripe.Event {
  const stripe = getClient();
  return stripe.webhooks.constructEvent(rawBody, signature, env.stripeWebhookSecret);
}
