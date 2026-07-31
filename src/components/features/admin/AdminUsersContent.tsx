'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Trash2, UserX, Loader2, AlertCircle } from 'lucide-react';
import { Card, Badge, Avatar, Button, Modal, ConfirmDialog, Pagination } from '@/components/ui';
import { AdminApi, AdminUser } from '@/lib/api/admin.api';

export default function AdminUsersContent() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<{ total: number; page: number; limit: number; totalPages: number }>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);

  // Modals
  const [viewUser, setViewUser] = useState<AdminUser | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {
        page: String(page),
        limit: '10',
      };
      if (search.trim()) params.search = search.trim();
      if (filterStatus !== 'all') params.status = filterStatus.toUpperCase();

      const res = await AdminApi.getUsers(params);
      let list = res.data ?? [];

      // Sort alphabetically by firstname
      list.sort((a, b) => a.firstname.localeCompare(b.firstname, 'th'));

      setUsers(list);
      setPagination(res.pagination ?? { total: list.length, page, limit: 10, totalPages: Math.ceil(list.length / 10) });
    } catch (e: any) {
      setError(e?.message ?? 'โหลดข้อมูลผู้ใช้ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterStatus]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const toggleStatus = async (user: AdminUser) => {
    try {
      setActionLoading(true);
      const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      await AdminApi.updateUserStatus(user.id, newStatus);
      await loadUsers();
      if (viewUser && viewUser.id === user.id) {
        setViewUser(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (e: any) {
      alert(e?.message ?? 'เปลี่ยนสถานะผู้ใช้ไม่สำเร็จ');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(true);
      await AdminApi.deleteUser(deleteId);
      setDeleteId(null);
      await loadUsers();
    } catch (e: any) {
      alert(e?.message ?? 'ลบผู้ใช้ไม่สำเร็จ');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex-1 flex gap-2 flex-wrap w-full sm:w-auto">
          <div className="relative flex-1 max-w-xs min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="ค้นหาชื่อ / อีเมล..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="active">ใช้งาน</option>
            <option value="suspended">ระงับ</option>
          </select>
        </div>
        <p className="text-sm text-muted-foreground font-medium">{pagination.total} ผู้ใช้</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="size-4 shrink-0" /> {error}
        </div>
      )}

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                {['ผู้ใช้', 'Role', 'สถานะ', 'สร้างเมื่อ', 'อัปเดตล่าสุด', 'จัดการ'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                    ไม่พบผู้ใช้งาน
                  </td>
                </tr>
              ) : (
                users.map(u => {
                  const name = `${u.firstname} ${u.lastname}`.trim() || u.email;
                  const createdAt = u.createdAt ? new Date(u.createdAt).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' }) : '-';
                  const updatedAt = u.updatedAt ? new Date(u.updatedAt).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' }) : '-';
                  return (
                    <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={name} size="sm" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">{name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={u.role === 'ADMIN' ? 'warning' : 'neutral'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={u.status === 'ACTIVE' ? 'success' : 'danger'}>
                          {u.status === 'ACTIVE' ? 'ใช้งาน' : u.status === 'SUSPENDED' ? 'ระงับ' : 'ลบแล้ว'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{createdAt}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{updatedAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setViewUser(u)}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="size-3.5" />
                          </button>
                          <button
                            onClick={() => toggleStatus(u)}
                            className="p-1.5 rounded-lg hover:bg-amber-500/10 text-muted-foreground hover:text-amber-500 transition-colors"
                            title={u.status === 'ACTIVE' ? 'ระงับการใช้งาน' : 'เปิดใช้งาน'}
                          >
                            <UserX className="size-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(u.id)}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            title="ลบผู้ใช้"
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

        {/* Pagination Footer */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{pagination.total} ผู้ใช้ (แสดง 10 คนต่อหน้า)</p>
          <Pagination current={page} total={Math.max(1, pagination.totalPages)} onChange={setPage} />
        </div>
      </Card>

      {/* View User Modal */}
      {viewUser && (
        <Modal open onClose={() => setViewUser(null)} title="ข้อมูลผู้ใช้งาน">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Avatar name={`${viewUser.firstname} ${viewUser.lastname}`} size="lg" />
              <div>
                <p className="font-bold text-foreground">{viewUser.firstname} {viewUser.lastname}</p>
                <p className="text-sm text-muted-foreground">{viewUser.email}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant={viewUser.role === 'ADMIN' ? 'warning' : 'neutral'}>{viewUser.role}</Badge>
                  <Badge variant={viewUser.status === 'ACTIVE' ? 'success' : 'danger'}>
                    {viewUser.status === 'ACTIVE' ? 'ใช้งาน' : 'ระงับ'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-3">
              {[
                ['เบอร์โทรศัพท์', viewUser.phone || '-'],
                ['วันที่สมัคร', new Date(viewUser.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })],
                ['อัปเดตล่าสุด', new Date(viewUser.updatedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between text-xs py-1 border-b border-border/50">
                  <span className="text-muted-foreground">{l}</span>
                  <span className="font-medium text-foreground">{v}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setViewUser(null)}>ปิด</Button>
              <Button
                variant={viewUser.status === 'ACTIVE' ? 'danger' : 'primary'}
                className="flex-1"
                disabled={actionLoading}
                onClick={() => toggleStatus(viewUser)}
              >
                {actionLoading && <Loader2 className="size-4 animate-spin mr-1" />}
                {viewUser.status === 'ACTIVE' ? 'ระงับบัญชี' : 'เปิดใช้งาน'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="ลบผู้ใช้?"
        description="การลบผู้ใช้จะลบข้อมูลทั้งหมดและไม่สามารถกู้คืนได้"
        danger
      />
    </div>
  );
}
