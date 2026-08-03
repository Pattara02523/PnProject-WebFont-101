/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 38 / Flow ขั้นตอนที่ 38]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page สมัครสมาชิก (`/register`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<RegisterForm />`
 * ==========================================
 */

import { Metadata } from 'next';
import { RegisterForm } from '@/components/features/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Register',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
