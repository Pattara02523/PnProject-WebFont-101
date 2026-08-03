/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 10 / Flow ขั้นตอนที่ 10]
 * ชื่อไฟล์: user.api.ts
 * หน้าที่หลัก: API Client Module สำหรับจัดการข้อมูลส่วนตัวผู้ใช้ (Get Profile, Update Profile, Change Password)
 * รับอะไรมาจากไหน (Input): UpdateProfileDto, ChangePasswordDto จาก Profile Form
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): เรียกใช้ `apiFetch` สื่อสารกับ `/users/*` บน NestJS API
 * ==========================================
 */

import { apiFetch } from './api-fetch';

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export async function getProfileApi(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/users/me', {
    method: 'GET'
  });
}

export async function updateProfileApi(
  payload: UpdateProfilePayload
): Promise<UserProfile> {
  return apiFetch<UserProfile>('/users/profile', {
    method: 'PATCH',
    body: payload as Record<string, unknown>
  });
}
