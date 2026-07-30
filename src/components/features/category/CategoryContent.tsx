"use client";

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Zap, Building2, Cpu, Home, TrendingUp, Star, Globe, Shield, Target } from 'lucide-react';
import { Card, Button, Badge, Modal, EmptyState, ConfirmDialog } from '@/components/ui/index';
import { mockCategories } from '@/lib/mock-data';

const iconOptions = ['Tag', 'Zap', 'Building2', 'Cpu', 'Home', 'TrendingUp', 'Star', 'Globe', 'Shield', 'Target'];
const colorOptions = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444', '#f97316', '#84cc16', '#64748b'];

const IconMap: Record<string, any> = { Tag, Zap, Building2, Cpu, Home, TrendingUp, Star, Globe, Shield, Target };

interface Category { id: string; name: string; icon: string; color: string; count: number }

export default function CategoryContent() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', icon: 'Tag', color: '#10b981' });

  const openCreate = () => { setForm({ name: '', icon: 'Tag', color: '#10b981' }); setEditItem(null); setShowForm(true); };
  const openEdit = (c: Category) => { setForm({ name: c.name, icon: c.icon, color: c.color }); setEditItem(c); setShowForm(true); };

  const handleSave = () => {
    if (editItem) {
      setCategories(cs => cs.map(c => c.id === editItem.id ? { ...c, ...form } : c));
    } else {
      setCategories(cs => [...cs, { id: Date.now().toString(), ...form, count: 0 }]);
    }
    setShowForm(false);
  };

  return (
    <>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">{categories.length} หมวดหมู่</p>
          <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> สร้างหมวดหมู่</Button>
        </div>

        {categories.length === 0 ? (
          <EmptyState title="ยังไม่มีหมวดหมู่" description="สร้างหมวดหมู่เพื่อจัดกลุ่มการลงทุน" action={<Button onClick={openCreate}><Plus className="w-4 h-4" /> สร้างหมวดหมู่</Button>} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(c => {
              const Icon = IconMap[c.icon] || Tag;
              return (
                <Card key={c.id} className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: c.color + '20' }}>
                      <Icon className="w-6 h-6" style={{ color: c.color }} />
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{c.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-sm text-slate-500 dark:text-slate-400">{c.count} สินทรัพย์</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editItem ? 'แก้ไขหมวดหมู่' : 'สร้างหมวดหมู่ใหม่'}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ชื่อหมวดหมู่</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="เช่น เทคโนโลยี, พลังงาน" className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ไอคอน</label>
            <div className="flex gap-2 flex-wrap">
              {iconOptions.map(icon => {
                const Icon = IconMap[icon] || Tag;
                return (
                  <button key={icon} onClick={() => setForm(f => ({ ...f, icon }))} className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${form.icon === icon ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                    <Icon className={`w-5 h-5 ${form.icon === icon ? 'text-emerald-600' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">สี</label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map(color => (
                <button key={color} onClick={() => setForm(f => ({ ...f, color }))} className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${form.color === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}`} style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowForm(false)}>ยกเลิก</Button>
            <Button className="flex-1" onClick={handleSave}>{editItem ? 'บันทึก' : 'สร้าง'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { setCategories(cs => cs.filter(c => c.id !== deleteId)); setDeleteId(null); }} title="ลบหมวดหมู่?" description="ข้อมูลในหมวดหมู่นี้จะยังคงอยู่ แต่จะถูกย้ายไปยัง 'ไม่มีหมวดหมู่'" danger />
    </>
  );
}
