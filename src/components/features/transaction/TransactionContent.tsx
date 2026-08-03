/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 54 / Flow ขั้นตอนที่ 54]
 * ชื่อไฟล์: TransactionContent.tsx
 * หน้าที่หลัก: Component แสดงประวัติรายการธุรกรรมทางการเงินทั้งหมด (ซื้อ, ขาย, ปันผล, ฝาก, ถอน) พร้อม Modal เพิ่มธุรกรรมใหม่
 * รับอะไรมาจากไหน (Input): ข้อมูลจาก `transactionApi.getAll()`
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render ตารางรายการธุรกรรมและฟอร์มบันทึก
 * ==========================================
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Search, ArrowUpRight, ArrowDownRight, Eye,
  DollarSign, PiggyBank, CreditCard, Calendar, FileText, Tag, Briefcase, Hash,
  Loader2, X, Pencil, Trash2, AlertCircle, Percent, Receipt
} from 'lucide-react';
import { TransactionApi, Transaction, CreateTransactionDto, UpdateTransactionDto } from '@/lib/api/transaction.api';
import { InvestmentApi, Investment } from '@/lib/api/investment.api';

const TX_TYPES = [
  { value: 'BUY', label: 'ซื้อ', icon: ArrowDownRight, color: 'text-blue-600', bg: 'bg-blue-500/10' },
  { value: 'SELL', label: 'ขาย', icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { value: 'DIVIDEND', label: 'เงินปันผล', icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-500/10' },
  { value: 'DEPOSIT', label: 'ฝากเงิน', icon: PiggyBank, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { value: 'WITHDRAW', label: 'ถอนเงิน', icon: CreditCard, color: 'text-red-600', bg: 'bg-red-500/10' },
] as const;

const emptyForm = {
  investmentId: '',
  type: 'BUY' as CreateTransactionDto['type'],
  amount: '',
  quantity: '',
  price: '',
  fee: '',
  tax: '',
  transactionDate: '',
  note: '',
};

const fmtCurrency = (v: any) => {
  const n = typeof v === 'number' ? v : Number(v || 0);
  return n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function TransactionContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  // Detail Modal States (Fetches GET /transactions/:id)
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [txDetail, setTxDetail] = useState<Transaction | null>(null);
  const [loadingTxDetail, setLoadingTxDetail] = useState(false);
  const [txDetailError, setTxDetailError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [txRes, invRes] = await Promise.all([
        TransactionApi.findAll({ limit: '1000' }),
        InvestmentApi.findAll({ limit: '1000' }),
      ]);
      setTransactions(txRes || []);
      setInvestments(invRes || []);
    } catch (e: any) {
      setError(e?.message ?? 'โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Open Transaction Detail Modal & Fetch GET /transactions/:id
  const openDetailModal = async (id: string) => {
    setSelectedTxId(id);
    setTxDetail(null);
    setTxDetailError(null);
    setLoadingTxDetail(true);

    try {
      const data = await TransactionApi.findOne(id);
      setTxDetail(data);
    } catch (err: any) {
      setTxDetailError(err?.message ?? 'ไม่พบรายการธุรกรรมหรือเกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoadingTxDetail(false);
    }
  };

  // Close Transaction Detail Modal & Reset state
  const closeDetailModal = () => {
    setSelectedTxId(null);
    setTxDetail(null);
    setTxDetailError(null);
    setLoadingTxDetail(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      investmentId: investments[0]?.id ?? '',
      transactionDate: new Date().toISOString().slice(0, 10),
    });
    setShowModal(true);
  };

  const openEdit = (tx: Transaction) => {
    setEditing(tx);
    setForm({
      investmentId: tx.investmentId,
      type: tx.type,
      amount: String(tx.amount),
      quantity: tx.quantity != null ? String(tx.quantity) : '',
      price: tx.price != null ? String(tx.price) : '',
      fee: tx.fee != null ? String(tx.fee) : '',
      tax: tx.tax != null ? String(tx.tax) : '',
      transactionDate: tx.transactionDate ? tx.transactionDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
      note: tx.note ?? '',
    });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); setForm({ ...emptyForm }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.investmentId || !form.amount) return;
    try {
      setSubmitting(true);
      const payload: CreateTransactionDto = {
        investmentId: form.investmentId,
        type: form.type,
        amount: Number(form.amount),
        quantity: form.quantity ? Number(form.quantity) : undefined,
        price: form.price ? Number(form.price) : undefined,
        fee: form.fee ? Number(form.fee) : undefined,
        tax: form.tax ? Number(form.tax) : undefined,
        transactionDate: form.transactionDate ? new Date(form.transactionDate).toISOString() : new Date().toISOString(),
        note: form.note.trim() || undefined,
      };

      if (editing) {
        const { investmentId, ...updatePayload } = payload;
        await TransactionApi.update(editing.id, updatePayload as UpdateTransactionDto);
      } else {
        await TransactionApi.create(payload);
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
      await TransactionApi.delete(id);
      setDeleteConfirm(null);
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'ลบไม่สำเร็จ');
    }
  };

  const filtered = transactions.filter(tx => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      (tx.investment?.assetName ?? '').toLowerCase().includes(q) ||
      (tx.investment?.symbol ?? '').toLowerCase().includes(q) ||
      (tx.note ?? '').toLowerCase().includes(q);
    const matchType = !filterType || tx.type === filterType;
    return matchSearch && matchType;
  });

  // Calculate real totals safely with Number() conversion
  const totalIn = transactions
    .filter(t => ['SELL', 'DIVIDEND', 'DEPOSIT'].includes(t.type))
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  const totalOut = transactions
    .filter(t => ['BUY', 'WITHDRAW'].includes(t.type))
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="size-8 animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Transaction</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{transactions.length} รายการ</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all cursor-pointer shadow-xs">
          <Plus className="size-4" /> เพิ่มรายการ
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'เงินเข้า', value: totalIn, color: 'text-emerald-600', icon: ArrowUpRight, bg: 'bg-emerald-500/10' },
          { label: 'เงินออก', value: totalOut, color: 'text-red-500', icon: ArrowDownRight, bg: 'bg-red-500/10' },
          { label: 'รายการทั้งหมด', value: null, count: transactions.length, color: 'text-foreground', icon: DollarSign, bg: 'bg-primary/10' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
            <div className={`size-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon className={`size-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-base font-bold ${s.color}`}>
                {s.value != null ? `฿${fmtCurrency(s.value)}` : s.count}
              </p>
            </div>
          </div>
        ))}
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหา..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex gap-1 p-1 bg-muted/30 rounded-xl overflow-x-auto">
          <button onClick={() => setFilterType('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!filterType ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            ทั้งหมด
          </button>
          {TX_TYPES.map(t => (
            <button key={t.value} onClick={() => setFilterType(t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${filterType === t.value ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          <DollarSign className="size-10 mx-auto mb-3 opacity-30" />
          ยังไม่มีรายการ Transaction
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['ประเภท', 'สินทรัพย์', 'Portfolio', 'ราคา/หน่วย', 'จำนวน', 'ยอดรวม', 'วันที่', 'หมายเหตุ', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(tx => {
                  const typeInfo = TX_TYPES.find(t => t.value === tx.type);
                  const isIn = ['SELL', 'DIVIDEND', 'DEPOSIT'].includes(tx.type);
                  const inv = tx.investment ?? investments.find(i => i.id === tx.investmentId);
                  const assetTitle = inv?.assetName ? `${inv.assetName}` : '-';
                  const assetSymbol = inv?.symbol ?? '';
                  const portName = inv?.portfolio?.name ?? '-';

                  return (
                    <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {typeInfo && (
                            <div className={`size-7 rounded-lg ${typeInfo.bg} flex items-center justify-center`}>
                              <typeInfo.icon className={`size-3.5 ${typeInfo.color}`} />
                            </div>
                          )}
                          <span className="text-xs font-medium text-foreground">{typeInfo?.label ?? tx.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {inv ? (
                          <div>
                            <p className="text-xs font-semibold text-foreground">{assetTitle}</p>
                            {assetSymbol && <p className="text-[10px] text-muted-foreground">{assetSymbol}</p>}
                          </div>
                        ) : <span className="text-muted-foreground text-xs">-</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{portName}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{tx.price != null ? `฿${fmtCurrency(tx.price)}` : '-'}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{tx.quantity != null ? Number(tx.quantity).toLocaleString('th-TH') : '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-semibold ${isIn ? 'text-emerald-600' : 'text-red-500'}`}>
                          {isIn ? '+' : '-'}฿{fmtCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {tx.transactionDate ? new Date(tx.transactionDate).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' }) : '-'}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[120px] truncate">{tx.note || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openDetailModal(tx.id)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="ดูรายละเอียด">
                            <Eye className="size-3.5 text-primary" />
                          </button>
                          <button onClick={() => openEdit(tx)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="แก้ไข">
                            <Pencil className="size-3.5" />
                          </button>
                          <button onClick={() => setDeleteConfirm(tx.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer" title="ลบ">
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

      {/* Transaction Detail Modal (Calls GET /transactions/:id) */}
      {selectedTxId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border bg-muted/20">
              <h3 className="font-bold text-foreground text-base">รายละเอียดธุรกรรม (Transaction Detail)</h3>
              <button onClick={closeDetailModal} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground cursor-pointer">
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5">
              {loadingTxDetail ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="size-8 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground font-medium">กำลังดึงข้อมูลรายละเอียดธุรกรรม...</p>
                </div>
              ) : txDetailError ? (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive my-2">
                  <AlertCircle className="size-5 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold">ไม่พบข้อมูลธุรกรรม</p>
                    <p className="text-xs opacity-90 mt-0.5">{txDetailError}</p>
                  </div>
                </div>
              ) : txDetail ? (
                <div className="flex flex-col gap-5">
                  {/* Header Card */}
                  {(() => {
                    const typeInfo = TX_TYPES.find(t => t.value === txDetail.type);
                    const isIn = ['SELL', 'DIVIDEND', 'DEPOSIT'].includes(txDetail.type);
                    const inv = txDetail.investment ?? investments.find(i => i.id === txDetail.investmentId);
                    return (
                      <div className="p-4 rounded-2xl bg-muted/30 border border-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {typeInfo && (
                            <div className={`size-12 rounded-xl ${typeInfo.bg} flex items-center justify-center shrink-0`}>
                              <typeInfo.icon className={`size-6 ${typeInfo.color}`} />
                            </div>
                          )}
                          <div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                              {typeInfo?.label ?? txDetail.type}
                            </span>
                            <h4 className="text-lg font-bold text-foreground">{inv?.assetName || 'ไม่ระบุสินทรัพย์'}</h4>
                            {inv?.symbol && <p className="text-xs text-muted-foreground">{inv.symbol}</p>}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">ยอดรวมธุรกรรม</p>
                          <p className={`text-xl font-extrabold ${isIn ? 'text-emerald-600' : 'text-red-500'}`}>
                            {isIn ? '+' : '-'}฿{fmtCurrency(txDetail.amount)}
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Transaction Info Grid */}
                  <div className="space-y-2 border-t border-border pt-3 text-xs">

                    <div className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Briefcase className="size-3.5 text-primary" /> Portfolio
                      </span>
                      <span className="font-semibold text-foreground">
                        {txDetail.investment?.portfolio?.name ?? investments.find(i => i.id === txDetail.investmentId)?.portfolio?.name ?? '-'}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Tag className="size-3.5 text-primary" /> ประเภทรายการ
                      </span>
                      <span className="font-semibold text-foreground">
                        {TX_TYPES.find(t => t.value === txDetail.type)?.label ?? txDetail.type}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <DollarSign className="size-3.5 text-primary" /> จำนวนหน่วย (Quantity)
                      </span>
                      <span className="font-semibold text-foreground">
                        {txDetail.quantity != null ? Number(txDetail.quantity).toLocaleString() : '-'}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <DollarSign className="size-3.5 text-primary" /> ราคาต่อหน่วย (Price)
                      </span>
                      <span className="font-semibold text-foreground">
                        {txDetail.price != null ? `฿${fmtCurrency(txDetail.price)}` : '-'}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Receipt className="size-3.5 text-primary" /> ค่าธรรมเนียม (Fee)
                      </span>
                      <span className="font-semibold text-foreground">
                        {txDetail.fee != null && Number(txDetail.fee) > 0 ? `฿${fmtCurrency(txDetail.fee)}` : '฿0.00'}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Percent className="size-3.5 text-primary" /> ภาษี (Tax)
                      </span>
                      <span className="font-semibold text-foreground">
                        {txDetail.tax != null && Number(txDetail.tax) > 0 ? `฿${fmtCurrency(txDetail.tax)}` : '฿0.00'}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-primary" /> วันที่ทำรายการ (Transaction Date)
                      </span>
                      <span className="font-medium text-foreground">
                        {txDetail.transactionDate ? new Date(txDetail.transactionDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-primary" /> วันที่บันทึกระบบ (Created At)
                      </span>
                      <span className="font-medium text-foreground">
                        {txDetail.createdAt ? new Date(txDetail.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                      </span>
                    </div>

                    <div className="py-2">
                      <span className="text-muted-foreground flex items-center gap-1.5 mb-1">
                        <FileText className="size-3.5 text-primary" /> หมายเหตุ (Note)
                      </span>
                      <p className="p-2.5 rounded-xl bg-muted/40 text-foreground text-xs">
                        {txDetail.note || 'ไม่มีหมายเหตุเพิ่มเติม'}
                      </p>
                    </div>
                  </div>

                  {/* Footer Action */}
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
              <h3 className="font-bold text-foreground">{editing ? 'แก้ไขรายการ' : 'เพิ่มรายการ'}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="size-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">ประเภท *</label>
                <div className="grid grid-cols-3 gap-2">
                  {TX_TYPES.map(t => (
                    <button key={t.value} type="button" onClick={() => setForm(f => ({ ...f, type: t.value as CreateTransactionDto['type'] }))}
                      className={`py-2 rounded-xl text-xs font-medium border transition-all ${form.type === t.value ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-border/80'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">สินทรัพย์การลงทุน *</label>
                  <select value={form.investmentId} onChange={e => setForm(f => ({ ...f, investmentId: e.target.value }))} required
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">เลือกสินทรัพย์</option>
                    {investments.map(inv => (
                      <option key={inv.id} value={inv.id}>{inv.assetName} ({inv.symbol})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">ยอดเงิน (บาท) *</label>
                  <input type="number" min="0" step="any" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">ราคา/หน่วย (บาท)</label>
                  <input type="number" min="0" step="any" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">จำนวนหน่วย</label>
                  <input type="number" min="0" step="any" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">วันที่ *</label>
                  <input type="date" value={form.transactionDate} onChange={e => setForm(f => ({ ...f, transactionDate: e.target.value }))} required
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">หมายเหตุ</label>
                  <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="หมายเหตุ (ไม่บังคับ)"
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
            <p className="text-sm text-muted-foreground mb-5">รายการ Transaction นี้จะถูกลบถาวร</p>
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
