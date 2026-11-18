import { Schema, model, Document, Types } from 'mongoose';

export type OrderStatus = 'completed' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'free' | 'mpesa' | 'manual';

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
  phoneNumber?: string;
  paymentProvider?: 'pesaflux' | 'payhero';
  paymentReference?: string;
  checkoutRequestId?: string;
  mpesaReceipt?: string;
  failureReason?: string;
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
    currency: { type: String, default: 'KES' },
    status: { type: String, enum: ['completed', 'pending', 'failed', 'refunded'], default: 'pending' },
    paymentMethod: { type: String, enum: ['free', 'mpesa', 'manual'], required: true },
    phoneNumber: { type: String },
    paymentProvider: { type: String, enum: ['pesaflux', 'payhero'] },
    paymentReference: { type: String, index: true },
    checkoutRequestId: { type: String },
    mpesaReceipt: { type: String },
    failureReason: { type: String },
  },
  { timestamps: true }
);

// A buyer can only hold one active order per pick (prevents duplicate purchases).
orderSchema.index({ buyer: 1, pick: 1 }, { unique: true });

export const Order = model<IOrder>('Order', orderSchema);
