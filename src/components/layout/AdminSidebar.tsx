'use client';

import React, { useState } from 'react';
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
  ChevronRight,
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
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const initials = user
    ? `${user.firstname?.[0] ?? ''}${user.lastname?.[0] ?? ''}`.toUpperCase() || 'A'
    : 'A';

  const fullName = user
    ? `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim() || user.email
    : 'Admin';

  const email = user?.email ?? '';

  return (
    <aside
      className={`${
        collapsed ? 'w-[68px]' : 'w-64'
      } bg-card border-r border-border flex flex-col justify-between h-screen sticky top-0 transition-all duration-300 overflow-hidden`}
    >
      {/* Top Section: Brand Logo */}
      <div className={`p-4 border-b border-border flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid size-9 place-items-center rounded-xl bg-violet-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.35)] shrink-0">
            <Shield className="size-5" />
          </span>
          {!collapsed && (
            <div className="text-left select-none min-w-0">
              <span className="block text-sm font-bold text-foreground leading-tight tracking-tight truncate">
                InvestPro
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-violet-500 font-semibold uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'ขยาย Sidebar' : 'ย่อ Sidebar'}
          className={`p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all shrink-0 ${collapsed ? 'hidden' : ''}`}
        >
          <ChevronLeft className="size-4" />
        </button>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            title="ขยาย Sidebar"
            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all mt-1"
          >
            <ChevronRight className="size-4" />
          </button>
        )}
      </div>

      {/* Middle Section: Scrollable Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname === item.href || pathname.startsWith(item.href + '/');

          if (collapsed) {
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`flex items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary dark:text-emerald-400'
                    : 'text-zinc-400 hover:text-foreground hover:bg-muted/40 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/40'
                }`}
              >
                <item.icon className="size-5" />
              </Link>
            );
          }

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
      <div className={`border-t border-border ${collapsed ? 'p-2 space-y-2' : 'p-4 space-y-4'}`}>

        {/* User Card - only when expanded */}
        {!collapsed && (
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
        )}

        {/* Collapsed: show avatar only */}
        {collapsed && (
          <div className="flex justify-center">
            <div className="size-9 rounded-xl bg-violet-500/20 text-violet-500 font-bold grid place-items-center text-sm border border-violet-500/10">
              {initials}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={logout}
          title="ออกจากระบบ"
          className={`w-full h-10 px-3 flex items-center rounded-xl border border-border/80 bg-card hover:bg-destructive/10 text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all font-medium text-sm cursor-pointer active:scale-[0.98] ${
            collapsed ? 'justify-center' : 'gap-2.5'
          }`}
        >
          <LogOut className="size-4.5 shrink-0" />
          {!collapsed && <span>ออกจากระบบ</span>}
        </button>

      </div>
    </aside>
  );
}
