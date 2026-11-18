import { Schema, model, Document, Types } from 'mongoose';

/**
 * Betslip screenshots are stored in their own collection (not on the Pick) so listing picks stays fast,
 * and so they can only be downloaded through the access-checked /picks/:id/images/:index endpoint.
 */
export interface IPickImage extends Document {
  pick: Types.ObjectId;
  index: number;
  contentType: 'image/jpeg' | 'image/png';
  data: Buffer;
}

const pickImageSchema = new Schema<IPickImage>(
  {
    pick: { type: Schema.Types.ObjectId, ref: 'Pick', required: true, index: true },
    index: { type: Number, required: true },
    contentType: { type: String, enum: ['image/jpeg', 'image/png'], required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

pickImageSchema.index({ pick: 1, index: 1 }, { unique: true });

export const PickImage = model<IPickImage>('PickImage', pickImageSchema);
