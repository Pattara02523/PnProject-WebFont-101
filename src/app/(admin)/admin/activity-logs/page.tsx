/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 79 / Flow ขั้นตอนที่ 79]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page ประวัติกิจกรรมระบบ Alias (`/admin/activity-logs`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<AdminActivityLogsContent />`
 * ==========================================
 */

import { Metadata } from 'next';
import AdminActivityLogsContent from '@/components/features/admin/AdminActivityLogsContent';

export const metadata: Metadata = {
  title: 'Admin Activity Logs',
};

export default function AdminActivityLogsPage() {
  return <AdminActivityLogsContent />;
}
