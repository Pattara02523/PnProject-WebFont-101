/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 18 / Flow ขั้นตอนที่ 18]
 * ชื่อไฟล์: report.api.ts
 * หน้าที่หลัก: API Client Module สำหรับขอดาวน์โหลดรายงานสรุปการเงินรูปแบบ PDF หรือ CSV
 * รับอะไรมาจากไหน (Input): ReportQueryDto (startDate, endDate, format)
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): เรียกใช้ `apiFetch` ดาวน์โหลดสตรีมไฟล์ หรือ JSON สรุปผล
 * ==========================================
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

function buildReportUrl(path: string, params?: Record<string, string>): string {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  return `${API_URL}${path}${query}`;
}

export const ReportApi = {
  getPortfolioCsvUrl(params?: Record<string, string>): string {
    return buildReportUrl('/reports/portfolio', params);
  },

  getTransactionCsvUrl(params?: Record<string, string>): string {
    return buildReportUrl('/reports/transactions', params);
  }
};
