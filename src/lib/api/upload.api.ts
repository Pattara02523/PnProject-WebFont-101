/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 11 / Flow ขั้นตอนที่ 11]
 * ชื่อไฟล์: upload.api.ts
 * หน้าที่หลัก: API Client Module สำหรับอัปโหลดไฟล์รูปภาพโปรไฟล์ไปยัง Cloudinary ผ่าน Backend
 * รับอะไรมาจากไหน (Input): File Object (FormData)
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): เรียกใช้ `apiFetch` สื่อสารกับ `/upload/image` และคืนค่า UploadResponseDto (secure_url)
 * ==========================================
 */

import { apiFetch } from './api-fetch';

export interface UploadResponse {
  url: string;
  publicId: string;
}

export async function uploadAvatarApi(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  return apiFetch<UploadResponse>('/upload/avatar', {
    method: 'POST',
    body: formData
  });
}
