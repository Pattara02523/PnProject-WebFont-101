import { apiFetch } from './api-fetch';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type LoginDto = {
  email: string;
  password?: string;
};

export type RegisterDto = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password?: string;
};

export const AuthApi = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: dto,
    });
  },

  async register(dto: RegisterDto): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: dto,
    });
  },

  async getMe(token: string): Promise<User> {
    return apiFetch<User>('/auth/me', {
      method: 'GET',
      token,
    });
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  },
};
