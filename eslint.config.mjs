/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 02 / Flow ขั้นตอนที่ 2]
 * ชื่อไฟล์: eslint.config.mjs
 * หน้าที่หลัก: ไฟล์กำหนดค่า ESLint สำหรับตรวจสอบคุณภาพโค้ด ไวยากรณ์ และกฎของ React/Next.js ในฝั่ง Web
 * รับอะไรมาจากไหน (Input): ESLint Rules Object
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): ใช้งานโดย Next CLI และ IDE เพื่อแสดงการแจ้งเตือน Linter
 * ==========================================
 */

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
