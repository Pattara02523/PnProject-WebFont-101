/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 04 / Flow ขั้นตอนที่ 4]
 * ชื่อไฟล์: font.ts
 * หน้าที่หลัก: ตั้งค่า Google Fonts (`Inter` และ `Prompt`) แบบ Next.js Font Optimization
 * รับอะไรมาจากไหน (Input): Google Fonts Configuration Options
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): ส่งออก Font Variable Classes ให้ `layout.tsx` เพื่อใช้งานฟอนต์ภาษาไทยและอังกฤษอย่างสวยงาม
 * ==========================================
 */

import { Noto_Sans } from 'next/font/google';

export const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});
