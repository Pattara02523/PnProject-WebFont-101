"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit2, Trash2, TrendingUp, TrendingDown, ChevronRight, Loader2 } from 'lucide-react';
import { Card, Button, Badge, Modal, EmptyState, ConfirmDialog, Pagination } from '@/components/ui/index';
import { InvestmentApi, Investment, CreateInvestmentDto } from '@/lib/api/investment.api';
import { PortfolioApi } from '@/lib/api/portfolio.api';
import { CategoryApi } from '@/lib/api/category.api';

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 2 }).format(v);
const formatPercent = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;

const riskColors: Record<string, string> = { LOW: 'success', MEDIUM: 'warning', HIGH: 'danger' };
const riskLabels: Record<string, string> = { LOW: 'ต่ำ', MEDIUM: 'ปานกลาง', HIGH: 'สูง' };
const typeLabels: Record<string, string> = { STOCK: 'หุ้น', ETF: 'ETF', FUND: 'กองทุน', CRYPTO: 'คริปโต', GOLD: 'ทอง', BOND: 'ตราสารหนี้' };

const EMPTY_FORM: CreateInvestmentDto = {
  portfolioId: '',
  categoryId: '',
  assetName: '',
  symbol: '',
  assetType: 'STOCK',
  purchasePrice: 0,
  currentPrice: 0,
  quantity: 0,
  averageCost: 0,
  riskLevel: 'MEDIUM',
  investmentDate: '',
};

