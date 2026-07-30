"use client";

import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, ArrowUpRight, ArrowDownRight, DollarSign, PiggyBank, CreditCard } from 'lucide-react';
import { Card, Button, Badge, Modal, EmptyState, Pagination } from '@/components/ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TransactionApi, Transaction } from '@/lib/api/transaction.api';
import { mockTransactions, formatCurrency } from '@/lib/mock-data';

const txTypes = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'buy', label: 'ซื้อ' },
  { value: 'sell', label: 'ขาย' },
  { value: 'dividend', label: 'เงินปันผล' },
  { value: 'deposit', label: 'ฝากเงิน' },
  { value: 'withdraw', label: 'ถอนเงิน' },
]

const typeConfig: Record<string, { label: string; color: string; bg: string; variant: any; icon: any }> = {
  buy: { label: 'ซื้อ', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', variant: 'info', icon: ArrowDownRight },
  sell: { label: 'ขาย', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', variant: 'success', icon: ArrowUpRight },
  dividend: { label: 'เงินปันผล', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', variant: 'info', icon: DollarSign },
  deposit: { label: 'ฝากเงิน', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', variant: 'success', icon: PiggyBank },
  withdraw: { label: 'ถอนเงิน', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', variant: 'danger', icon: CreditCard },
}

export default function TransactionContent() {
  const queryClient = useQueryClient();

  // Load transactions from REST API using React Query
  const { data: apiTransactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => TransactionApi.findAll(),
    retry: false,
  });

  const [localTransactions, setLocalTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: 'buy', asset: '', symbol: '', amount: '', quantity: '', price: '', date: '', note: '' });

  const transactions = useMemo(() => {
    if (apiTransactions && apiTransactions.length > 0) {
      return apiTransactions;
    }
    return localTransactions.length > 0 ? localTransactions : mockTransactions;
  }, [apiTransactions, localTransactions]);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.asset.toLowerCase().includes(search.toLowerCase()) || t.symbol.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'all' || t.type === filterType;
      return matchSearch && matchType;
    });
  }, [transactions, search, filterType]);

  const perPage = 10;
  const paged = useMemo(() => {
    return filtered.slice((page - 1) * perPage, page * perPage);
  }, [filtered, page]);

  const handleAdd = async () => {
    const data = {
      type: form.type as any,
      asset: form.asset,
      symbol: form.symbol,
      amount: parseFloat(form.amount) || 0,
      quantity: parseFloat(form.quantity) || 0,
      price: parseFloat(form.price) || 0,
      date: form.date,
      note: form.note,
      portfolioId: '1',
    };

    try {
      await TransactionApi.create(data);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    } catch (err) {
      console.warn('API create transaction failed, fallback to local state:', err);
      setLocalTransactions(ts => {
        const current = ts.length > 0 ? ts : [...mockTransactions];
        return [...current, { id: Date.now().toString(), ...data }];
      });
    }
    setShowAdd(false);
    setForm({ type: 'buy', asset: '', symbol: '', amount: '', quantity: '', price: '', date: '', note: '' });
  };

  const totalIn = transactions.filter(t => ['sell', 'dividend', 'deposit'].includes(t.type)).reduce((s, t) => s + t.amount, 0)
  const totalOut = transactions.filter(t => ['buy', 'withdraw'].includes(t.type)).reduce((s, t) => s + t.amount, 0)

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center"><ArrowUpRight className="w-5 h-5 text-emerald-500" /></div>
          <div><p className="text-xs text-slate-400">เงินเข้า</p><p className="text-base font-bold text-emerald-600">{formatCurrency(totalIn)}</p></div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center"><ArrowDownRight className="w-5 h-5 text-red-500" /></div>
          <div><p className="text-xs text-slate-400">เงินออก</p><p className="text-base font-bold text-red-500">{formatCurrency(totalOut)}</p></div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"><Filter className="w-5 h-5 text-blue-500" /></div>
          <div><p className="text-xs text-slate-400">รายการทั้งหมด</p><p className="text-base font-bold text-slate-900 dark:text-slate-100">{transactions.length}</p></div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1 flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหา..." className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {txTypes.map(t => (
              <button key={t.value} onClick={() => setFilterType(t.value)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${filterType === t.value ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>{t.label}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> เพิ่มรายการ</Button>
        </div>
      </div>

      {paged.length === 0 ? (
        <EmptyState title="ไม่มีรายการ" description="ยังไม่มีรายการ Transaction ที่ตรงกับเงื่อนไข" />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-100 dark:border-slate-800">
                <tr>{['ประเภท', 'สินทรัพย์', 'ราคา', 'จำนวน', 'มูลค่า', 'วันที่', 'หมายเหตุ'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {paged.map(tx => {
                  const config = typeConfig[tx.type]
                  const TxIcon = config?.icon
                  const isIn = ['sell', 'dividend', 'deposit'].includes(tx.type)
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
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{tx.asset}</p>
                        <p className="text-xs text-slate-400">{tx.symbol}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatCurrency(tx.price)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{tx.quantity.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-semibold ${isIn ? 'text-emerald-600' : 'text-red-500'}`}>
                          {isIn ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{tx.date}</td>
                      <td className="px-4 py-3 text-xs text-slate-400 max-w-xs truncate">{tx.note || '-'}</td>
                    </tr>
                  )
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
            <div className="grid grid-cols-3 gap-2">
              {txTypes.slice(1).map(t => (
                <button key={t.value} onClick={() => setForm(f => ({ ...f, type: t.value }))} className={`py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${form.type === t.value ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}>{t.label}</button>
              ))}
            </div>
          </div>
          {[
            ['ชื่อสินทรัพย์', 'asset', 'text', 'Apple Inc.'],
            ['Symbol', 'symbol', 'text', 'AAPL'],
            ['ราคา', 'price', 'number', '0'],
            ['จำนวน', 'quantity', 'number', '0'],
            ['มูลค่ารวม', 'amount', 'number', '0']
          ].map(([label, key, type, ph]) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
              <input type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">วันที่</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">หมายเหตุ</label>
            <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="..." rows={2} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setShowAdd(false)}>ยกเลิก</Button>
            <Button className="flex-1" onClick={handleAdd}>บันทึก</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
