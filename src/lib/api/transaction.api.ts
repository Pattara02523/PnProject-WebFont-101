import { apiFetch } from './api-fetch';

export type Transaction = {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdraw' | 'dividend';
  asset: string;
  symbol: string;
  amount: number;
  quantity: number;
  price: number;
  date: string;
  portfolioId: string;
  note?: string;
};

export type CreateTransactionDto = {
  type: 'buy' | 'sell' | 'deposit' | 'withdraw' | 'dividend';
  asset: string;
  symbol: string;
  amount: number;
  quantity: number;
  price: number;
  date: string;
  portfolioId: string;
  note?: string;
};

export const TransactionApi = {
  async findAll(): Promise<Transaction[]> {
    return apiFetch<Transaction[]>('/transactions', {
      method: 'GET',
    });
  },

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    return apiFetch<Transaction>('/transactions', {
      method: 'POST',
      body: dto,
    });
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },
};
