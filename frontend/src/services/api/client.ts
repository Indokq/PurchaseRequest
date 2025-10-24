import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../../shared/types';

// Get API base URL from environment or use default
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://localhost:5001/api';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth storage key
const AUTH_STORAGE_KEY = 'prms.auth';

// Get stored token
export const getStoredToken = (): string | null => {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!authData) return null;
    
    const parsed = JSON.parse(authData);
    
    // Check if token is expired
    if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    
    return parsed.token;
  } catch {
    return null;
  }
};

// Store auth data
export const storeAuth = (authData: any) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
};

// Clear auth data
export const clearAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

// Request interceptor: Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if ((import.meta as any).env?.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log responses in development
    if ((import.meta as any).env?.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    
    return response;
  },
  (error: AxiosError) => {
    // Log errors in development
    if ((import.meta as any).env?.DEV) {
      console.error('[API Error]', error.response?.status, error.response?.data || error.message);
    }
    
    // Handle 401 Unauthorized - clear auth and redirect to login
    if (error.response?.status === 401) {
      clearAuth();
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Transform error to ApiError format
    const apiError: ApiError = {
      message: (error.response?.data as any)?.message || error.message || 'An unexpected error occurred',
      statusCode: error.response?.status || 500,
      errors: (error.response?.data as any)?.errors,
    };
    
    return Promise.reject(apiError);
  }
);

// Retry logic with exponential backoff (for transient failures)
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries - 1;
      const isRetryableError = 
        error instanceof Error && 
        (error.message.includes('Network Error') || error.message.includes('timeout'));
      
      if (isLastAttempt || !isRetryableError) {
        throw error;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
};

export default apiClient;
