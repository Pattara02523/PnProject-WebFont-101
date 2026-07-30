'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TrendingUp,
  LayoutDashboard,
  Briefcase,
  TrendingDown,
  ArrowLeftRight,
  FolderTree,
  Target,
  BarChart3,
  Bell,
  User,
  Settings,
  ChevronLeft,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthContext';
import NavigationItem from './NavigationItem';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Portfolio', icon: Briefcase, href: '/portfolio' },
  { label: 'การลงทุน', icon: TrendingUp, href: '/investment' },
  { label: 'Transaction', icon: ArrowLeftRight, href: '/transaction' },
  { label: 'หมวดหมู่', icon: FolderTree, href: '/category' },
  { label: 'เป้าหมาย', icon: Target, href: '/goal' },
  { label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { label: 'แจ้งเตือน', icon: Bell, href: '/notification' },
  { label: 'โปรไฟล์', icon: User, href: '/profile' },
  { label: 'ตั้งค่า', icon: Settings, href: '/settings' },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstname?.[0] ?? ''}${user.lastname?.[0] ?? ''}`.toUpperCase() || 'U'
    : 'U';

  const fullName = user
    ? `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim() || user.email
    : 'ผู้ใช้งาน';

  const email = user?.email ?? '';

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col justify-between h-screen sticky top-0 transition-colors duration-300">
      
      {/* Top Section: Brand Logo & Selector */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        
        {/* Logo and dropdown area */}
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <TrendingUp className="size-5" />
          </span>
          <div className="text-left select-none">
            <span className="block text-sm font-bold text-foreground leading-tight tracking-tight">
              InvestPro
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              PORTFOLIO
              <ChevronDown className="size-2.5" />
            </span>
          </div>
        </div>

        {/* Collapse Button */}
        <button className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer">
          <ChevronLeft className="size-4" />
        </button>

      </div>

      {/* Middle Section: Scrollable Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin">
        {SIDEBAR_ITEMS.map((item) => (
          <NavigationItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
          />
        ))}
      </nav>

      {/* Bottom Section: User Profile Card & Logout */}
      <div className="p-4 border-t border-border space-y-4">
        
        {/* User Card */}
        <div className="flex items-center gap-3 p-1 select-none">
          <div className="size-10 rounded-xl bg-emerald-500/20 text-emerald-500 font-bold grid place-items-center text-sm border border-emerald-500/10 shrink-0">
            {initials}
          </div>
          <div className="text-left overflow-hidden">
            <h4 className="text-sm font-bold text-foreground truncate">
              {fullName}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {email}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full h-10 px-3 flex items-center gap-2.5 rounded-xl border border-border/80 bg-card hover:bg-destructive/10 text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all font-medium text-sm cursor-pointer active:scale-[0.98]"
        >
          <LogOut className="size-4.5" />
          <span>ออกจากระบบ</span>
        </button>

      </div>

    </aside>
  );
}
