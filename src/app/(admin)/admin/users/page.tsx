/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 76 / Flow ขั้นตอนที่ 76]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page จัดการผู้ใช้งาน (`/admin/users`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<AdminUsersContent />`
 * ==========================================
 */

import { Metadata } from 'next';
import AdminUsersContent from '@/components/features/admin/AdminUsersContent';

export const metadata: Metadata = {
  title: 'Admin Users',
};

export default function AdminUsersPage() {
  return <AdminUsersContent />;
}
