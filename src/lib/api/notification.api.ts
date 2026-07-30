import { apiFetch } from './api-fetch';

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export const NotificationApi = {
  async findAll(): Promise<NotificationItem[]> {
    return apiFetch<NotificationItem[]>('/notifications', {
      method: 'GET',
    });
  },

  async markAsRead(id: string): Promise<NotificationItem> {
    return apiFetch<NotificationItem>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },
};
