"use client";

import { Download } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Button, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/mock-data';

const monthlyRevenue = [
  { month: 'ม.ค.', revenue: 12500, users: 320 },
  { month: 'ก.พ.', revenue: 18900, users: 410 },
  { month: 'มี.ค.', revenue: 15200, users: 380 },
  { month: 'เม.ย.', revenue: 22400, users: 520 },
  { month: 'พ.ค.', revenue: 31000, users: 680 },
  { month: 'มิ.ย.', revenue: 28700, users: 620 },
];

const planDist = [
  { name: 'Free', value: 35, color: '#94a3b8' },
  { name: 'Basic', value: 23, color: '#6366f1' },
  { name: 'Go', value: 32, color: '#10b981' },
  { name: 'Plus', value: 10, color: '#f59e0b' },
];

export default function AdminReportsContent() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">ข้อมูล ณ วันที่ 10 ก.ค. 2025</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="w-4 h-4" /> PDF</Button>
          <Button variant="outline" size="sm"><Download className="w-4 h-4" /> Excel</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'รายได้รวม (YTD)', value: '฿128,700', badge: '+32%', pos: true },
          { label: 'ผู้ใช้ใหม่ (เดือนนี้)', value: '142', badge: '+18%', pos: true },
          { label: 'Churn Rate', value: '2.1%', badge: '-0.3%', pos: true },
          { label: 'ARPU', value: '฿107', badge: '+5%', pos: true },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{s.value}</p>
            <Badge variant={s.pos ? 'success' : 'danger'} className="mt-1">{s.badge}</Badge>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-4">รายได้รายเดือน</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `฿${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => [formatCurrency(Number(v || 0)), 'รายได้']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#rg)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-4">สัดส่วน Plan</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={planDist} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {planDist.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [`${v}%`]} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-2">
            {planDist.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-slate-600 dark:text-slate-400">{d.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-3">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-4">ผู้ใช้ใหม่รายเดือน</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={monthlyRevenue}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="users" fill="#6366f1" radius={[4, 4, 0, 0]} name="ผู้ใช้ใหม่" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
