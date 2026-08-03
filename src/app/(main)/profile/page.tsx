/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 65 / Flow ขั้นตอนที่ 65]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page ตั้งค่าโปรไฟล์ผู้ใช้งาน (`/profile`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<ProfileContent />`
 * ==========================================
 */

import { Metadata } from 'next';
import ProfileContent from '@/components/features/profile/ProfileContent';

export const metadata: Metadata = {
  title: 'Profile',
};

export default function ProfilePage() {
  return <ProfileContent />;
}
