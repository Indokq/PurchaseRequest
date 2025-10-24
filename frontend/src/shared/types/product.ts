import type { BaseEntity } from './common';

export type ProductCategory = 
  | 'Electronics'
  | 'Furniture'
  | 'Supplies'
  | 'Equipment'
  | 'Software'
  | 'Services'
  | 'Other';

export interface ProductResponse extends BaseEntity {
  productCode: string;
  name: string;
  description?: string;
  category: ProductCategory;
  subCategory?: string;
  partNumber?: string;
  manufacturer?: string;
  brand?: string;
  unit: string;
  standardPrice: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  leadTimeDays: number;
  isActive: boolean;
  requiresApproval: boolean;
  imageUrl?: string;
  specification?: string;
}

export interface CreateProductDto {
  productCode: string;
  name: string;
  description?: string;
  category: string;
  subCategory?: string;
  partNumber?: string;
  manufacturer?: string;
  brand?: string;
  unit: string;
  standardPrice: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  leadTimeDays: number;
  isActive: boolean;
  requiresApproval: boolean;
  imageUrl?: string;
  specification?: string;
}

export interface UpdateProductDto extends CreateProductDto {
  id: string;
}

export interface ProductFilters {
  category?: ProductCategory | string;
  search?: string;
  isActive?: boolean;
}
