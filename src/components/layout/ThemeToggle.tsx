'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme state from html class list
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    setIsDark(isCurrentlyDark);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex size-9 items-center justify-center rounded-xl border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="size-[18px] text-yellow-500 animate-pulse" />
      ) : (
        <Moon className="size-[18px] text-indigo-600" />
      )}
    </button>
  );
}
