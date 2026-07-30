"use client";

import { useState } from 'react';
import { Search, LogIn, CreditCard, UserPlus, Settings, Shield, Database } from 'lucide-react';
import { Card, Badge, Pagination } from '@/components/ui';
import { mockActivityLogs } from '@/lib/mock-data';

const actionConfig: Record<string, { icon: any; label: string; variant: any; color: string }> = {
  login: { icon: LogIn, label: 'เข้าสู่ระบบ', variant: 'neutral', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  register: { icon: UserPlus, label: 'สมัครสมาชิก', variant: 'success', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
  payment: { icon: CreditCard, label: 'การชำระเงิน', variant: 'info', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
  crud: { icon: Database, label: 'CRUD', variant: 'neutral', color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' },
  admin: { icon: Shield, label: 'Admin Action', variant: 'warning', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
};

export default function AdminActivityLogsContent() {
  const [logs] = useState(mockActivityLogs);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = logs.filter(l => {
    const matchSearch = l.user.toLowerCase().includes(search.toLowerCase()) || l.description.toLowerCase().includes(search.toLowerCase());
    const matchAction = filterAction === 'all' || l.action === filterAction;
    return matchSearch && matchAction;
  });

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหา..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <select value={filterAction} onChange={e => setFilterAction(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="all">ทั้งหมด</option>
            <option value="login">Login</option>
            <option value="register">Register</option>
            <option value="payment">Payment</option>
            <option value="crud">CRUD</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-100 dark:border-slate-800">
              <tr>{['ประเภท', 'ผู้ใช้', 'รายละเอียด', 'IP', 'เวลา'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map(log => {
                const config = actionConfig[log.action];
                const Icon = config?.icon || Settings;
                return (
                  <tr key={log.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${config?.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <Badge variant={config?.variant}>{config?.label}</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">{log.user}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{log.description}</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-400">{log.ip}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{log.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-400">{filtered.length} รายการ</p>
          <Pagination current={page} total={Math.max(1, Math.ceil(filtered.length / 10))} onChange={setPage} />
        </div>
      </Card>
    </div>
  );
}
