import { apiFetch } from './api-fetch';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  joined: string;
  lastLogin: string;
};

export type AdminPayment = {
  id: string;
  user: string;
  email: string;
  plan: string;
  amount: number;
  method: string;
  status: string;
  date: string;
  slip?: string | null;
};

export type ActivityLog = {
  id: string;
  user: string;
  action: string;
  description: string;
  ip: string;
  time: string;
};

export const AdminApi = {
  async getUsers(): Promise<AdminUser[]> {
    return apiFetch<AdminUser[]>('/admin/users', {
      method: 'GET',
    });
  },

  async getPayments(): Promise<AdminPayment[]> {
    return apiFetch<AdminPayment[]>('/admin/payments', {
      method: 'GET',
    });
  },

  async getActivityLogs(): Promise<ActivityLog[]> {
    return apiFetch<ActivityLog[]>('/admin/activity-logs', {
      method: 'GET',
    });
  },

  async approvePayment(id: string): Promise<AdminPayment> {
    return apiFetch<AdminPayment>(`/admin/payments/${id}/approve`, {
      method: 'PATCH',
    });
  },

  async rejectPayment(id: string): Promise<AdminPayment> {
    return apiFetch<AdminPayment>(`/admin/payments/${id}/reject`, {
      method: 'PATCH',
    });
  },
};
