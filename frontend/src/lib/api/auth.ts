import { apiClient } from './client';
import { ApiResponse, User } from '@/types';

export interface AuthPayload {
  user: User;
  token: string;
}

export const authApi = {
  register: (input: { name: string; email: string; password: string }) =>
    apiClient.post<ApiResponse<AuthPayload>>('/auth/register', input).then((r) => r.data.data),

  login: (input: { email: string; password: string }) =>
    apiClient.post<ApiResponse<AuthPayload>>('/auth/login', input).then((r) => r.data.data),

  logout: () => apiClient.post('/auth/logout'),

  me: () => apiClient.get<ApiResponse<{ user: User }>>('/auth/me').then((r) => r.data.data.user),
};
