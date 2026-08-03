/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 53 / Flow ขั้นตอนที่ 53]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Dynamic Route Page รายละเอียดสินทรัพย์ (`/investment/[id]`)
 * รับอะไรมาจากไหน (Input): params.id
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<InvestmentDetailContent investmentId={id} />`
 * ==========================================
 */

import { Metadata } from 'next';
import InvestmentDetailContent from '@/components/features/investment/InvestmentDetailContent';

export const metadata: Metadata = {
  title: 'Investment Detail',
};

export default function InvestmentDetailPage() {
  return <InvestmentDetailContent />;
}
