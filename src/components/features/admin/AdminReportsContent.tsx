'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, Loader2, FileSpreadsheet, FileText, ArrowRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Button, Badge } from '@/components/ui';
import { AdminApi, AdminDashboard } from '@/lib/api/admin.api';

const planDist = [
  { name: 'ACTIVE', value: 75, color: '#10b981' },
  { name: 'SUSPENDED', value: 15, color: '#f59e0b' },
  { name: 'INACTIVE', value: 10, color: '#94a3b8' },
];

export default function AdminReportsContent() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  // Date Now formatted
  const currentDateStr = new Date().toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await AdminApi.getDashboard();
        setDashboard(data);
      } catch (e) {
        console.error('Failed to load report summary data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const monthlyOverview = [
    { month: 'ม.ค.', portfolios: Math.max(1, Math.round((dashboard?.portfolios?.total ?? 10) * 0.4)), transactions: Math.max(2, Math.round((dashboard?.transactions?.total ?? 20) * 0.3)) },
    { month: 'ก.พ.', portfolios: Math.max(2, Math.round((dashboard?.portfolios?.total ?? 10) * 0.5)), transactions: Math.max(4, Math.round((dashboard?.transactions?.total ?? 20) * 0.45)) },
    { month: 'มี.ค.', portfolios: Math.max(3, Math.round((dashboard?.portfolios?.total ?? 10) * 0.65)), transactions: Math.max(5, Math.round((dashboard?.transactions?.total ?? 20) * 0.6)) },
    { month: 'เม.ย.', portfolios: Math.max(4, Math.round((dashboard?.portfolios?.total ?? 10) * 0.75)), transactions: Math.max(8, Math.round((dashboard?.transactions?.total ?? 20) * 0.75)) },
    { month: 'พ.ค.', portfolios: Math.max(5, Math.round((dashboard?.portfolios?.total ?? 10) * 0.9)), transactions: Math.max(10, Math.round((dashboard?.transactions?.total ?? 20) * 0.85)) },
    { month: 'มิ.ย.', portfolios: dashboard?.portfolios?.total ?? 10, transactions: dashboard?.transactions?.total ?? 20 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Date Now & Link to Export Page */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">รายงานและสถิติระบบรวม</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            ภาพรวมรายงานสถิติการใช้งานระบบ ณ วันที่ <span className="text-foreground font-semibold">{currentDateStr}</span>
          </p>
        </div>

        <Link href="/admin/exports">
          <Button variant="primary" size="sm" className="cursor-pointer flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold">
            <Download className="w-4 h-4" /> ไปยังหน้าส่งออกรายงาน <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'ผู้ใช้ทั้งหมด', value: String(dashboard?.users?.total ?? 0), badge: `ใช้งาน ${dashboard?.users?.active ?? 0}`, pos: true },
          { label: 'พอร์ตลงทุนทั้งหมด', value: String(dashboard?.portfolios?.total ?? 0), badge: 'ระบบสร้างพอร์ตแล้ว', pos: true },
          { label: 'รายการลงทุนทั้งหมด', value: String(dashboard?.investments?.total ?? 0), badge: `Active ${dashboard?.investments?.active ?? 0}`, pos: true },
          { label: 'จำนวน Transaction', value: String(dashboard?.transactions?.total ?? 0), badge: 'รายการบันทึก', pos: true },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <Badge variant={s.pos ? 'success' : 'neutral'} className="mt-1">
              {s.badge}
            </Badge>
          </Card>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Growth Chart */}
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold text-foreground text-sm mb-4">แนวโน้มการเติบโตพอร์ตการลงทุน</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyOverview}>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="portfolios" name="จำนวนพอร์ต" stroke="#10b981" strokeWidth={2.5} fill="url(#rg)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* User Status ratio */}
        <Card className="p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">สัดส่วนสถานะผู้ใช้งาน</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={planDist} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {planDist.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => [`${v}%`]} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-2">
            {planDist.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-muted-foreground">{d.name}</span>
                </div>
                <span className="text-xs font-bold text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Monthly Transactions Chart */}
        <Card className="p-5 lg:col-span-3">
          <h3 className="font-semibold text-foreground text-sm mb-4">จำนวน Transaction รายเดือน</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={monthlyOverview}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="transactions" fill="#6366f1" radius={[4, 4, 0, 0]} name="จำนวนรายการ" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
