'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/AuthContext';
import { PortfolioApi } from '@/lib/api/portfolio.api';
import { InvestmentApi } from '@/lib/api/investment.api';
import { GoalApi } from '@/lib/api/goal.api';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Briefcase,
  BarChart3,
  Download,
  Target,
  ArrowUpRight,
  Sparkles,
  PieChart,
} from 'lucide-react';

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 2 }).format(v);

const typeColors: Record<string, string> = {
  STOCK: '#10b981',
  ETF: '#3b82f6',
  FUND: '#6366f1',
  CRYPTO: '#f59e0b',
  GOLD: '#eab308',
  BOND: '#8b5cf6',
};

const typeNames: Record<string, string> = {
  STOCK: 'หุ้น',
  ETF: 'ETF',
  FUND: 'กองทุน',
  CRYPTO: 'คริปโต',
  GOLD: 'ทองคำ',
  BOND: 'ตราสารหนี้',
};

export default function DashboardContent() {
  const { user } = useAuth();

  // Fetch portfolios
  const { data: portfolios = [] } = useQuery({
    queryKey: ['portfolios'],
    queryFn: () => PortfolioApi.findAll(),
    retry: false,
  });

  // Fetch investments
  const { data: investments = [] } = useQuery({
    queryKey: ['investments'],
    queryFn: () => InvestmentApi.findAll(),
    retry: false,
  });

  // Fetch goals
  const { data: goals = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: () => GoalApi.findAll(),
    retry: false,
  });

  // Real metric calculations directly from API data
  const dTotalValue = investments.reduce(
    (sum, inv) => sum + Number(inv.currentPrice || 0) * Number(inv.quantity || 0),
    0
  );

  const dTotalInvested = investments.reduce(
    (sum, inv) => sum + Number(inv.purchasePrice || 0) * Number(inv.quantity || 0),
    0
  );

  const dProfit = dTotalValue - dTotalInvested;

  const dRoi = dTotalInvested > 0 ? (dProfit / dTotalInvested) * 100 : 0;

  const dLoss = investments
    .filter((inv) => Number(inv.currentPrice) < Number(inv.purchasePrice))
    .reduce(
      (sum, inv) =>
        sum + (Number(inv.purchasePrice) - Number(inv.currentPrice)) * Number(inv.quantity),
      0
    );

  const dAssetsCount = investments.length;
  const dPortfoliosCount = portfolios.length;
  const dGoalsCount = goals.length;
  const completedGoalsCount = goals.filter((g) => g.status === 'COMPLETED').length;

  const userInitials = user
    ? `${user.firstname?.[0] ?? ''}${user.lastname?.[0] ?? ''}`.toUpperCase() || 'U'
    : 'U';

  const userFullName = user
    ? `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim() || user.email
    : 'ผู้ใช้งาน';

  // Dynamic Asset Allocation calculation
  const assetAllocation = useMemo(() => {
    if (dTotalValue === 0) return [];
    const grouped: Record<string, number> = {};
    investments.forEach((inv) => {
      const val = Number(inv.currentPrice || 0) * Number(inv.quantity || 0);
      grouped[inv.assetType] = (grouped[inv.assetType] || 0) + val;
    });
    return Object.entries(grouped).map(([type, val]) => ({
      name: typeNames[type] || type,
      value: Math.round((val / dTotalValue) * 100 * 10) / 10,
      color: typeColors[type] || '#64748b',
    }));
  }, [investments, dTotalValue]);

  // Donut chart stroke calculations
  let currentOffset = 25;
  const donutSlices = assetAllocation.map((item) => {
    const dashArray = `${item.value} ${100 - item.value}`;
    const dashOffset = currentOffset;
    currentOffset = (currentOffset - item.value + 100) % 100;
    return { ...item, dashArray, dashOffset };
  });

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner Card */}
      <section className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        {/* Glow vector backdrops */}
        <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 size-36 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: User Welcome info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="size-16 rounded-full border-2 border-white/20 bg-white/15 backdrop-blur-sm grid place-items-center text-2xl font-bold font-sans">
              {userInitials}
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  ยินดีต้อนรับกลับ {userFullName}
                </h1>
                <span className="text-2xl animate-bounce origin-bottom">
                  👋
                </span>
              </div>
              <p className="text-sm text-emerald-50/90 font-medium mt-1">
                {user?.role === 'ADMIN' ? 'Administrator' : 'Member'} <span className="mx-1.5">•</span> อัปเดตข้อมูลแบบเรียลไทม์
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/investment">
              <button className="h-10 px-4 rounded-xl text-xs font-semibold bg-white text-emerald-700 hover:bg-emerald-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98]">
                <Plus className="size-4" />
                เพิ่มการลงทุน
              </button>
            </Link>

            <Link href="/portfolio">
              <button className="h-10 px-4 rounded-xl text-xs font-semibold border border-white/30 bg-white/10 hover:bg-white/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]">
                <Briefcase className="size-4" />
                สร้าง Portfolio
              </button>
            </Link>

            <Link href="/analytics">
              <button className="h-10 px-4 rounded-xl text-xs font-semibold border border-white/30 bg-white/10 hover:bg-white/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]">
                <BarChart3 className="size-4" />
                Analytics
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Quick Action / Goal Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: 'สร้าง Portfolio แรก',
            desc: 'จัดกลุ่มสินทรัพย์ของคุณแยกตามเป้าหมาย',
            actionText: 'สร้าง Portfolio →',
            color:
              'from-pink-500/10 to-rose-500/10 hover:border-rose-500/30 text-rose-500 dark:text-rose-400',
            bgIcon: 'bg-rose-500/10 text-rose-500',
            icon: <Briefcase className="size-5" />,
            link: '/portfolio',
          },
          {
            title: 'เพิ่มการลงทุน',
            desc: 'บันทึกประวัติการซื้อหุ้น กองทุน และคริปโต',
            actionText: 'เพิ่ม Investment →',
            color:
              'from-amber-500/10 to-orange-500/10 hover:border-orange-500/30 text-orange-500 dark:text-orange-400',
            bgIcon: 'bg-orange-500/10 text-orange-500',
            icon: <Plus className="size-5" />,
            link: '/investment',
          },
          {
            title: 'ตั้งเป้าหมายการเงิน',
            desc: 'วางแผนเกษียณ ซื้อบ้าน หรือเป้าหมายระยะยาว',
            actionText: 'สร้างเป้าหมาย →',
            color:
              'from-indigo-500/10 to-blue-500/10 hover:border-blue-500/30 text-blue-500 dark:text-blue-400',
            bgIcon: 'bg-blue-500/10 text-blue-500',
            icon: <Target className="size-5" />,
            link: '/goal',
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl border border-border/60 bg-gradient-to-br ${card.color} hover:shadow-sm transition-all duration-300 flex flex-col justify-between h-40 group`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-base">
                  {card.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {card.desc}
                </p>
              </div>
              <div
                className={`size-9 rounded-xl flex items-center justify-center ${card.bgIcon}`}
              >
                {card.icon}
              </div>
            </div>
            <Link
              href={card.link}
              className="text-xs font-bold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              {card.actionText}
            </Link>
          </div>
        ))}
      </section>

      {/* 3. Metric Cards Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'มูลค่าพอร์ตรวม',
            value: formatCurrency(dTotalValue),
            change: dTotalInvested > 0 ? `${dRoi >= 0 ? '+' : ''}${dRoi.toFixed(1)}%` : '0%',
            isPositive: dRoi >= 0,
            bgIcon: 'bg-emerald-500/10 text-emerald-500',
            icon: <TrendingUp className="size-4" />,
          },
          {
            title: 'เงินลงทุนทั้งหมด',
            value: formatCurrency(dTotalInvested),
            change: `${dAssetsCount} สินทรัพย์`,
            isPositive: true,
            bgIcon: 'bg-blue-500/10 text-blue-500',
            icon: <Briefcase className="size-4" />,
          },
          {
            title: 'กำไรสุทธิ',
            value: formatCurrency(dProfit),
            change: `${dRoi >= 0 ? '+' : ''}${dRoi.toFixed(1)}%`,
            isPositive: dProfit >= 0,
            bgIcon: 'bg-violet-500/10 text-violet-500',
            icon: <Sparkles className="size-4" />,
          },
          {
            title: 'ROI รวม',
            value: `${dRoi >= 0 ? '+' : ''}${dRoi.toFixed(2)}%`,
            change: dRoi >= 0 ? 'กำไร' : 'ขาดทุน',
            isPositive: dRoi >= 0,
            bgIcon: 'bg-amber-500/10 text-amber-500',
            icon: <TrendingUp className="size-4" />,
          },
          {
            title: 'ขาดทุน (ยังไม่ realise)',
            value: formatCurrency(dLoss),
            change: dLoss > 0 ? 'ขาดทุนสะสม' : 'ไม่มี',
            isPositive: dLoss === 0,
            bgIcon: 'bg-rose-500/10 text-rose-500',
            icon: <TrendingDown className="size-4" />,
          },
          {
            title: 'จำนวนรายการสินทรัพย์',
            value: `${dAssetsCount} รายการ`,
            change: 'สินทรัพย์จริง',
            isPositive: null,
            bgIcon: 'bg-sky-500/10 text-sky-500',
            icon: <Plus className="size-4" />,
          },
          {
            title: 'จำนวน Portfolio',
            value: `${dPortfoliosCount} พอร์ต`,
            change: 'พอร์ตลงทุนของคุณ',
            isPositive: null,
            bgIcon: 'bg-indigo-500/10 text-indigo-500',
            icon: <Briefcase className="size-4" />,
          },
          {
            title: 'เป้าหมายทั้งหมด',
            value: `${dGoalsCount} เป้าหมาย`,
            change: `สำเร็จแล้ว ${completedGoalsCount} เป้าหมาย`,
            isPositive: null,
            bgIcon: 'bg-teal-500/10 text-teal-500',
            icon: <Target className="size-4" />,
          },
        ].map((metric, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-muted-foreground truncate">
                {metric.title}
              </span>
              <div
                className={`size-8 rounded-xl flex items-center justify-center shrink-0 ${metric.bgIcon}`}
              >
                {metric.icon}
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {metric.value}
              </h3>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold select-none">
                {metric.isPositive === true && (
                  <span className="text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {metric.change}
                  </span>
                )}
                {metric.isPositive === false && (
                  <span className="text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">
                    {metric.change}
                  </span>
                )}
                {metric.isPositive === null && (
                  <span className="text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-normal">
                    {metric.change}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 4. Charts Grid (Line Chart & Donut Chart) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Line Chart (2/3 width) */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-border/60 bg-card/65 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-foreground text-base">
                การเติบโตของพอร์ต (Portfolio Growth)
              </h3>
              <p className="text-xs text-muted-foreground">
                ผลประกอบการสะสมตามพอร์ตโฟลิโอของคุณ
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <ArrowUpRight className="size-3.5" />
                {dRoi >= 0 ? '+' : ''}{dRoi.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="h-60 relative w-full pt-4">
            {/* Grid Y-Lines */}
            <div className="absolute inset-y-0 inset-x-2 flex flex-col justify-between pointer-events-none opacity-40">
              <span className="w-full h-px border-t border-dashed border-border" />
              <span className="w-full h-px border-t border-dashed border-border" />
              <span className="w-full h-px border-t border-dashed border-border" />
              <span className="w-full h-px border-t border-dashed border-border" />
            </div>

            {/* Line Chart Draw */}
            <svg
              className="w-full h-full"
              viewBox="0 0 600 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Area path */}
              <path
                d="M0,170 C50,150 100,160 150,130 C200,110 250,120 300,90 C350,80 400,90 450,60 C500,50 550,55 600,45 L600,200 L0,200 Z"
                fill="url(#chartGradient)"
              />

              {/* Stroke line path */}
              <path
                d="M0,170 C50,150 100,160 150,130 C200,110 250,120 300,90 C350,80 400,90 450,60 C500,50 550,55 600,45"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="drop-shadow-[0_4px_8px_rgba(16,185,129,0.3)]"
              />

              {/* Dots */}
              <circle cx="150" cy="130" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="300" cy="90" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="450" cy="60" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="600" cy="45" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>

          {/* X-axis months */}
          <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground font-semibold select-none border-t border-border pt-3">
            <span>ม.ค.</span>
            <span>มี.ค.</span>
            <span>พ.ค.</span>
            <span>ก.ค.</span>
            <span>ก.ย.</span>
            <span>พ.ย.</span>
            <span>ธ.ค.</span>
          </div>
        </div>

        {/* Right: Donut Chart (1/3 width) */}
        <div className="p-5 rounded-2xl border border-border/60 bg-card/65 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-foreground text-base">
              สัดส่วนสินทรัพย์ (Asset Allocation)
            </h3>
            <p className="text-xs text-muted-foreground">
              สัดส่วนตามประเภทของสินทรัพย์การลงทุนจริง
            </p>
          </div>

          {/* Dynamic Donut Chart wrapper */}
          <div className="flex items-center justify-center py-4 relative">
            {assetAllocation.length === 0 ? (
              <div className="size-40 rounded-full border-4 border-slate-200 dark:border-slate-800 flex items-center justify-center">
                <span className="text-xs text-muted-foreground text-center px-4">
                  ไม่มีข้อมูลสินทรัพย์
                </span>
              </div>
            ) : (
              <svg className="size-40" viewBox="0 0 36 36">
                {donutSlices.map((slice, idx) => (
                  <circle
                    key={idx}
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth="3"
                    strokeDasharray={slice.dashArray}
                    strokeDashoffset={slice.dashOffset}
                  />
                ))}
              </svg>
            )}

            {/* Center label inside donut */}
            <div className="absolute flex flex-col items-center select-none pointer-events-none">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                มูลค่าพอร์ต
              </span>
              <span className="text-xs font-extrabold text-foreground">
                {formatCurrency(dTotalValue)}
              </span>
            </div>
          </div>

          {/* Legends list */}
          <div className="space-y-2 mt-4">
            {assetAllocation.length === 0 ? (
              <p className="text-xs text-slate-400 text-center">เพิ่มสินทรัพย์เพื่อเริ่มติดตามสัดส่วน</p>
            ) : (
              assetAllocation.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="size-3 rounded"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-muted-foreground font-medium">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-foreground">{item.value}%</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
