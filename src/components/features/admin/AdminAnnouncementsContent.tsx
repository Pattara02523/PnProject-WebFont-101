"use client";

import { useState } from 'react';
import { Plus, Edit, Trash, Eye } from 'lucide-react';
import { Card, Button, Badge, Table, Tr, Td } from '@/components/ui';

export default function AdminAnnouncementsContent() {
  const [announcements, setAnnouncements] = useState([
    { id: '1', title: 'เปิดตัวระบบ AI วิเคราะห์พอร์ต', date: '2025-07-28', status: 'published' },
    { id: '2', title: 'ปิดปรับปรุงระบบชั่วคราว', date: '2025-08-05', status: 'draft' },
  ]);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">ประกาศระบบ</h2>
        <Button className="flex items-center gap-2"><Plus className="w-4 h-4" /> สร้างประกาศใหม่</Button>
      </div>

      <Card>
        <Table headers={['หัวข้อประกาศ', 'วันที่', 'สถานะ', 'จัดการ']}>
          {announcements.map(a => (
            <Tr key={a.id}>
              <Td className="font-medium text-slate-900 dark:text-slate-100">{a.title}</Td>
              <Td className="text-slate-500">{a.date}</Td>
              <Td>
                <Badge variant={a.status === 'published' ? 'success' : 'neutral'}>
                  {a.status === 'published' ? 'เผยแพร่แล้ว' : 'แบบร่าง'}
                </Badge>
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"><Eye className="w-4 h-4" /></button>
                  <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"><Edit className="w-4 h-4" /></button>
                  <button className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><Trash className="w-4 h-4" /></button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
