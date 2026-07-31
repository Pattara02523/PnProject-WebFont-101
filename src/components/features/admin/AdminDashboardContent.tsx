'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Users, UserCheck, Briefcase, TrendingUp, ArrowLeftRight, Megaphone, Loader2, Power, Plus, X } from 'lucide-react';
import { StatCard, Card, Badge, Table, Tr, Td, Avatar, Modal } from '@/components/ui';
import { AdminApi, AdminDashboard, AdminUser, Announcement, CreateAnnouncementDto } from '@/lib/api/admin.api';

const TYPE_LABEL: Record<string, string> = {
  NEWS: 'ข่าวสาร',
  MAINTENANCE: 'ระบบ',
  MARKET: 'ตลาด',
  SYSTEM: 'ทั่วไป',
};

const emptyForm: CreateAnnouncementDto = {
  title: '',
  message: '',
  type: 'NEWS',
  isPublished: true,
};

export default function AdminDashboardContent() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Create Announcement Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState<CreateAnnouncementDto>({ ...emptyForm });
  const [creating, setCreating] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [dash, usersRes, annRes] = await Promise.all([
        AdminApi.getDashboard(),
        AdminApi.getUsers({ limit: '10', page: '1' }),
        AdminApi.getAnnouncements(),
      ]);
      setDashboard(dash);
      setUsers(usersRes.data ?? []);
      setAnnouncements(annRes ?? []);
    } catch (e: any) {
      setError(e?.message ?? 'โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTogglePublished = async (ann: Announcement) => {
    try {
      setTogglingId(ann.id);
      const updated = await AdminApi.updateAnnouncement(ann.id, { isPublished: !ann.isPublished });
      setAnnouncements(prev => prev.map(a => a.id === ann.id ? updated : a));
      const dash = await AdminApi.getDashboard();
      setDashboard(dash);
    } catch (e: any) {
      alert(e?.message ?? 'สลับสถานะประกาศไม่สำเร็จ');
    } finally {
      setTogglingId(null);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;
    try {
      setCreating(true);
      await AdminApi.createAnnouncement({
        title: form.title.trim(),
        message: form.message.trim(),
        type: form.type,
        isPublished: form.isPublished,
      });
      setShowCreateModal(false);
      setForm({ ...emptyForm });
      await loadData();
    } catch (err: any) {
      alert(err?.message ?? 'สร้างประกาศไม่สำเร็จ');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive text-sm font-medium">
        {error}
      </div>
    );
  }

  const publishedCount = announcements.filter(a => a.isPublished).length;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">ยินดีต้อนรับ, Admin 👋</h2>
          <p className="text-sm text-muted-foreground mt-0.5">ภาพรวมระบบ InvestPro</p>
        </div>
        <Link href="/admin/announcements">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold hover:bg-violet-500/20 transition-all cursor-pointer">
            <Megaphone className="size-3.5" /> จัดการประกาศทั้งหมด →
          </button>
        </Link>
      </div>

      {/* Stats Cards (ข้อมูลจริงจาก API) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="ผู้ใช้ทั้งหมด"
          value={String(dashboard?.users?.total ?? 0)}
          change={`ใช้งาน ${dashboard?.users?.active ?? 0}`}
          positive
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="ผู้ใช้ที่ active"
          value={String(dashboard?.users?.active ?? 0)}
          change={`ระงับ ${dashboard?.users?.suspended ?? 0}`}
          positive
          icon={<UserCheck className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Portfolio ทั้งหมด"
          value={String(dashboard?.portfolios?.total ?? 0)}
          icon={<Briefcase className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          title="การลงทุน"
          value={String(dashboard?.investments?.total ?? 0)}
          change={`active ${dashboard?.investments?.active ?? 0}`}
          positive
          icon={<TrendingUp className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="Transaction"
          value={String(dashboard?.transactions?.total ?? 0)}
          icon={<ArrowLeftRight className="w-5 h-5" />}
          color="blue"
        />
      </div>

      {/* Announcements + Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

        {/* Announcement card */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="size-4 text-violet-500" />
              <h3 className="font-semibold text-sm text-foreground">ประกาศ</h3>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-500/10 hover:bg-violet-500/20 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
            >
              <Plus className="size-3.5" /> สร้างประกาศ
            </button>
          </div>

          {/* Summary counts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/40 p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{announcements.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">ทั้งหมด</p>
            </div>
            <div className="rounded-xl bg-violet-500/10 p-3 text-center">
              <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{publishedCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">เผยแพร่แล้ว</p>
            </div>
          </div>

          {/* List of Announcements with toggle switch */}
          <div className="space-y-3 pt-1 border-t border-border">
            {announcements.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground py-4">ไม่มีประกาศ</p>
            ) : (
              announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className="p-3 rounded-xl border border-border bg-muted/20 flex items-start justify-between gap-3 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Badge variant={ann.isPublished ? 'success' : 'neutral'}>
                        {ann.isPublished ? 'เผยแพร่' : 'ปิดการแสดง'}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {TYPE_LABEL[ann.type] ?? ann.type}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-foreground truncate">{ann.title}</h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{ann.message}</p>
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => handleTogglePublished(ann)}
                    disabled={togglingId === ann.id}
                    title={ann.isPublished ? 'คลิกเพื่อปิดการแสดง' : 'คลิกเพื่อเปิดเผยแพร่'}
                    className={`p-2 rounded-xl border transition-all shrink-0 cursor-pointer ${
                      ann.isPublished
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20'
                        : 'bg-muted border-border text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                    }`}
                  >
                    {togglingId === ann.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Power className="size-3.5" />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Users table (Limit 10 + Scrollable) */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
            <div>
              <h3 className="font-semibold text-sm text-foreground">ผู้ใช้งานล่าสุด</h3>
              <p className="text-xs text-muted-foreground mt-0.5">แสดงผู้ใช้ล่าสุดสูงสุด 10 คน (เลื่อนดูได้)</p>
            </div>
            <Badge variant="info">{users.length} คน</Badge>
          </div>

          {users.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-12">ไม่มีข้อมูลผู้ใช้งาน</p>
          ) : (
            <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
              <Table headers={['ผู้ใช้', 'ROLE', 'สถานะ', 'สร้างเมื่อ']}>
                {users.map(u => {
                  const name = `${u.firstname} ${u.lastname}`.trim() || u.email;
                  const createdAt = new Date(u.createdAt).toLocaleDateString('th-TH', {
                    day: '2-digit', month: 'short', year: '2-digit',
                  });
                  return (
                    <Tr key={u.id} className="hover:bg-muted/20 transition-colors">
                      <Td>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={name} size="sm" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{name}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{u.email}</p>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <Badge variant={u.role === 'ADMIN' ? 'warning' : 'neutral'}>
                          {u.role}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge variant={u.status === 'ACTIVE' ? 'success' : 'danger'}>
                          {u.status === 'ACTIVE' ? 'ใช้งาน' : u.status === 'SUSPENDED' ? 'ระงับ' : 'ลบแล้ว'}
                        </Badge>
                      </Td>
                      <Td className="text-xs text-muted-foreground whitespace-nowrap">{createdAt}</Td>
                    </Tr>
                  );
                })}
              </Table>
            </div>
          )}
        </Card>

      </div>

      {/* Modal: Create Announcement */}
      {showCreateModal && (
        <Modal open onClose={() => setShowCreateModal(false)} title="สร้างประกาศใหม่">
          <form onSubmit={handleCreateAnnouncement} className="flex flex-col gap-4">
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
                id="isPublished"
                checked={form.isPublished}
                onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))}
                className="rounded border-border text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
              <label htmlFor="isPublished" className="text-xs font-medium text-foreground cursor-pointer select-none">
                เผยแพร่ประกาศทันที (Is Published)
              </label>
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {creating && <Loader2 className="size-4 animate-spin" />}
                สร้างประกาศ
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
