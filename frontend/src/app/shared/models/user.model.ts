export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'USER' | 'MEDECIN';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role?: 'ADMIN' | 'USER' | 'MEDECIN';
}

export interface AuthResponse {
  token: string;
  user: User;
}
