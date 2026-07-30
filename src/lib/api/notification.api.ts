import { apiFetch } from './api-fetch';

// ─── Types ตรงตาม Backend Prisma Schema ─────────────────────────────

export type NotificationItem = {
  id: string;
  userId: string;
  type: 'GOAL' | 'INVESTMENT' | 'REMINDER';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
};

// ─── API Methods ─────────────────────────────────────────────────────

export const NotificationApi = {
  async findAll(): Promise<NotificationItem[]> {
    return apiFetch<NotificationItem[]>('/notifications', { method: 'GET' });
  },

  async markAsRead(id: string): Promise<NotificationItem> {
    return apiFetch<NotificationItem>(`/notifications/${id}/read`, { method: 'PATCH' });
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>(`/notifications/${id}`, { method: 'DELETE' });
  },
};
