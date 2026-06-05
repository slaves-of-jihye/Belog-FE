export interface User {
  id: string;
  name: string;
  email: string;
  nickname: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
}
