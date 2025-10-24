import { apiClient } from './client';
import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from '../../shared/types';

export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    const response = await apiClient.get<Department[]>('/Department');
    return response.data;
  },

  getById: async (id: string): Promise<Department> => {
    const response = await apiClient.get<Department>(`/Department/${id}`);
    return response.data;
  },

  create: async (data: CreateDepartmentDto): Promise<Department> => {
    const response = await apiClient.post<Department>('/Department', data);
    return response.data;
  },

  update: async (id: string, data: UpdateDepartmentDto): Promise<Department> => {
    const response = await apiClient.put<Department>(`/Department/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/Department/${id}`);
  },
};
