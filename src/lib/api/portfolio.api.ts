import { apiFetch } from './api-fetch';

export type Portfolio = {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isFavorite: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    investments: number;
  };
};

export type CreatePortfolioDto = {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isFavorite?: boolean;
  isDefault?: boolean;
};

export type UpdatePortfolioDto = Partial<CreatePortfolioDto>;

export const PortfolioApi = {
  async findAll(token?: string): Promise<Portfolio[]> {
    return apiFetch<Portfolio[]>('/portfolios', {
      method: 'GET',
      token,
    });
  },

  async findOne(id: string, token?: string): Promise<Portfolio> {
    return apiFetch<Portfolio>(`/portfolios/${id}`, {
      method: 'GET',
      token,
    });
  },

  async create(dto: CreatePortfolioDto, token?: string): Promise<Portfolio> {
    return apiFetch<Portfolio>('/portfolios', {
      method: 'POST',
      body: dto,
      token,
    });
  },

  async update(id: string, dto: UpdatePortfolioDto, token?: string): Promise<Portfolio> {
    return apiFetch<Portfolio>(`/portfolios/${id}`, {
      method: 'PATCH',
      body: dto,
      token,
    });
  },

  async delete(id: string, token?: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>(`/portfolios/${id}`, {
      method: 'DELETE',
      token,
    });
  },
};
