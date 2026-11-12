import { Router } from 'express';
import { checkout, myPurchases, mySales } from '../controllers/order.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/checkout', protect, checkout);
router.get('/me', protect, myPurchases);
router.get('/sales', protect, mySales);

export default router;
