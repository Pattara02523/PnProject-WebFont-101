/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 69 / Flow ขั้นตอนที่ 69]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page ประกาศข่าวสารระบบ (`/announcements`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<AnnouncementsContent />`
 * ==========================================
 */

import { Metadata } from 'next';
import AnnouncementsContent from '@/components/features/announcements/AnnouncementsContent';

export const metadata: Metadata = {
  title: 'Announcements',
};

export default function AnnouncementsPage() {
  return <AnnouncementsContent />;
}
