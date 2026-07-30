"use client";

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Home, Car, Target, Palmtree } from 'lucide-react';
import { Card, Button, Modal, EmptyState, ConfirmDialog, Progress } from '@/components/ui/index';
import { mockGoals, formatCurrency } from '@/lib/mock-data';

const iconMap: Record<string, any> = { Home, Car, Target, Palmtree };
const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444'];

interface Goal { id: string; name: string; icon: string; targetAmount: number; currentAmount: number; deadline: string; color: string; description: string }

export default function GoalContent() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Goal | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', targetAmount: '', currentAmount: '', deadline: '', color: '#10b981', icon: 'Target' });

  const openCreate = () => { setForm({ name: '', description: '', targetAmount: '', currentAmount: '', deadline: '', color: '#10b981', icon: 'Target' }); setEditItem(null); setShowForm(true); };
  const openEdit = (g: Goal) => { setForm({ ...g, targetAmount: String(g.targetAmount), currentAmount: String(g.currentAmount) }); setEditItem(g); setShowForm(true); };

  const handleSave = () => {
    const data = { ...form, targetAmount: parseFloat(form.targetAmount) || 0, currentAmount: parseFloat(form.currentAmount) || 0 };
    if (editItem) {
      setGoals(gs => gs.map(g => g.id === editItem.id ? { ...g, ...data } : g));
    } else {
      setGoals(gs => [...gs, { id: Date.now().toString(), ...data }]);
    }
    setShowForm(false);
  };

  const daysLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">{goals.length} เป้าหมาย</p>
          <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> สร้างเป้าหมาย</Button>
        </div>

        {goals.length === 0 ? (
          <EmptyState title="ยังไม่มีเป้าหมาย" description="สร้างเป้าหมายทางการเงินเพื่อวางแผนการออมและลงทุน" action={<Button onClick={openCreate}><Plus className="w-4 h-4" /> สร้างเป้าหมาย</Button>} icon={<Target className="w-8 h-8" />} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {goals.map(g => {
              const Icon = iconMap[g.icon] || Target;
              const pct = Math.min(100, g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0);
              const days = daysLeft(g.deadline);
              const remaining = Math.max(0, g.targetAmount - g.currentAmount);
              return (
                <Card key={g.id} className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center animate-fade-in" style={{ backgroundColor: g.color + '20' }}>
                        <Icon className="w-6 h-6" style={{ color: g.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{g.name}</h3>
                        <p className="text-xs text-slate-400">{g.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(g)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteId(g.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-end justify-between mb-1.5">
                      <span className="text-xs text-slate-400">ความคืบหน้า</span>
                      <span className="text-lg font-bold" style={{ color: g.color }}>{pct.toFixed(1)}%</span>
                    </div>
                    <Progress value={pct} max={100} color={g.color} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                      <p className="text-xs text-slate-400 mb-0.5">ปัจจุบัน</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatCurrency(g.currentAmount)}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                      <p className="text-xs text-slate-400 mb-0.5">เป้าหมาย</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatCurrency(g.targetAmount)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">เหลืออีก <span className="font-semibold text-slate-600 dark:text-slate-300">{formatCurrency(remaining)}</span></span>
                    <span className={`font-medium ${days < 30 ? 'text-red-500' : days < 90 ? 'text-amber-500' : 'text-slate-400'}`}>
                      {days > 0 ? `${days} วัน` : 'หมดเวลาแล้ว'}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editItem ? 'แก้ไขเป้าหมาย' : 'สร้างเป้าหมายใหม่'}>
        <div className="flex flex-col gap-4">
          {[
            ['ชื่อเป้าหมาย', 'name', 'text', 'เช่น ซื้อบ้าน, เกษียณ'],
            ['คำอธิบาย', 'description', 'text', 'รายละเอียด...'],
            ['จำนวนเงินเป้าหมาย (บาท)', 'targetAmount', 'number', '0'],
            ['จำนวนเงินปัจจุบัน (บาท)', 'currentAmount', 'number', '0']
          ].map(([label, key, type, ph]) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
              <input type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">กำหนดเวลา</label>
            <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ไอคอน</label>
            <div className="flex gap-2">
              {['Home', 'Car', 'Target', 'Palmtree'].map(icon => {
                const Icon = iconMap[icon] || Target;
                return (
                  <button key={icon} onClick={() => setForm(f => ({ ...f, icon }))} className={`flex-1 py-2.5 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all ${form.icon === icon ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'}`}>
                    <Icon className="w-4 h-4" />{icon === 'Palmtree' ? 'เกษียณ' : icon === 'Home' ? 'บ้าน' : icon === 'Car' ? 'รถ' : 'เป้าหมาย'}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">สี</label>
            <div className="flex gap-2">
              {COLORS.map(c => <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} className={`w-8 h-8 rounded-full hover:scale-110 transition-transform ${form.color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}`} style={{ backgroundColor: c }} />)}
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowForm(false)}>ยกเลิก</Button>
            <Button className="flex-1" onClick={handleSave}>{editItem ? 'บันทึก' : 'สร้าง'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { setGoals(gs => gs.filter(g => g.id !== deleteId)); setDeleteId(null); }} title="ลบเป้าหมาย?" danger />
    </>
  );
}
