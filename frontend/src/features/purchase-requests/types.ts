export interface PurchaseRequestSummary {
  id: string;
  requestNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  urgency?: string;
  totalAmount: number;
  currency: string;
  requestDate: string;
  requiredByDate?: string | null;
}

export interface PurchaseRequestItem {
  id?: string;
  lineNumber?: number;
  itemName: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice?: number;
  preferredVendorId?: string | null;
  preferredVendorName?: string | null;
  productId?: string | null;
  specification?: string | null;
  requiredDate?: string | null;
}

export interface ApprovalInfo {
  id: string;
  level: number;
  approverName: string;
  status: string;
  approvedAt?: string | null;
  comments?: string | null;
  dueDate: string;
  isOverdue: boolean;
}

export interface PurchaseRequestDetail extends PurchaseRequestSummary {
  justification?: string | null;
  requesterName?: string;
  requesterEmail?: string;
  departmentName?: string;
  currentApprovalLevel?: number;
  items: PurchaseRequestItem[];
  approvals: ApprovalInfo[];
}

export interface CreatePurchaseRequestInput {
  title: string;
  description: string;
  justification?: string | null;
  priority: number;
  urgency: number;
  requiredByDate?: string | null;
  departmentId: string;
  budgetId?: string | null;
  projectId?: string | null;
  items: Array<{
    productId?: string | null;
    itemName: string;
    description: string;
    specification?: string | null;
    quantity: number;
    unit: string;
    unitPrice: number;
    preferredVendorId?: string | null;
  }>;
}

export interface UpdatePurchaseRequestInput {
  id: string;
  title: string;
  description: string;
  justification?: string | null;
  priority: number;
  requiredByDate?: string | null;
}

export interface ProductOption {
  id: string;
  name: string;
  description: string;
  productCode?: string;
}

export interface VendorOption {
  id: string;
  name: string;
  contactName?: string;
}
