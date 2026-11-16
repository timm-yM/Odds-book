import { Schema, model, Document, Types } from 'mongoose';

export type PickStatus = 'upcoming' | 'won' | 'lost' | 'void' | 'postponed';

export interface IPick extends Document {
  _id: Types.ObjectId;
  seller: Types.ObjectId;
  isOfficial: boolean;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: Date;
  market: string;
  /** The actual pick, e.g. "Arsenal -1.5". Hidden until purchased/unlocked. */
  selection: string;
  odds: number;
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

const pickSchema = new Schema<IPick>(
  {
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    isOfficial: { type: Boolean, default: false },
    sport: { type: String, required: true, trim: true },
    league: { type: String, required: true, trim: true },
    homeTeam: { type: String, required: true, trim: true },
    awayTeam: { type: String, required: true, trim: true },
    matchDate: { type: Date, required: true },
    market: { type: String, required: true, trim: true },
    selection: { type: String, required: true, trim: true },
    odds: { type: Number, required: true, min: 1.01 },
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
