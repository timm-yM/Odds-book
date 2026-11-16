import { Request, Response } from 'express';
import { z } from 'zod';
import { Pick, IPick } from '../models/Pick';
import { Order } from '../models/Order';
import { Review } from '../models/Review';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

const pickInputSchema = z.object({
  sport: z.string().min(2).max(40),
  league: z.string().min(1).max(80),
  homeTeam: z.string().min(1).max(80),
  awayTeam: z.string().min(1).max(80),
  matchDate: z.coerce.date(),
  market: z.string().min(1).max(80),
  selection: z.string().min(1).max(200),
  odds: z.coerce.number().min(1.01).max(1000),
  confidence: z.coerce.number().min(1).max(5).optional(),
  analysis: z.string().max(4000).optional(),
  price: z.coerce.number().int('Price must be a whole number of KES').min(0).max(150000),
  currency: z.literal('KES').optional(),
});

const statusSchema = z.object({
  status: z.enum(['upcoming', 'won', 'lost', 'void', 'postponed']),
});

/** True if the requester may see the locked (selection/analysis) fields of a pick. */
async function canUnlock(pick: IPick, userId?: string, isAdmin?: boolean): Promise<boolean> {
  if (pick.price === 0) return true;
  if (!userId) return false;
  if (isAdmin) return true;
  if (String(pick.seller) === userId) return true;
  const order = await Order.findOne({ pick: pick._id, buyer: userId, status: 'completed' });
  return Boolean(order);
}

function serializePick(pick: IPick, unlocked: boolean) {
  const obj = pick.toObject({ virtuals: true }) as Record<string, unknown>;
  if (!unlocked) {
    obj.selection = null;
    obj.analysis = null;
  }
  obj.locked = !unlocked;
  return obj;
}

export const listPicks = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(parseInt(String(req.query.page ?? '1'), 10), 1);
  const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? '12'), 10), 1), 50);
  const { sport, status, seller, maxPrice, freeOnly, search } = req.query;

  const filter: Record<string, unknown> = { isPublished: true };
  if (sport && sport !== 'all') filter.sport = sport;
  if (status && status !== 'all') filter.status = status;
  if (seller) filter.seller = seller;
  if (freeOnly === 'true') filter.price = 0;
  if (maxPrice) filter.price = { ...(filter.price as object), $lte: Number(maxPrice) };
  if (search) {
    const re = new RegExp(String(search), 'i');
    filter.$or = [{ homeTeam: re }, { awayTeam: re }, { league: re }, { market: re }];
  }

  const [picks, total] = await Promise.all([
    Pick.find(filter)
      .populate('seller', 'name role avatarColor ratingAvg ratingCount')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Pick.countDocuments(filter),
  ]);

  const userId = req.user ? String(req.user._id) : undefined;
  const isAdmin = req.user?.role === 'admin';

  const purchasedIds = userId
    ? new Set(
        (await Order.find({ buyer: userId, status: 'completed', pick: { $in: picks.map((p) => p._id) } }).select('pick')).map(
          (o) => String(o.pick)
        )
      )
    : new Set<string>();

  const data = picks.map((p) => {
    const unlocked = p.price === 0 || isAdmin || String(p.seller._id ?? p.seller) === userId || purchasedIds.has(String(p._id));
    return serializePick(p, unlocked);
  });

  res.status(200).json({
    success: true,
    data,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getPick = asyncHandler(async (req: Request, res: Response) => {
  const pick = await Pick.findById(req.params.id).populate('seller', 'name role avatarColor ratingAvg ratingCount bio');
  if (!pick) throw ApiError.notFound('Pick not found');

  const unlocked = await canUnlock(pick, req.user ? String(req.user._id) : undefined, req.user?.role === 'admin');
  const reviews = await Review.find({ pick: pick._id }).populate('buyer', 'name avatarColor').sort({ createdAt: -1 }).limit(20);

  res.status(200).json({ success: true, data: { pick: serializePick(pick, unlocked), reviews } });
});

export const createPick = asyncHandler(async (req: Request, res: Response) => {
  const input = pickInputSchema.parse(req.body);
  const pick = await Pick.create({
    ...input,
    seller: req.user!._id,
    isOfficial: req.user!.role === 'admin',
  });
  res.status(201).json({ success: true, data: { pick } });
});

export const updatePick = asyncHandler(async (req: Request, res: Response) => {
  const pick = await Pick.findById(req.params.id);
  if (!pick) throw ApiError.notFound('Pick not found');

  const isOwner = String(pick.seller) === String(req.user!._id);
  if (!isOwner && req.user!.role !== 'admin') throw ApiError.forbidden('You can only edit your own picks');

  const input = pickInputSchema.partial().parse(req.body);
  Object.assign(pick, input);
  await pick.save();

  res.status(200).json({ success: true, data: { pick } });
});

export const updatePickStatus = asyncHandler(async (req: Request, res: Response) => {
  const pick = await Pick.findById(req.params.id);
  if (!pick) throw ApiError.notFound('Pick not found');

  const isOwner = String(pick.seller) === String(req.user!._id);
  if (!isOwner && req.user!.role !== 'admin') throw ApiError.forbidden('You can only update your own picks');

  const { status } = statusSchema.parse(req.body);
  pick.status = status;
  await pick.save();

  res.status(200).json({ success: true, data: { pick } });
});

export const deletePick = asyncHandler(async (req: Request, res: Response) => {
  const pick = await Pick.findById(req.params.id);
  if (!pick) throw ApiError.notFound('Pick not found');

  const isOwner = String(pick.seller) === String(req.user!._id);
  if (!isOwner && req.user!.role !== 'admin') throw ApiError.forbidden('You can only delete your own picks');

  await pick.deleteOne();
  res.status(200).json({ success: true, data: null });
});

export const myPicks = asyncHandler(async (req: Request, res: Response) => {
  const picks = await Pick.find({ seller: req.user!._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: picks });
});
