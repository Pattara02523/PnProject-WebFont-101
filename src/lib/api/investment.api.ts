/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 14 / Flow ขั้นตอนที่ 14]
 * ชื่อไฟล์: investment.api.ts
 * หน้าที่หลัก: API Client Module สำหรับจัดการสินทรัพย์การลงทุน (Create, Update, Delete, List, Get Detail)
 * รับอะไรมาจากไหน (Input): Investment DTOs, Query Filters และ Investment ID
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): เรียกใช้ `apiFetch` สื่อสารกับ `/investments/*`
 * ==========================================
 */

import { apiFetch } from './api-fetch';

// ─── Types ตรงตาม Backend Prisma Schema ─────────────────────────────

export type Investment = {
  id: string;
  portfolioId: string;
  categoryId: string;
  assetName: string;
  symbol: string;
  assetType: 'STOCK' | 'ETF' | 'FUND' | 'CRYPTO' | 'GOLD' | 'BOND';
  purchasePrice: number;
  currentPrice: number;
  quantity: number;
  averageCost: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'ACTIVE' | 'SOLD';
  investmentDate: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  portfolio?: { id: string; name: string; color?: string };
  category?: { id: string; name: string; color?: string };
};

export type CreateInvestmentDto = {
  portfolioId: string;
  categoryId: string;
  assetName: string;
  symbol: string;
  assetType: 'STOCK' | 'ETF' | 'FUND' | 'CRYPTO' | 'GOLD' | 'BOND';
  purchasePrice: number;
  currentPrice: number;
  quantity: number;
  averageCost: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  investmentDate: string;
  note?: string;
};

export type UpdateInvestmentDto = Partial<CreateInvestmentDto>;

// ─── API Methods ─────────────────────────────────────────────────────

export const InvestmentApi = {
  async findAll(params?: Record<string, string>): Promise<Investment[]> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await apiFetch<any>(`/investments${query}`, { method: 'GET' });
    return Array.isArray(res) ? res : res?.data || [];
  },

  async findOne(id: string): Promise<Investment> {
    return apiFetch<Investment>(`/investments/${id}`, { method: 'GET' });
  },

  async create(dto: CreateInvestmentDto): Promise<Investment> {
    return apiFetch<Investment>('/investments', { method: 'POST', body: dto });
  },

  async update(id: string, dto: UpdateInvestmentDto): Promise<Investment> {
    return apiFetch<Investment>(`/investments/${id}`, { method: 'PATCH', body: dto });
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>(`/investments/${id}`, { method: 'DELETE' });
  },
};
