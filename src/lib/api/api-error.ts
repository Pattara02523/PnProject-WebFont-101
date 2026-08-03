/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 07 / Flow ขั้นตอนที่ 7]
 * ชื่อไฟล์: api-error.ts
 * หน้าที่หลัก: Custom Error Class `ApiError` สำหรับจัดการ HTTP Error Status Code และ Error Message ที่ตอบกลับจาก NestJS API
 * รับอะไรมาจากไหน (Input): HTTP Status Code, Message, Details จาก API Request Failure
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): ส่งออก class ให้ `api-fetch.ts` และ React Query สำหรับจับ Error
 * ==========================================
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
