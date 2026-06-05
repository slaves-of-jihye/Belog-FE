import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from './types';
import { apiClient } from '../../../shared/api/base';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeUser = useCallback((userData: any) => {
    const nextUser = { ...userData };
    if (!nextUser.nickname) {
      nextUser.nickname = nextUser.name;
    }
    return nextUser;
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken');

      if (token) {
        try {
          const response = await apiClient.get('/auth/me');
          const userData = response.data.user;
          setUser(normalizeUser(userData));
        } catch {
          localStorage.removeItem('accessToken');
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    fetchUser();
  }, [normalizeUser]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { accessToken, user: userData } = response.data as { accessToken?: string; user?: User };
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      if (userData) {
        setUser(normalizeUser(userData));
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || '로그인에 실패했습니다.';
      setError(message);
      throw new Error(message);
    }
  }, [normalizeUser]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setError(null);
    try {
      const response = await apiClient.post('/auth/signup', { name, email, password });
      const { accessToken, user: userData } = response.data as { accessToken?: string; user?: User };
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      if (userData) {
        setUser(normalizeUser(userData));
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || '회원가입에 실패했습니다.';
      setError(message);
      throw new Error(message);
    }
  }, [normalizeUser]);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      localStorage.removeItem('accessToken');
      setUser(null);
      return;
    }
    localStorage.removeItem('accessToken');
    setUser(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, setUser, login, signup, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
