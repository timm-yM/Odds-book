import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { Review } from '../models/Review';
import { Order } from '../models/Order';
import { Pick } from '../models/Pick';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

async function recalculateSellerRating(sellerId: string) {
  const stats = await Review.aggregate([
    { $match: { seller: new Types.ObjectId(sellerId) } },
    { $group: { _id: '$seller', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = stats[0] ?? {};
  await User.findByIdAndUpdate(sellerId, { ratingAvg: Math.round(avg * 10) / 10, ratingCount: count });
}

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const pick = await Pick.findById(req.params.pickId);
  if (!pick) throw ApiError.notFound('Pick not found');

  const purchased = await Order.findOne({ pick: pick._id, buyer: req.user!._id, status: 'completed' });
  if (!purchased) throw ApiError.forbidden('You can only review picks you have unlocked');

  const { rating, comment } = reviewSchema.parse(req.body);

  const review = await Review.findOneAndUpdate(
    { pick: pick._id, buyer: req.user!._id },
    { rating, comment: comment ?? '', seller: pick.seller },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await recalculateSellerRating(String(pick.seller));

  res.status(201).json({ success: true, data: { review } });
});
