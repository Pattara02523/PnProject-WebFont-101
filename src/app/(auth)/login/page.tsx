/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 36 / Flow ขั้นตอนที่ 36]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Route Page เข้าสู่ระบบ (`/login`)
 * รับอะไรมาจากไหน (Input): HTTP GET Request
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render `<LoginForm />`
 * ==========================================
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/features/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginForm />
    </Suspense>
  );
}
