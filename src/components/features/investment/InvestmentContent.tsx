'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Search, TrendingUp, TrendingDown, Eye,
  Loader2, X, Pencil, Trash2, AlertCircle, Calendar, ShieldAlert, FileText, Tag, Briefcase, DollarSign
} from 'lucide-react';
import {
  InvestmentApi, Investment, CreateInvestmentDto, UpdateInvestmentDto,
} from '@/lib/api/investment.api';
import { PortfolioApi, Portfolio } from '@/lib/api/portfolio.api';
import { CategoryApi, Category } from '@/lib/api/category.api';

const ASSET_TYPES = [
  { value: 'STOCK', label: 'หุ้น' },
  { value: 'ETF', label: 'ETF' },
  { value: 'FUND', label: 'กองทุน' },
  { value: 'CRYPTO', label: 'คริปโต' },
  { value: 'GOLD', label: 'ทองคำ' },
  { value: 'BOND', label: 'พันธบัตร' },
];

const RISK_LEVELS = [
  { value: 'LOW', label: 'ต่ำ', color: 'text-emerald-500 bg-emerald-500/10' },
  { value: 'MEDIUM', label: 'ปานกลาง', color: 'text-amber-500 bg-amber-500/10' },
  { value: 'HIGH', label: 'สูง', color: 'text-red-500 bg-red-500/10' },
];

const TYPE_LABEL: Record<string, string> = {
  STOCK: 'หุ้น', ETF: 'ETF', FUND: 'กองทุน',
  CRYPTO: 'คริปโต', GOLD: 'ทองคำ', BOND: 'พันธบัตร',
};

const emptyForm = {
  portfolioId: '', categoryId: '', assetName: '', symbol: '',
  assetType: 'STOCK' as CreateInvestmentDto['assetType'],
  purchasePrice: '', currentPrice: '', quantity: '', averageCost: '',
  riskLevel: 'MEDIUM' as CreateInvestmentDto['riskLevel'],
  investmentDate: '', note: '',
};

