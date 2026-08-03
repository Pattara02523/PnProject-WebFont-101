/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 33 / Flow ขั้นตอนที่ 33]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Landing Page Route (`/`) หน้าต้อนรับเข้าสู่ระบบ PNProject
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<LandingPage />`
 * ==========================================
 */

import { Metadata } from 'next';
import { LandingPage } from '@/components/landing-page';

export const metadata: Metadata = {
  title: 'Home',
};

export default function Home() {
  return <LandingPage />;
}
