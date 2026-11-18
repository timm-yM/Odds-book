import { apiClient } from './client';
import { ApiListResponse, ApiResponse, OddsPick, PickStatus, Review } from '@/types';

export interface PickFilters {
  page?: number;
  limit?: number;
  sport?: string;
  status?: string;
  freeOnly?: boolean;
  search?: string;
}

export interface PickInput {
  pickType?: 'single' | 'slip';
  title?: string;
  sport: string;
  league?: string;
  homeTeam?: string;
  awayTeam?: string;
  matchDate: string;
  market?: string;
  selection?: string;
  odds: number;
  bookmaker?: string;
  bookingCode?: string;
  /** JPG/PNG data URLs (create only) */
  images?: string[];
  confidence?: number;
  analysis?: string;
  price: number;
  currency?: string;
}

export const picksApi = {
  list: (filters: PickFilters = {}) =>
    apiClient.get<ApiListResponse<OddsPick>>('/picks', { params: filters }).then((r) => r.data),

  get: (id: string) =>
    apiClient.get<ApiResponse<{ pick: OddsPick; reviews: Review[] }>>(`/picks/${id}`).then((r) => r.data.data),

  /** Fetches a paywalled slip image with the user's token and returns a local blob URL for <img src> */
  image: (pickId: string, index: number) =>
    apiClient.get<Blob>(`/picks/${pickId}/images/${index}`, { responseType: 'blob' }).then((r) => URL.createObjectURL(r.data)),

  mine: () => apiClient.get<ApiResponse<OddsPick[]>>('/picks/mine').then((r) => r.data.data),

  create: (input: PickInput) => apiClient.post<ApiResponse<{ pick: OddsPick }>>('/picks', input).then((r) => r.data.data.pick),

  update: (id: string, input: Partial<PickInput>) =>
    apiClient.patch<ApiResponse<{ pick: OddsPick }>>(`/picks/${id}`, input).then((r) => r.data.data.pick),

  updateStatus: (id: string, status: PickStatus) =>
    apiClient.patch<ApiResponse<{ pick: OddsPick }>>(`/picks/${id}/status`, { status }).then((r) => r.data.data.pick),

  remove: (id: string) => apiClient.delete(`/picks/${id}`),

  review: (pickId: string, input: { rating: number; comment?: string }) =>
    apiClient.post<ApiResponse<{ review: Review }>>(`/picks/${pickId}/reviews`, input).then((r) => r.data.data.review),
};
