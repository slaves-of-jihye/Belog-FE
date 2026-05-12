export interface User {
  id: number;
  nickname: string;
}

export interface AuthRequest {
  nickname: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
}
