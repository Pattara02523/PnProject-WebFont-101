/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 62 / Flow ขั้นตอนที่ 62]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page ออกรายงานทางการเงิน (`/reports`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<ReportsContent />`
 * ==========================================
 */

import { Metadata } from 'next';
import ReportsContent from '@/components/features/reports/ReportsContent';

export const metadata: Metadata = {
  title: 'Reports',
};

export default function ReportsPage() {
  return <ReportsContent />;
}
