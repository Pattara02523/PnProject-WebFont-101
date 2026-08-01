import { apiFetch } from './api-fetch';

// ─── Types ตรงตาม Backend Prisma Schema ─────────────────────────────

export type Category = {
  id: string;
  userId: string;
  name: string;
  icon?: string;
  color?: string;
  description?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { investments: number };
};

export type CreateCategoryDto = {
  name: string;
  icon?: string;
  color?: string;
  description?: string;
  isDefault?: boolean;
};

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

// ─── API Methods ─────────────────────────────────────────────────────

export const CategoryApi = {
  async findAll(): Promise<Category[]> {
    return apiFetch<Category[]>('/categories', { method: 'GET' });
  },

  async findOne(id: string): Promise<Category> {
    return apiFetch<Category>(`/categories/${id}`, { method: 'GET' });
  },

  async create(dto: CreateCategoryDto): Promise<Category> {
    return apiFetch<Category>('/categories', { method: 'POST', body: dto });
  },

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    return apiFetch<Category>(`/categories/${id}`, { method: 'PATCH', body: dto });
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>(`/categories/${id}`, { method: 'DELETE' });
  },
};
