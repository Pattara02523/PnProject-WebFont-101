import { apiFetch } from './api-fetch';

export type Investment = {
  id: string;
  name: string;
  symbol: string;
  type: string;
  category: string;
  buyPrice: number;
  currentPrice: number;
  quantity: number;
  investDate: string;
  risk: 'low' | 'medium' | 'high';
  roi: number;
  profit: number;
  status: 'active' | 'sold';
  portfolioId: string;
};

export type CreateInvestmentDto = {
  name: string;
  symbol: string;
  type: string;
  category: string;
  buyPrice: number;
  currentPrice?: number;
  quantity: number;
  investDate: string;
  risk: 'low' | 'medium' | 'high';
  portfolioId: string;
};

export type UpdateInvestmentDto = Partial<CreateInvestmentDto>;

export const InvestmentApi = {
  async findAll(): Promise<Investment[]> {
    return apiFetch<Investment[]>('/investments', {
      method: 'GET',
    });
  },

  async findOne(id: string): Promise<Investment> {
    return apiFetch<Investment>(`/investments/${id}`, {
      method: 'GET',
    });
  },

  async create(dto: CreateInvestmentDto): Promise<Investment> {
    return apiFetch<Investment>('/investments', {
      method: 'POST',
      body: dto,
    });
  },

  async update(id: string, dto: UpdateInvestmentDto): Promise<Investment> {
    return apiFetch<Investment>(`/investments/${id}`, {
      method: 'PATCH',
      body: dto,
    });
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>(`/investments/${id}`, {
      method: 'DELETE',
    });
  },
};
