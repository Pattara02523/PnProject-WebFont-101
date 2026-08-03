/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 66 / Flow ขั้นตอนที่ 66]
 * ชื่อไฟล์: NotificationContent.tsx
 * หน้าที่หลัก: Component แสดงรายการการแจ้งเตือนทั้งหมดของผู้ใช้ พร้อมปุ่มกดอ่าน และ ลบแจ้งเตือน
 * รับอะไรมาจากไหน (Input): ข้อมูลจาก `notificationApi.getAll()`
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render รายการแจ้งเตือนในระบบ
 * ==========================================
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, TrendingUp, Target, Clock, CheckCheck, X, Loader2, Trash2, ExternalLink, Megaphone, Calendar, Sparkles } from 'lucide-react';
import { Card, Button, Tabs, EmptyState, Badge } from '@/components/ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationApi, NotificationItem } from '@/lib/api/notification.api';
import { AnnouncementApi, Announcement } from '@/lib/api/admin.api';

const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  INVESTMENT: { icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', label: 'การลงทุน' },
  GOAL:       { icon: Target,    color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-500/10',    label: 'เป้าหมาย' },
  REMINDER:   { icon: Clock,     color: 'text-amber-500 dark:text-amber-400',     bg: 'bg-amber-500/10',   label: 'เตือนความจำ' },
};

const ANNOUNCEMENT_TYPE: Record<string, { label: string; variant: 'info' | 'warning' | 'success' | 'neutral' }> = {
  NEWS: { label: 'ข่าวสาร', variant: 'info' },
  MAINTENANCE: { label: 'ปรับปรุงระบบ', variant: 'warning' },
  MARKET: { label: 'ตลาดหุ้น', variant: 'success' },
  SYSTEM: { label: 'ประกาศระบบ', variant: 'neutral' },
};

const formatTime = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'เมื่อกี้';
  if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' });
};

