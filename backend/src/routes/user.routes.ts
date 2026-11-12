import { Router } from 'express';
import { updateMe, getSellerProfile } from '../controllers/user.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.patch('/me', protect, updateMe);
router.get('/:id', getSellerProfile);

export default router;
