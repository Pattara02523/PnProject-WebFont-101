'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Plus, Grid, List, ChevronDown, Loader2,
  X, AlertCircle, Trash2, Pencil, Briefcase
} from 'lucide-react';
import PortfolioCard, { PortfolioItem } from './PortfolioCard';
import { PortfolioApi, Portfolio, CreatePortfolioDto, UpdatePortfolioDto } from '@/lib/api/portfolio.api';
import { InvestmentApi } from '@/lib/api/investment.api';

const COLOR_OPTIONS = [
  { value: 'green', label: 'เขียว', class: 'bg-emerald-500' },
  { value: 'blue', label: 'น้ำเงิน', class: 'bg-blue-500' },
  { value: 'orange', label: 'ส้ม', class: 'bg-amber-500' },
];

const emptyForm = {
  name: '',
  description: '',
  color: 'green',
};

export default function PortfolioContent() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [investmentsMap, setInvestmentsMap] = useState<Record<string, { value: number; cost: number }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'date'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Portfolio | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ports, invsRes] = await Promise.all([
        PortfolioApi.findAll(),
        InvestmentApi.getAll({ limit: '1000' }).catch(() => ({ data: [] })),
      ]);
      
      setPortfolios(ports || []);

      // Calculate portfolio values from investments
      const invMap: Record<string, { value: number; cost: number }> = {};
      (invsRes.data || []).forEach((inv: any) => {
        const pId = inv.portfolioId;
        if (!invMap[pId]) invMap[pId] = { value: 0, cost: 0 };
        const val = Number(inv.currentValue ?? (inv.quantity * inv.currentPrice));
        const cost = Number(inv.totalCost ?? (inv.quantity * inv.buyPrice));
        invMap[pId].value += val;
        invMap[pId].cost += cost;
      });
      setInvestmentsMap(invMap);
    } catch (e: any) {
      setError(e?.message ?? 'เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEditModal = (p: Portfolio) => {
    setEditingItem(p);
    setForm({
      name: p.name,
      description: p.description || '',
      color: p.color || 'green',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setForm({ ...emptyForm });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      setSubmitting(true);
      const payload: CreatePortfolioDto = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        color: form.color,
      };

      if (editingItem) {
        await PortfolioApi.update(editingItem.id, payload as UpdatePortfolioDto);
      } else {
        await PortfolioApi.create(payload);
      }
      await loadData();
      closeModal();
    } catch (e: any) {
      setError(e?.message ?? 'บันทึกไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await PortfolioApi.delete(id);
      setDeleteConfirm(null);
      await loadData();
    } catch (e: any) {
      setError(e?.message ?? 'ลบพอร์ตโฟลิโอไม่สำเร็จ');
    }
  };

  // Convert API portfolios to Card items
  const cardItems: PortfolioItem[] = portfolios.map((p) => {
    const invData = investmentsMap[p.id] || { value: 0, cost: 0 };
    const pnl = invData.value - invData.cost;
    const pnlPct = invData.cost > 0 ? (pnl / invData.cost) * 100 : 0;
    const isPositive = pnl >= 0;

    return {
      id: p.id,
      name: p.name,
      description: p.description || 'ไม่มีคำอธิบาย',
      value: invData.value,
      change: `${isPositive ? '' : '-'}${Math.abs(pnl).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      changePercent: `${isPositive ? '+' : ''}${pnlPct.toFixed(2)}%`,
      isPositive,
      assetsCount: p._count?.investments || 0,
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : '',
      color: p.color || 'green',
    };
  });

  // Filter and Sort
  const filteredPortfolios = cardItems
    .filter((p) => {
      const term = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term);
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'th');
      if (sortBy === 'value') return b.value - a.value;
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border/60 transition-colors duration-300">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ค้นหา Portfolio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-xl text-sm border border-border bg-muted/30 hover:bg-muted/65 text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary/60 focus:ring-1 focus:ring-primary/60"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'value' | 'date')}
              className="h-9 pl-3 pr-8 rounded-xl text-sm border border-border bg-card text-foreground font-semibold outline-none transition-all hover:bg-muted/50 cursor-pointer appearance-none"
            >
              <option value="name">ชื่อ</option>
              <option value="value">มูลค่าพอร์ต</option>
              <option value="date">วันที่สร้าง</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* View Mode & Add Button */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="flex items-center border border-border rounded-xl p-0.5 bg-muted/20">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
              title="ตาราง"
            >
              <Grid className="size-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
              title="รายการ"
            >
              <List className="size-4" />
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="h-9 px-4 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:bg-primary/95 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="size-4" />
            สร้าง Portfolio
          </button>
        </div>
      </section>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="size-4 shrink-0" /> {error}
          <button onClick={() => setError(null)} className="ml-auto"><X className="size-4" /></button>
        </div>
      )}

      {/* Main Portfolios List/Grid */}
      {filteredPortfolios.length > 0 ? (
        viewMode === 'grid' ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                onViewDetails={(id) => router.push(`/portfolio/${id}`)}
                onEdit={(id) => {
                  const target = portfolios.find(p => p.id === id);
                  if (target) openEditModal(target);
                }}
                onDelete={(id) => setDeleteConfirm(id)}
              />
            ))}
          </section>
        ) : (
          <section className="bg-card rounded-2xl border border-border/60 overflow-hidden transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs font-bold text-muted-foreground uppercase bg-muted/10 select-none">
                    <th className="p-4 pl-6">พอร์ตโฟลิโอ</th>
                    <th className="p-4">มูลค่า</th>
                    <th className="p-4">กำไร/ขาดทุน</th>
                    <th className="p-4">เปอร์เซ็นต์</th>
                    <th className="p-4">จำนวนสินทรัพย์</th>
                    <th className="p-4">วันที่สร้าง</th>
                    <th className="p-4 pr-6 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm">
                  {filteredPortfolios.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <span className={`w-1 h-8 rounded-full ${
                            p.color === 'orange' ? 'bg-amber-500' : p.color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'
                          }`} />
                          <div>
                            <h4 className="font-bold text-foreground">{p.name}</h4>
                            <p className="text-xs text-muted-foreground">{p.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-foreground">
                        ฿{p.value.toLocaleString()}
                      </td>
                      <td className={`p-4 font-bold ${p.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {p.isPositive ? '+' : ''}฿{p.change}
                      </td>
                      <td className={`p-4 font-bold ${p.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {p.changePercent}
                      </td>
                      <td className="p-4 font-medium text-muted-foreground">
                        {p.assetsCount} สินทรัพย์
                      </td>
                      <td className="p-4 text-muted-foreground/80 font-medium">
                        {p.createdAt}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => router.push(`/portfolio/${p.id}`)}
                            className="h-8 px-3 rounded-lg text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer"
                          >
                            ดู
                          </button>
                          <button
                            onClick={() => {
                              const target = portfolios.find(item => item.id === p.id);
                              if (target) openEditModal(target);
                            }}
                            className="h-8 px-2.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(p.id)}
                            className="h-8 px-2.5 rounded-lg border border-border bg-card hover:bg-destructive/10 text-muted-foreground hover:text-rose-500 hover:border-rose-500/30 transition-all cursor-pointer"
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )
      ) : (
        <section className="text-center py-16 bg-card rounded-2xl border border-border/60">
          <Briefcase className="size-10 mx-auto mb-3 opacity-30 text-muted-foreground" />
          <p className="text-base text-muted-foreground select-none">
            ยังไม่มีพอร์ตโฟลิโอ กด "+ สร้าง Portfolio" เพื่อเริ่มต้น
          </p>
        </section>
      )}

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-foreground">{editingItem ? 'แก้ไข Portfolio' : 'สร้าง Portfolio ใหม่'}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="size-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">ชื่อ Portfolio *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="เช่น หุ้นไทย, พอร์ตคริปโต"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">คำอธิบาย</label>
                <input
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="คำอธิบายเพิ่มเติม (ไม่บังคับ)"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">สีธีม</label>
                <div className="flex gap-3">
                  {COLOR_OPTIONS.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, color: c.value }))}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                        form.color === c.value ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground'
                      }`}
                    >
                      <span className={`size-3 rounded-full ${c.class}`} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                  ยกเลิก
                </button>
                <button type="submit" disabled={submitting} className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting && <Loader2 className="size-4 animate-spin" />}
                  {editingItem ? 'บันทึก' : 'สร้าง'}
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
            <p className="text-sm text-muted-foreground mb-5">Portfolio นี้และข้อมูลสินทรัพย์ที่เกี่ยวข้องจะถูกลบถาวร</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                ยกเลิก
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2 rounded-xl bg-destructive text-white text-sm font-medium hover:bg-destructive/90 transition-colors">
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
