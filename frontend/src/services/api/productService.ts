import { apiClient } from './client';
import type { ProductResponse, ProductFilters } from '../../shared/types';

export const productService = {
  /**
   * Get all products with optional filters
   */
  async getAll(filters?: ProductFilters): Promise<ProductResponse[]> {
    const { data } = await apiClient.get<ProductResponse[]>('/Product', {
      params: filters,
    });
    return data;
  },

  /**
   * Get product by ID
   */
  async getById(id: string): Promise<ProductResponse> {
    const { data } = await apiClient.get<ProductResponse>(`/Product/${id}`);
    return data;
  },

  /**
   * Search products by query
   */
  async search(query: string): Promise<ProductResponse[]> {
    const { data } = await apiClient.get<ProductResponse[]>('/Product/search', {
      params: { query },
    });
    return data;
  },
};
