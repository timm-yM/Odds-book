import dotenv from 'dotenv';

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '5000', 10),
  mongoUri: required('MONGO_URI', 'mongodb://127.0.0.1:27017/oddsbook'),
  jwtSecret: required('JWT_SECRET', 'dev-only-secret-change-me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  // Public URL of THIS API (Render URL in production). Pay Hero posts payment results here.
  apiUrl: (process.env.API_URL ?? `http://localhost:${process.env.PORT ?? '5000'}`).replace(/\/$/, ''),
  // Pay Hero (M-Pesa STK Push) - https://docs.payhero.co.ke
  payheroUsername: process.env.PAYHERO_API_USERNAME ?? '',
  payheroPassword: process.env.PAYHERO_API_PASSWORD ?? '',
  payheroChannelId: parseInt(process.env.PAYHERO_CHANNEL_ID ?? '0', 10),
  payheroCallbackSecret: process.env.PAYHERO_CALLBACK_SECRET ?? '',
  platformFeePercent: parseFloat(process.env.PLATFORM_FEE_PERCENT ?? '15'),
  adminEmail: process.env.ADMIN_EMAIL ?? '',
  adminPassword: process.env.ADMIN_PASSWORD ?? '',
  adminName: process.env.ADMIN_NAME ?? 'ODDSBOOK Admin',
};

export const isProd = env.nodeEnv === 'production';
export const isPayHeroEnabled = Boolean(env.payheroUsername && env.payheroPassword && env.payheroChannelId);
