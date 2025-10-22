import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api, configureInterceptors, loadStoredAuth, persistAuth, setAuthHeader, StoredAuth } from '../api/client';

interface AuthContextValue {
  auth: StoredAuth | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface LoginResponse {
  token: string;
  expiresAt: string;
  userId: string;
  email: string;
  fullName: string;
}

const isExpired = (expiresAt: string | undefined) => {
  if (!expiresAt) return false;
  const expiry = new Date(expiresAt).getTime();
  return Number.isFinite(expiry) && expiry <= Date.now();
};

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [auth, setAuth] = useState<StoredAuth | null>(() => {
    const stored = loadStoredAuth();
    if (stored && isExpired(stored.expiresAt)) {
      persistAuth(null);
      return null;
    }
    return stored;
  });

  const logout = useCallback(() => {
    setAuth(null);
    persistAuth(null);
    setAuthHeader(null);
  }, []);

  useEffect(() => {
    configureInterceptors(logout);
  }, [logout]);

  useEffect(() => {
    setAuthHeader(auth?.token ?? null);

    if (!auth?.expiresAt) {
      return;
    }

    const expiryMs = new Date(auth.expiresAt).getTime();
    if (!Number.isFinite(expiryMs)) {
      return;
    }

    const timeout = expiryMs - Date.now();
    if (timeout <= 0) {
      logout();
      return;
    }

    const timer = window.setTimeout(() => {
      logout();
    }, timeout);

    return () => window.clearTimeout(timer);
  }, [auth, logout]);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<LoginResponse>('/Auth/Login', { email, password });

    const payload: StoredAuth = {
      token: data.token,
      expiresAt: data.expiresAt,
      userId: data.userId,
      email: data.email,
      fullName: data.fullName,
    };

    setAuth(payload);
    persistAuth(payload);
    setAuthHeader(payload.token);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      auth,
      isAuthenticated: Boolean(auth?.token),
      login,
      logout,
    }),
    [auth, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
