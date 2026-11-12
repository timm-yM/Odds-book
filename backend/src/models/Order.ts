import { Schema, model, Document, Types } from 'mongoose';

export type OrderStatus = 'completed' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'free' | 'stripe' | 'manual';

export interface IOrder extends Document {
  _id: Types.ObjectId;
  buyer: Types.ObjectId;
  seller: Types.ObjectId;
  pick: Types.ObjectId;
  amount: number;
  platformFee: number;
  sellerPayout: number;
  currency: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  stripeSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    pick: { type: Schema.Types.ObjectId, ref: 'Pick', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    platformFee: { type: Number, required: true, default: 0 },
    sellerPayout: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['completed', 'pending', 'failed', 'refunded'], default: 'pending' },
    paymentMethod: { type: String, enum: ['free', 'stripe', 'manual'], required: true },
    stripeSessionId: { type: String },
  },
  { timestamps: true }
);

// A buyer can only hold one active order per pick (prevents duplicate purchases).
orderSchema.index({ buyer: 1, pick: 1 }, { unique: true });

export const Order = model<IOrder>('Order', orderSchema);
