/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 46 / Flow ขั้นตอนที่ 46]
 * ชื่อไฟล์: PortfolioDetailContent.tsx
 * หน้าที่หลัก: Component แสดงรายละเอียดพอร์ตเฉพาะ ID สรุปรายสินทรัพย์ที่สังกัดพอร์ตนี้
 * รับอะไรมาจากไหน (Input): portfolioId จาก URL Param
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render รายละเอียดเจาะลึกของพอร์ตการลงทุน
 * ==========================================
 */

"use client";

import React from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Briefcase, Loader2 } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { PortfolioApi } from '@/lib/api/portfolio.api';
import { InvestmentApi, Investment } from '@/lib/api/investment.api';

interface PortfolioDetailContentProps {
  id: string;
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 2 }).format(v);

const riskBadges: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  LOW: 'success', MEDIUM: 'warning', HIGH: 'danger',
};
const riskText: Record<string, string> = { LOW: 'ต่ำ', MEDIUM: 'กลาง', HIGH: 'สูง' };
const typeLabels: Record<string, string> = { STOCK: 'หุ้น', ETF: 'ETF', FUND: 'กองทุน', CRYPTO: 'คริปโต', GOLD: 'ทอง', BOND: 'ตราสารหนี้' };

export default function PortfolioDetailContent({ id }: PortfolioDetailContentProps) {
  const { data: portfolio, isLoading: loadingPortfolio } = useQuery({
    queryKey: ['portfolio', id],
    queryFn: () => PortfolioApi.findOne(id),
    retry: false,
  });

  const { data: allInvestments = [], isLoading: loadingInvestments } = useQuery({
    queryKey: ['investments'],
    queryFn: () => InvestmentApi.findAll(),
    retry: false,
  });

  const investments = allInvestments.filter(inv => inv.portfolioId === id);

  if (loadingPortfolio || loadingInvestments) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-xl font-bold text-foreground mb-4">ไม่พบข้อมูลพอร์ตการลงทุน</h2>
        <Link href="/portfolio" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
          <ArrowLeft className="w-4 h-4" /> กลับหน้าพอร์ตโฟลิโอ
        </Link>
      </div>
    );
  }

  // คำนวณ metrics จาก investments จริง
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentPrice * inv.quantity, 0);
  const totalInvested = investments.reduce((sum, inv) => sum + inv.purchasePrice * inv.quantity, 0);
  const profit = totalValue - totalInvested;
  const roi = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;
  const isPositive = profit >= 0;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-foreground font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> กลับไปหน้าพอร์ตโฟลิโอ
        </Link>
        <Badge variant={isPositive ? 'success' : 'danger'} className="text-xs font-semibold">
          ROI {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
        </Badge>
      </div>

      {/* Portfolio Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl border border-border/60">
        <div>
          <div className="flex items-center gap-3">
            {portfolio.color && <span className="w-3 h-3 rounded-full" style={{ backgroundColor: portfolio.color }} />}
            <h1 className="text-2xl font-extrabold text-foreground">{portfolio.name}</h1>
          </div>
          {portfolio.description && <p className="text-sm text-muted-foreground mt-1">{portfolio.description}</p>}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-muted-foreground/80 font-medium">
            สินทรัพย์ {portfolio._count?.investments ?? investments.length} รายการ
          </span>
          <span className="text-xs text-muted-foreground/80 font-medium">
            วันที่สร้าง: {portfolio.createdAt?.split('T')[0] ?? '-'}
          </span>
        </div>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase">มูลค่ารวมพอร์ต</span>
            <Briefcase className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-foreground">{formatCurrency(totalValue)}</p>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase">เงินลงทุนเริ่มต้น</span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-foreground">{formatCurrency(totalInvested)}</p>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase">กำไร / ขาดทุน</span>
            {isPositive ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-rose-500" />}
          </div>
          <p className={`text-2xl font-extrabold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? '+' : ''}{formatCurrency(profit)}
          </p>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase">ผลตอบแทน (ROI)</span>
            <span className="text-xs font-bold text-muted-foreground">%</span>
          </div>
          <p className={`text-2xl font-extrabold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
          </p>
        </Card>
      </div>

      {/* Asset Table */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-border/60">
          <h2 className="text-base font-bold text-foreground">สินทรัพย์ในพอร์ต ({investments.length})</h2>
        </div>

        {investments.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            ยังไม่มีสินทรัพย์ในพอร์ตโฟลิโอนี้
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs font-bold text-muted-foreground uppercase bg-muted/10">
                  <th className="p-4 pl-6">ชื่อสินทรัพย์</th>
                  <th className="p-4">ประเภท</th>
                  <th className="p-4">ความเสี่ยง</th>
                  <th className="p-4">ราคาซื้อ</th>
                  <th className="p-4">ราคาปัจจุบัน</th>
                  <th className="p-4">จำนวน</th>
                  <th className="p-4">ROI</th>
                  <th className="p-4 pr-6 text-right">มูลค่าปัจจุบัน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {investments.map(inv => {
                  const invRoi = inv.purchasePrice > 0
                    ? ((inv.currentPrice - inv.purchasePrice) / inv.purchasePrice) * 100
                    : 0;
                  const assetRoiPositive = invRoi >= 0;
                  const currentValue = inv.quantity * inv.currentPrice;

                  return (
                    <tr key={inv.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 pl-6">
                        <div>
                          <h4 className="font-bold text-foreground">{inv.assetName}</h4>
                          <span className="text-xs text-muted-foreground">{inv.symbol}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground font-medium">
                        {typeLabels[inv.assetType] ?? inv.assetType}
                        {inv.category && <span className="text-xs ml-1">({inv.category.name})</span>}
                      </td>
                      <td className="p-4">
                        <Badge variant={riskBadges[inv.riskLevel] || 'neutral'}>
                          {riskText[inv.riskLevel] || inv.riskLevel}
                        </Badge>
                      </td>
                      <td className="p-4 font-medium text-foreground">{formatCurrency(inv.purchasePrice)}</td>
                      <td className="p-4 font-medium text-foreground">{formatCurrency(inv.currentPrice)}</td>
                      <td className="p-4 font-medium text-foreground">
                        {inv.quantity.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                      </td>
                      <td className={`p-4 font-bold ${assetRoiPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {assetRoiPositive ? '+' : ''}{invRoi.toFixed(2)}%
                      </td>
                      <td className="p-4 pr-6 text-right font-bold text-foreground">
                        {formatCurrency(currentValue)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
