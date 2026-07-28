import '@/styles/globals.css';

import { cn } from '@/lib/utils';
import { notoSans } from '@/styles/font';
import { Metadata } from 'next';

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
    >
      <body>{children}</body>
    </html>
  );
}
