import { apiFetch } from './api-fetch';

// ─── Types ตรงตาม Backend Prisma Schema ─────────────────────────────

export type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  access_token: string;
  user: User;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  password: string;
};

// ─── API Methods ─────────────────────────────────────────────────────

export const AuthApi = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: dto,
    });
  },

  async register(dto: RegisterDto): Promise<void> {
    return apiFetch<void>('/auth/register', {
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
