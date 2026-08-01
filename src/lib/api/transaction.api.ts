import { apiFetch } from './api-fetch';

// ─── Types ตรงตาม Backend Prisma Schema ─────────────────────────────

export type Transaction = {
  id: string;
  investmentId: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'DEPOSIT' | 'WITHDRAW';
  quantity?: number;
  price?: number;
  amount: number;
  fee?: number;
  tax?: number;
  transactionDate: string;
  note?: string;
  createdAt: string;
  investment?: {
    id: string;
    assetName: string;
    symbol: string;
    portfolioId: string;
    portfolio?: { id: string; name: string };
  };
};

export type CreateTransactionDto = {
  investmentId: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'DEPOSIT' | 'WITHDRAW';
  quantity?: number;
  price?: number;
  amount: number;
  fee?: number;
  tax?: number;
  transactionDate: string;
  note?: string;
};

export type UpdateTransactionDto = Partial<Omit<CreateTransactionDto, 'investmentId'>>;

// ─── API Methods ─────────────────────────────────────────────────────

export const TransactionApi = {
  async findAll(params?: Record<string, string>): Promise<Transaction[]> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await apiFetch<any>(`/transactions${query}`, { method: 'GET' });
    return Array.isArray(res) ? res : res?.data || [];
  },

  async findOne(id: string): Promise<Transaction> {
    return apiFetch<Transaction>(`/transactions/${id}`, { method: 'GET' });
  },

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    return apiFetch<Transaction>('/transactions', { method: 'POST', body: dto });
  },

  async update(id: string, dto: UpdateTransactionDto): Promise<Transaction> {
    return apiFetch<Transaction>(`/transactions/${id}`, { method: 'PATCH', body: dto });
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>(`/transactions/${id}`, { method: 'DELETE' });
  },
};
