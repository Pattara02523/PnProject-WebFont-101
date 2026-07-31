'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Loader2, TrendingUp, TrendingDown, Briefcase, BarChart3, Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { DashboardApi } from '@/lib/api/admin.api';

const TYPE_LABEL: Record<string, string> = {
  STOCK: 'หุ้น', FUND: 'กองทุน', CRYPTO: 'คริปโต',
  ETF: 'ETF', BOND: 'พันธบัตร', REAL_ESTATE: 'อสังหา', OTHER: 'อื่นๆ',
};

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

const fmtB = (n: number) => `฿${n.toLocaleString('th-TH', { maximumFractionDigits: 0 })}`;
const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

export default function AnalyticsContent() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Export states
  const [exportTarget, setExportTarget] = useState<'portfolio' | 'transactions'>('portfolio');
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingCsv, setDownloadingCsv] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await DashboardApi.getSummary();
        setData(res);
      } catch (e: any) {
        setError(e?.message ?? 'โหลดข้อมูลไม่สำเร็จ');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleExport = async (format: 'pdf' | 'csv') => {
    try {
      if (format === 'pdf') setDownloadingPdf(true);
      else setDownloadingCsv(true);

      const Cookies = require('js-cookie');
      const token = Cookies.get('auth_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
      const endpoint = format === 'pdf'
        ? `${API_URL}/reports/${exportTarget}/pdf`
        : `${API_URL}/reports/${exportTarget}`;

      const response = await fetch(endpoint, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        let msg = `ดาวน์โหลดไฟล์ ${format.toUpperCase()} ไม่สำเร็จ`;
        try {
          const errBody = await response.json();
          msg = errBody.message || msg;
        } catch (_) {}
        throw new Error(msg);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportTarget}-report-${new Date().toISOString().slice(0, 10)}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err?.message ?? 'เกิดข้อผิดพลาดในการดาวน์โหลดรายงาน');
    } finally {
      setDownloadingPdf(false);
      setDownloadingCsv(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  if (error) return <div className="flex items-center justify-center h-64 text-destructive text-sm">{error}</div>;

  const summary = data?.summary ?? {};
  const allocation: { assetType: string; totalValue: number; percentage: number }[] = data?.assetAllocation ?? [];
  const recentTx: any[] = data?.recentTransactions ?? [];
  const goals = data?.goals ?? {};

  // Pie chart data
  const pieData = allocation.map((a, i) => ({
    name: TYPE_LABEL[a.assetType] ?? a.assetType,
    value: a.totalValue,
    pct: a.percentage,
    color: COLORS[i % COLORS.length],
  }));

  // Recent tx as bar chart
  const txBarData = recentTx.map(tx => ({
    name: tx.assetName ?? tx.symbol,
    amount: tx.amount,
    type: tx.type,
  }));

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header with Export Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Analytics</h2>
          <p className="text-sm text-muted-foreground mt-0.5">ภาพรวมและบทวิเคราะห์การลงทุนของคุณ</p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
          {/* Target selector */}
          <select
            value={exportTarget}
            onChange={e => setExportTarget(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
          >
            <option value="portfolio">พอร์ตการลงทุน (Portfolio)</option>
            <option value="transactions">รายการธุรกรรม (Transactions)</option>
          </select>

          {/* Export PDF */}
          <button
            onClick={() => handleExport('pdf')}
            disabled={downloadingPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all disabled:opacity-60 cursor-pointer"
          >
            {downloadingPdf ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <FileText className="size-3.5 text-red-500" />
            )}
            ส่งออก PDF
          </button>

          {/* Export CSV */}
          <button
            onClick={() => handleExport('csv')}
            disabled={downloadingCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all disabled:opacity-60 cursor-pointer"
          >
            {downloadingCsv ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <FileSpreadsheet className="size-3.5 text-emerald-500" />
            )}
            ส่งออก CSV (Excel)
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'มูลค่ารวม', value: fmtB(summary.totalPortfolioValue ?? 0),
            icon: Briefcase, color: 'text-primary', bg: 'bg-primary/10',
          },
          {
            label: 'เงินลงทุน', value: fmtB(summary.totalInvestmentAmount ?? 0),
            icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-500/10',
          },
          {
            label: 'กำไร/ขาดทุน',
            value: fmtB(summary.totalProfitLoss ?? 0),
            sub: fmtPct(summary.totalRoiPercentage ?? 0),
            icon: (summary.totalProfitLoss ?? 0) >= 0 ? TrendingUp : TrendingDown,
            color: (summary.totalProfitLoss ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-500',
            bg: (summary.totalProfitLoss ?? 0) >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10',
          },
          {
            label: 'สินทรัพย์ทั้งหมด', value: String(summary.totalAssetsCount ?? 0) + ' รายการ',
            icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-500/10',
          },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
            <div className={`size-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon className={`size-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
              {s.sub && <p className="text-xs text-muted-foreground">{s.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Asset Allocation Pie */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">สัดส่วนการลงทุน</h3>
          {pieData.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-12">ยังไม่มีข้อมูล</p>
          ) : (
            <div className="flex flex-col gap-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`฿${Number(v).toLocaleString('th-TH')}`, 'มูลค่า']} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {pieData.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="size-2.5 rounded-full" style={{ background: p.color }} />
                      <span className="text-muted-foreground">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-medium">฿{p.value.toLocaleString('th-TH', { maximumFractionDigits: 0 })}</span>
                      <span className="text-muted-foreground w-12 text-right">{p.pct.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Goals Summary */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">สรุปเป้าหมาย</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'ทั้งหมด',       value: goals.totalGoals ?? 0,    color: 'text-foreground' },
              { label: 'กำลังดำเนินการ', value: goals.inProgressGoals ?? 0, color: 'text-blue-600' },
              { label: 'สำเร็จแล้ว',    value: goals.completedGoals ?? 0, color: 'text-emerald-600' },
              { label: 'ยกเลิก',        value: goals.failedGoals ?? 0,    color: 'text-red-500' },
            ].map((g, i) => (
              <div key={i} className="rounded-xl bg-muted/30 p-3 text-center">
                <p className={`text-2xl font-bold ${g.color}`}>{g.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{g.label}</p>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>ความคืบหน้าเฉลี่ย</span>
              <span className="font-semibold text-foreground">{(goals.averageProgressPercentage ?? 0).toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${goals.averageProgressPercentage ?? 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Bar Chart */}
      {txBarData.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">ธุรกรรมล่าสุด</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={txBarData} barSize={28}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={v => `฿${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => [`฿${Number(v).toLocaleString('th-TH')}`, 'ยอดเงิน']}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} name="ยอดเงิน" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1">
            {recentTx.map((tx: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{tx.assetName} ({tx.symbol})</span>
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">฿{tx.amount.toLocaleString('th-TH', { maximumFractionDigits: 0 })}</span>
                  <span className="text-muted-foreground">{tx.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
