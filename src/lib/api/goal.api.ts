/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 16 / Flow ขั้นตอนที่ 16]
 * ชื่อไฟล์: goal.api.ts
 * หน้าที่หลัก: API Client Module สำหรับจัดการเป้าหมายการเงิน (Create, Update, Delete, List, Deposit Progress)
 * รับอะไรมาจากไหน (Input): Goal DTOs และ Goal ID
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): เรียกใช้ `apiFetch` สื่อสารกับ `/goals/*`
 * ==========================================
 */

import { apiFetch } from './api-fetch';

// ─── Types ตรงตาม Backend Prisma Schema ─────────────────────────────

export type Goal = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
};

export type CreateGoalDto = {
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  deadline: string;
};

export type UpdateGoalDto = Partial<CreateGoalDto>;

// ─── API Methods ─────────────────────────────────────────────────────

export const GoalApi = {
  async findAll(): Promise<Goal[]> {
    return apiFetch<Goal[]>('/goals', { method: 'GET' });
  },

  async findOne(id: string): Promise<Goal> {
    return apiFetch<Goal>(`/goals/${id}`, { method: 'GET' });
  },

  async create(dto: CreateGoalDto): Promise<Goal> {
    return apiFetch<Goal>('/goals', { method: 'POST', body: dto });
  },

  async update(id: string, dto: UpdateGoalDto): Promise<Goal> {
    return apiFetch<Goal>(`/goals/${id}`, { method: 'PATCH', body: dto });
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>(`/goals/${id}`, { method: 'DELETE' });
  },
};
