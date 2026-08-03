/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 01 / Flow ขั้นตอนที่ 1]
 * ชื่อไฟล์: postcss.config.mjs
 * หน้าที่หลัก: ไฟล์กำหนดค่า PostCSS Plugins (TailwindCSS & Autoprefixer) สำหรับประมวลผลไฟล์ CSS
 * รับอะไรมาจากไหน (Input): PostCSS Config Object
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): ส่งต่อให้ PostCSS Compiler เพื่อแปลง CSS utility classes
 * ==========================================
 */

const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
