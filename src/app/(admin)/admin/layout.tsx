/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 72 / Flow ขั้นตอนที่ 72]
 * ชื่อไฟล์: layout.tsx
 * หน้าที่หลัก: Layout สำหรับผู้ดูแลระบบ ครอบด้วย `<AdminGuard />` และ `<AdminSidebar />`
 * รับอะไรมาจากไหน (Input): children React Nodes
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render โครงสร้างแผงควบคุม Admin
 * ==========================================
 */

import React from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Header from '@/components/layout/Header';
import AdminGuard from '@/components/features/admin/AdminGuard';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminGuard>
      <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
        {/* Admin Sidebar */}
        <AdminSidebar />

        {/* Right Scrollable Page Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {/* Top Header */}
          <Header />

          {/* Scrollable page body */}
          <main className="flex-1 overflow-y-auto p-5 sm:p-6 bg-violet-50/30 dark:bg-violet-950/10">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
