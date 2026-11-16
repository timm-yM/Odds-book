import { apiClient } from './client';
import { ApiResponse, Order } from '@/types';

export interface CheckoutResult {
  /** true = an M-Pesa STK prompt was sent; poll orderStatus(orderId) until it settles */
  pending: boolean;
  orderId?: string;
  order?: Order;
  alreadyUnlocked?: boolean;
  demoMode?: boolean;
}

export interface OrderStatusResult {
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  mpesaReceipt?: string;
  failureReason?: string;
}

export const ordersApi = {
  checkout: (pickId: string, phoneNumber?: string) =>
    apiClient.post<ApiResponse<CheckoutResult>>('/orders/checkout', { pickId, phoneNumber }).then((r) => r.data.data),

  status: (orderId: string) =>
    apiClient.get<ApiResponse<OrderStatusResult>>(`/orders/${orderId}/status`).then((r) => r.data.data),

  myPurchases: () => apiClient.get<ApiResponse<Order[]>>('/orders/me').then((r) => r.data.data),

  mySales: () =>
    apiClient
      .get<ApiResponse<{ orders: Order[]; totalRevenue: number; salesCount: number }>>('/orders/sales')
      .then((r) => r.data.data),
};
