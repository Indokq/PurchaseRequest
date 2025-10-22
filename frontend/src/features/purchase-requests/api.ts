import { api } from '../../api/client';
import {
  CreatePurchaseRequestInput,
  PurchaseRequestDetail,
  PurchaseRequestSummary,
  ProductOption,
  UpdatePurchaseRequestInput,
  VendorOption,
} from './types';

export const fetchPurchaseRequests = async (page: number) => {
  const response = await api.get<PurchaseRequestSummary[]>(`/PurchaseRequest`, {
    params: { pageNumber: page, pageSize: 10 },
  });
  return response.data;
};

export const fetchPurchaseRequest = async (id: string) => {
  const response = await api.get<PurchaseRequestDetail>(`/PurchaseRequest/${id}`);
  return response.data;
};

export const createPurchaseRequest = async (payload: CreatePurchaseRequestInput) => {
  const response = await api.post<PurchaseRequestDetail>('/PurchaseRequest', payload);
  return response.data;
};

export const updatePurchaseRequest = async (payload: UpdatePurchaseRequestInput) => {
  await api.put(`/PurchaseRequest/${payload.id}`, payload);
};

export const deletePurchaseRequest = async (id: string) => {
  await api.delete(`/PurchaseRequest/${id}`);
};

export const fetchProducts = async () => {
  const response = await api.get<ProductOption[]>('/Product');
  return response.data;
};

export const fetchVendors = async () => {
  const response = await api.get<VendorOption[]>('/Vendor');
  return response.data;
};
