/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 00 / Flow ขั้นตอนที่ 0]
 * ชื่อไฟล์: next.config.ts
 * หน้าที่หลัก: ไฟล์กำหนดค่า Next.js Framework Configuration (ตั้งค่า React StrictMode, Image Domains สำหรับ Cloudinary)
 * รับอะไรมาจากไหน (Input): NextConfig Options
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): ส่งการตั้งค่าให้ Next.js Server & Build Compiler
 * ==========================================
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/regis',
        destination: '/register',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
