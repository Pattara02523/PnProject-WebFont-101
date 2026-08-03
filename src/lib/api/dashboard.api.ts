/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 17 / Flow ขั้นตอนที่ 17]
 * ชื่อไฟล์: dashboard.api.ts
 * หน้าที่หลัก: API Client Module สำหรับดึงข้อมูลภาพรวมการเงิน หน้า Dashboard สรุปมูลค่าพอร์ต และสัดส่วนสินทรัพย์
 * รับอะไรมาจากไหน (Input): ไม่มี (ใช้ JWT Token ยืนยัน ตัวตน)
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): เรียกใช้ `apiFetch` สื่อสารกับ `/dashboard` และคืนค่า DashboardResponseDto
 * ==========================================
 */

import { apiFetch } from './api-fetch';

export const DashboardApi = {
  async getSummary<T>(): Promise<T> {
    return apiFetch<T>('/dashboard', { method: 'GET' });
  }
};
