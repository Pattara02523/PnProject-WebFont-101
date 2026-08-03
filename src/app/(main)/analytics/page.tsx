/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 60 / Flow ขั้นตอนที่ 60]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page กราฟและสถิติวิเคราะห์ (`/analytics`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<AnalyticsContent />`
 * ==========================================
 */

import { Metadata } from 'next';
import AnalyticsContent from '@/components/features/analytics/AnalyticsContent';

export const metadata: Metadata = {
  title: 'Analytics',
};

export default function AnalyticsPage() {
  return <AnalyticsContent />;
}
