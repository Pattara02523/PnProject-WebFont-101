'use client';

import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PortfolioItem = {
  id: string;
  name: string;
  description: string;
  value: number;
  change: string;
  changePercent: string;
  isPositive: boolean;
  assetsCount: number;
  createdAt: string;
  color: string; // e.g. 'orange', 'blue', 'green'
};

type PortfolioCardProps = {
  portfolio: PortfolioItem;
  onViewDetails?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function PortfolioCard({
  portfolio,
  onViewDetails,
  onEdit,
  onDelete,
}: PortfolioCardProps) {
  
  // Resolve top border and accent colors
  const accentColors: Record<string, { border: string; bg: string; text: string }> = {
    orange: {
      border: 'border-t-amber-500',
      bg: 'bg-amber-500/10',
      text: 'text-amber-500'
    },
    blue: {
      border: 'border-t-blue-500',
      bg: 'bg-blue-500/10',
      text: 'text-blue-500'
    },
    green: {
      border: 'border-t-emerald-500',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-500'
    }
  };

  const colors = accentColors[portfolio.color] || accentColors.green;

  return (
    <div className={cn(
      'rounded-2xl bg-card border border-border/60 border-t-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between overflow-hidden',
      colors.border
    )}>
      
      {/* Top Header Row: Title & Profit/Loss Badge */}
      <div className="p-5 pb-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-foreground tracking-tight select-none">
            {portfolio.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 select-none">
            {portfolio.description}
          </p>
        </div>

        {/* Change Percentage Badge */}
        <span className={cn(
          'text-xs font-bold px-2 py-0.75 rounded-md select-none shrink-0',
          portfolio.isPositive
            ? 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15'
            : 'text-rose-500 bg-rose-500/10 dark:bg-rose-500/15'
        )}>
          {portfolio.changePercent}
        </span>
      </div>

      {/* Main Values Grid */}
      <div className="px-5 py-3 grid grid-cols-2 gap-4">
        
        {/* Value Box */}
        <div className="p-3.5 rounded-xl bg-muted/30 border border-border/30">
          <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase select-none">
            มูลค่า
          </p>
          <p className="text-base sm:text-lg font-bold text-foreground mt-1">
            ฿{portfolio.value.toLocaleString()}
          </p>
        </div>

        {/* PnL Box */}
        <div className="p-3.5 rounded-xl bg-muted/30 border border-border/30">
          <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase select-none">
            กำไร/ขาดทุน
          </p>
          <p className={cn(
            'text-base sm:text-lg font-bold mt-1',
            portfolio.isPositive ? 'text-emerald-500' : 'text-rose-500'
          )}>
            {portfolio.isPositive ? '+' : ''}฿{portfolio.change}
          </p>
        </div>

      </div>

      {/* Subtext info (Assets & Created Date) */}
      <div className="px-5 py-2 flex items-center justify-between text-xs text-muted-foreground/80 font-medium select-none border-b border-border/40 pb-3">
        <span>{portfolio.assetsCount} สินทรัพย์</span>
        <span>สร้าง {portfolio.createdAt}</span>
      </div>

      {/* Card Actions Row */}
      <div className="p-4 bg-muted/10 flex items-center gap-2">
        
        {/* View details */}
        <button
          onClick={() => onViewDetails?.(portfolio.id)}
          className="flex-1 h-9 px-4 rounded-xl text-xs font-semibold border border-border/80 bg-card hover:bg-muted text-foreground transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <Eye className="size-3.5" />
          <span>ดูรายละเอียด</span>
        </button>

        {/* Edit button */}
        <button
          onClick={() => onEdit?.(portfolio.id)}
          className="size-9 rounded-xl border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-[0.98]"
          title="แก้ไข"
        >
          <Edit2 className="size-3.5" />
        </button>

        {/* Delete button */}
        <button
          onClick={() => onDelete?.(portfolio.id)}
          className="size-9 rounded-xl border border-border/80 bg-card hover:bg-destructive/10 text-muted-foreground hover:text-rose-500 hover:border-rose-500/30 transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-[0.98]"
          title="ลบ"
        >
          <Trash2 className="size-3.5" />
        </button>

      </div>

    </div>
  );
}
