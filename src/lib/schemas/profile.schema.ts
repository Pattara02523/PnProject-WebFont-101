/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 06 / Flow ขั้นตอนที่ 6]
 * ชื่อไฟล์: profile.schema.ts
 * หน้าที่หลัก: Zod Validation Schema สำหรับตรวจสอบฟอร์มแก้ไขข้อมูลโปรไฟล์และเปลี่ยนรหัสผ่านในฝั่ง Frontend
 * รับอะไรมาจากไหน (Input): ข้อมูล Input ฟอร์มจากผู้ใช้งาน
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): ส่งให้ react-hook-form resolvers ในหน้า Profile Page
 * ==========================================
 */

import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  avatarUrl: z.string().optional()
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
