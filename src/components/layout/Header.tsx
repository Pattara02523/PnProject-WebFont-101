/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 30 / Flow ขั้นตอนที่ 30]
 * ชื่อไฟล์: Header.tsx
 * หน้าที่หลัก: Component แถบเมนูด้านบน (Top Navbar Header) แสดงแจ้งเตือน, ปุ่มเปลี่ยนธีม, และเมนูโปรไฟล์ผู้ใช้งาน
 * รับอะไรมาจากไหน (Input): User Auth State จาก AuthContext, Notifications
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render แถบเมนูบนของแอปพลิเคชัน
 * ==========================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ThemeToggle } from './ThemeToggle';
import { NotificationApi } from '@/lib/api/notification.api';

const PATH_TITLE_MAP: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/portfolio': 'Portfolio',
  '/investment': 'การลงทุน',
  '/transaction': 'Transaction',
  '/category': 'หมวดหมู่',
  '/goal': 'เป้าหมาย',
  '/analytics': 'Analytics',
  '/notification': 'แจ้งเตือน',
  '/profile': 'โปรไฟล์',
};

export default function Header() {
  const pathname = usePathname();

  // Real unread notifications count query
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => NotificationApi.findAll(),
    retry: false,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Find matching title based on path
  const getPageTitle = () => {
    if (PATH_TITLE_MAP[pathname]) return PATH_TITLE_MAP[pathname];
    for (const prefix in PATH_TITLE_MAP) {
      if (pathname.startsWith(prefix + '/')) {
        return PATH_TITLE_MAP[prefix];
      }
    }
    return 'InvestPro';
  };

  return (
    <header className="h-16 border-b border-border bg-card/45 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300">
      {/* Left: Active Section Title */}
      <h2 className="text-xl font-bold text-foreground tracking-tight select-none">
        {getPageTitle()}
      </h2>

      {/* Right: Notifications, Theme Switcher */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon Button with Real Badge & Link */}
        <Link href="/notification">
          <button
            title="ดูการแจ้งเตือน"
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground relative transition-all cursor-pointer"
          >
            <Bell className="size-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 size-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-card animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </Link>

        {/* Theme Toggle Button */}
        <ThemeToggle />
      </div>
    </header>
  );
}