export default function NotificationContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('all');

  // Fetch Notifications
  const { data: notifications = [], isLoading: loadingNotifs } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => NotificationApi.findAll(),
    retry: false,
  });

  // Fetch Public Announcements
  const { data: announcements = [], isLoading: loadingAnnouncements } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => AnnouncementApi.findAll(),
    retry: false,
  });

  const markRead = async (n: NotificationItem) => {
    try {
      if (!n.isRead) {
        await NotificationApi.markAsRead(n.id);
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
      if (n.link) {
        let target = n.link;
        if (n.type === 'GOAL' || target.startsWith('/goal') || target.startsWith('/goals')) {
          target = '/goal';
        }
        router.push(target);
      }
    } catch (err) {
      console.error('markRead failed:', err);
    }
  };

  const dismiss = async (id: string) => {
    try {
      await NotificationApi.delete(id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (err) {
      console.error('dismiss failed:', err);
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    await Promise.allSettled(unread.map(n => NotificationApi.markAsRead(n.id)));
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const clearAllRead = async () => {
    const readItems = notifications.filter(n => n.isRead);
    await Promise.allSettled(readItems.map(n => NotificationApi.delete(n.id)));
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const filtered = notifications.filter(n => {
    if (tab === 'unread') return !n.isRead;
    if (tab === 'INVESTMENT') return n.type === 'INVESTMENT';
    if (tab === 'GOAL') return n.type === 'GOAL';
    if (tab === 'REMINDER') return n.type === 'REMINDER';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const readCount = notifications.filter(n => n.isRead).length;

  if (loadingNotifs || loadingAnnouncements) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Header Tabs & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Tabs
          tabs={[
            { label: 'ทั้งหมด', value: 'all' },
            { label: `ยังไม่อ่าน${unreadCount > 0 ? ` (${unreadCount})` : ''}`, value: 'unread' },
            { label: `ประกาศสาธารณะ (${announcements.length})`, value: 'ANNOUNCEMENT' },
            { label: 'การลงทุน', value: 'INVESTMENT' },
            { label: 'เป้าหมาย', value: 'GOAL' },
          ]}
          active={tab}
          onChange={setTab}
        />

        {tab !== 'ANNOUNCEMENT' && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead} className="cursor-pointer text-xs">
                <CheckCheck className="w-3.5 h-3.5 mr-1 text-emerald-500" /> อ่านทั้งหมด
              </Button>
            )}

            {readCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllRead} className="cursor-pointer text-xs text-muted-foreground hover:text-destructive">
                <Trash2 className="w-3.5 h-3.5 mr-1" /> ลบที่อ่านแล้ว
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Main List Rendering */}
      {tab === 'ANNOUNCEMENT' ? (
        /* Announcements Tab Only */
        announcements.length === 0 ? (
          <Card className="p-8">
            <EmptyState
              title="ไม่มีประกาศในขณะนี้"
              description="ยังไม่มีประกาศข่าวสารสาธารณะจากผู้ดูแลระบบ"
              icon={<Megaphone className="w-8 h-8 text-muted-foreground" />}
            />
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {announcements.map((a) => {
              const typeBadge = ANNOUNCEMENT_TYPE[a.type] ?? { label: a.type, variant: 'neutral' as const };
              const dateStr = a.publishedAt || a.createdAt
                ? new Date(a.publishedAt || a.createdAt).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '-';

              return (
                <div
                  key={a.id}
                  className="p-4.5 rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 shadow-sm relative overflow-hidden transition-all hover:border-violet-500/50"
                >
                  <span className="absolute top-0 left-0 bottom-0 w-1.5 bg-violet-500" />
                  <div className="flex items-start gap-3.5 pl-1">
                    <div className="size-10 rounded-2xl bg-violet-500/20 text-violet-500 font-bold flex items-center justify-center shrink-0 border border-violet-500/20">
                      <Megaphone className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-600 dark:text-violet-300 border border-violet-500/30">
                            <Sparkles className="size-3" /> ประกาศระบบ
                          </span>
                          <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
                        </div>
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
                          <Calendar className="size-3" /> {dateStr}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-foreground">{a.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line mt-1">
                        {a.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Notifications Tab View (In 'all' tab, show prominent Announcements at the TOP!) */
        <div className="flex flex-col gap-3">

          {/* Render Prominent Announcements at Top of 'ทั้งหมด' (All) Tab */}
          {tab === 'all' && announcements.length > 0 && (
            <div className="space-y-3 mb-2">
              {announcements.map((a) => {
                const typeBadge = ANNOUNCEMENT_TYPE[a.type] ?? { label: a.type, variant: 'neutral' as const };
                const dateStr = a.publishedAt || a.createdAt
                  ? new Date(a.publishedAt || a.createdAt).toLocaleDateString('th-TH', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '-';

                return (
                  <div
                    key={`pinned-${a.id}`}
                    className="p-4 rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 shadow-sm relative overflow-hidden transition-all hover:border-violet-500/50"
                  >
                    <span className="absolute top-0 left-0 bottom-0 w-1.5 bg-violet-500" />
                    <div className="flex items-start gap-3.5 pl-1">
                      <div className="size-10 rounded-2xl bg-violet-500/20 text-violet-500 font-bold flex items-center justify-center shrink-0 border border-violet-500/20">
                        <Megaphone className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-600 dark:text-violet-300 border border-violet-500/30">
                              <Sparkles className="size-3" /> ประกาศระบบ
                            </span>
                            <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
                          </div>
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
                            <Calendar className="size-3" /> {dateStr}
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-foreground">{a.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line mt-1">
                          {a.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Render User Notifications */}
          {filtered.length === 0 && (tab !== 'all' || announcements.length === 0) ? (
            <Card className="p-8">
              <EmptyState
                title="ไม่มีการแจ้งเตือน"
                description={tab === 'unread' ? 'อ่านการแจ้งเตือนทั้งหมดแล้ว' : 'ยังไม่มีข้อมูลการแจ้งเตือนในประเภทนี้'}
                icon={<Bell className="w-8 h-8 text-muted-foreground" />}
              />
            </Card>
          ) : (
            filtered.map(n => {
              const config = typeConfig[n.type];
              const Icon = config?.icon || Bell;
              return (
                <Card
                  key={n.id}
                  className={`p-4 transition-all hover:shadow-md cursor-pointer relative overflow-hidden ${
                    !n.isRead
                      ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10'
                      : 'border-border bg-card'
                  }`}
                  onClick={() => markRead(n)}
                >
                  {!n.isRead && (
                    <span className="absolute top-0 left-0 bottom-0 w-1 bg-emerald-500" />
                  )}

                  <div className="flex items-start gap-3.5 pl-1">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${config?.bg}`}>
                      <Icon className={`w-5 h-5 ${config?.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className={`text-sm font-bold ${!n.isRead ? 'text-foreground font-extrabold' : 'text-foreground/90'}`}>
                              {n.title}
                            </p>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {config?.label || n.type}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {n.message}
                          </p>

                          {n.link && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                markRead(n);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-2 hover:underline cursor-pointer"
                            >
                              ดูรายละเอียด <ExternalLink className="size-3" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                            {formatTime(n.createdAt)}
                          </span>

                          <button
                            onClick={e => {
                              e.stopPropagation();
                              dismiss(n.id);
                            }}
                            title="ลบการแจ้งเตือน"
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
