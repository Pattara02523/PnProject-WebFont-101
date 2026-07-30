'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, Sun, Moon } from 'lucide-react';

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
  '/settings': 'ตั้งค่า',
};

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Sync theme status on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  // Find matching title based on path
  const getPageTitle = () => {
    // Exact match
    if (PATH_TITLE_MAP[pathname]) return PATH_TITLE_MAP[pathname];
    
    // Prefix match
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

      {/* Right: Search, Notifications, Theme Switcher */}
      <div className="flex items-center gap-4">
        
        {/* Search Bar */}
        <div className="relative hidden sm:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ค้นหา..."
            className="w-full h-9 pl-9 pr-4 rounded-xl text-sm border border-border bg-muted/40 hover:bg-muted/65 text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary/60 focus:ring-1 focus:ring-primary/60"
          />
        </div>

        {/* Notifications Icon Button */}
        <button className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground relative transition-all cursor-pointer">
          <Bell className="size-4.5" />
          <span className="absolute top-1 right-1 size-2 rounded-full bg-rose-500 ring-2 ring-card animate-pulse"></span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer active:scale-95 group"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="size-4.5 text-amber-500 transition-transform duration-500 group-hover:rotate-45" />
          ) : (
            <Moon className="size-4.5 text-indigo-400 transition-transform duration-500 group-hover:-rotate-12" />
          )}
        </button>

      </div>

    </header>
  );
}
