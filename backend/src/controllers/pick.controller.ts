import { Request, Response } from 'express';
import { z } from 'zod';
import { Pick, IPick } from '../models/Pick';
import { PickImage } from '../models/PickImage';
import { Order } from '../models/Order';
import { Review } from '../models/Review';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

const MAX_IMAGES = 3;
const MAX_IMAGE_BYTES = 1_500_000; // per image, after decoding (the frontend compresses before upload)

const pickBase = z.object({
  pickType: z.enum(['single', 'slip']).optional(),
  title: z.string().max(120).optional(),
  sport: z.string().min(2).max(40),
  league: z.string().max(80).optional(),
  homeTeam: z.string().max(80).optional(),
  awayTeam: z.string().max(80).optional(),
  matchDate: z.coerce.date(),
  market: z.string().max(80).optional(),
  selection: z.string().max(200).optional(),
  odds: z.coerce.number().min(1.01).max(100000),
  bookmaker: z.string().max(40).optional(),
  bookingCode: z.string().max(80).optional(),
  confidence: z.coerce.number().min(1).max(5).optional(),
  analysis: z.string().max(4000).optional(),
  price: z.coerce.number().int('Price must be a whole number of KES').min(0).max(150000),
  currency: z.literal('KES').optional(),
});

/** Single-match picks need the match details; betslips need a title plus a code and/or images. */
function checkRequired(v: z.infer<typeof pickBase> & { images?: string[] }, ctx: z.RefinementCtx) {
  const need = (field: string, value?: string) => {
    if (!value || !value.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: `${field} is required` });
  };
  if (v.pickType === 'slip') {
    need('title', v.title);
    if (!v.bookingCode?.trim() && !(v.images && v.images.length)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['bookingCode'], message: 'Add a booking code or at least one slip image' });
    }
  } else {
    need('league', v.league);
    need('homeTeam', v.homeTeam);
    need('awayTeam', v.awayTeam);
    need('market', v.market);
    need('selection', v.selection);
  }
}

const pickCreateSchema = pickBase.extend({ images: z.array(z.string()).max(MAX_IMAGES).optional() }).superRefine(checkRequired);
const pickUpdateSchema = pickBase.partial();

/** Decodes and validates a JPG/PNG data URL. Checks the real file signature, not just the declared type. */
function decodeImage(dataUrl: string): { contentType: 'image/jpeg' | 'image/png'; data: Buffer } {
  const m = /^data:image\/(?:png|jpeg|jpg);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!m) throw ApiError.badRequest('Slip images must be JPG or PNG files');
  const data = Buffer.from(m[1], 'base64');
  if (data.length > MAX_IMAGE_BYTES) throw ApiError.badRequest('One of the images is too large. Try a smaller screenshot.');
  const isPng = data.length > 8 && data.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  const isJpg = data.length > 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
  if (!isPng && !isJpg) throw ApiError.badRequest('That file is not a valid JPG or PNG image');
  return { contentType: isPng ? 'image/png' : 'image/jpeg', data };
}

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
    obj.bookingCode = null;
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
  const { images = [], ...input } = pickCreateSchema.parse(req.body);
  const decoded = images.map(decodeImage); // validate everything before writing anything

  const pick = await Pick.create({
    ...input,
    pickType: input.pickType ?? 'single',
    imageCount: decoded.length,
    seller: req.user!._id,
    isOfficial: req.user!.role === 'admin',
  });

  if (decoded.length) {
    await PickImage.insertMany(decoded.map((img, index) => ({ pick: pick._id, index, ...img })));
  }

  res.status(201).json({ success: true, data: { pick } });
});

/** Streams one betslip image, but only to someone who has unlocked the pick. */
export const getPickImage = asyncHandler(async (req: Request, res: Response) => {
  const pick = await Pick.findById(req.params.id);
  if (!pick) throw ApiError.notFound('Pick not found');

  const unlocked = await canUnlock(pick, req.user ? String(req.user._id) : undefined, req.user?.role === 'admin');
  if (!unlocked) throw ApiError.forbidden('Unlock this pick to view the slip');

  const image = await PickImage.findOne({ pick: pick._id, index: parseInt(req.params.index, 10) || 0 });
  if (!image) throw ApiError.notFound('Image not found');

  res.set({ 'Content-Type': image.contentType, 'Cache-Control': 'private, max-age=3600', 'X-Content-Type-Options': 'nosniff' });
  res.status(200).send(image.data);
});

export const updatePick = asyncHandler(async (req: Request, res: Response) => {
  const pick = await Pick.findById(req.params.id);
  if (!pick) throw ApiError.notFound('Pick not found');

  const isOwner = String(pick.seller) === String(req.user!._id);
  if (!isOwner && req.user!.role !== 'admin') throw ApiError.forbidden('You can only edit your own picks');

  const input = pickUpdateSchema.parse(req.body);
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

  await PickImage.deleteMany({ pick: pick._id });
  await pick.deleteOne();
  res.status(200).json({ success: true, data: null });
});

export const myPicks = asyncHandler(async (req: Request, res: Response) => {
  const picks = await Pick.find({ seller: req.user!._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: picks });
});
