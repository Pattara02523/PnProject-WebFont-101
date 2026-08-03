/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 68 / Flow ขั้นตอนที่ 68]
 * ชื่อไฟล์: AnnouncementsContent.tsx
 * หน้าที่หลัก: Component แสดงประกาศข่าวสารระบบ อัปเดตฟีเจอร์ และ ข่าวการลงทุนสำหรับผู้ใช้งาน
 * รับอะไรมาจากไหน (Input): ข้อมูลจาก `announcementApi.getAll()`
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render ข่าวสารประกาศระบบ
 * ==========================================
 */

'use client';

import { useEffect, useState } from 'react';
import { Megaphone, Calendar, Tag, Loader2, Info } from 'lucide-react';
import { Card, Badge, EmptyState } from '@/components/ui';
import { AnnouncementApi, Announcement } from '@/lib/api/admin.api';

const TYPE_CONFIG: Record<string, { label: string; variant: 'info' | 'warning' | 'success' | 'neutral' }> = {
  NEWS: { label: 'ข่าวสาร', variant: 'info' },
  MAINTENANCE: { label: 'ปิดปรับปรุงระบบ', variant: 'warning' },
  MARKET: { label: 'วิเคราะห์ตลาด', variant: 'success' },
  SYSTEM: { label: 'ประกาศระบบ', variant: 'neutral' },
};

export default function AnnouncementsContent() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const list = await AnnouncementApi.findAll();
        setAnnouncements(list ?? []);
      } catch (e: any) {
        setError(e?.message ?? 'โหลดประกาศไม่สำเร็จ');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
          <Megaphone className="size-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">ประกาศและข่าวสารจากระบบ</h2>
          <p className="text-xs text-muted-foreground mt-0.5">อัปเดตข้อมูลข่าวสาร แจ้งเตือนระบบ และสาระการลงทุนล่าสุด</p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      {announcements.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            title="ไม่มีประกาศในขณะนี้"
            description="ยังไม่มีประกาศหรือข่าวสารใหม่จากผู้ดูแลระบบ"
            icon={<Megaphone className="w-8 h-8 text-muted-foreground" />}
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {announcements.map((a) => {
            const typeInfo = TYPE_CONFIG[a.type] ?? { label: a.type, variant: 'neutral' as const };
            const formattedDate = a.publishedAt || a.createdAt
              ? new Date(a.publishedAt || a.createdAt).toLocaleDateString('th-TH', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : '-';

            return (
              <Card key={a.id} className="p-5 hover:border-emerald-500/50 transition-all shadow-sm">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>
                      <h3 className="font-bold text-base text-foreground">{a.title}</h3>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3.5" /> {formattedDate}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1 whitespace-pre-line">
                    {a.message}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
