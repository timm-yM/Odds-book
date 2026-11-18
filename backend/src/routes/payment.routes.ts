import { Router } from 'express';
import { paymentWebhook } from '../controllers/payment.controller';

const router = Router();

// Set this full URL (with ?token=YOUR_SECRET) as the webhook in your PesaFlux dashboard
router.post('/webhook', paymentWebhook);

export default router;
