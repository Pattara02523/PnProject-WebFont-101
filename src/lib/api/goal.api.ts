import { apiFetch } from './api-fetch';

export type Goal = {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color?: string;
  description?: string;
};

export type CreateGoalDto = {
  name: string;
  icon?: string;
  targetAmount: number;
  currentAmount?: number;
  deadline: string;
  color?: string;
  description?: string;
};

export type UpdateGoalDto = Partial<CreateGoalDto>;

export const GoalApi = {
  async findAll(): Promise<Goal[]> {
    return apiFetch<Goal[]>('/goals', {
      method: 'GET',
    });
  },

  async create(dto: CreateGoalDto): Promise<Goal> {
    return apiFetch<Goal>('/goals', {
      method: 'POST',
      body: dto,
    });
  },

  async update(id: string, dto: UpdateGoalDto): Promise<Goal> {
    return apiFetch<Goal>(`/goals/${id}`, {
      method: 'PATCH',
      body: dto,
    });
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>(`/goals/${id}`, {
      method: 'DELETE',
    });
  },
};
