import { apiClient } from './client';
import { ApiResponse, OddsPick, User } from '@/types';

export const usersApi = {
  updateMe: (input: { name?: string; bio?: string }) =>
    apiClient.patch<ApiResponse<{ user: User }>>('/users/me', input).then((r) => r.data.data.user),

  sellerProfile: (id: string) =>
    apiClient.get<ApiResponse<{ seller: User; picks: OddsPick[] }>>(`/users/${id}`).then((r) => r.data.data),
};
