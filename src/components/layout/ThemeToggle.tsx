/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 28 / Flow ขั้นตอนที่ 28]
 * ชื่อไฟล์: ThemeToggle.tsx
 * หน้าที่หลัก: Component สวิตช์สลับธีม Light Mode / Dark Mode
 * รับอะไรมาจากไหน (Input): User Click Event
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): อัปเดต class `dark` ที่ document.documentElement และบันทึกใน LocalStorage
 * ==========================================
 */

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
