/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 45 / Flow ขั้นตอนที่ 45]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page รายการพอร์ตการลงทุน (`/portfolio`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<PortfolioContent />`
 * ==========================================
 */

import { Metadata } from 'next';
import PortfolioContent from '@/components/features/portfolio/PortfolioContent';

export const metadata: Metadata = {
  title: 'Portfolio',
};

export default function PortfolioPage() {
  return <PortfolioContent />;
}
