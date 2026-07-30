"use client";

import { useState } from 'react'
import { Bell, TrendingUp, Target, Settings, CheckCheck, X } from 'lucide-react'
import { Card, Button, Tabs, EmptyState } from '@/components/ui'
import { mockNotifications } from '@/lib/mock-data'

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  price: { icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  goal: { icon: Target, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  system: { icon: Settings, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800' },
  reminder: { icon: Bell, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
}

export default function NotificationContent() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [tab, setTab] = useState('all')

  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })))
  const dismiss = (id: string) => setNotifications(ns => ns.filter(n => n.id !== id))
  const markRead = (id: string) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))

  const filtered = notifications.filter(n => {
    if (tab === 'unread') return !n.read
    if (tab === 'price') return n.type === 'price'
    if (tab === 'goal') return n.type === 'goal'
    if (tab === 'system') return n.type === 'system' || n.type === 'reminder'
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tabs
            tabs={[
              { label: 'ทั้งหมด', value: 'all' },
              { label: `ยังไม่อ่าน${unreadCount > 0 ? ` (${unreadCount})` : ''}`, value: 'unread' },
              { label: 'ราคา', value: 'price' },
              { label: 'เป้าหมาย', value: 'goal' },
              { label: 'ระบบ', value: 'system' },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}><CheckCheck className="w-4 h-4" /> อ่านทั้งหมด</Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="ไม่มีการแจ้งเตือน" description="ไม่มีการแจ้งเตือนในขณะนี้" icon={<Bell className="w-8 h-8" />} />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(n => {
            const config = typeConfig[n.type]
            const Icon = config?.icon || Bell
            return (
              <Card key={n.id} className={`p-4 transition-all ${!n.read ? 'ring-1 ring-emerald-200 dark:ring-emerald-800' : ''}`} onClick={() => markRead(n.id)}>
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
                        {!n.read && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                        <button onClick={e => { e.stopPropagation(); dismiss(n.id) }} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-300 hover:text-slate-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 dark:text-slate-600 mt-1.5">{n.time}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
