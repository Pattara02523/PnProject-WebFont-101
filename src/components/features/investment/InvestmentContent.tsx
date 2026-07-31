'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Search, TrendingUp, TrendingDown,
  Loader2, X, Pencil, Trash2, AlertCircle,
} from 'lucide-react';
import {
  InvestmentApi, Investment, CreateInvestmentDto, UpdateInvestmentDto,
} from '@/lib/api/investment.api';
import { PortfolioApi, Portfolio } from '@/lib/api/portfolio.api';
import { CategoryApi, Category } from '@/lib/api/category.api';

const INVESTMENT_TYPES = [
  { value: 'STOCK', label: 'หุ้น' },
  { value: 'FUND', label: 'กองทุน' },
  { value: 'CRYPTO', label: 'คริปโต' },
  { value: 'ETF', label: 'ETF' },
  { value: 'BOND', label: 'พันธบัตร' },
  { value: 'REAL_ESTATE', label: 'อสังหา' },
  { value: 'OTHER', label: 'อื่นๆ' },
];

const TYPE_LABEL: Record<string, string> = {
  STOCK: 'หุ้น', FUND: 'กองทุน', CRYPTO: 'คริปโต',
  ETF: 'ETF', BOND: 'พันธบัตร', REAL_ESTATE: 'อสังหา', OTHER: 'อื่นๆ',
};

const emptyForm = {
  portfolioId: '', categoryId: '', name: '', ticker: '',
  type: 'STOCK', quantity: '', buyPrice: '', currentPrice: '', boughtAt: '',
};