export default function InvestmentContent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: investments = [], isLoading } = useQuery({
    queryKey: ['investments'],
    queryFn: () => InvestmentApi.findAll(),
    retry: false,
  });

  const { data: portfolios = [] } = useQuery({
    queryKey: ['portfolios'],
    queryFn: () => PortfolioApi.findAll(),
    retry: false,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryApi.findAll(),
    retry: false,
  });

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Investment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateInvestmentDto>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const filtered = investments.filter(inv => {
    const matchSearch =
      inv.assetName.toLowerCase().includes(search.toLowerCase()) ||
      inv.symbol.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || inv.assetType === filterType;
    const matchRisk = filterRisk === 'all' || inv.riskLevel === filterRisk;
    return matchSearch && matchType && matchRisk;
  });

  const perPage = 10;
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, portfolioId: portfolios[0]?.id ?? '', categoryId: categories[0]?.id ?? '' });
    setEditItem(null);
    setShowForm(true);
  };

  const openEdit = (inv: Investment) => {
    setForm({
      portfolioId: inv.portfolioId,
      categoryId: inv.categoryId,
      assetName: inv.assetName,
      symbol: inv.symbol,
      assetType: inv.assetType,
      purchasePrice: inv.purchasePrice,
      currentPrice: inv.currentPrice,
      quantity: inv.quantity,
      averageCost: inv.averageCost,
      riskLevel: inv.riskLevel,
      investmentDate: inv.investmentDate?.split('T')[0] ?? '',
      note: inv.note,
    });
    setEditItem(inv);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editItem) {
        await InvestmentApi.update(editItem.id, form);
      } else {
        await InvestmentApi.create(form);
      }
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      setShowForm(false);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await InvestmentApi.delete(deleteId);
      queryClient.invalidateQueries({ queryKey: ['investments'] });
    } catch (err) {
      console.error('Delete failed:', err);
    }
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex-1 flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ค้นหาสินทรัพย์..."
                className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">ทุกประเภท</option>
              <option value="STOCK">หุ้น</option>
              <option value="ETF">ETF</option>
              <option value="FUND">กองทุน</option>
              <option value="CRYPTO">คริปโต</option>
              <option value="GOLD">ทอง</option>
              <option value="BOND">ตราสารหนี้</option>
            </select>
            <select
              value={filterRisk}
              onChange={e => setFilterRisk(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">ทุก Risk</option>
              <option value="LOW">ต่ำ</option>
              <option value="MEDIUM">ปานกลาง</option>
              <option value="HIGH">สูง</option>
            </select>
          </div>
          <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> เพิ่มการลงทุน</Button>
        </div>

        {paged.length === 0 ? (
          <EmptyState
            title="ยังไม่มีการลงทุน"
            description="เพิ่มสินทรัพย์เพื่อเริ่มติดตามการลงทุน"
            action={<Button onClick={openCreate}><Plus className="w-4 h-4" /> เพิ่มการลงทุน</Button>}
            icon={<TrendingUp className="w-8 h-8" />}
          />
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    {['สินทรัพย์', 'ประเภท', 'ราคาซื้อ', 'ราคาปัจจุบัน', 'จำนวน', 'กำไร/ขาดทุน', 'ROI', 'Risk', 'วันที่', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map(inv => {
                    const profit = (inv.currentPrice - inv.purchasePrice) * inv.quantity;
                    const roi = inv.purchasePrice > 0 ? ((inv.currentPrice - inv.purchasePrice) / inv.purchasePrice) * 100 : 0;
                    return (
                      <tr
                        key={inv.id}
                        className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                        onClick={() => router.push(`/investment/${inv.id}`)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                              {inv.symbol.slice(0, 2)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{inv.assetName}</p>
                              <p className="text-xs text-slate-400">{inv.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><Badge variant="neutral">{typeLabels[inv.assetType] ?? inv.assetType}</Badge></td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatCurrency(inv.purchasePrice)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">{formatCurrency(inv.currentPrice)}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{inv.quantity.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {profit >= 0 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                            <span className={`text-sm font-semibold ${profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {profit >= 0 ? '+' : ''}{formatCurrency(Math.abs(profit))}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><Badge variant={roi >= 0 ? 'success' : 'danger'}>{formatPercent(roi)}</Badge></td>
                        <td className="px-4 py-3"><Badge variant={riskColors[inv.riskLevel] as any}>{riskLabels[inv.riskLevel]}</Badge></td>
                        <td className="px-4 py-3 text-xs text-slate-400">{inv.investmentDate?.split('T')[0] ?? '-'}</td>
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <div className="flex gap-1">
                            <button onClick={e => { e.stopPropagation(); openEdit(inv); }} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={e => { e.stopPropagation(); setDeleteId(inv.id); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => router.push(`/investment/${inv.id}`)} className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-500"><ChevronRight className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <p className="text-xs text-slate-400">{filtered.length} รายการ</p>
              <Pagination current={page} total={Math.ceil(filtered.length / perPage)} onChange={setPage} />
            </div>
          </Card>
        )}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editItem ? 'แก้ไขการลงทุน' : 'เพิ่มการลงทุน'} size="lg">
        <div className="grid grid-cols-2 gap-4">
          {/* Portfolio */}
          <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">พอร์ตโฟลิโอ</label>
            <select value={form.portfolioId} onChange={e => setForm(f => ({ ...f, portfolioId: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">หมวดหมู่</label>
            <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {/* Asset Name */}
          <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ชื่อสินทรัพย์</label>
            <input value={form.assetName} onChange={e => setForm(f => ({ ...f, assetName: e.target.value }))} placeholder="Apple Inc." className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          {/* Symbol */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Symbol</label>
            <input value={form.symbol} onChange={e => setForm(f => ({ ...f, symbol: e.target.value }))} placeholder="AAPL" className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          {/* Asset Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ประเภท</label>
            <select value={form.assetType} onChange={e => setForm(f => ({ ...f, assetType: e.target.value as any }))} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="STOCK">หุ้น</option>
              <option value="ETF">ETF</option>
              <option value="FUND">กองทุน</option>
              <option value="CRYPTO">คริปโต</option>
              <option value="GOLD">ทอง</option>
              <option value="BOND">ตราสารหนี้</option>
            </select>
          </div>
          {/* Risk Level */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ระดับความเสี่ยง</label>
            <select value={form.riskLevel} onChange={e => setForm(f => ({ ...f, riskLevel: e.target.value as any }))} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="LOW">ต่ำ</option>
              <option value="MEDIUM">ปานกลาง</option>
              <option value="HIGH">สูง</option>
            </select>
          </div>
          {/* Numeric Fields */}
          {([['ราคาซื้อ', 'purchasePrice'], ['ราคาปัจจุบัน', 'currentPrice'], ['จำนวน', 'quantity'], ['ต้นทุนเฉลี่ย', 'averageCost']] as const).map(([label, key]) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
              <input
                type="number"
                value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ))}
          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">วันที่ลงทุน</label>
            <input type="date" value={form.investmentDate} onChange={e => setForm(f => ({ ...f, investmentDate: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          {/* Note */}
          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">หมายเหตุ</label>
            <input value={form.note ?? ''} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="หมายเหตุ (ไม่บังคับ)" className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="col-span-2 flex gap-3 mt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowForm(false)}>ยกเลิก</Button>
            <Button className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editItem ? 'บันทึก' : 'เพิ่ม')}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="ลบการลงทุน?"
        description="ไม่สามารถกู้คืนได้หลังจากลบแล้ว"
        danger
      />
    </>
  );
}
