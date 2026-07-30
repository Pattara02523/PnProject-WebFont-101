"use client";

import Link from 'next/link';
import { Card, Badge } from '@/components/ui';

const announcements = [
  { id: '1', title: 'เปิดตัวระบบ AI วิเคราะห์พอร์ต', date: '28 ก.ค. 2025', excerpt: 'พบกับฟีเจอร์ใหม่ที่ช่วยให้คุณตัดสินใจลงทุนได้ดียิ่งขึ้นด้วย AI', isNew: true },
  { id: '2', title: 'แจ้งปิดปรับปรุงระบบชั่วคราว', date: '5 ส.ค. 2025', excerpt: 'ระบบจะปิดปรับปรุงในเวลา 02:00 - 05:00 น. ของวันที่ 5 ส.ค.', isNew: false },
];

export default function AnnouncementsContent() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">ประกาศและข่าวสาร</h2>
      <div className="flex flex-col gap-4">
        {announcements.map(a => (
          <Link href={`/announcements/${a.id}`} key={a.id}>
            <Card className="p-5 hover:border-emerald-500 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">{a.title}</h3>
                  {a.isNew && <Badge variant="success">ใหม่</Badge>}
                </div>
                <span className="text-sm text-slate-400">{a.date}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">{a.excerpt}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
