import type { BaseEntity } from './common';

// Purchase Request Status enum
export type PurchaseRequestStatus = 
  | 'Draft' 
  | 'Submitted' 
  | 'InApproval' 
  | 'Approved' 
  | 'Rejected' 
  | 'Completed' 
  | 'Cancelled';

// Purchase Request Item
export interface PurchaseRequestItem {
  id: string;
  purchaseRequestId: string;
  productId: string;
  productName: string;
  productCode: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specification?: string;
}

// Purchase Request DTO
export interface PurchaseRequestDto extends BaseEntity {
  requestNumber: string;
  title: string;
  description?: string;
  requesterId: string;
  requesterName: string;
  departmentId: string;
  departmentName: string;
  budgetId?: string;
  status: PurchaseRequestStatus;
  totalAmount: number;
  requestDate: string;
  items: PurchaseRequestItem[];
  approvals?: ApprovalDto[];
}

// Create Purchase Request DTO
export interface CreatePurchaseRequestDto {
  title: string;
  description?: string;
  departmentId: string;
  budgetId?: string;
  items: CreatePurchaseRequestItemDto[];
}

export interface CreatePurchaseRequestItemDto {
  productId: string;
  quantity: number;
  unitPrice: number;
  description?: string;
  specification?: string;
}

// Update Purchase Request DTO
export interface UpdatePurchaseRequestDto {
  id: string;
  title: string;
  description?: string;
  departmentId: string;
  budgetId?: string;
  items: PurchaseRequestItem[];
}

// Approval DTO
export interface ApprovalDto {
  id: string;
  purchaseRequestId: string;
  approverId: string;
  approverName: string;
  approvalLevel: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  comments?: string;
  approvedAt?: string;
}

// Purchase Request Filters
export interface PurchaseRequestFilters {
  requesterId?: string;
  status?: PurchaseRequestStatus | string;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
}
