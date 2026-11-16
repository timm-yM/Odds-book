import { Router } from 'express';
import { payheroCallback } from '../controllers/payment.controller';

const router = Router();

router.post('/payhero/callback', payheroCallback);

export default router;
