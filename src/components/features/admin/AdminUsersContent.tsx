/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 75 / Flow ขั้นตอนที่ 75]
 * ชื่อไฟล์: AdminUsersContent.tsx
 * หน้าที่หลัก: Component จัดการผู้ใช้งานระบบสำหรับ Admin (ค้นหา, คัดกรอง, ระงับ/เปิดใช้งาน บัญชีผู้ใช้)
 * รับอะไรมาจากไหน (Input): ข้อมูลจาก `adminApi.getUsers()`
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render ตารางผู้ใช้และการเปลี่ยนสถานะ
 * ==========================================
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Trash2, UserX, Loader2, AlertCircle, Briefcase, DollarSign, Calendar, Mail, Phone, Shield, UserCheck } from 'lucide-react';
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

  // Detail Modal States (Fetches GET /admin/users/:id)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userDetail, setUserDetail] = useState<AdminUser | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Delete Confirm & Status Action States
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

  // Open Detail Modal & Fetch GET /admin/users/:id
  const openDetailModal = async (userId: string) => {
    setSelectedUserId(userId);
    setUserDetail(null);
    setDetailError(null);
    setLoadingDetail(true);

    try {
      const data = await AdminApi.getUserById(userId);
      setUserDetail(data);
    } catch (err: any) {
      setDetailError(err?.message ?? 'ไม่สามารถโหลดข้อมูลรายละเอียดผู้ใช้งานได้');
    } finally {
      setLoadingDetail(false);
    }
  };

  // Close Detail Modal & Reset state
  const closeDetailModal = () => {
    setSelectedUserId(null);
    setUserDetail(null);
    setDetailError(null);
    setLoadingDetail(false);
  };

  const toggleStatus = async (user: AdminUser) => {
    try {
      setActionLoading(true);
      const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      await AdminApi.updateUserStatus(user.id, newStatus);
      await loadUsers();
      if (userDetail && userDetail.id === user.id) {
        setUserDetail(prev => prev ? { ...prev, status: newStatus as any } : null);
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
                            onClick={() => openDetailModal(u.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer shadow-xs"
                            title="ดูรายละเอียดผู้ใช้"
                          >
                            <Eye className="size-3.5 text-violet-500" />
                            ดูรายละเอียด
                          </button>
                          <button
                            onClick={() => toggleStatus(u)}
                            className="p-1.5 rounded-lg hover:bg-amber-500/10 text-muted-foreground hover:text-amber-500 transition-colors cursor-pointer"
                            title={u.status === 'ACTIVE' ? 'ระงับการใช้งาน' : 'เปิดใช้งาน'}
                          >
                            <UserX className="size-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(u.id)}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
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

      {/* User Detail Modal (Calls GET /admin/users/:id) */}
      {selectedUserId && (
        <Modal open onClose={closeDetailModal} title="รายละเอียดผู้ใช้งาน (User Details)">
          {loadingDetail ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="size-8 animate-spin text-violet-500" />
              <p className="text-xs text-muted-foreground font-medium">กำลังดึงข้อมูลรายละเอียดผู้ใช้...</p>
            </div>
          ) : detailError ? (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive my-2">
              <AlertCircle className="size-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold">ไม่สามารถดึงข้อมูลได้</p>
                <p className="text-xs opacity-90 mt-0.5">{detailError}</p>
              </div>
            </div>
          ) : userDetail ? (
            <div className="flex flex-col gap-5">
              {/* Profile Card Header */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border">
                {userDetail.avatarUrl ? (
                  <img
                    src={userDetail.avatarUrl}
                    alt="profile"
                    className="size-14 rounded-2xl object-cover ring-2 ring-violet-500/20"
                  />
                ) : (
                  <Avatar name={`${userDetail.firstname} ${userDetail.lastname}`} size="lg" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-base truncate">
                      {userDetail.firstname} {userDetail.lastname}
                    </h3>
                    <Badge variant={userDetail.role === 'ADMIN' ? 'warning' : 'neutral'}>
                      {userDetail.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{userDetail.email}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant={userDetail.status === 'ACTIVE' ? 'success' : 'danger'}>
                      {userDetail.status === 'ACTIVE' ? 'ใช้งานปกติ (ACTIVE)' : 'ถูกระงับ (SUSPENDED)'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Usage Summary Stats Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-border bg-card flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500 shrink-0">
                    <Briefcase className="size-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">จำนวน Portfolio</p>
                    <p className="text-base font-bold text-foreground">
                      {userDetail._count?.portfolios ?? 0} พอร์ต
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-card flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                    <DollarSign className="size-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">จำนวน Transaction</p>
                    <p className="text-base font-bold text-foreground">
                      {userDetail._count?.transactions ?? 0} รายการ
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed User Information List */}
              <div className="space-y-2 border-t border-border pt-4 text-xs">
                <p className="font-bold text-foreground uppercase tracking-wider text-[11px] mb-2">
                  ข้อมูลบัญชี (Account Info)
                </p>

                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Mail className="size-3.5 text-violet-500" /> อีเมล
                  </span>
                  <span className="font-medium text-foreground">{userDetail.email}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Phone className="size-3.5 text-violet-500" /> เบอร์โทรศัพท์
                  </span>
                  <span className="font-medium text-foreground">{userDetail.phone || '-'}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-violet-500" /> วันที่สมัครเข้าใช้งาน
                  </span>
                  <span className="font-medium text-foreground">
                    {new Date(userDetail.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Shield className="size-3.5 text-violet-500" /> อัปเดตข้อมูลล่าสุด
                  </span>
                  <span className="font-medium text-foreground">
                    {new Date(userDetail.updatedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex gap-3 pt-3 border-t border-border">
                <Button variant="secondary" className="flex-1 cursor-pointer" onClick={closeDetailModal}>
                  ปิดหน้าต่าง
                </Button>
                <Button
                  variant={userDetail.status === 'ACTIVE' ? 'danger' : 'primary'}
                  className="flex-1 cursor-pointer"
                  disabled={actionLoading}
                  onClick={() => toggleStatus(userDetail)}
                >
                  {actionLoading && <Loader2 className="size-4 animate-spin mr-1" />}
                  {userDetail.status === 'ACTIVE' ? 'ระงับบัญชีผู้ใช้' : 'เปิดใช้งานบัญชี'}
                </Button>
              </div>
            </div>
          ) : null}
        </Modal>
      )}

      {/* Confirm Delete Dialog */}
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
