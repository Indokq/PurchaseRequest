import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseRequestService } from '../../../services/api/purchaseRequestService';
import { queryKeys } from '../../../shared/utils/queryKeys';
import type { 
  PurchaseRequestFilters, 
  CreatePurchaseRequestDto, 
  UpdatePurchaseRequestDto 
} from '../../../shared/types';

/**
 * Hook to fetch all purchase requests with optional filters
 */
export function usePurchaseRequests(filters?: PurchaseRequestFilters) {
  return useQuery({
    queryKey: queryKeys.purchaseRequests.list(filters),
    queryFn: () => purchaseRequestService.getAll(filters),
  });
}

/**
 * Hook to fetch a single purchase request by ID
 */
export function usePurchaseRequest(id: string) {
  return useQuery({
    queryKey: queryKeys.purchaseRequests.detail(id),
    queryFn: () => purchaseRequestService.getById(id),
    enabled: !!id, // Only run query if ID is provided
  });
}

/**
 * Hook to create a new purchase request
 */
export function useCreatePurchaseRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreatePurchaseRequestDto) => 
      purchaseRequestService.create(request),
    onSuccess: () => {
      // Invalidate and refetch purchase requests list
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseRequests.lists() });
    },
  });
}

/**
 * Hook to update a purchase request
 */
export function useUpdatePurchaseRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdatePurchaseRequestDto }) =>
      purchaseRequestService.update(id, request),
    onSuccess: (_, variables) => {
      // Invalidate specific purchase request and lists
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseRequests.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseRequests.lists() });
    },
  });
}

/**
 * Hook to submit a purchase request for approval
 */
export function useSubmitPurchaseRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => purchaseRequestService.submit(id),
    onSuccess: (_, id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseRequests.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseRequests.lists() });
    },
  });
}

/**
 * Hook to approve a purchase request (Admin only)
 */
export function useApprovePurchaseRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, comments }: { id: string; comments?: string }) =>
      purchaseRequestService.approve(id, comments),
    onMutate: async ({ id }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.purchaseRequests.detail(id) });

      // Snapshot the previous value
      const previousPR = queryClient.getQueryData(queryKeys.purchaseRequests.detail(id));

      // Optimistically update to "Approved"
      queryClient.setQueryData(queryKeys.purchaseRequests.detail(id), (old: any) => ({
        ...old,
        status: 'Approved',
      }));

      return { previousPR };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPR) {
        queryClient.setQueryData(
          queryKeys.purchaseRequests.detail(variables.id),
          context.previousPR
        );
      }
    },
    onSettled: (_, __, variables) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseRequests.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseRequests.lists() });
    },
  });
}

/**
 * Hook to reject a purchase request (Admin only)
 */
export function useRejectPurchaseRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      purchaseRequestService.reject(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseRequests.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseRequests.lists() });
    },
  });
}

/**
 * Hook to delete a purchase request (Admin only)
 */
export function useDeletePurchaseRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => purchaseRequestService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseRequests.lists() });
    },
  });
}
