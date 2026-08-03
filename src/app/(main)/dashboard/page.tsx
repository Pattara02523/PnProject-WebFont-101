/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 42 / Flow ขั้นตอนที่ 42]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page ภาพรวมทางการเงิน (`/dashboard`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<DashboardContent />`
 * ==========================================
 */

import { Metadata } from 'next';
import DashboardContent from '@/components/features/dashboard/DashboardContent';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return <DashboardContent />;
}
