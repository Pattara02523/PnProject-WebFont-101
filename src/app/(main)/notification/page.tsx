/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 67 / Flow ขั้นตอนที่ 67]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page รายการแจ้งเตือน (`/notification`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<NotificationContent />`
 * ==========================================
 */

import { Metadata } from 'next';
import NotificationContent from '@/components/features/notification/NotificationContent';

export const metadata: Metadata = {
  title: 'Notification',
};

export default function NotificationPage() {
  return <NotificationContent />;
}
