import { apiClient } from './client';
import { ApiResponse, Order } from '@/types';

export interface CheckoutResult {
  redirect: boolean;
  url?: string;
  order?: Order;
  alreadyUnlocked?: boolean;
  demoMode?: boolean;
}

export const ordersApi = {
  checkout: (pickId: string) =>
    apiClient.post<ApiResponse<CheckoutResult>>('/orders/checkout', { pickId }).then((r) => r.data.data),

  myPurchases: () => apiClient.get<ApiResponse<Order[]>>('/orders/me').then((r) => r.data.data),

  mySales: () =>
    apiClient
      .get<ApiResponse<{ orders: Order[]; totalRevenue: number; salesCount: number }>>('/orders/sales')
      .then((r) => r.data.data),
};