export default function InvestmentContent() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Investment | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [invRes, portRes, catRes] = await Promise.all([
        InvestmentApi.getAll(),
        PortfolioApi.getAll(),
        CategoryApi.getAll(),
      ]);
      setInvestments(invRes.data ?? []);
      setPortfolios(portRes);
      setCategories(catRes);
    } catch (e: any) {
      setError(e?.message ?? 'โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, portfolioId: portfolios[0]?.id ?? '' });
    setShowModal(true);
  };

  const openEdit = (inv: Investment) => {
    setEditing(inv);
    setForm({
      portfolioId: inv.portfolioId,
      categoryId: inv.categoryId ?? '',
      name: inv.name,
      ticker: inv.ticker ?? '',
      type: inv.type,
      quantity: String(inv.quantity),
      buyPrice: String(inv.buyPrice),
      currentPrice: String(inv.currentPrice),
      boughtAt: inv.boughtAt ? inv.boughtAt.slice(0, 10) : '',
    });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); setForm({ ...emptyForm }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.portfolioId || !form.name || !form.type || !form.quantity || !form.buyPrice || !form.currentPrice) return;
    try {
      setSubmitting(true);
      const payload: CreateInvestmentDto = {
        portfolioId: form.portfolioId,
        categoryId: form.categoryId || undefined,
        name: form.name,
        ticker: form.ticker || undefined,
        type: form.type as CreateInvestmentDto['type'],
        quantity: Number(form.quantity),
        buyPrice: Number(form.buyPrice),
        currentPrice: Number(form.currentPrice),
        boughtAt: form.boughtAt || undefined,
      };
      if (editing) {
        const { portfolioId, ...rest } = payload;
        await InvestmentApi.update(editing.id, rest as UpdateInvestmentDto);
      } else {
        await InvestmentApi.create(payload);
      }
      await load();
      closeModal();
    } catch (e: any) {
      setError(e?.message ?? 'บันทึกไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await InvestmentApi.delete(id);
      setDeleteConfirm(null);
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'ลบไม่สำเร็จ');
    }
  };

  const filtered = investments.filter(inv => {
    const matchSearch = !search || inv.name.toLowerCase().includes(search.toLowerCase()) || (inv.ticker ?? '').toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || inv.type === filterType;
    return matchSearch && matchType;
  });

  const fmtNum = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="size-8 animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">การลงทุน</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{investments.length} รายการ</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
        >
          <Plus className="size-4" /> เพิ่มการลงทุน
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="size-4 shrink-0" /> {error}
          <button onClick={() => setError(null)} className="ml-auto"><X className="size-4" /></button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อ / ticker..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">ทุกประเภท</option>
          {INVESTMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          <TrendingUp className="size-10 mx-auto mb-3 opacity-30" />
          ยังไม่มีการลงทุน
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['ชื่อ', 'Portfolio', 'ประเภท', 'จำนวน', 'ราคาซื้อ', 'ราคาปัจจุบัน', 'มูลค่า', 'กำไร/ขาดทุน', 'สถานะ', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(inv => {
                  const gain = inv.gainLoss ?? 0;
                  const gainPct = inv.gainLossPercent ?? 0;
                  return (
                    <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground">{inv.name}</p>
                        {inv.ticker && <p className="text-xs text-muted-foreground">{inv.ticker}</p>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{inv.portfolio?.name ?? '-'}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {TYPE_LABEL[inv.type] ?? inv.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground">{inv.quantity.toLocaleString()}</td>
                      <td className="px-4 py-3 text-foreground">฿{fmtNum(inv.buyPrice)}</td>
                      <td className="px-4 py-3 text-foreground">฿{fmtNum(inv.currentPrice)}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">฿{fmtNum(inv.currentValue ?? inv.quantity * inv.currentPrice)}</td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-1 font-semibold text-xs ${gain >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {gain >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                          {gain >= 0 ? '+' : ''}{fmtNum(gain)}
                          <span className="opacity-70">({gainPct >= 0 ? '+' : ''}{gainPct.toFixed(2)}%)</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${inv.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-zinc-500/10 text-zinc-500'}`}>
                          {inv.status === 'ACTIVE' ? 'Active' : 'Sold'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(inv)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            <Pencil className="size-3.5" />
                          </button>
                          <button onClick={() => setDeleteConfirm(inv.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-foreground">{editing ? 'แก้ไขการลงทุน' : 'เพิ่มการลงทุน'}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="size-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Portfolio *</label>
                  <select value={form.portfolioId} onChange={e => setForm(f => ({ ...f, portfolioId: e.target.value }))} required
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">เลือก Portfolio</option>
                    {portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">ชื่อการลงทุน *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="เช่น Apple Inc."
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Ticker (ไม่บังคับ)</label>
                  <input value={form.ticker} onChange={e => setForm(f => ({ ...f, ticker: e.target.value }))} placeholder="เช่น AAPL"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">ประเภท *</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    {INVESTMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">หมวดหมู่</label>
                  <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">ไม่ระบุ</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">จำนวน *</label>
                  <input type="number" min="0" step="any" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} required placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">ราคาซื้อ (บาท) *</label>
                  <input type="number" min="0" step="any" value={form.buyPrice} onChange={e => setForm(f => ({ ...f, buyPrice: e.target.value }))} required placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">ราคาปัจจุบัน (บาท) *</label>
                  <input type="number" min="0" step="any" value={form.currentPrice} onChange={e => setForm(f => ({ ...f, currentPrice: e.target.value }))} required placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">วันที่ซื้อ</label>
                  <input type="date" value={form.boughtAt} onChange={e => setForm(f => ({ ...f, boughtAt: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">ยกเลิก</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting && <Loader2 className="size-4 animate-spin" />}
                  {editing ? 'บันทึก' : 'เพิ่ม'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-sm p-6 text-center">
            <Trash2 className="size-10 text-destructive mx-auto mb-3" />
            <h3 className="font-bold text-foreground mb-1">ยืนยันการลบ</h3>
            <p className="text-sm text-muted-foreground mb-5">ข้อมูลการลงทุนนี้จะถูกลบถาวร</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">ยกเลิก</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2 rounded-xl bg-destructive text-white text-sm font-medium hover:bg-destructive/90 transition-colors">ลบ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
