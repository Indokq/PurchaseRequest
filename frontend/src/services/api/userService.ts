import { apiClient } from './client';
import type { User } from '../../shared/types';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/UserManagement');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/UserManagement/${id}`);
    return response.data;
  },

  assignRole: async (userId: string, role: string): Promise<void> => {
    await apiClient.post(`/UserManagement/${userId}/assign-role`, { role });
  },
};
