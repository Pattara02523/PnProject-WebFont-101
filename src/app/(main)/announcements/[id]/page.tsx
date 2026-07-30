"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui';

const mockAnnouncement = {
  title: 'เปิดตัวระบบ AI วิเคราะห์พอร์ต',
  date: '28 ก.ค. 2025',
  content: 'เรามีความยินดีที่จะประกาศเปิดตัวฟีเจอร์ใหม่ "AI วิเคราะห์พอร์ต" ที่จะช่วยให้นักลงทุนสามารถวิเคราะห์ความเสี่ยงและโอกาสในการลงทุนได้อย่างแม่นยำมากยิ่งขึ้น ระบบใช้ข้อมูลแบบ Real-time ผสานกับ Machine Learning โมเดลล่าสุด\n\nสามารถทดลองใช้งานได้แล้ววันนี้ที่เมนู "การวิเคราะห์".',
};

export default function AnnouncementDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <Link href="/announcements" className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 w-fit">
        <ArrowLeft className="w-4 h-4" /> กลับไปหน้าประกาศ
      </Link>
      
      <Card className="p-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{mockAnnouncement.title}</h1>
        <p className="text-sm text-slate-500 mb-8">ประกาศเมื่อ {mockAnnouncement.date}</p>
        
        <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {mockAnnouncement.content}
        </div>
      </Card>
    </div>
  );
}
