import { Router } from 'express';
import {
  listPicks,
  getPick,
  createPick,
  updatePick,
  updatePickStatus,
  deletePick,
  myPicks,
  getPickImage,
} from '../controllers/pick.controller';
import { createReview } from '../controllers/review.controller';
import { protect, attachUserIfPresent } from '../middleware/auth';

const router = Router();

router.get('/', attachUserIfPresent, listPicks);
router.get('/mine', protect, myPicks);
router.get('/:id', attachUserIfPresent, getPick);
router.get('/:id/images/:index', attachUserIfPresent, getPickImage);

router.post('/', protect, createPick);
router.patch('/:id', protect, updatePick);
router.patch('/:id/status', protect, updatePickStatus);
router.delete('/:id', protect, deletePick);

router.post('/:pickId/reviews', protect, createReview);

export default router;
