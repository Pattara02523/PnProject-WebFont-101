'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Zap, Building2, Cpu, Home, TrendingUp, Star, Globe, Shield, Target, Loader2, AlertCircle, X, Eye, Calendar, FileText, Briefcase } from 'lucide-react';
import { Card, Button, Modal, EmptyState, ConfirmDialog } from '@/components/ui/index';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CategoryApi, Category, CreateCategoryDto } from '@/lib/api/category.api';

const iconOptions = ['Tag', 'Zap', 'Building2', 'Cpu', 'Home', 'TrendingUp', 'Star', 'Globe', 'Shield', 'Target'];
const colorOptions = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444', '#f97316', '#84cc16', '#64748b'];
const IconMap: Record<string, any> = { Tag, Zap, Building2, Cpu, Home, TrendingUp, Star, Globe, Shield, Target };

const EMPTY_FORM: CreateCategoryDto = { name: '', icon: 'Tag', color: '#10b981' };

export default function CategoryContent() {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryApi.findAll(),
    retry: false,
  });

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateCategoryDto>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Category Detail Modal States (Fetches GET /categories/:id)
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [catDetail, setCatDetail] = useState<Category | null>(null);
  const [loadingCatDetail, setLoadingCatDetail] = useState(false);
  const [catDetailError, setCatDetailError] = useState<string | null>(null);

  const openCreate = () => { setForm(EMPTY_FORM); setEditItem(null); setShowForm(true); };
  const openEdit = (c: Category) => { setForm({ name: c.name, icon: c.icon ?? 'Tag', color: c.color ?? '#10b981', description: c.description }); setEditItem(c); setShowForm(true); };

  // Open Category Detail Modal & Fetch GET /categories/:id
  const openDetailModal = async (id: string) => {
    setSelectedCatId(id);
    setCatDetail(null);
    setCatDetailError(null);
    setLoadingCatDetail(true);

    try {
      const data = await CategoryApi.findOne(id);
      setCatDetail(data);
    } catch (err: any) {
      setCatDetailError(err?.message ?? 'ไม่พบหมวดหมู่หรือเกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoadingCatDetail(false);
    }
  };

  // Close Category Detail Modal & Reset state
  const closeDetailModal = () => {
    setSelectedCatId(null);
    setCatDetail(null);
    setCatDetailError(null);
    setLoadingCatDetail(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage(null);
    try {
      if (editItem) {
        await CategoryApi.update(editItem.id, form);
      } else {
        await CategoryApi.create(form);
      }
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setShowForm(false);
    } catch (err: any) {
      setErrorMessage(err?.message ?? 'บันทึกหมวดหมู่ไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setErrorMessage(null);
    try {
      await CategoryApi.delete(deleteId);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeleteId(null);
    } catch (err: any) {
      console.error('Delete category failed:', err);
      const msg = err?.message || 'ไม่สามารถลบหมวดหมู่นี้ได้ เนื่องจากยังมีรายการลงทุนใช้งานอยู่ (Cannot delete category because it is being used by investments.)';
      setErrorMessage(msg);
      setDeleteId(null);
    }
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
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {/* Banner แสดงแจ้งเตือนกรณีเกิดข้อผิดพลาดในการลบ */}
        {errorMessage && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">ไม่สามารถลบหมวดหมู่ได้</p>
              <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="p-1 rounded-lg hover:bg-destructive/20 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">{categories.length} หมวดหมู่</p>
          <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> สร้างหมวดหมู่</Button>
        </div>

        {categories.length === 0 ? (
          <EmptyState title="ยังไม่มีหมวดหมู่" description="สร้างหมวดหมู่เพื่อจัดกลุ่มการลงทุน" action={<Button onClick={openCreate}><Plus className="w-4 h-4" /> สร้างหมวดหมู่</Button>} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(c => {
              const Icon = IconMap[c.icon ?? 'Tag'] || Tag;
              const count = c._count?.investments ?? 0;
              const color = c.color ?? '#10b981';
              return (
                <Card key={c.id} className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
                      <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openDetailModal(c.id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer" title="ดูรายละเอียด">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 cursor-pointer" title="แก้ไข">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 cursor-pointer" title="ลบ">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{c.name}</h3>
                  {c.description && <p className="text-xs text-slate-400 mb-2">{c.description}</p>}
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-sm text-slate-500 dark:text-slate-400">{count} สินทรัพย์</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Detail Modal (Redesigned & Cleaned) */}
      {selectedCatId && (
        <Modal open onClose={closeDetailModal} title="รายละเอียดหมวดหมู่">
          {loadingCatDetail ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">กำลังดึงข้อมูลรายละเอียด...</p>
            </div>
          ) : catDetailError ? (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive my-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold">ไม่พบข้อมูลหมวดหมู่</p>
                <p className="text-xs opacity-90 mt-0.5">{catDetailError}</p>
              </div>
            </div>
          ) : catDetail ? (
            <div className="flex flex-col gap-4">
              {/* Header Card */}
              {(() => {
                const Icon = IconMap[catDetail.icon ?? 'Tag'] || Tag;
                const color = catDetail.color ?? '#10b981';
                return (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs" style={{ backgroundColor: color + '25' }}>
                        <Icon className="w-6 h-6" style={{ color }} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{catDetail.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{color}</span>
                        </div>
                      </div>
                    </div>

                    {catDetail.isDefault && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        หมวดหมู่เริ่มต้น
                      </span>
                    )}
                  </div>
                );
              })()}

              {/* Stats Summary Grid (Clean Typography) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">สินทรัพย์ในหมวดนี้</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {catDetail._count?.investments ?? 0} รายการ
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">รูปแบบไอคอน</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {catDetail.icon || 'Tag'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Information Rows */}
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 space-y-3 bg-white dark:bg-slate-900">
                <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" /> วันที่สร้างหมวดหมู่
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {catDetail.createdAt ? new Date(catDetail.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" /> อัปเดตล่าสุด
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {catDetail.updatedAt ? new Date(catDetail.updatedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                  </span>
                </div>

                <div className="pt-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-500" /> คำอธิบายหมวดหมู่
                  </span>
                  <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 text-xs leading-relaxed border border-slate-100 dark:border-slate-800/40">
                    {catDetail.description || 'ไม่มีคำอธิบายเพิ่มเติม'}
                  </p>
                </div>
              </div>

              {/* Close Action */}
              <div className="pt-1">
                <Button variant="secondary" className="w-full" onClick={closeDetailModal}>
                  ปิดหน้าต่าง
                </Button>
              </div>
            </div>
          ) : null}
        </Modal>
      )}

      {/* Form Create/Edit Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title={editItem ? 'แก้ไขหมวดหมู่' : 'สร้างหมวดหมู่ใหม่'}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ชื่อหมวดหมู่</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="เช่น เทคโนโลยี, พลังงาน" className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">คำอธิบาย</label>
            <input value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="คำอธิบาย (ไม่บังคับ)" className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
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
            <Button className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editItem ? 'บันทึก' : 'สร้าง')}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="ยืนยันการลบหมวดหมู่?"
        description="หากหมวดหมู่นี้ยังมีรายการลงทุนใช้งานอยู่ ระบบจะไม่ยินยอมให้ลบเพื่อรักษาความถูกต้องของข้อมูล"
        danger
      />
    </>
  );
}
