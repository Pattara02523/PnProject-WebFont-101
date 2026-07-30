"use client";

import { Users, CreditCard, TrendingUp, DollarSign, UserCheck, AlertCircle } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard, Card, Badge, Table, Tr, Td, Avatar } from '@/components/ui';
import { mockAdminUsers, mockAdminPayments, formatCurrency } from '@/lib/mock-data';

const revenueData = [
  { month: 'ม.ค.', revenue: 12500 }, { month: 'ก.พ.', revenue: 18900 }, { month: 'มี.ค.', revenue: 15200 },
  { month: 'เม.ย.', revenue: 22400 }, { month: 'พ.ค.', revenue: 31000 }, { month: 'มิ.ย.', revenue: 28700 },
];

const subData = [
  { plan: 'Free', count: 4200 }, { plan: 'Basic', count: 2800 }, { plan: 'Go', count: 3900 }, { plan: 'Plus', count: 1100 },
];

const statusConfig: Record<string, { label: string; variant: any }> = {
  pending: { label: 'รอตรวจสอบ', variant: 'warning' },
  approved: { label: 'อนุมัติ', variant: 'success' },
  rejected: { label: 'ปฏิเสธ', variant: 'danger' },
};

export default function AdminDashboardContent() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">ยินดีต้อนรับ, Admin 👋</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">ภาพรวมระบบ InvestPro วันนี้</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="ผู้ใช้ทั้งหมด" value="12,047" change="+142" positive icon={<Users className="w-5 h-5" />} color="blue" />
        <StatCard title="รายได้เดือนนี้" value="฿128,450" change="+18.4%" positive icon={<DollarSign className="w-5 h-5" />} color="emerald" />
        <StatCard title="Subscription ที่ใช้งาน" value="7,800" change="+5.2%" positive icon={<UserCheck className="w-5 h-5" />} color="purple" />
        <StatCard title="รอตรวจสอบ" value="3" change="Payment" icon={<AlertCircle className="w-5 h-5" />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-4">รายได้รายเดือน</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `฿${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => [formatCurrency(Number(v || 0)), 'รายได้']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-4">Subscription แยก Plan</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={subData} layout="vertical" barSize={16}>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="plan" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} name="ผู้ใช้" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">ผู้ใช้ล่าสุด</h3>
          </div>
          <Table headers={['ผู้ใช้', 'Plan', 'สถานะ', 'เข้าสู่ระบบล่าสุด']}>
            {mockAdminUsers.slice(0, 5).map(u => (
              <Tr key={u.id}>
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar name={u.name} size="sm" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                </Td>
                <Td><Badge variant="neutral">{u.plan}</Badge></Td>
                <Td><Badge variant={u.status === 'active' ? 'success' : 'danger'}>{u.status === 'active' ? 'ใช้งาน' : 'ระงับ'}</Badge></Td>
                <Td className="text-xs text-slate-400">{u.lastLogin}</Td>
              </Tr>
            ))}
          </Table>
        </Card>

        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">การชำระเงินล่าสุด</h3>
          </div>
          <Table headers={['ผู้ใช้', 'Plan', 'ยอด', 'สถานะ']}>
            {mockAdminPayments.map(p => (
              <Tr key={p.id}>
                <Td>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{p.user}</p>
                  <p className="text-xs text-slate-400">{p.date}</p>
                </Td>
                <Td><Badge variant="neutral">{p.plan}</Badge></Td>
                <Td className="text-xs font-semibold text-emerald-600">฿{p.amount}</Td>
                <Td><Badge variant={statusConfig[p.status]?.variant}>{statusConfig[p.status]?.label}</Badge></Td>
              </Tr>
            ))}
          </Table>
        </Card>
      </div>
    </div>
  );
}
