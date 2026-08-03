/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 47 / Flow ขั้นตอนที่ 47]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Dynamic Route Page รายละเอียดพอร์ตเฉพาะ ID (`/portfolio/[id]`)
 * รับอะไรมาจากไหน (Input): params.id
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<PortfolioDetailContent portfolioId={id} />`
 * ==========================================
 */

import { Metadata } from 'next';
import PortfolioDetailContent from '@/components/features/portfolio/PortfolioDetailContent';

export const metadata: Metadata = {
  title: 'Portfolio Detail',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <PortfolioDetailContent id={id} />;
}