const fmtNum = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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

  // Detail Modal States (Fetches GET /investments/:id)
  const [selectedInvId, setSelectedInvId] = useState<string | null>(null);
  const [invDetail, setInvDetail] = useState<Investment | null>(null);
  const [loadingInvDetail, setLoadingInvDetail] = useState(false);
  const [invDetailError, setInvDetailError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [invRes, portRes, catRes] = await Promise.all([
        InvestmentApi.findAll({ limit: '1000' }),
        PortfolioApi.findAll(),
        CategoryApi.findAll(),
      ]);
      setInvestments(invRes || []);
      setPortfolios(portRes || []);
      setCategories(catRes || []);
    } catch (e: any) {
      setError(e?.message ?? 'โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Open Investment Detail Modal & Fetch GET /investments/:id
  const openDetailModal = async (id: string) => {
    setSelectedInvId(id);
    setInvDetail(null);
    setInvDetailError(null);
    setLoadingInvDetail(true);

    try {
      const data = await InvestmentApi.findOne(id);
      setInvDetail(data);
    } catch (err: any) {
      setInvDetailError(err?.message ?? 'ไม่พบรายการลงทุนหรือเกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoadingInvDetail(false);
    }
  };

  // Close Investment Detail Modal & Reset state
  const closeDetailModal = () => {
    setSelectedInvId(null);
    setInvDetail(null);
    setInvDetailError(null);
    setLoadingInvDetail(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      portfolioId: portfolios[0]?.id ?? '',
      categoryId: categories[0]?.id ?? '',
      investmentDate: new Date().toISOString().slice(0, 10),
    });
    setShowModal(true);
  };

  const openEdit = (inv: Investment) => {
    setEditing(inv);
    setForm({
      portfolioId: inv.portfolioId,
      categoryId: inv.categoryId,
      assetName: inv.assetName,
      symbol: inv.symbol,
      assetType: inv.assetType,
      purchasePrice: String(inv.purchasePrice),
      currentPrice: String(inv.currentPrice),
      quantity: String(inv.quantity),
      averageCost: String(inv.averageCost ?? inv.purchasePrice),
      riskLevel: inv.riskLevel,
      investmentDate: inv.investmentDate ? inv.investmentDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
      note: inv.note ?? '',
    });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); setForm({ ...emptyForm }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.portfolioId || !form.categoryId || !form.assetName || !form.symbol || !form.quantity || !form.purchasePrice || !form.currentPrice) return;
    try {
      setSubmitting(true);
      const payload: CreateInvestmentDto = {
        portfolioId: form.portfolioId,
        categoryId: form.categoryId,
        assetName: form.assetName.trim(),
        symbol: form.symbol.trim().toUpperCase(),
        assetType: form.assetType,
        purchasePrice: Number(form.purchasePrice),
        currentPrice: Number(form.currentPrice),
        quantity: Number(form.quantity),
        averageCost: form.averageCost ? Number(form.averageCost) : Number(form.purchasePrice),
        riskLevel: form.riskLevel,
        investmentDate: form.investmentDate ? new Date(form.investmentDate).toISOString() : new Date().toISOString(),
        note: form.note.trim() || undefined,
      };

      if (editing) {
        await InvestmentApi.update(editing.id, payload as UpdateInvestmentDto);
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
    const matchSearch = !search || inv.assetName.toLowerCase().includes(search.toLowerCase()) || inv.symbol.toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || inv.assetType === filterType;
    return matchSearch && matchType;
  });

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
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
        >
          <Plus className="size-4" /> เพิ่มการลงทุน
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="size-4 shrink-0" /> {error}
          <button onClick={() => setError(null)} className="ml-auto cursor-pointer"><X className="size-4" /></button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อ / Symbol..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">ทุกประเภท</option>
          {ASSET_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
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
                  {['สินทรัพย์', 'Portfolio', 'ประเภท', 'จำนวน', 'ราคาซื้อ', 'ราคาปัจจุบัน', 'มูลค่ารวม', 'กำไร/ขาดทุน', 'สถานะ', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(inv => {
                  const currentValue = Number(inv.quantity) * Number(inv.currentPrice);
                  const costValue = Number(inv.quantity) * Number(inv.purchasePrice);
                  const gain = currentValue - costValue;
                  const gainPct = costValue > 0 ? (gain / costValue) * 100 : 0;
                  return (
                    <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground">{inv.assetName}</p>
                        <p className="text-xs text-muted-foreground">{inv.symbol}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{inv.portfolio?.name ?? '-'}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {TYPE_LABEL[inv.assetType] ?? inv.assetType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground">{Number(inv.quantity).toLocaleString()}</td>
                      <td className="px-4 py-3 text-foreground">฿{fmtNum(Number(inv.purchasePrice))}</td>
                      <td className="px-4 py-3 text-foreground">฿{fmtNum(Number(inv.currentPrice))}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">฿{fmtNum(currentValue)}</td>
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
                          <button
                            onClick={() => openDetailModal(inv.id)}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="size-3.5 text-primary" />
                          </button>
                          <button
                            onClick={() => openEdit(inv)}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title="แก้ไข"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(inv.id)}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                            title="ลบ"
                          >
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

      {/* Investment Detail Modal (Calls GET /investments/:id) */}
      {selectedInvId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border bg-muted/20">
              <h3 className="font-bold text-foreground text-base">รายละเอียดการลงทุน (Investment Detail)</h3>
              <button onClick={closeDetailModal} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground cursor-pointer">
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5">
              {loadingInvDetail ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="size-8 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground font-medium">กำลังดึงข้อมูลรายละเอียดสินทรัพย์...</p>
                </div>
              ) : invDetailError ? (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive my-2">
                  <AlertCircle className="size-5 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold">ไม่พบข้อมูลการลงทุน</p>
                    <p className="text-xs opacity-90 mt-0.5">{invDetailError}</p>
                  </div>
                </div>
              ) : invDetail ? (
                <div className="flex flex-col gap-5">
                  {/* Header Asset Card */}
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-foreground">{invDetail.assetName}</h4>
                        <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase">
                          {invDetail.symbol}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        <span>ประเภท: {TYPE_LABEL[invDetail.assetType] ?? invDetail.assetType}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${invDetail.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-zinc-500/10 text-zinc-500'}`}>
                        {invDetail.status === 'ACTIVE' ? 'เปิดใช้งาน (Active)' : 'ขายแล้ว (Sold)'}
                      </span>
                    </div>
                  </div>

                  {/* Profit / Loss Financial Summary */}
                  {(() => {
                    const currVal = Number(invDetail.quantity) * Number(invDetail.currentPrice);
                    const costVal = Number(invDetail.quantity) * Number(invDetail.purchasePrice);
                    const pnl = currVal - costVal;
                    const pnlPct = costVal > 0 ? (pnl / costVal) * 100 : 0;
                    const isPositive = pnl >= 0;
                    return (
                      <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-card border border-border">
                        <div>
                          <p className="text-[11px] text-muted-foreground">มูลค่ารวมปัจจุบัน</p>
                          <p className="text-base font-bold text-foreground">฿{fmtNum(currVal)}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">ต้นทุนรวม: ฿{fmtNum(costVal)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-muted-foreground">กำไร / ขาดทุนสุทธิ</p>
                          <p className={`text-base font-bold flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                            {isPositive ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                            {isPositive ? '+' : ''}฿{fmtNum(pnl)}
                          </p>
                          <p className={`text-[10px] font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                            ({isPositive ? '+' : ''}{pnlPct.toFixed(2)}%)
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Detailed Information Grid */}
                  <div className="space-y-2 border-t border-border pt-3 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Briefcase className="size-3.5 text-primary" /> พอร์ตการลงทุน (Portfolio)
                      </span>
                      <span className="font-semibold text-foreground">{invDetail.portfolio?.name ?? '-'}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Tag className="size-3.5 text-primary" /> หมวดหมู่ (Category)
                      </span>
                      <span className="font-semibold text-foreground">{invDetail.category?.name ?? '-'}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <DollarSign className="size-3.5 text-primary" /> จำนวนหน่วย (Quantity)
                      </span>
                      <span className="font-semibold text-foreground">{Number(invDetail.quantity).toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <DollarSign className="size-3.5 text-primary" /> ราคาซื้อเริ่มต้น (Purchase Price)
                      </span>
                      <span className="font-semibold text-foreground">฿{fmtNum(Number(invDetail.purchasePrice))}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <DollarSign className="size-3.5 text-primary" /> ราคาปัจจุบัน (Current Price)
                      </span>
                      <span className="font-semibold text-foreground">฿{fmtNum(Number(invDetail.currentPrice))}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <ShieldAlert className="size-3.5 text-primary" /> ระดับความเสี่ยง (Risk Level)
                      </span>
                      {(() => {
                        const r = RISK_LEVELS.find(lvl => lvl.value === invDetail.riskLevel);
                        return (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r?.color ?? 'text-foreground'}`}>
                            {r?.label ?? invDetail.riskLevel}
                          </span>
                        );
                      })()}
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-primary" /> วันที่เข้าลงทุน (Investment Date)
                      </span>
                      <span className="font-medium text-foreground">
                        {invDetail.investmentDate ? new Date(invDetail.investmentDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-primary" /> วันที่สร้างรายการ (Created At)
                      </span>
                      <span className="font-medium text-foreground">
                        {invDetail.createdAt ? new Date(invDetail.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-primary" /> วันที่แก้ไขล่าสุด (Updated At)
                      </span>
                      <span className="font-medium text-foreground">
                        {invDetail.updatedAt ? new Date(invDetail.updatedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                      </span>
                    </div>

                    <div className="py-2">
                      <span className="text-muted-foreground flex items-center gap-1.5 mb-1">
                        <FileText className="size-3.5 text-primary" /> หมายเหตุ (Note)
                      </span>
                      <p className="p-2.5 rounded-xl bg-muted/40 text-foreground text-xs">
                        {invDetail.note || 'ไม่มีหมายเหตุเพิ่มเติม'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2">
                    <button
                      onClick={closeDetailModal}
                      className="w-full py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      ปิดหน้าต่าง
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-foreground">{editing ? 'แก้ไขการลงทุน' : 'เพิ่มการลงทุน'}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground cursor-pointer"><X className="size-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Portfolio *</label>
                  <select value={form.portfolioId} onChange={e => setForm(f => ({ ...f, portfolioId: e.target.value }))} required
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">เลือก Portfolio</option>
                    {portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">หมวดหมู่ *</label>
                  <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} required
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">ชื่อสินทรัพย์ *</label>
                  <input value={form.assetName} onChange={e => setForm(f => ({ ...f, assetName: e.target.value }))} required placeholder="เช่น Apple Inc."
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Symbol *</label>
                  <input value={form.symbol} onChange={e => setForm(f => ({ ...f, symbol: e.target.value }))} required placeholder="เช่น AAPL"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">ประเภท *</label>
                  <select value={form.assetType} onChange={e => setForm(f => ({ ...f, assetType: e.target.value as any }))} required
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    {ASSET_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">ระดับความเสี่ยง *</label>
                  <select value={form.riskLevel} onChange={e => setForm(f => ({ ...f, riskLevel: e.target.value as any }))} required
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    {RISK_LEVELS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">จำนวน *</label>
                  <input type="number" min="0" step="any" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} required placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">ราคาซื้อ (บาท) *</label>
                  <input type="number" min="0" step="any" value={form.purchasePrice} onChange={e => setForm(f => ({ ...f, purchasePrice: e.target.value }))} required placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">ราคาปัจจุบัน (บาท) *</label>
                  <input type="number" min="0" step="any" value={form.currentPrice} onChange={e => setForm(f => ({ ...f, currentPrice: e.target.value }))} required placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">วันที่ลงทุน *</label>
                  <input type="date" value={form.investmentDate} onChange={e => setForm(f => ({ ...f, investmentDate: e.target.value }))} required
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">หมายเหตุ</label>
                  <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="หมายเหตุ (ไม่บังคับ)"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors cursor-pointer">ยกเลิก</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer">
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
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors cursor-pointer">ยกเลิก</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2 rounded-xl bg-destructive text-white text-sm font-medium hover:bg-destructive/90 transition-colors cursor-pointer">ลบ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
