import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes/index';
import paymentRoutes from './routes/payment.routes';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';
import { env, isProd } from './config/env';

const app: Application = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(morgan(isProd ? 'combined' : 'dev'));

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false });
app.use('/api', apiLimiter);

// 8mb: betslip images are sent as compressed base64 data URLs when a pick is created
app.use(express.json({ limit: '8mb' }));
app.use(cookieParser());

// Payment webhook (secured with a secret token in the URL)
app.use('/api/payments', paymentRoutes);

app.use('/api', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
