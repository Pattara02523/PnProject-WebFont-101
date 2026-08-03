/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 74 / Flow ขั้นตอนที่ 74]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page ภาพรวม Admin Dashboard (`/admin`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<AdminDashboardContent />`
 * ==========================================
 */

import { Metadata } from 'next';
import AdminDashboardContent from '@/components/features/admin/AdminDashboardContent';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

export default function AdminDashboardPage() {
  return <AdminDashboardContent />;
}
