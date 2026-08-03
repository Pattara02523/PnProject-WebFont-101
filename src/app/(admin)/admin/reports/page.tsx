/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 83 / Flow ขั้นตอนที่ 83]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page รายงานภาพรวมระบบ Admin (`/admin/reports`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<AdminReportsContent />`
 * ==========================================
 */

import { Metadata } from 'next';
import AdminReportsContent from '@/components/features/admin/AdminReportsContent';

export const metadata: Metadata = {
  title: 'Admin Reports',
};

export default function AdminReportsPage() {
  return <AdminReportsContent />;
}
