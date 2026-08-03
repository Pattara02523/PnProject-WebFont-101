/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 05 / Flow ขั้นตอนที่ 5]
 * ชื่อไฟล์: utils.ts
 * หน้าที่หลัก: ไฟล์รวมฟังก์ชัน ยูทิลิตี้ส่วนกลาง (Class Name Merger `cn` โดยใช้ clsx และ tailwind-merge, ฟอร์แมตตัวเลขการเงิน, ฟอร์แมตวันที่)
 * รับอะไรมาจากไหน (Input): Class Names, Numbers, Dates
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): ส่งออกฟังก์ชัน helper ให้ทุก UI Component และ Feature นำไปใช้งาน
 * ==========================================
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
