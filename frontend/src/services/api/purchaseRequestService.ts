import { apiClient } from './client';
import type {
  PurchaseRequestDto,
  CreatePurchaseRequestDto,
  UpdatePurchaseRequestDto,
  PurchaseRequestFilters,
} from '../../shared/types';

export const purchaseRequestService = {
  /**
   * Get all purchase requests with filters
   */
  async getAll(filters?: PurchaseRequestFilters): Promise<PurchaseRequestDto[]> {
    const { data } = await apiClient.get<PurchaseRequestDto[]>('/PurchaseRequest', {
      params: filters,
    });
    return data;
  },

  /**
   * Get purchase request by ID
   */
  async getById(id: string): Promise<PurchaseRequestDto> {
    const { data } = await apiClient.get<PurchaseRequestDto>(`/PurchaseRequest/${id}`);
    return data;
  },

  /**
   * Create new purchase request
   */
  async create(request: CreatePurchaseRequestDto): Promise<PurchaseRequestDto> {
    const { data } = await apiClient.post<PurchaseRequestDto>('/PurchaseRequest', request);
    return data;
  },

  /**
   * Update purchase request
   */
  async update(id: string, request: UpdatePurchaseRequestDto): Promise<void> {
    await apiClient.put(`/PurchaseRequest/${id}`, request);
  },

  /**
   * Submit purchase request for approval
   */
  async submit(id: string): Promise<void> {
    await apiClient.post(`/PurchaseRequest/${id}/submit`);
  },

  /**
   * Approve purchase request (Admin only)
   */
  async approve(id: string, comments?: string): Promise<void> {
    await apiClient.post(`/PurchaseRequest/${id}/approve`, comments);
  },

  /**
   * Reject purchase request (Admin only)
   */
  async reject(id: string, reason: string): Promise<void> {
    await apiClient.post(`/PurchaseRequest/${id}/reject`, reason);
  },

  /**
   * Delete purchase request (Admin only)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/PurchaseRequest/${id}`);
  },
};
