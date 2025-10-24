/**
 * Query key factory for TanStack Query
 * Centralized place for all query keys to enable easy cache invalidation
 */

import type { PurchaseRequestFilters, ProductFilters } from '../types';

export const queryKeys = {
  // Purchase Requests
  purchaseRequests: {
    all: ['purchaseRequests'] as const,
    lists: () => [...queryKeys.purchaseRequests.all, 'list'] as const,
    list: (filters?: PurchaseRequestFilters) => 
      [...queryKeys.purchaseRequests.lists(), { filters }] as const,
    details: () => [...queryKeys.purchaseRequests.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.purchaseRequests.details(), id] as const,
  },

  // Products
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: ProductFilters) => 
      [...queryKeys.products.lists(), { filters }] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    search: (query: string) => [...queryKeys.products.all, 'search', query] as const,
  },

  // Departments
  departments: {
    all: ['departments'] as const,
    lists: () => [...queryKeys.departments.all, 'list'] as const,
    list: () => [...queryKeys.departments.lists()] as const,
    details: () => [...queryKeys.departments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.departments.details(), id] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: () => [...queryKeys.users.lists()] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Roles
  roles: {
    all: ['roles'] as const,
    list: () => [...queryKeys.roles.all, 'list'] as const,
  },
};
