import { Router } from 'express';
import { stripeWebhook } from '../controllers/payment.controller';

const router = Router();

router.post('/webhook', stripeWebhook);

export default router;
