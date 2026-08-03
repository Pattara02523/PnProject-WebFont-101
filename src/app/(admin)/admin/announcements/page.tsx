/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 81 / Flow ขั้นตอนที่ 81]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page จัดการประกาศข่าวสารสำหรับ Admin (`/admin/announcements`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<AdminAnnouncementsContent />`
 * ==========================================
 */

import { Metadata } from 'next';
import AdminAnnouncementsContent from '@/components/features/admin/AdminAnnouncementsContent';

export const metadata: Metadata = {
  title: 'Admin Announcements',
};

export default function AdminAnnouncementsPage() {
  return <AdminAnnouncementsContent />;
}
