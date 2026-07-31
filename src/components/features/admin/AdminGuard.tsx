'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthContext';

/**
 * AdminGuard — ห่อหน้า Admin ไว้
 * ถ้า user ไม่ได้ login หรือ role ไม่ใช่ ADMIN จะ redirect ไปหน้าที่เหมาะสม
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (user.role !== 'ADMIN') {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // While loading show spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="size-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Not admin — show nothing while redirect happens
  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return <>{children}</>;
}
