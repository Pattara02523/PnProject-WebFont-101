/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 56 / Flow ขั้นตอนที่ 56]
 * ชื่อไฟล์: GoalContent.tsx
 * หน้าที่หลัก: Component แสดงเป้าหมายการออมเงิน คำนวณ % ความคืบหน้า และ Modal เพิ่มเป้าหมาย/ออมเงินเพิ่ม
 * รับอะไรมาจากไหน (Input): ข้อมูลจาก `goalApi.getAll()`
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render รายการเป้าหมายการเงินและการออม
 * ==========================================
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Target, Loader2, X, Pencil, Trash2,
  AlertCircle, CheckCircle2, Clock, XCircle,
} from 'lucide-react';
import { GoalApi, Goal, CreateGoalDto, UpdateGoalDto } from '@/lib/api/goal.api';

const STATUS_CONFIG = {
  IN_PROGRESS: { label: 'กำลังดำเนินการ', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  COMPLETED: { label: 'สำเร็จแล้ว', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  FAILED: { label: 'ไม่สำเร็จ', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

const emptyForm = {
  title: '', description: '', targetAmount: '', currentAmount: '', deadline: '',
};

const fmtCurrency = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function GoalContent() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GoalApi.findAll();
      setGoals(data || []);
    } catch (e: any) {
      setError(e?.message ?? 'โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, deadline: new Date().toISOString().slice(0, 10) });
    setShowModal(true);
  };

  const openEdit = (goal: Goal) => {
    setEditing(goal);
    setForm({
      title: goal.title,
      description: goal.description ?? '',
      targetAmount: String(goal.targetAmount),
      currentAmount: String(goal.currentAmount),
      deadline: goal.deadline ? goal.deadline.slice(0, 10) : new Date().toISOString().slice(0, 10),
    });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); setForm({ ...emptyForm }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.targetAmount || !form.deadline) return;
    try {
      setSubmitting(true);
      const payload: CreateGoalDto = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        targetAmount: Number(form.targetAmount),
        currentAmount: form.currentAmount ? Number(form.currentAmount) : 0,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : new Date().toISOString(),
      };

      if (editing) {
        await GoalApi.update(editing.id, payload as UpdateGoalDto);
      } else {
        await GoalApi.create(payload);
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
      await GoalApi.delete(id);
      setDeleteConfirm(null);
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'ลบไม่สำเร็จ');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="size-8 animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">เป้าหมาย</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{goals.length} เป้าหมาย</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
          <Plus className="size-4" /> เพิ่มเป้าหมาย
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="size-4 shrink-0" /> {error}
          <button onClick={() => setError(null)} className="ml-auto"><X className="size-4" /></button>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          <Target className="size-10 mx-auto mb-3 opacity-30" />
          ยังไม่มีเป้าหมาย กด "+ เพิ่มเป้าหมาย" เพื่อเริ่มต้น
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {goals.map(goal => {
            const pct = goal.targetAmount > 0
              ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
              : 0;
            const cfg = STATUS_CONFIG[goal.status] ?? STATUS_CONFIG.IN_PROGRESS;
            const remaining = goal.targetAmount - goal.currentAmount;
            return (
              <div key={goal.id} className={`rounded-2xl border ${cfg.border} bg-card p-5 flex flex-col gap-4`}>
                {/* Top */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground truncate">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{goal.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => openEdit(goal)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="size-3.5" />
                    </button>
                    <button onClick={() => setDeleteConfirm(goal.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${cfg.bg} w-fit`}>
                  <cfg.icon className={`size-3 ${cfg.color}`} />
                  <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <div>
                      <p className="text-[10px] text-muted-foreground">ปัจจุบัน</p>
                      <p className="text-sm font-bold text-foreground">฿{fmtCurrency(goal.currentAmount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">เป้าหมาย</p>
                      <p className="text-sm font-bold text-foreground">฿{fmtCurrency(goal.targetAmount)}</p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className={`text-xs font-semibold ${pct >= 100 ? 'text-emerald-600' : 'text-primary'}`}>
                      {pct.toFixed(1)}%
                    </span>
                    {remaining > 0 && (
                      <span className="text-xs text-muted-foreground">
                        เหลืออีก ฿{fmtCurrency(remaining)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Target Date */}
                {goal.deadline && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3" />
                    ครบกำหนด {new Date(goal.deadline).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-foreground">{editing ? 'แก้ไขเป้าหมาย' : 'เพิ่มเป้าหมาย'}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="size-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">ชื่อเป้าหมาย *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="เช่น ซื้อบ้าน"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">คำอธิบาย</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">เป้าหมาย (บาท) *</label>
                  <input type="number" min="0" step="any" value={form.targetAmount} onChange={e => setForm(f => ({ ...f, targetAmount: e.target.value }))} required placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">ออมแล้ว (บาท)</label>
                  <input type="number" min="0" step="any" value={form.currentAmount} onChange={e => setForm(f => ({ ...f, currentAmount: e.target.value }))} placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">วันครบกำหนด *</label>
                <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} required
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
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
            <p className="text-sm text-muted-foreground mb-5">เป้าหมายนี้จะถูกลบถาวร</p>
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
