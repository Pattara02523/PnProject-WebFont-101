/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 77 / Flow ขั้นตอนที่ 77]
 * ชื่อไฟล์: AdminActivityLogsContent.tsx
 * หน้าที่หลัก: Component แสดงประวัติกิจกรรมการใช้งานระบบ Audit Logs (Activity Logs)
 * รับอะไรมาจากไหน (Input): ข้อมูลจาก `adminApi.getActivityLogs()`
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render ตาราง Audit Logs ของระบบ
 * ==========================================
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, LogIn, LogOut, UserPlus, Database, Edit, Trash2, Settings, Loader2, Globe } from 'lucide-react';
import { Card, Badge, Pagination } from '@/components/ui';
import { AdminApi, ActivityLog } from '@/lib/api/admin.api';

const ACTION_CONFIG: Record<string, { icon: any; label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  LOGIN: { icon: LogIn, label: 'เข้าสู่ระบบ', variant: 'info' },
  LOGOUT: { icon: LogOut, label: 'ออกจากระบบ', variant: 'neutral' },
  REGISTER: { icon: UserPlus, label: 'สมัครสมาชิก', variant: 'success' },
  CREATE: { icon: Database, label: 'สร้างข้อมูล', variant: 'success' },
  UPDATE: { icon: Edit, label: 'แก้ไขข้อมูล', variant: 'warning' },
  DELETE: { icon: Trash2, label: 'ลบข้อมูล', variant: 'danger' },
};

export default function AdminActivityLogsContent() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState<{ total: number; page: number; limit: number; totalPages: number }>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [page, setPage] = useState(1);

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {
        page: String(page),
        limit: '10',
      };
      if (filterAction !== 'all') {
        params.action = filterAction;
      }

      const res = await AdminApi.getActivityLogs(params);
      let data = res.data ?? [];

      // Filter locally by search term if provided
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        data = data.filter((l) => {
          const userName = `${l.user?.firstname ?? ''} ${l.user?.lastname ?? ''} ${l.user?.email ?? ''}`.toLowerCase();
          const desc = (l.description ?? '').toLowerCase();
          const ip = (l.ipAddress ?? '').toLowerCase();
          return userName.includes(q) || desc.includes(q) || ip.includes(q);
        });
      }

      setLogs(data);
      setPagination(res.pagination ?? { total: data.length, page, limit: 10, totalPages: Math.ceil(data.length / 10) });
    } catch (e: any) {
      setError(e?.message ?? 'โหลดบันทึกกิจกรรมไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, [page, filterAction, search]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  if (loading && logs.length === 0) {
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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="ค้นหาชื่อผู้ใช้ / กิจกรรม / IP..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />
          </div>
          <select
            value={filterAction}
            onChange={(e) => {
              setFilterAction(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            <option value="all">กิจกรรมทั้งหมด</option>
            <option value="LOGIN">เข้าสู่ระบบ (LOGIN)</option>
            <option value="LOGOUT">ออกจากระบบ (LOGOUT)</option>
            <option value="REGISTER">สมัครสมาชิก (REGISTER)</option>
            <option value="CREATE">สร้างข้อมูล (CREATE)</option>
            <option value="UPDATE">แก้ไขข้อมูล (UPDATE)</option>
            <option value="DELETE">ลบข้อมูล (DELETE)</option>
          </select>
        </div>
        <p className="text-sm text-muted-foreground font-medium">{pagination.total} รายการ</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      {/* Activity Logs Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                {['ประเภท', 'ผู้ใช้งาน', 'รายละเอียด', 'IP Address', 'เวลา'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                    ไม่พบบันทึกกิจกรรม
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const cfg = ACTION_CONFIG[log.action] ?? { icon: Settings, label: log.action, variant: 'neutral' as const };
                  const Icon = cfg.icon;
                  const fullName = log.user
                    ? `${log.user.firstname} ${log.user.lastname}`.trim() || log.user.email
                    : 'System / Guest';

                  const createdAtFormatted = log.createdAt
                    ? new Date(log.createdAt).toLocaleString('th-TH', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })
                    : '-';

                  return (
                    <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-muted shrink-0 text-foreground">
                            <Icon className="size-3.5" />
                          </div>
                          <Badge variant={cfg.variant}>{cfg.label}</Badge>
                        </div>
                      </td>

                      {/* แสดงชื่อ-นามสกุล และ อีเมลจริง ของผู้ใช้ */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {log.user ? (
                          <div>
                            <p className="text-xs font-semibold text-foreground">{fullName}</p>
                            <p className="text-[10px] text-muted-foreground">{log.user.email}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">System / Guest</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                        {log.description || `${log.action} in ${log.module}`}
                      </td>

                      {/* IP Address แสดงจริงตามที่เก็บได้ใน DB */}
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground whitespace-nowrap">
                        {log.ipAddress ? (
                          <span className="inline-flex items-center gap-1">
                            <Globe className="size-3 text-muted-foreground/60" />
                            {log.ipAddress}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/50">-</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{createdAtFormatted}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{pagination.total} รายการ (แสดง 10 รายการต่อหน้า)</p>
          <Pagination current={page} total={Math.max(1, pagination.totalPages)} onChange={setPage} />
        </div>
      </Card>
    </div>
  );
}
