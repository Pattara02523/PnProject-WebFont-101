/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 25 / Flow ขั้นตอนที่ 25]
 * ชื่อไฟล์: layout.tsx
 * หน้าที่หลัก: Root Layout หลักของแอปพลิเคชัน ห่อหุ้มด้วย HTML Structure, Custom Fonts, QueryProvider และ AuthProvider
 * รับอะไรมาจากไหน (Input): children React Nodes
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render โครงสร้างหน้าเว็บพื้นฐานของทุก Route
 * ==========================================
 */

import '@/styles/globals.css';

import { cn } from '@/lib/utils';
import { notoSans } from '@/styles/font';
import { Metadata } from 'next';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthProvider } from '@/components/providers/AuthContext';

export const metadata: Metadata = {
  title: {
    template: '%s | InvestmentPro',
    default: 'InvestmentPro',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn('antialiased', 'font-sans', notoSans.variable)}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('theme');
                if (saved === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
