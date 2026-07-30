import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Scrollable Page Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-6 bg-zinc-50/50 dark:bg-slate-950/40">
          {children}
        </main>
      </div>
    </div>
  );
}
