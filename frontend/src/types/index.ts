export type Role = 'user' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  bio: string;
  avatarColor: string;
  ratingAvg: number;
  ratingCount: number;
  walletBalance: number;
  createdAt: string;
}

export type SellerSummary = Pick<User, '_id' | 'name' | 'role' | 'avatarColor' | 'ratingAvg' | 'ratingCount'>;

export type PickStatus = 'upcoming' | 'won' | 'lost' | 'void' | 'postponed';

export interface OddsPick {
  _id: string;
  seller: SellerSummary | string;
  isOfficial: boolean;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  market: string;
  selection: string | null;
  odds: number;
  confidence: number;
  analysis: string | null;
  price: number;
  currency: string;
  status: PickStatus;
  purchaseCount: number;
  locked: boolean;
  createdAt: string;
}

export interface Review {
  _id: string;
  buyer: { _id: string; name: string; avatarColor: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export type OrderStatus = 'completed' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'free' | 'stripe' | 'manual';

export interface Order {
  _id: string;
  buyer: string | { _id: string; name: string; avatarColor: string };
  seller: string;
  pick: OddsPick;
  amount: number;
  platformFee: number;
  sellerPayout: number;
  currency: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginatedMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const SPORTS = ['Football', 'Basketball', 'Tennis', 'Rugby', 'Cricket', 'American Football', 'Boxing/MMA', 'Other'];
