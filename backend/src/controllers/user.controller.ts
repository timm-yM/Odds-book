import { Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User';
import { Pick } from '../models/Pick';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

const updateSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  bio: z.string().max(500).optional(),
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const input = updateSchema.parse(req.body);
  const user = await User.findByIdAndUpdate(req.user!._id, input, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: { user } });
});

export const getSellerProfile = asyncHandler(async (req: Request, res: Response) => {
  const seller = await User.findById(req.params.id).select('name bio avatarColor role ratingAvg ratingCount createdAt');
  if (!seller) throw ApiError.notFound('Seller not found');

  const picks = await Pick.find({ seller: seller._id, isPublished: true }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: { seller, picks } });
});
