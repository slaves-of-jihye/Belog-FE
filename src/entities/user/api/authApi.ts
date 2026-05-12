import { apiClient } from '../../../shared/api/base';
import { AuthRequest, AuthResponse } from '../model/types';

export const signup = async (data: AuthRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/signup', data);
  return response.data;
};

export const login = async (data: AuthRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
};
