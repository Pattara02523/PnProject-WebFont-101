"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown, Edit2, Save, ArrowDownRight, ArrowUpRight, DollarSign, PiggyBank, CreditCard, AlertTriangle } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui/index';
import { mockInvestments, mockTransactions, formatCurrency, formatPercent } from '@/lib/mock-data';

const riskLabels: Record<string, string> = { low: 'ต่ำ', medium: 'ปานกลาง', high: 'สูง' };
const riskColors: Record<string, string> = {
  low: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
  medium: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400',
  high: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
};

const txTypeConfig: Record<string, { label: string; icon: any; color: string }> = {
  buy:      { label: 'ซื้อ',       icon: ArrowDownRight, color: 'text-blue-600' },
  sell:     { label: 'ขาย',        icon: ArrowUpRight,   color: 'text-emerald-600' },
  dividend: { label: 'เงินปันผล', icon: DollarSign,     color: 'text-purple-600' },
  deposit:  { label: 'ฝาก',        icon: PiggyBank,      color: 'text-emerald-600' },
  withdraw: { label: 'ถอน',        icon: CreditCard,     color: 'text-red-600' },
};

export default function InvestmentDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const asset = mockInvestments.find(i => i.id === id);
  const [notes, setNotes] = useState((asset as any)?.notes || '');
  const [editingNotes, setEditingNotes] = useState(false);
  const [savedNotes, setSavedNotes] = useState(notes);

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500 dark:text-slate-400">ไม่พบข้อมูลสินทรัพย์</p>
        <Button variant="outline" onClick={() => router.push('/investment')}><ArrowLeft className="w-4 h-4" /> กลับ</Button>
      </div>
    );
  }

  const relatedTx = mockTransactions.filter(t => t.symbol === asset.symbol);
  const profit = asset.profit;
  const roi = asset.roi;
  const totalValue = asset.currentPrice * asset.quantity;
  const costBasis = asset.buyPrice * asset.quantity;

  const handleSaveNotes = () => { setSavedNotes(notes); setEditingNotes(false); };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/investment')}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4 flex-1">
          {/* Asset logo placeholder */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-100 dark:shadow-emerald-900/30 flex-shrink-0">
            <span className="text-white text-lg font-extrabold tracking-tight">{asset.symbol.slice(0, 2)}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{asset.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-slate-400">{asset.symbol}</span>
              <span className="text-slate-200 dark:text-slate-700">·</span>
              <Badge variant="neutral">{asset.type}</Badge>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${riskColors[asset.risk]}`}>
                ความเสี่ยง: {riskLabels[asset.risk]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-slate-400 mb-1">ราคาซื้อเฉลี่ย</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatCurrency(asset.buyPrice)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400 mb-1">ราคาปัจจุบัน</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatCurrency(asset.currentPrice)}</p>
          <div className="flex items-center gap-1 mt-0.5">
            {profit >= 0 ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
            <span className={`text-xs font-medium ${profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {profit >= 0 ? '+' : ''}{formatPercent(asset.buyPrice > 0 ? ((asset.currentPrice - asset.buyPrice) / asset.buyPrice) * 100 : 0)}
            </span>
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400 mb-1">กำไร/ขาดทุน</p>
          <p className={`text-lg font-bold ${profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {profit >= 0 ? '+' : ''}{formatCurrency(Math.abs(profit))}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400 mb-1">ROI</p>
          <p className={`text-lg font-bold ${roi >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {roi >= 0 ? '+' : ''}{formatPercent(roi)}
          </p>
        </Card>
      </div>

      {/* Detail row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">รายละเอียดการลงทุน</h3>
          {[
            ['จำนวนที่ถือ', `${asset.quantity.toLocaleString()} หน่วย`],
            ['ต้นทุนรวม', formatCurrency(costBasis)],
            ['มูลค่าตลาดปัจจุบัน', formatCurrency(totalValue)],
            ['วันที่ลงทุน', asset.investDate],
            ['Portfolio', asset.portfolioId === '1' ? 'หุ้นไทย' : 'Global ETF'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
              <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</span>
            </div>
          ))}
        </Card>

        <Card className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">โน้ต / บันทึก</h3>
            {editingNotes ? (
              <button onClick={handleSaveNotes} className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                <Save className="w-3.5 h-3.5" /> บันทึก
              </button>
            ) : (
              <button onClick={() => setEditingNotes(true)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <Edit2 className="w-3.5 h-3.5" /> แก้ไข
              </button>
            )}
          </div>
          {editingNotes ? (
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={6}
              placeholder="จดบันทึกเกี่ยวกับสินทรัพย์นี้..."
              className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          ) : (
            <div
              onClick={() => setEditingNotes(true)}
              className="flex-1 min-h-[120px] p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400 cursor-text"
            >
              {savedNotes || <span className="text-slate-300 dark:text-slate-600 italic">คลิกเพื่อเพิ่มโน้ต...</span>}
            </div>
          )}

          {/* Profit/Loss bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>ต้นทุน</span>
              <span>ปัจจุบัน</span>
            </div>
            <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`absolute left-0 h-full rounded-full transition-all ${profit >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, Math.max(5, (totalValue / (costBasis + Math.abs(profit))) * 100))}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Transaction history */}
      <Card>
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">ประวัติการซื้อขาย</h3>
        </div>
        {relatedTx.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-sm text-slate-400">ยังไม่มีประวัติการซื้อขาย</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {['ประเภท', 'ราคา', 'จำนวน', 'มูลค่า', 'วันที่', 'หมายเหตุ'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {relatedTx.map(tx => {
                  const cfg = txTypeConfig[tx.type];
                  const TxIcon = cfg?.icon;
                  const isIn = ['sell', 'dividend', 'deposit'].includes(tx.type);
                  return (
                    <tr key={tx.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${isIn ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                            {TxIcon && <TxIcon className={`w-3.5 h-3.5 ${cfg?.color}`} />}
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cfg?.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatCurrency(tx.price)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{tx.quantity.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-semibold ${isIn ? 'text-emerald-600' : 'text-red-500'}`}>
                          {isIn ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{tx.date}</td>
                      <td className="px-4 py-3 text-xs text-slate-400 max-w-xs truncate">{tx.note || '-'}</td>
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
