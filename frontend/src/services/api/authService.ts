import { apiClient } from './client';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../../shared/types';

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/Auth/Login', credentials);
    return data;
  },

  /**
   * Register new user (Admin only)
   */
  async register(request: RegisterRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/Auth/Register', request);
    return data;
  },
};
