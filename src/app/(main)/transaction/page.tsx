/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 55 / Flow ขั้นตอนที่ 55]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page ประวัติรายการธุรกรรม (`/transaction`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<TransactionContent />`
 * ==========================================
 */

import { Metadata } from 'next';
import TransactionContent from '@/components/features/transaction/TransactionContent';

export const metadata: Metadata = {
  title: 'Transaction',
};

export default function TransactionPage() {
  return <TransactionContent />;
}
