"use client";

import { useEffect, useState } from 'react';
import { Users, UserCheck, Briefcase, TrendingUp, ArrowLeftRight, Megaphone, Loader2 } from 'lucide-react';
import { StatCard, Card, Badge, Table, Tr, Td, Avatar } from '@/components/ui';
import { AdminApi, AdminDashboard, AdminUser } from '@/lib/api/admin.api';

export default function AdminDashboardContent() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [dash, usersRes] = await Promise.all([
          AdminApi.getDashboard(),
          AdminApi.getUsers({ limit: '5', page: '1' }),
        ]);
        setDashboard(dash);
        setUsers(usersRes.data ?? []);
      } catch (e: any) {
        setError(e?.message ?? 'โหลดข้อมูลไม่สำเร็จ');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-foreground">ยินดีต้อนรับ, Admin 👋</h2>
        <p className="text-sm text-muted-foreground mt-0.5">ภาพรวมระบบ InvestPro</p>
      </div>

      {/* Stats Cards */}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Announcement summary card */}
        <Card className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Megaphone className="size-4 text-violet-500" />
            <h3 className="font-semibold text-sm text-foreground">ประกาศ</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/40 p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{dashboard?.announcements?.total ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-0.5">ทั้งหมด</p>
            </div>
            <div className="rounded-xl bg-violet-500/10 p-3 text-center">
              <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{dashboard?.announcements?.published ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-0.5">เผยแพร่แล้ว</p>
            </div>
          </div>
        </Card>

        {/* Users table */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-sm text-foreground">ผู้ใช้งานล่าสุด</h3>
          </div>
          {users.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">ไม่มีข้อมูล</p>
          ) : (
            <Table headers={['ผู้ใช้', 'Role', 'สถานะ', 'สร้างเมื่อ']}>
              {users.map(u => {
                const name = `${u.firstname} ${u.lastname}`.trim() || u.email;
                const createdAt = new Date(u.createdAt).toLocaleDateString('th-TH', {
                  day: '2-digit', month: 'short', year: '2-digit',
                });
                return (
                  <Tr key={u.id}>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Avatar name={name} size="sm" />
                        <div>
                          <p className="text-xs font-semibold text-foreground">{name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
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
                    <Td className="text-xs text-muted-foreground">{createdAt}</Td>
                  </Tr>
                );
              })}
            </Table>
          )}
        </Card>

      </div>
    </div>
  );
}
