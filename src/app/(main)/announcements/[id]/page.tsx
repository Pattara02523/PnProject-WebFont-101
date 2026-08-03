/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 70 / Flow ขั้นตอนที่ 70]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Dynamic Route Page รายละเอียดประกาศเดี่ยว (`/announcements/[id]`)
 * รับอะไรมาจากไหน (Input): params.id
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render หน้ารายละเอียดประกาศฉบับเต็ม
 * ==========================================
 */

'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Megaphone, Calendar, AlertCircle } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { AnnouncementApi, Announcement } from '@/lib/api/admin.api';

export default function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = use(Promise.resolve(params));
  const id = resolvedParams.id;

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnnouncement() {
      try {
        setLoading(true);
        setError(null);
        const data = await AnnouncementApi.findOne(id);
        setAnnouncement(data);
      } catch (err: any) {
        setError(err?.message ?? 'ไม่สามารถดึงข้อมูลประกาศได้');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadAnnouncement();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <Link href="/announcements" className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 w-fit font-medium">
          <ArrowLeft className="w-4 h-4" /> กลับไปหน้าประกาศ
        </Link>
        <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-3">
          <AlertCircle className="size-5 shrink-0" />
          <p className="text-sm font-semibold">{error || 'ไม่พบประกาศนี้ในระบบ'}</p>
        </div>
      </div>
    );
  }

  const dateStr = new Date(announcement.createdAt).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <Link href="/announcements" className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 w-fit font-medium">
        <ArrowLeft className="w-4 h-4" /> กลับไปหน้าประกาศ
      </Link>
      
      <Card className="p-8 border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="info" className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">
            <Megaphone className="size-3.5 mr-1 inline" /> ประกาศระบบ ({announcement.type})
          </Badge>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2 leading-snug">{announcement.title}</h1>
        <p className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5 border-b border-border pb-4">
          <Calendar className="size-3.5 text-violet-500" /> ประกาศเมื่อ {dateStr}
        </p>
        
        <div className="text-foreground/90 text-sm leading-relaxed whitespace-pre-line">
          {announcement.message}
        </div>
      </Card>
    </div>
  );
}
