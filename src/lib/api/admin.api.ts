import { apiFetch } from './api-fetch';

// ─── Types ตรงตาม Backend Prisma Schema ─────────────────────────────

export type AdminUser = {
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
  _count?: {
    portfolios?: number;
    transactions?: number;
    goals?: number;
  };
};

export type ActivityLog = {
  id: string;
  userId: string;
  action: 'LOGIN' | 'LOGOUT' | 'REGISTER' | 'CREATE' | 'UPDATE' | 'DELETE';
  module: string;
  entityId?: string;
  description?: string;
  ipAddress?: string;
  browser?: string;
  device?: string;
  createdAt: string;
  user?: { id?: string; firstname: string; lastname: string; email: string; avatarUrl?: string };
};

export type AdminDashboard = {
  users: { total: number; active: number; suspended: number };
  portfolios: { total: number };
  investments: { total: number; active: number; sold: number };
  transactions: { total: number };
  announcements: { total: number; published: number };
};

export type Announcement = {
  id: string;
  title: string;
  message: string;
  type: 'NEWS' | 'MAINTENANCE' | 'MARKET' | 'SYSTEM';
  imageUrl?: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAnnouncementDto = {
  title: string;
  message: string;
  type: 'NEWS' | 'MAINTENANCE' | 'MARKET' | 'SYSTEM';
  imageUrl?: string;
  isPublished?: boolean;
};

// ─── API Methods ─────────────────────────────────────────────────────

export const AdminApi = {
  async getDashboard(): Promise<AdminDashboard> {
    return apiFetch<AdminDashboard>('/admin/dashboard', { method: 'GET' });
  },

  async getUsers(params?: Record<string, string>): Promise<{ data: AdminUser[]; pagination: any }> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<{ data: AdminUser[]; pagination: any }>(`/admin/users${query}`, { method: 'GET' });
  },

  async getUserById(id: string): Promise<AdminUser> {
    return apiFetch<AdminUser>(`/admin/users/${id}`, { method: 'GET' });
  },

  async updateUserStatus(id: string, status: string): Promise<AdminUser> {
    return apiFetch<AdminUser>(`/admin/users/${id}/status`, { method: 'PATCH', body: { status } });
  },

  async deleteUser(id: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>(`/admin/users/${id}`, { method: 'DELETE' });
  },

  async getActivityLogs(params?: Record<string, string>): Promise<{ data: ActivityLog[]; pagination: any }> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<{ data: ActivityLog[]; pagination: any }>(`/admin/activity-logs${query}`, { method: 'GET' });
  },

  // ─── Announcements (Admin) ──────────────────────────────────────────

  async getAnnouncements(): Promise<Announcement[]> {
    return apiFetch<Announcement[]>('/admin/announcements', { method: 'GET' });
  },

  async createAnnouncement(dto: CreateAnnouncementDto): Promise<Announcement> {
    return apiFetch<Announcement>('/admin/announcements', { method: 'POST', body: dto });
  },

  async updateAnnouncement(id: string, dto: Partial<CreateAnnouncementDto>): Promise<Announcement> {
    return apiFetch<Announcement>(`/admin/announcements/${id}`, { method: 'PATCH', body: dto });
  },

  async deleteAnnouncement(id: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>(`/admin/announcements/${id}`, { method: 'DELETE' });
  },
};

// ─── Public Announcements API ────────────────────────────────────────

export const AnnouncementApi = {
  async findAll(): Promise<Announcement[]> {
    return apiFetch<Announcement[]>('/announcements', { method: 'GET' });
  },

  async findOne(id: string): Promise<Announcement> {
    return apiFetch<Announcement>(`/announcements/${id}`, { method: 'GET' });
  },
};

// ─── Dashboard API ───────────────────────────────────────────────────

export const DashboardApi = {
  async getSummary(): Promise<any> {
    return apiFetch<any>('/dashboard', { method: 'GET' });
  },
};

// ─── Report API ──────────────────────────────────────────────────────

export const ReportApi = {
  getPortfolioCsvUrl(params?: Record<string, string>): string {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
    return `${API_URL}/reports/portfolio${query}`;
  },

  getTransactionCsvUrl(params?: Record<string, string>): string {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
    return `${API_URL}/reports/transactions${query}`;
  },
};

// ─── User Profile API ────────────────────────────────────────────────

export const UserApi = {
  async getProfile(): Promise<AdminUser> {
    return apiFetch<AdminUser>('/users/profile', { method: 'GET' });
  },

  async updateProfile(dto: { firstname?: string; lastname?: string; phone?: string }): Promise<AdminUser> {
    return apiFetch<AdminUser>('/users/profile', { method: 'PATCH', body: dto });
  },

  async changePassword(dto: { oldPassword: string; newPassword: string }): Promise<{ message: string }> {
    return apiFetch<{ message: string }>('/users/password', { method: 'PATCH', body: dto });
  },
};
