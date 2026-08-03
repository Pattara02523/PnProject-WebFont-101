/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 22 / Flow ขั้นตอนที่ 22]
 * ชื่อไฟล์: QueryProvider.tsx
 * หน้าที่หลัก: React Client Component สำหรับลงทะเบียน TanStack React Query Provider สำหรับจัดการ Caching & Data Fetching ทั้งแอป
 * รับอะไรมาจากไหน (Input): children React Nodes
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): ครอบทุก Component ใน `layout.tsx` ให้สามารถใช้ useQuery/useMutation
 * ==========================================
 */

'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
