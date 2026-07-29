import { Metadata } from 'next';
import Link from 'next/link';
import { Eye, Lock, Mail, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <main className="dark grid min-h-screen bg-background text-foreground lg:grid-cols-[0.82fr_1fr]">
      <section className="hidden bg-primary px-10 py-12 text-primary-foreground lg:flex lg:flex-col">
        <Link className="flex items-center gap-3" href="/">
          <span className="grid size-9 place-items-center rounded-xl bg-white/15">
            <TrendingUp className="size-5" />
          </span>
          <span className="text-2xl font-bold">InvestPro</span>
        </Link>

        <div className="mt-24 max-w-xl">
          <h1 className="text-4xl font-bold leading-tight">
            บริหารพอร์ตลงทุน
            <br />
            อย่างมืออาชีพ
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-primary-foreground/90">
            วิเคราะห์ ติดตาม และเติบโตไปกับการลงทุนของคุณในที่เดียว
          </p>
        </div>

        <div className="mt-14 grid max-w-2xl grid-cols-2 gap-4">
          {[
            { value: '12,000+', label: 'นักลงทุน' },
            { value: '฿2.4B', label: 'มูลค่าสินทรัพย์' },
            { value: '4.9★', label: 'คะแนน' },
            { value: '99.9%', label: 'Uptime' },
          ].map((item) => (
            <div
              className="rounded-2xl bg-white/10 p-5 backdrop-blur"
              key={item.label}
            >
              <p className="text-3xl font-bold">{item.value}</p>
              <p className="mt-2 text-sm font-medium text-primary-foreground/90">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          <Link className="mb-10 flex items-center gap-3 lg:hidden" href="/">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <TrendingUp className="size-5" />
            </span>
            <span className="text-2xl font-bold">InvestPro</span>
          </Link>

          <div>
            <h1 className="text-2xl font-bold">ยินดีต้อนรับท่านสมาชิก</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              เข้าสู่ระบบเพื่อดูพอร์ตการลงทุน
            </p>
          </div>

          <form className="mt-8 space-y-5">
            <label className="block space-y-2 text-sm font-medium">
              <span>อีเมล</span>
              <span className="flex h-11 items-center gap-3 rounded-xl border bg-card px-3 text-muted-foreground">
                <Mail className="size-4" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="your@email.com"
                  type="email"
                />
              </span>
            </label>

            <label className="block space-y-2 text-sm font-medium">
              <span>รหัสผ่าน</span>
              <span className="flex h-11 items-center gap-3 rounded-xl border bg-card px-3 text-muted-foreground">
                <Lock className="size-4" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="••••••••"
                  type="password"
                />
                <Eye className="size-4" />
              </span>
            </label>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input
                  className="size-4 rounded border bg-card accent-primary"
                  type="checkbox"
                />
                <span>จดจำไว้</span>
              </label>
              <Link
                className="font-medium text-primary"
                href="/forgot-password"
              >
                ลืมรหัสผ่าน?
              </Link>
            </div>

            <Button className="h-12 w-full rounded-xl text-base" type="button">
              เข้าสู่ระบบ
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            <span>ยังไม่มีบัญชี?</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            สมัครสมาชิกใหม่?{' '}
            <Link className="font-medium text-primary" href="/register">
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
