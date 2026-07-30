'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  PiggyBank,
  CreditCard,
} from 'lucide-react';
import {
  Card,
  Button,
  Badge,
  Modal,
  EmptyState,
  Pagination,
} from '@/components/ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TransactionApi } from '@/lib/api/transaction.api';
import { InvestmentApi } from '@/lib/api/investment.api';
const formatCurrency = (v: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 2 }).format(v);

const txTypes = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'BUY', label: 'ซื้อ' },
  { value: 'SELL', label: 'ขาย' },
  { value: 'DIVIDEND', label: 'เงินปันผล' },
  { value: 'DEPOSIT', label: 'ฝากเงิน' },
  { value: 'WITHDRAW', label: 'ถอนเงิน' },
];

const typeConfig: Record<
  string,
  { label: string; color: string; bg: string; variant: any; icon: any }
> = {
  BUY: {
    label: 'ซื้อ',
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    variant: 'info',
    icon: ArrowDownRight,
  },
  SELL: {
    label: 'ขาย',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    variant: 'success',
    icon: ArrowUpRight,
  },
  DIVIDEND: {
    label: 'เงินปันผล',
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    variant: 'info',
    icon: DollarSign,
  },
  DEPOSIT: {
    label: 'ฝากเงิน',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    variant: 'success',
    icon: PiggyBank,
  },
  WITHDRAW: {
    label: 'ถอนเงิน',
    color: 'text-red-600',
    bg: 'bg-red-50 dark:bg-red-900/20',
    variant: 'danger',
    icon: CreditCard,
  },
};

