/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 78 / Flow ขั้นตอนที่ 78]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page ประวัติกิจกรรมระบบ (`/admin/activity`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<AdminActivityLogsContent />`
 * ==========================================
 */

import { Metadata } from 'next';
import AdminActivityLogsContent from '@/components/features/admin/AdminActivityLogsContent';

export const metadata: Metadata = {
  title: 'Admin Activity',
};

export default function AdminActivityPage() {
  return <AdminActivityLogsContent />;
}
