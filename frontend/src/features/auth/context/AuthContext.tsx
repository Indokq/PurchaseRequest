import React, { createContext, useContext, useEffect, useState } from 'react';
import { clearAuth, getStoredToken, storeAuth } from '../../../services/api/client';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const token = getStoredToken();
    if (token) {
      // In a real app, verify token with backend
      // For now, just mark as authenticated
      setUser({
        id: '1',
        username: 'user',
        email: 'user@example.com',
        fullName: 'Current User',
        roles: ['User'],
      });
    }
    setIsLoading(false);
  }, []);

  const login = (authData: any) => {
    storeAuth(authData);
    setUser({
      id: authData.userId || '1',
      username: authData.username || 'user',
      email: authData.email || 'user@example.com',
      fullName: authData.fullName || 'Current User',
      roles: authData.roles || ['User'],
    });
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
