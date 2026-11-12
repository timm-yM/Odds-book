import { Router } from 'express';
import authRoutes from './auth.routes';
import pickRoutes from './pick.routes';
import orderRoutes from './order.routes';
import userRoutes from './user.routes';

const router = Router();

router.get('/health', (_req, res) => res.status(200).json({ success: true, message: 'ODDSBOOK API is running' }));

router.use('/auth', authRoutes);
router.use('/picks', pickRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);

export default router;
