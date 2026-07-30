"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit2, Trash2, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { Card, Button, Badge, Modal, EmptyState, ConfirmDialog, Pagination } from '@/components/ui/index';
import { mockInvestments, formatCurrency, formatPercent } from '@/lib/mock-data';

type Investment = typeof mockInvestments[0];

const riskColors: Record<string, string> = { low: 'success', medium: 'warning', high: 'danger' };
const riskLabels: Record<string, string> = { low: 'ต่ำ', medium: 'ปานกลาง', high: 'สูง' };

const EMPTY_FORM = { name: '', symbol: '', type: 'หุ้น', category: '', buyPrice: '', currentPrice: '', quantity: '', investDate: '', risk: 'medium', portfolioId: '1' };

export default function InvestmentContent() {
  const router = useRouter();
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Investment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = investments.filter(inv => {
    const matchSearch = inv.name.toLowerCase().includes(search.toLowerCase()) || inv.symbol.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || inv.type === filterType;
    const matchRisk = filterRisk === 'all' || inv.risk === filterRisk;
    return matchSearch && matchType && matchRisk;
  });

  const perPage = 10;
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const openCreate = () => { setForm(EMPTY_FORM); setEditItem(null); setShowForm(true); };
  const openEdit = (inv: Investment) => { setForm({ ...inv, buyPrice: String(inv.buyPrice), currentPrice: String(inv.currentPrice), quantity: String(inv.quantity) }); setEditItem(inv); setShowForm(true); };

  const handleSave = () => {
    const bp = parseFloat(form.buyPrice) || 0, cp = parseFloat(form.currentPrice) || 0, qty = parseFloat(form.quantity) || 0;
    const profit = (cp - bp) * qty;
    const roi = bp > 0 ? ((cp - bp) / bp) * 100 : 0;
    if (editItem) {
      setInvestments(is => is.map(i => i.id === editItem.id ? { ...i, ...form, buyPrice: bp, currentPrice: cp, quantity: qty, profit, roi, status: 'active' } : i));
    } else {
      setInvestments(is => [...is, { id: Date.now().toString(), ...form, buyPrice: bp, currentPrice: cp, quantity: qty, profit, roi, status: 'active' }]);
    }
    setShowForm(false);
  };

  return (
    <>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex-1 flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาสินทรัพย์..." className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="all">ทุกประเภท</option>
              <option value="หุ้น">หุ้น</option>
              <option value="ETF">ETF</option>
              <option value="คริปโต">คริปโต</option>
            </select>
            <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="all">ทุก Risk</option>
              <option value="low">ต่ำ</option>
              <option value="medium">ปานกลาง</option>
              <option value="high">สูง</option>
            </select>
          </div>
          <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> เพิ่มการลงทุน</Button>
        </div>

        {paged.length === 0 ? (
          <EmptyState title="ยังไม่มีการลงทุน" description="เพิ่มสินทรัพย์เพื่อเริ่มติดตามการลงทุน" action={<Button onClick={openCreate}><Plus className="w-4 h-4" /> เพิ่มการลงทุน</Button>} icon={<TrendingUp className="w-8 h-8" />} />
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-100 dark:border-slate-800">
                  <tr>{['สินทรัพย์', 'ประเภท', 'ราคาซื้อ', 'ราคาปัจจุบัน', 'จำนวน', 'กำไร/ขาดทุน', 'ROI', 'Risk', 'วันที่', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {paged.map(inv => (
                    <tr key={inv.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => router.push(`/investment/${inv.id}`)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">{inv.symbol.slice(0, 2)}</div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{inv.name}</p>
                            <p className="text-xs text-slate-400">{inv.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge variant="neutral">{inv.type}</Badge></td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatCurrency(inv.buyPrice)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">{formatCurrency(inv.currentPrice)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{inv.quantity.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {inv.profit >= 0 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                          <span className={`text-sm font-semibold ${inv.profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{inv.profit >= 0 ? '+' : ''}{formatCurrency(Math.abs(inv.profit))}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge variant={inv.roi >= 0 ? 'success' : 'danger'}>{formatPercent(inv.roi)}</Badge></td>
                      <td className="px-4 py-3"><Badge variant={riskColors[inv.risk] as any}>{riskLabels[inv.risk]}</Badge></td>
                      <td className="px-4 py-3 text-xs text-slate-400">{inv.investDate}</td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-1">
                          <button onClick={e => { e.stopPropagation(); openEdit(inv); }} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={e => { e.stopPropagation(); setDeleteId(inv.id); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => router.push(`/investment/${inv.id}`)} className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-500"><ChevronRight className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <p className="text-xs text-slate-400">{filtered.length} รายการ</p>
              <Pagination current={page} total={Math.ceil(filtered.length / perPage)} onChange={setPage} />
            </div>
          </Card>
        )}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editItem ? 'แก้ไขการลงทุน' : 'เพิ่มการลงทุน'} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ชื่อสินทรัพย์</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Apple Inc." className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Symbol</label>
            <input value={form.symbol} onChange={e => setForm(f => ({ ...f, symbol: e.target.value }))} placeholder="AAPL" className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          {[['ประเภท', 'type', ['หุ้น', 'ETF', 'คริปโต', 'กองทุน']], ['Risk', 'risk', ['low:ต่ำ', 'medium:ปานกลาง', 'high:สูง']]].map(([label, key, opts]) => (
            <div key={key as string} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label as string}</label>
              <select value={(form as any)[key as string]} onChange={e => setForm(f => ({ ...f, [key as string]: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {(opts as string[]).map(o => <option key={o} value={o.split(':')[0]}>{o.split(':')[1] || o}</option>)}
              </select>
            </div>
          ))}
          {[['ราคาซื้อ', 'buyPrice'], ['ราคาปัจจุบัน', 'currentPrice'], ['จำนวน', 'quantity']].map(([label, key]) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
              <input type="number" value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder="0" className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">วันที่ลงทุน</label>
            <input type="date" value={form.investDate} onChange={e => setForm(f => ({ ...f, investDate: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="col-span-2 flex gap-3 mt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowForm(false)}>ยกเลิก</Button>
            <Button className="flex-1" onClick={handleSave}>{editItem ? 'บันทึก' : 'เพิ่ม'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { setInvestments(is => is.filter(i => i.id !== deleteId)); setDeleteId(null); }} title="ลบการลงทุน?" description="ไม่สามารถกู้คืนได้หลังจากลบแล้ว" danger />
    </>
  );
}