export default function TransactionContent() {
  const queryClient = useQueryClient();

  const { data: apiTransactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => TransactionApi.findAll(),
    retry: false,
  });

  const { data: apiInvestments = [] } = useQuery({
    queryKey: ['investments'],
    queryFn: () => InvestmentApi.findAll(),
    retry: false,
  });

  const transactions = apiTransactions;
  const allInvestments = apiInvestments;

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    type: 'BUY',
    investmentId: '',
    amount: '',
    quantity: '',
    price: '',
    fee: '',
    tax: '',
    date: '',
    note: '',
  });

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const keyword = search.toLowerCase();
      const matchSearch =
        (t.investment?.assetName ?? '').toLowerCase().includes(keyword) ||
        (t.investment?.symbol ?? '').toLowerCase().includes(keyword) ||
        (t.note ?? '').toLowerCase().includes(keyword);
      const matchType = filterType === 'all' || t.type === filterType;
      return matchSearch && matchType;
    });
  }, [transactions, search, filterType]);

  const perPage = 10;
  const paged = useMemo(() => {
    return filtered.slice((page - 1) * perPage, page * perPage);
  }, [filtered, page]);

  const handlePriceChange = (val: string) => {
    setForm((f) => {
      const q = parseFloat(f.quantity) || 0;
      const p = parseFloat(val) || 0;
      return { ...f, price: val, amount: q && p ? String(q * p) : f.amount };
    });
  };

  const handleQuantityChange = (val: string) => {
    setForm((f) => {
      const q = parseFloat(val) || 0;
      const p = parseFloat(f.price) || 0;
      return { ...f, quantity: val, amount: q && p ? String(q * p) : f.amount };
    });
  };

  const handleAdd = async () => {
    const selectedInv = allInvestments.find((inv) => inv.id === form.investmentId);
    const data = {
      investmentId: form.investmentId,
      type: form.type as 'BUY' | 'SELL' | 'DIVIDEND' | 'DEPOSIT' | 'WITHDRAW',
      amount: parseFloat(form.amount) || 0,
      quantity: form.quantity ? parseFloat(form.quantity) : undefined,
      price: form.price ? parseFloat(form.price) : undefined,
      fee: form.fee ? parseFloat(form.fee) : undefined,
      tax: form.tax ? parseFloat(form.tax) : undefined,
      transactionDate: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
      note: form.note || undefined,
    };

    try {
      await TransactionApi.create(data);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    } catch (err) {
      console.error('API create transaction failed:', err);
    }
    setShowAdd(false);
    setForm({ type: 'BUY', investmentId: '', amount: '', quantity: '', price: '', fee: '', tax: '', date: '', note: '' });
  };

  const totalIn = transactions.filter((t) => ['SELL', 'DIVIDEND', 'DEPOSIT'].includes(t.type)).reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter((t) => ['BUY', 'WITHDRAW'].includes(t.type)).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400">เงินเข้า</p>
            <p className="text-base font-bold text-emerald-600">{formatCurrency(totalIn)}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400">เงินออก</p>
            <p className="text-base font-bold text-red-500">{formatCurrency(totalOut)}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <Filter className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400">รายการทั้งหมด</p>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">{transactions.length}</p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1 flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหา..."
              className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
            {txTypes.map((t) => (
              <button
                key={t.value}
                onClick={() => setFilterType(t.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${filterType === t.value ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" /> เพิ่มรายการ
          </Button>
        </div>
      </div>

      {paged.length === 0 ? (
        <EmptyState title="ไม่มีรายการ" description="ยังไม่มีรายการ Transaction ที่ตรงกับเงื่อนไข" />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-100 dark:border-slate-800">
                <tr>
                  {['ประเภท', 'สินทรัพย์', 'ราคาต่อหน่วย', 'จำนวนหน่วย', 'ค่าธรรมเนียม / ภาษี', 'มูลค่ารวม', 'วันที่ทำรายการ', 'หมายเหตุ'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((tx) => {
                  const config = typeConfig[tx.type];
                  const TxIcon = config?.icon;
                  const isIn = ['SELL', 'DIVIDEND', 'DEPOSIT'].includes(tx.type);
                  return (
                    <tr key={tx.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${config?.bg}`}>
                            {TxIcon && <TxIcon className={`w-3.5 h-3.5 ${config?.color}`} />}
                          </div>
                          <Badge variant={config?.variant}>{config?.label}</Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{tx.investment?.assetName || '-'}</p>
                        <p className="text-xs text-slate-400">{tx.investment?.symbol || '-'}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{tx.price !== undefined ? formatCurrency(tx.price) : '-'}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{tx.quantity !== undefined ? tx.quantity.toLocaleString() : '-'}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                          {tx.fee ? <span>คธม: {formatCurrency(tx.fee)}</span> : null}
                          {tx.tax ? <span>ภาษี: {formatCurrency(tx.tax)}</span> : null}
                          {!tx.fee && !tx.tax ? <span>-</span> : null}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-semibold ${isIn ? 'text-emerald-600' : 'text-red-500'}`}>
                          {isIn ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                        {tx.transactionDate ? new Date(tx.transactionDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 max-w-xs truncate">{tx.note || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-400">{filtered.length} รายการ</p>
            <Pagination current={page} total={Math.max(1, Math.ceil(filtered.length / perPage))} onChange={setPage} />
          </div>
        </Card>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="เพิ่ม Transaction">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ประเภท</label>
            <div className="grid grid-cols-5 gap-1.5">
              {txTypes.slice(1).map((t) => (
                <button
                  key={t.value}
                  onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${form.type === t.value ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">สินทรัพย์การลงทุน <span className="text-red-500">*</span></label>
            <select
              value={form.investmentId}
              onChange={(e) => setForm((f) => ({ ...f, investmentId: e.target.value }))}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- เลือกสินทรัพย์ --</option>
              {allInvestments.map((inv) => (
                <option key={inv.id} value={inv.id}>{inv.assetName} ({inv.symbol})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ราคาต่อหน่วย</label>
              <input type="number" value={form.price} onChange={(e) => handlePriceChange(e.target.value)} placeholder="0" className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">จำนวนหน่วย</label>
              <input type="number" value={form.quantity} onChange={(e) => handleQuantityChange(e.target.value)} placeholder="0" className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ค่าธรรมเนียม</label>
              <input type="number" value={form.fee} onChange={(e) => setForm((f) => ({ ...f, fee: e.target.value }))} placeholder="0" className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ภาษี</label>
              <input type="number" value={form.tax} onChange={(e) => setForm((f) => ({ ...f, tax: e.target.value }))} placeholder="0" className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">มูลค่ารวม <span className="text-red-500">*</span></label>
            <input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="0" className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">วันที่ <span className="text-red-500">*</span></label>
            <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">หมายเหตุ</label>
            <textarea value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} rows={2} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setShowAdd(false)}>ยกเลิก</Button>
            <Button className="flex-1" onClick={handleAdd} disabled={!form.investmentId || !form.amount || !form.date}>บันทึก</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
