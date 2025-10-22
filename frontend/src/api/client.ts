import axios from 'axios';

const defaultBaseUrl = 'https://localhost:5001/api';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? defaultBaseUrl;
export const AUTH_STORAGE_KEY = 'prms.auth';

export interface StoredAuth {
  token: string;
  expiresAt: string;
  userId: string;
  email: string;
  fullName: string;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

let interceptorsConfigured = false;

export const configureInterceptors = (onUnauthorized: () => void) => {
  if (interceptorsConfigured) {
    return;
  }

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      if (status === 401) {
        onUnauthorized();
      }
      return Promise.reject(error);
    }
  );

  interceptorsConfigured = true;
};

export const loadStoredAuth = (): StoredAuth | null => {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as StoredAuth;
  } catch (error) {
    console.warn('Unable to parse stored auth payload', error);
    return null;
  }
};

export const persistAuth = (auth: StoredAuth | null) => {
  if (!auth) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};
