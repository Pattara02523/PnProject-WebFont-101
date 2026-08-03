/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 80 / Flow ขั้นตอนที่ 80]
 * ชื่อไฟล์: AdminAnnouncementsContent.tsx
 * หน้าที่หลัก: Component จัดการประกาศระบบสำหรับ Admin (สร้าง, แก้ไข, ซ่อน/เผยแพร่ ประกาศข่าวสาร)
 * รับอะไรมาจากไหน (Input): ข้อมูลจาก `announcementApi` สำหรับ Admin
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render ตารางประกาศและฟอร์มสร้างประกาศ
 * ==========================================
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Power, Megaphone, Loader2, Calendar } from 'lucide-react';
import { Card, Badge, Modal, ConfirmDialog } from '@/components/ui';
import { AdminApi, Announcement, CreateAnnouncementDto } from '@/lib/api/admin.api';

const TYPE_CONFIG: Record<string, { label: string; variant: 'info' | 'warning' | 'success' | 'neutral' }> = {
  NEWS: { label: 'ข่าวสาร (NEWS)', variant: 'info' },
  MAINTENANCE: { label: 'ปรับปรุงระบบ (MAINTENANCE)', variant: 'warning' },
  MARKET: { label: 'ตลาดหุ้น (MARKET)', variant: 'success' },
  SYSTEM: { label: 'ทั่วไป (SYSTEM)', variant: 'neutral' },
};

const emptyForm: CreateAnnouncementDto = {
  title: '',
  message: '',
  type: 'NEWS',
  isPublished: true,
};

export default function AdminAnnouncementsContent() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateAnnouncementDto>({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await AdminApi.getAnnouncements();
      setAnnouncements(list ?? []);
    } catch (e: any) {
      setError(e?.message ?? 'โหลดรายการประกาศไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (ann: Announcement) => {
    setEditing(ann);
    setForm({
      title: ann.title,
      message: ann.message,
      type: ann.type,
      isPublished: ann.isPublished,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({ ...emptyForm });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;

    try {
      setSubmitting(true);
      if (editing) {
        await AdminApi.updateAnnouncement(editing.id, {
          title: form.title.trim(),
          message: form.message.trim(),
          type: form.type,
          isPublished: form.isPublished,
        });
      } else {
        await AdminApi.createAnnouncement({
          title: form.title.trim(),
          message: form.message.trim(),
          type: form.type,
          isPublished: form.isPublished,
        });
      }
      closeModal();
      await loadData();
    } catch (err: any) {
      alert(err?.message ?? 'บันทึกประกาศไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublished = async (ann: Announcement) => {
    try {
      setTogglingId(ann.id);
      const updated = await AdminApi.updateAnnouncement(ann.id, { isPublished: !ann.isPublished });
      setAnnouncements(prev => prev.map(a => a.id === ann.id ? updated : a));
    } catch (e: any) {
      alert(e?.message ?? 'เปลี่ยนสถานะประกาศไม่สำเร็จ');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await AdminApi.deleteAnnouncement(deleteId);
      setDeleteId(null);
      await loadData();
    } catch (e: any) {
      alert(e?.message ?? 'ลบประกาศไม่สำเร็จ');
    }
  };

  if (loading && announcements.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">จัดการประกาศและข่าวสารระบบ</h2>
          <p className="text-xs text-muted-foreground mt-0.5">สร้าง แก้ไข และจัดการการเปิด/ปิดเผยแพร่ประกาศให้ผู้ใช้เห็น</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-all shadow-sm cursor-pointer"
        >
          <Plus className="size-4" /> สร้างประกาศใหม่
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      {/* Announcements Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                {['หัวข้อประกาศ', 'ประเภท', 'สถานะ', 'วันที่สร้าง / เผยแพร่', 'จัดการ'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {announcements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                    ไม่พบรายการประกาศ
                  </td>
                </tr>
              ) : (
                announcements.map((a) => {
                  const typeBadge = TYPE_CONFIG[a.type] ?? { label: a.type, variant: 'neutral' as const };
                  const dateStr = a.publishedAt || a.createdAt
                    ? new Date(a.publishedAt || a.createdAt).toLocaleDateString('th-TH', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-';

                  return (
                    <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500 shrink-0">
                            <Megaphone className="size-4" />
                          </div>
                          <div className="min-w-0 max-w-md">
                            <p className="font-semibold text-foreground truncate">{a.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{a.message}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant={a.isPublished ? 'success' : 'neutral'}>
                          {a.isPublished ? 'เผยแพร่แล้ว' : 'ปิดการแสดง'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{dateStr}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleTogglePublished(a)}
                            disabled={togglingId === a.id}
                            title={a.isPublished ? 'ปิดการเผยแพร่' : 'เปิดเผยแพร่'}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              a.isPublished
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20'
                                : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {togglingId === a.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Power className="size-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => openEdit(a)}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="แก้ไขประกาศ"
                          >
                            <Edit className="size-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(a.id)}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            title="ลบประกาศ"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Create/Edit */}
      {showModal && (
        <Modal open onClose={closeModal} title={editing ? 'แก้ไขประกาศ' : 'สร้างประกาศใหม่'}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">หัวข้อประกาศ *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="ระบุหัวข้อประกาศ..."
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">ประเภทประกาศ *</label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              >
                <option value="NEWS">ข่าวสาร (NEWS)</option>
                <option value="MAINTENANCE">ปรับปรุงระบบ (MAINTENANCE)</option>
                <option value="MARKET">ตลาดหุ้น (MARKET)</option>
                <option value="SYSTEM">ทั่วไป / ประกาศระบบ (SYSTEM)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">เนื้อหาประกาศ *</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="ระบุรายละเอียดข้อความประกาศ..."
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublishedModal"
                checked={form.isPublished}
                onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))}
                className="rounded border-border text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
              <label htmlFor="isPublishedModal" className="text-xs font-medium text-foreground cursor-pointer select-none">
                เผยแพร่ประกาศทันที (Is Published)
              </label>
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {submitting && <Loader2 className="size-4 animate-spin" />}
                {editing ? 'บันทึกการแก้ไข' : 'สร้างประกาศ'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="ลบประกาศ?"
        description="รายการประกาศนี้จะถูกลบถาวร"
        danger
      />
    </div>
  );
}
