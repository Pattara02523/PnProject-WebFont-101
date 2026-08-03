/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 20 / Flow ขั้นตอนที่ 20]
 * ชื่อไฟล์: announcement.api.ts
 * หน้าที่หลัก: API Client Module สำหรับดึงประกาศและข่าวสารจากระบบ (สำหรับ User และ Admin)
 * รับอะไรมาจากไหน (Input): Announcement ID และ DTOs
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): เรียกใช้ `apiFetch` สื่อสารกับ `/announcements/*`
 * ==========================================
 */

import { apiFetch } from './api-fetch';

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

export const AnnouncementApi = {
  async findAll(): Promise<Announcement[]> {
    return apiFetch<Announcement[]>('/announcements', { method: 'GET' });
  },

  async findOne(id: string): Promise<Announcement> {
    return apiFetch<Announcement>(`/announcements/${id}`, { method: 'GET' });
  }
};
