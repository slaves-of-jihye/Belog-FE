import { apiClient, setToken, clearToken } from './apiClient';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authService = {
  async login(email, password) {
    const { user, accessToken } = await apiClient.post('/api/auth/login', { email, password });
    setToken(accessToken);
    return user;
  },

  async signup(name, email, password) {
    const { user, accessToken } = await apiClient.post('/api/auth/signup', { name, email, password });
    setToken(accessToken);
    return user;
  },

  async logout() {
    try {
      await apiClient.post('/api/auth/logout', {});
    } finally {
      clearToken();
    }
  },

  async getCurrentUser() {
    try {
      // Refresh Token 쿠키로 세션 복원 시도
      const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) return null;
      const { accessToken } = await res.json();
      setToken(accessToken);
      const { user } = await apiClient.get('/api/auth/me');
      return user;
    } catch {
      return null;
    }
  },
};
