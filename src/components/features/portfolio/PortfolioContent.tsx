'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Grid, List, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import PortfolioCard, { PortfolioItem } from './PortfolioCard';
import { PortfolioApi } from '@/lib/api/portfolio.api';

// Initial Mock Portfolios matching the design mockup screenshot
const MOCK_PORTFOLIOS: PortfolioItem[] = [
  {
    id: 'crypto-portfolio',
    name: 'คริปโต',
    description: 'สินทรัพย์ดิจิทัล',
    value: 195000,
    change: '55,000',
    changePercent: '-22.00%',
    isPositive: false,
    assetsCount: 4,
    createdAt: '2024-03-05',
    color: 'orange',
  },
  {
    id: 'foreign-portfolio',
    name: 'หุ้นต่างประเทศ',
    description: 'ETF และหุ้นสหรัฐอเมริกา',
    value: 420000,
    change: '40,000',
    changePercent: '+10.53%',
    isPositive: true,
    assetsCount: 5,
    createdAt: '2024-02-10',
    color: 'blue',
  },
  {
    id: 'thai-portfolio',
    name: 'หุ้นไทย',
    description: 'พอร์ตหุ้นในตลาดหลักทรัพย์ไทย',
    value: 850000,
    change: '150,000',
    changePercent: '+21.43%',
    isPositive: true,
    assetsCount: 8,
    createdAt: '2024-01-20',
    color: 'green',
  },
];

export default function PortfolioContent() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'date'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load portfolios from NestJS REST API using React Query
  const { data: apiPortfolios = [] } = useQuery({
    queryKey: ['portfolios'],
    queryFn: () => PortfolioApi.findAll(),
    retry: false,
  });

  const portfolios = useMemo(() => {
    if (apiPortfolios && apiPortfolios.length > 0) {
      return apiPortfolios.map((item, index) => {
        const colorThemes = ['orange', 'blue', 'green'];
        const color = item.color || colorThemes[index % colorThemes.length];
        
        const mockValues = [
          { value: 195000, change: '55,000', percent: '-22.00%', isPos: false },
          { value: 420000, change: '40,000', percent: '+10.53%', isPos: true },
          { value: 850000, change: '150,000', percent: '+21.43%', isPos: true },
        ];
        const currentMock = mockValues[index % mockValues.length];

        return {
          id: item.id,
          name: item.name,
          description: item.description || 'คำอธิบายพอร์ตโฟลิโอ',
          value: currentMock.value,
          change: currentMock.change,
          changePercent: currentMock.percent,
          isPositive: currentMock.isPos,
          assetsCount: item._count?.investments || 0,
          createdAt: new Date(item.createdAt).toISOString().split('T')[0],
          color: color,
        };
      });
    }
    return MOCK_PORTFOLIOS;
  }, [apiPortfolios]);

  // Filter and Sort portfolios
  const getFilteredPortfolios = () => {
    let result = [...portfolios];

    // Search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    // Sort order
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name, 'th');
      } else if (sortBy === 'value') {
        return b.value - a.value;
      } else if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return result;
  };

  const filteredPortfolios = getFilteredPortfolios();

  return (
    <div className="space-y-6">
      
      {/* Search and Controls Bar */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border/60 transition-colors duration-300">
        
        {/* Left Side: Search Input and Sort Select */}
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Search Portfolios */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ค้นหา Portfolio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-xl text-sm border border-border bg-muted/30 hover:bg-muted/65 text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary/60 focus:ring-1 focus:ring-primary/60"
            />
          </div>

          {/* Sort Selection dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'value' | 'date')}
              className="h-9 pl-3 pr-8 rounded-xl text-sm border border-border bg-card text-foreground font-semibold outline-none transition-all hover:bg-muted/50 cursor-pointer appearance-none"
            >
              <option value="name">ชื่อ</option>
              <option value="value">มูลค่าพอร์ต</option>
              <option value="date">วันที่สร้าง</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          </div>

        </div>

        {/* Right Side: View Mode Toggles and Add Button */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          
          {/* View Toggles */}
          <div className="flex items-center border border-border rounded-xl p-0.5 bg-muted/20">
            
            {/* Grid view */}
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="ตาราง"
            >
              <Grid className="size-4" />
            </button>

            {/* List view */}
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="รายการ"
            >
              <List className="size-4" />
            </button>

          </div>

          {/* Create button */}
          <button className="h-9 px-4 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:bg-primary/95 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]">
            <Plus className="size-4" />
            สร้าง Portfolio
          </button>

        </div>

      </section>

      {/* Main Portfolios List/Grid */}
      {filteredPortfolios.length > 0 ? (
        viewMode === 'grid' ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                onViewDetails={(id) => router.push(`/portfolio/${id}`)}
                onEdit={(id) => console.log('Edit portfolio', id)}
                onDelete={(id) => console.log('Delete portfolio', id)}
              />
            ))}
          </section>
        ) : (
          /* List Mode (Table layout) */
          <section className="bg-card rounded-2xl border border-border/60 overflow-hidden transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs font-bold text-muted-foreground uppercase bg-muted/10 select-none">
                    <th className="p-4 pl-6">พอร์ตโฟลิโอ</th>
                    <th className="p-4">มูลค่า</th>
                    <th className="p-4">กำไร/ขาดทุน</th>
                    <th className="p-4">เปอร์เซ็นต์</th>
                    <th className="p-4">จำนวนสินทรัพย์</th>
                    <th className="p-4">วันที่สร้าง</th>
                    <th className="p-4 pr-6 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm">
                  {filteredPortfolios.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <span className={`w-1 h-8 rounded-full ${
                            p.color === 'orange' ? 'bg-amber-500' : p.color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'
                          }`} />
                          <div>
                            <h4 className="font-bold text-foreground">{p.name}</h4>
                            <p className="text-xs text-muted-foreground">{p.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-foreground">
                        ฿{p.value.toLocaleString()}
                      </td>
                      <td className={`p-4 font-bold ${p.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {p.isPositive ? '+' : ''}฿{p.change}
                      </td>
                      <td className={`p-4 font-bold ${p.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {p.changePercent}
                      </td>
                      <td className="p-4 font-medium text-muted-foreground">
                        {p.assetsCount} สินทรัพย์
                      </td>
                      <td className="p-4 text-muted-foreground/80 font-medium">
                        {p.createdAt}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => router.push(`/portfolio/${p.id}`)}
                            className="h-8 px-3 rounded-lg text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer"
                          >
                            ดู
                          </button>
                          <button
                            onClick={() => console.log('Edit', p.id)}
                            className="h-8 px-2.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => console.log('Delete', p.id)}
                            className="h-8 px-2.5 rounded-lg border border-border bg-card hover:bg-destructive/10 text-muted-foreground hover:text-rose-500 hover:border-rose-500/30 transition-all cursor-pointer"
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )
      ) : (
        /* Empty search results */
        <section className="text-center py-16 bg-card rounded-2xl border border-border/60">
          <p className="text-base text-muted-foreground select-none">
            ไม่พบพอร์ตการลงทุนที่ค้นหา
          </p>
        </section>
      )}

    </div>
  );
}
