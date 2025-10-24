import { useQuery } from '@tanstack/react-query';
import { productService } from '../../../services/api/productService';
import { queryKeys } from '../../../shared/utils/queryKeys';
import type { ProductFilters } from '../../../shared/types';

/**
 * Hook to fetch all products with optional filters
 */
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productService.getAll(filters),
  });
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to search products
 */
export function useProductSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.products.search(query),
    queryFn: () => productService.search(query),
    enabled: query.length >= 2, // Only search if query is at least 2 characters
    staleTime: 30000, // 30 seconds - searches can be cached shorter
  });
}
