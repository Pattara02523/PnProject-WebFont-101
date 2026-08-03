/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 49 / Flow ขั้นตอนที่ 49]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page หมวดหมู่สินทรัพย์ (`/category`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<CategoryContent />`
 * ==========================================
 */

import { Metadata } from 'next';
import CategoryContent from '@/components/features/category/CategoryContent';

export const metadata: Metadata = {
  title: 'Category',
};

export default function CategoryPage() {
  return <CategoryContent />;
}
