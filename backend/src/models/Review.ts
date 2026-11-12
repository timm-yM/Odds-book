import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  _id: Types.ObjectId;
  pick: Types.ObjectId;
  seller: Types.ObjectId;
  buyer: Types.ObjectId;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    pick: { type: Schema.Types.ObjectId, ref: 'Pick', required: true, index: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', maxlength: 1000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// One review per buyer per pick.
reviewSchema.index({ pick: 1, buyer: 1 }, { unique: true });

export const Review = model<IReview>('Review', reviewSchema);
