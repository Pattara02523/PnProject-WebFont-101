/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 85 / Flow ขั้นตอนที่ 85]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page ส่งออกข้อมูลสถิติ Admin (`/admin/exports`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<AdminExportsContent />`
 * ==========================================
 */

import { Metadata } from 'next';
import AdminExportsContent from '@/components/features/admin/AdminExportsContent';

export const metadata: Metadata = {
  title: 'Admin Export Reports',
};

export default function AdminExportsPage() {
  return <AdminExportsContent />;
}
