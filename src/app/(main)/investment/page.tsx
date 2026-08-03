/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 51 / Flow ขั้นตอนที่ 51]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page รายการสินทรัพย์การลงทุน (`/investment`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<InvestmentContent />`
 * ==========================================
 */

import { Metadata } from 'next';
import InvestmentContent from '@/components/features/investment/InvestmentContent';

export const metadata: Metadata = {
  title: 'Investment',
};

export default function InvestmentPage() {
  return <InvestmentContent />;
}
