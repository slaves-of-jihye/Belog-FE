import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from './types';
import { apiClient } from '../../../shared/api/base';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  login: (nickname: string, password: string) => Promise<void>;
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

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken');

      if (token) {
        try {
          const response = await apiClient.get<User>('/auth/me');
          setUser(response.data);
        } catch {
          localStorage.removeItem('accessToken');
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const login = useCallback(async (nickname: string, password: string) => {
    setError(null);
    try {
      const response = await apiClient.post('/auth/login', { nickname, password });
      const { accessToken, user: userData } = response.data as { accessToken?: string; user?: User };
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      if (userData) {
        setUser(userData);
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || '로그인에 실패했습니다.';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setError(null);
    try {
      const response = await apiClient.post('/auth/signup', { nickname: name, email, password });
      const { accessToken, user: userData } = response.data as { accessToken?: string; user?: User };
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      if (userData) {
        setUser(userData);
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || '회원가입에 실패했습니다.';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(() => {
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
