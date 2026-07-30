"use client";

import { useState } from 'react';
import { Bell, TrendingUp, Target, Clock, CheckCheck, X, Loader2 } from 'lucide-react';
import { Card, Button, Tabs, EmptyState } from '@/components/ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationApi, NotificationItem } from '@/lib/api/notification.api';

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  INVESTMENT: { icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  GOAL:       { icon: Target,    color: 'text-blue-600',    bg: 'bg-blue-50 dark:bg-blue-900/20' },
  REMINDER:   { icon: Clock,     color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-900/20' },
};

const formatTime = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'เมื่อกี้';
  if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
  return `${Math.floor(diff / 86400)} วันที่แล้ว`;
};

export default function NotificationContent() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('all');

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => NotificationApi.findAll(),
    retry: false,
  });

  const markRead = async (id: string) => {
    try {
      await NotificationApi.markAsRead(id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
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

  const filtered = notifications.filter(n => {
    if (tab === 'unread') return !n.isRead;
    if (tab === 'INVESTMENT') return n.type === 'INVESTMENT';
    if (tab === 'GOAL') return n.type === 'GOAL';
    if (tab === 'REMINDER') return n.type === 'REMINDER';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tabs
            tabs={[
              { label: 'ทั้งหมด', value: 'all' },
              { label: `ยังไม่อ่าน${unreadCount > 0 ? ` (${unreadCount})` : ''}`, value: 'unread' },
              { label: 'การลงทุน', value: 'INVESTMENT' },
              { label: 'เป้าหมาย', value: 'GOAL' },
              { label: 'แจ้งเตือน', value: 'REMINDER' },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            <CheckCheck className="w-4 h-4" /> อ่านทั้งหมด
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="ไม่มีการแจ้งเตือน" description="ไม่มีการแจ้งเตือนในขณะนี้" icon={<Bell className="w-8 h-8" />} />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(n => {
            const config = typeConfig[n.type];
            const Icon = config?.icon || Bell;
            return (
              <Card
                key={n.id}
                className={`p-4 transition-all cursor-pointer ${!n.isRead ? 'ring-1 ring-emerald-200 dark:ring-emerald-800' : ''}`}
                onClick={() => markRead(n.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${config?.bg}`}>
                    <Icon className={`w-5 h-5 ${config?.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{n.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {!n.isRead && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                        <button
                          onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-300 hover:text-slate-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 dark:text-slate-600 mt-1.5">{formatTime(n.createdAt)}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
