import { apiFetch } from './api-fetch';

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
};

export const CategoryApi = {
  async findAll(): Promise<Category[]> {
    return apiFetch<Category[]>('/categories', {
      method: 'GET',
    });
  },
};
