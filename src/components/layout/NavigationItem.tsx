import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

type NavigationItemProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
};

export default function NavigationItem({
  href,
  icon: Icon,
  label,
  isActive = false,
}: NavigationItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 select-none font-medium text-sm',
        isActive
          ? 'bg-primary/10 text-primary dark:text-emerald-400'
          : 'text-zinc-400 hover:text-foreground hover:bg-muted/40 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/40'
      )}
    >
      <div className="flex items-center gap-3.5">
        <Icon
          className={cn(
            'size-5 transition-transform duration-200 group-hover:scale-105',
            isActive ? 'text-primary dark:text-emerald-400' : 'text-zinc-400 group-hover:text-foreground dark:text-zinc-500 dark:group-hover:text-zinc-300'
          )}
        />
        <span>{label}</span>
      </div>

      {isActive && (
        <span className="size-2 rounded-full bg-primary dark:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
      )}
    </Link>
  );
}
