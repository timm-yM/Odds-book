import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'user' | 'admin';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  bio: string;
  avatarColor: string;
  ratingAvg: number;
  ratingCount: number;
  walletBalance: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const AVATAR_PALETTE = ['#00A8FF', '#F5A623', '#2F6BFF', '#FF5A5F', '#7C5CFF', '#00D0C4'];

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    bio: { type: String, default: '', maxlength: 500 },
    avatarColor: {
      type: String,
      default: () => AVATAR_PALETTE[Math.floor(Math.random() * AVATAR_PALETTE.length)],
    },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const clean = ret as unknown as Record<string, unknown>;
    delete clean.passwordHash;
    delete clean.__v;
    return clean;
  },
});

export const User = model<IUser>('User', userSchema);
