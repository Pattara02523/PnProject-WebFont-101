"use client";

import { useState } from 'react';
import { Search, Edit2, Trash2, Lock, UserX, MoreHorizontal } from 'lucide-react';
import { Card, Badge, Avatar, Button, Modal, Input, ConfirmDialog, Pagination } from '@/components/ui';
import { mockAdminUsers } from '@/lib/mock-data';

export default function AdminUsersContent() {
  const [users, setUsers] = useState(mockAdminUsers);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [viewUser, setViewUser] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [resetId, setResetId] = useState<string | null>(null);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const toggleStatus = (id: string) => {
    setUsers(us => us.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาผู้ใช้..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="all">ทั้งหมด</option>
            <option value="active">ใช้งาน</option>
            <option value="suspended">ระงับ</option>
          </select>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{filtered.length} ผู้ใช้</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-100 dark:border-slate-800">
              <tr>{['ผู้ใช้', 'Plan', 'สถานะ', 'สมัครเมื่อ', 'เข้าสู่ระบบล่าสุด', 'จัดการ'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant={u.plan === 'Plus' ? 'info' : u.plan === 'Go' ? 'success' : 'neutral'}>{u.plan}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={u.status === 'active' ? 'success' : 'danger'}>{u.status === 'active' ? 'ใช้งาน' : 'ระงับ'}</Badge></td>
                  <td className="px-4 py-3 text-xs text-slate-400">{u.joined}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{u.lastLogin}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setViewUser(u)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400" title="ดูข้อมูล"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => toggleStatus(u.id)} className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-400" title={u.status === 'active' ? 'ระงับ' : 'เปิดใช้งาน'}><UserX className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setResetId(u.id)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-400" title="Reset รหัสผ่าน"><Lock className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteId(u.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400" title="ลบ"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-400">{filtered.length} ผู้ใช้</p>
          <Pagination current={page} total={Math.max(1, Math.ceil(filtered.length / 10))} onChange={setPage} />
        </div>
      </Card>

      {viewUser && (
        <Modal open onClose={() => setViewUser(null)} title="ข้อมูลผู้ใช้">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Avatar name={viewUser.name} size="lg" />
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">{viewUser.name}</p>
                <p className="text-sm text-slate-400">{viewUser.email}</p>
                <Badge variant={viewUser.status === 'active' ? 'success' : 'danger'} className="mt-1">{viewUser.status === 'active' ? 'ใช้งาน' : 'ระงับ'}</Badge>
              </div>
            </div>
            {[['Plan', viewUser.plan], ['สมัครเมื่อ', viewUser.joined], ['เข้าสู่ระบบล่าสุด', viewUser.lastLogin]].map(([l, v]) => (
              <div key={l} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm text-slate-400">{l}</span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{v}</span>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setViewUser(null)}>ปิด</Button>
              <Button variant="danger" className="flex-1" onClick={() => { toggleStatus(viewUser.id); setViewUser(null); }}>
                {viewUser.status === 'active' ? 'ระงับบัญชี' : 'เปิดใช้งาน'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { setUsers(us => us.filter(u => u.id !== deleteId)); setDeleteId(null); }} title="ลบผู้ใช้?" description="การลบผู้ใช้จะลบข้อมูลทั้งหมดและไม่สามารถกู้คืนได้" danger />
      <ConfirmDialog open={!!resetId} onClose={() => setResetId(null)} onConfirm={() => setResetId(null)} title="Reset รหัสผ่าน?" description="ระบบจะส่งลิงก์ Reset รหัสผ่านไปยังอีเมลของผู้ใช้" />
    </div>
  );
}
