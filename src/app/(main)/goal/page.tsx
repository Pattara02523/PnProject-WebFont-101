/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 57 / Flow ขั้นตอนที่ 57]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page เป้าหมายการเงิน (`/goal`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<GoalContent />`
 * ==========================================
 */

import { Metadata } from 'next';
import GoalContent from '@/components/features/goal/GoalContent';

export const metadata: Metadata = {
  title: 'Goal',
};

export default function GoalPage() {
  return <GoalContent />;
}
