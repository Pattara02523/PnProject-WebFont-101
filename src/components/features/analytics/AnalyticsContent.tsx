"use client";

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Download } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, Button, Tabs, Badge } from '@/components/ui/index';
import { mockPortfolioGrowth, mockMonthlyInvestment, mockAllocation, formatCurrency } from '@/lib/mock-data';

const roiData = [
  { month: 'ม.ค.', roi: 2.1 }, { month: 'ก.พ.', roi: 5.8 }, { month: 'มี.ค.', roi: 3.2 },
  { month: 'เม.ย.', roi: -1.5 }, { month: 'พ.ค.', roi: 8.4 }, { month: 'มิ.ย.', roi: 6.7 },
  { month: 'ก.ค.', roi: 10.2 }, { month: 'ส.ค.', roi: 9.1 }, { month: 'ก.ย.', roi: 11.5 },
  { month: 'ต.ค.', roi: 8.9 }, { month: 'พ.ย.', roi: 12.3 }, { month: 'ธ.ค.', roi: 10.15 },
];

const assetPerf = [
  { name: 'PTTGC', roi: 19.47, value: 78250 },
  { name: 'KBANK', roi: 12.68, value: 77750 },
  { name: 'AAPL', roi: 12.91, value: 10275 },
  { name: 'SPY', roi: 13.78, value: 10240 },
  { name: 'BTC', roi: -8.33, value: 165000 },
  { name: 'ETH', roi: -10.53, value: 42500 },
];

export default function AnalyticsContent() {
  const [period, setPeriod] = useState('12m');
  const [view, setView] = useState('portfolio');

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Tabs
          tabs={[{ label: 'Portfolio', value: 'portfolio' }, { label: 'ROI', value: 'roi' }, { label: 'Allocation', value: 'allocation' }, { label: 'Performance', value: 'perf' }]}
          active={view}
          onChange={setView}
        />
        <div className="flex gap-2">
          {['3m', '6m', '12m', 'YTD'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${period === p ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>{p}</button>
          ))}
          <Button variant="outline" size="sm"><Download className="w-4 h-4" /> Export</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'มูลค่ารวม', value: '฿1,465,000', change: '+8.2%', positive: true },
          { label: 'กำไรสุทธิ', value: '฿135,000', change: '+10.2%', positive: true },
          { label: 'ROI ปีนี้', value: '+10.15%', change: '+2.1%', positive: true },
          { label: 'ขาดทุนสูงสุด', value: '-฿55,000', change: 'คริปโต', positive: false },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{s.value}</p>
            <div className="flex items-center gap-1 mt-0.5">
              {s.positive ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
              <span className={`text-xs font-medium ${s.positive ? 'text-emerald-600' : 'text-red-500'}`}>{s.change}</span>
            </div>
          </Card>
        ))}
      </div>

      {view === 'portfolio' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Portfolio Growth</h3>
                <p className="text-xs text-slate-400">มูลค่าพอร์ตตามเวลา</p>
              </div>
              <Badge variant="success">+109.28%</Badge>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={mockPortfolioGrowth}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any) => [formatCurrency(Number(v || 0)), 'มูลค่า']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} fill="url(#g1)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-4">Asset Allocation</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={mockAllocation} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {mockAllocation.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [`${v}%`]} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 mt-3">
              {mockAllocation.map(a => (
                <div key={a.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                    <span className="text-xs text-slate-600 dark:text-slate-400">{a.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{a.value}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 lg:col-span-3">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-4">รายได้และกำไรรายเดือน</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={mockMonthlyInvestment} barGap={4}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any) => [formatCurrency(Number(v || 0)), '']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="invested" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="ลงทุน" />
                <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="กำไร" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {view === 'roi' && (
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-4">ROI รายเดือน (%)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={roiData}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v: any) => [`${v}%`, 'ROI']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Line type="monotone" dataKey="roi" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {view === 'allocation' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-4">สัดส่วนสินทรัพย์</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={mockAllocation} cx="50%" cy="50%" outerRadius={110} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                  {mockAllocation.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [`${v}%`]} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-4">รายละเอียดสัดส่วน</h3>
            <div className="flex flex-col gap-4">
              {mockAllocation.map(a => (
                <div key={a.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }} />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{a.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{a.value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${a.value}%`, backgroundColor: a.color }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {view === 'perf' && (
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-4">Performance แต่ละสินทรัพย์</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-100 dark:border-slate-800">
                <tr>{['สินทรัพย์', 'ROI', 'มูลค่า', 'สถานะ'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>)}</tr>
              </thead>
              <tbody>
                {assetPerf.sort((a, b) => b.roi - a.roi).map(a => (
                  <tr key={a.name} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{a.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {a.roi >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                        <span className={`text-sm font-bold ${a.roi >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{a.roi >= 0 ? '+' : ''}{a.roi.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatCurrency(a.value)}</td>
                    <td className="px-4 py-3"><Badge variant={a.roi >= 0 ? 'success' : 'danger'}>{a.roi >= 0 ? 'กำไร' : 'ขาดทุน'}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
