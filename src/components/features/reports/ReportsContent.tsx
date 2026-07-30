"use client";

import { useState } from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import { Card, Button, Input, Table, Tr, Td, Badge } from '@/components/ui';

export default function ReportsContent() {
  const [format, setFormat] = useState('pdf');
  const [dateFrom, setDateFrom] = useState('2025-01-01');
  const [dateTo, setDateTo] = useState('2025-07-30');

  const history = [
    { id: '1', name: 'รายงานสรุปผลการลงทุน Q2 2025', date: '2025-07-01', format: 'PDF', status: 'ready' },
    { id: '2', name: 'ใบเสร็จรับเงิน ค่าบริการรายปี', date: '2025-06-15', format: 'PDF', status: 'ready' },
    { id: '3', name: 'ประวัติการทำรายการ พ.ค. 2025', date: '2025-06-01', format: 'Excel', status: 'ready' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">รายงานของฉัน</h2>

      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">ส่งออกรายงานสรุปผลการลงทุน</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <Input label="ตั้งแต่วันที่" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <Input label="ถึงวันที่" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">รูปแบบไฟล์</label>
            <select value={format} onChange={e => setFormat(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="pdf">PDF Document</option>
              <option value="excel">Excel Spreadsheet</option>
            </select>
          </div>
          <Button className="w-full">สร้างรายงาน</Button>
        </div>
      </Card>

      <Card>
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">ประวัติการสร้างรายงาน</h3>
        </div>
        <Table headers={['ชื่อรายงาน', 'วันที่สร้าง', 'รูปแบบ', 'ดาวน์โหลด']}>
          {history.map(h => (
            <Tr key={h.id}>
              <Td>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-900 dark:text-slate-100">{h.name}</span>
                </div>
              </Td>
              <Td className="text-slate-500">{h.date}</Td>
              <Td><Badge variant="neutral">{h.format}</Badge></Td>
              <Td>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> โหลด
                </Button>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
