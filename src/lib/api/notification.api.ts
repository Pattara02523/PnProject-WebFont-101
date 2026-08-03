/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 19 / Flow ขั้นตอนที่ 19]
 * ชื่อไฟล์: notification.api.ts
 * หน้าที่หลัก: API Client Module สำหรับรายการแจ้งเตือนในแอป (List Notifications, Mark as Read, Delete)
 * รับอะไรมาจากไหน (Input): Notification ID
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): เรียกใช้ `apiFetch` สื่อสารกับ `/notifications/*`
 * ==========================================
 */

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
