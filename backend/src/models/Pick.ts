import { Schema, model, Document, Types } from 'mongoose';

export type PickType = 'single' | 'slip';
export type PickStatus = 'upcoming' | 'won' | 'lost' | 'void' | 'postponed';

export interface IPick extends Document {
  _id: Types.ObjectId;
  seller: Types.ObjectId;
  isOfficial: boolean;
  /** 'single' = one match; 'slip' = a betslip/accumulator posted as images and/or a booking code */
  pickType: PickType;
  title?: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: Date;
  market: string;
  /** The actual pick, e.g. "Arsenal -1.5". Hidden until purchased/unlocked. */
  selection: string;
  odds: number;
  /** Bookmaker the slip was built on, e.g. SportPesa, Betika, SportyBet (shown publicly) */
  bookmaker?: string;
  /** The bookmaker's booking/share code. Hidden until purchased/unlocked. */
  bookingCode?: string;
  /** Number of betslip images stored for this pick (the images themselves are paywalled) */
  imageCount: number;
  confidence: number; // 1-5
  /** Longer reasoning. Hidden until purchased/unlocked. */
  analysis: string;
  price: number; // 0 = free
  currency: string;
  status: PickStatus;
  purchaseCount: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Fields that only make sense for a single-match pick */
function isSingle(this: IPick): boolean {
  return this.pickType !== 'slip';
}

const pickSchema = new Schema<IPick>(
  {
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    isOfficial: { type: Boolean, default: false },
    pickType: { type: String, enum: ['single', 'slip'], default: 'single' },
    title: { type: String, trim: true, maxlength: 120 },
    sport: { type: String, required: true, trim: true },
    league: { type: String, trim: true, default: '', required: isSingle },
    homeTeam: { type: String, trim: true, default: '', required: isSingle },
    awayTeam: { type: String, trim: true, default: '', required: isSingle },
    matchDate: { type: Date, required: true },
    market: { type: String, trim: true, default: '', required: isSingle },
    selection: { type: String, trim: true, default: '', required: isSingle },
    odds: { type: Number, required: true, min: 1.01 },
    bookmaker: { type: String, trim: true, maxlength: 40 },
    bookingCode: { type: String, trim: true, maxlength: 80 },
    imageCount: { type: Number, default: 0, min: 0, max: 3 },
    confidence: { type: Number, min: 1, max: 5, default: 3 },
    analysis: { type: String, default: '', maxlength: 4000 },
    price: { type: Number, required: true, min: 0, default: 0 },
    currency: { type: String, default: 'KES' },
    status: {
      type: String,
      enum: ['upcoming', 'won', 'lost', 'void', 'postponed'],
      default: 'upcoming',
      index: true,
    },
    purchaseCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

pickSchema.index({ createdAt: -1 });
pickSchema.index({ sport: 1, status: 1 });

export const Pick = model<IPick>('Pick', pickSchema);
