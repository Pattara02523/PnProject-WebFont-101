"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, Shield, DollarSign, Briefcase } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { mockPortfolios, mockInvestments, formatCurrency } from '@/lib/mock-data';

interface PortfolioDetailContentProps {
  id: string;
}

export default function PortfolioDetailContent({ id }: PortfolioDetailContentProps) {
  // Translate string IDs from UI mocks if needed
  const resolvedId = id === 'thai-portfolio' ? '1' : id === 'foreign-portfolio' ? '2' : id === 'crypto-portfolio' ? '3' : id;

  const portfolio = mockPortfolios.find(p => p.id === resolvedId);
  const investments = mockInvestments.filter(inv => inv.portfolioId === resolvedId);

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

  const isPositive = portfolio.profit >= 0;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-foreground font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> กลับไปหน้าพอร์ตโฟลิโอ
        </Link>
        <Badge variant={isPositive ? 'success' : 'danger'} className="text-xs font-semibold">
          ROI {portfolio.roi}%
        </Badge>
      </div>

      {/* Portfolio Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl border border-border/60">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: portfolio.color }} />
            <h1 className="text-2xl font-extrabold text-foreground">{portfolio.name}</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{portfolio.description}</p>
        </div>
        <div className="text-xs text-muted-foreground/80 font-medium">
          วันที่สร้าง: {portfolio.createdAt}
        </div>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase">มูลค่ารวมพอร์ต</span>
            <Briefcase className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-foreground">
            {formatCurrency(portfolio.totalValue)}
          </p>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase">เงินลงทุนเริ่มต้น</span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-foreground">
            {formatCurrency(portfolio.invested)}
          </p>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase">กำไร / ขาดทุน</span>
            {isPositive ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-rose-500" />}
          </div>
          <p className={`text-2xl font-extrabold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? '+' : ''}{formatCurrency(portfolio.profit)}
          </p>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase">ผลตอบแทน (ROI)</span>
            <span className="text-xs font-bold text-muted-foreground">%</span>
          </div>
          <p className={`text-2xl font-extrabold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {portfolio.roi}%
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
                {investments.map((inv) => {
                  const assetRoiPositive = inv.roi >= 0;
                  const currentValue = inv.quantity * inv.currentPrice;
                  
                  // Resolve risk level colors
                  const riskBadges: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
                    low: 'success',
                    medium: 'warning',
                    high: 'danger',
                  };
                  const riskText: Record<string, string> = {
                    low: 'ต่ำ',
                    medium: 'กลาง',
                    high: 'สูง',
                  };

                  return (
                    <tr key={inv.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 pl-6">
                        <div>
                          <h4 className="font-bold text-foreground">{inv.name}</h4>
                          <span className="text-xs text-muted-foreground">{inv.symbol}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground font-medium">
                        {inv.type} ({inv.category})
                      </td>
                      <td className="p-4">
                        <Badge variant={riskBadges[inv.risk] || 'neutral'}>
                          {riskText[inv.risk] || inv.risk}
                        </Badge>
                      </td>
                      <td className="p-4 font-medium text-foreground">
                        {formatCurrency(inv.buyPrice)}
                      </td>
                      <td className="p-4 font-medium text-foreground">
                        {formatCurrency(inv.currentPrice)}
                      </td>
                      <td className="p-4 font-medium text-foreground">
                        {inv.quantity.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                      </td>
                      <td className={`p-4 font-bold ${assetRoiPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {assetRoiPositive ? '+' : ''}{inv.roi}%
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
