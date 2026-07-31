'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TrendingUp,
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  Settings,
  ChevronLeft,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthContext';
import NavigationItem from './NavigationItem';

const ADMIN_NAV_ITEMS = [
  { label: 'Admin Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'ผู้ใช้งาน',       icon: Users,           href: '/admin/users' },
  { label: 'รายงาน',          icon: FileText,         href: '/admin/reports' },
  { label: 'Activity Logs',    icon: Activity,         href: '/admin/activity' },
  { label: 'ตั้งค่าระบบ',     icon: Settings,         href: '/admin/settings' },
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstname?.[0] ?? ''}${user.lastname?.[0] ?? ''}`.toUpperCase() || 'A'
    : 'A';

  const fullName = user
    ? `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim() || user.email
    : 'Admin';

  const email = user?.email ?? '';

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col justify-between h-screen sticky top-0 transition-colors duration-300">

      {/* Top Section: Brand Logo */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-violet-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.35)]">
            <Shield className="size-5" />
          </span>
          <div className="text-left select-none">
            <span className="block text-sm font-bold text-foreground leading-tight tracking-tight">
              InvestPro
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-violet-500 font-semibold uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Back to App Link */}
        <Link
          href="/dashboard"
          title="กลับไปหน้า User"
          className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
        >
          <ChevronLeft className="size-4" />
        </Link>
      </div>

      {/* Middle Section: Scrollable Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin">
        {ADMIN_NAV_ITEMS.map((item) => {
          // Exact match for /admin, prefix match for subroutes
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <NavigationItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive}
            />
          );
        })}
      </nav>

      {/* Bottom Section: User Profile Card & Logout */}
      <div className="p-4 border-t border-border space-y-4">

        {/* User Card */}
        <div className="flex items-center gap-3 p-1 select-none">
          <div className="size-10 rounded-xl bg-violet-500/20 text-violet-500 font-bold grid place-items-center text-sm border border-violet-500/10 shrink-0">
            {initials}
          </div>
          <div className="text-left overflow-hidden">
            <h4 className="text-xs font-bold text-foreground truncate">
              {fullName}
            </h4>
            <p className="text-[10px] text-muted-foreground truncate">
              {email}
            </p>
            <span className="inline-flex items-center gap-1 text-[9px] text-violet-500 font-semibold uppercase tracking-wide mt-0.5">
              <Shield className="size-2.5" /> Admin
            </span>
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
