import { Metadata } from 'next';
import Link from 'next/link';
import { Eye, Lock, Mail, Phone, TrendingUp, User } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Register',
};

export default function RegisterPage() {
  return (
    <main className="dark min-h-screen bg-background px-5 py-8 text-foreground">
      <div className="mx-auto flex w-full max-w-[512px] flex-col items-center">
        <Link className="flex items-center gap-3" href="/">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <TrendingUp className="size-5" />
          </span>
          <span className="text-2xl font-bold">InvestPro</span>
        </Link>

        <section className="mt-7 w-full rounded-2xl border bg-card px-8 py-9 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold">สมัครสมาชิก</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              เริ่มบริหารพอร์ตลงทุนได้ทันที
            </p>
          </div>

          <form className="mt-7 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium">
                <span>ชื่อ</span>
                <span className="flex h-11 items-center gap-3 rounded-xl border bg-background px-3 text-muted-foreground">
                  <User className="size-4" />
                  <input
                    className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                    placeholder="ชื่อจริง"
                  />
                </span>
              </label>

              <label className="space-y-2 text-sm font-medium">
                <span>นามสกุล</span>
                <span className="flex h-11 items-center rounded-xl border bg-background px-3">
                  <input
                    className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                    placeholder="นามสกุล"
                  />
                </span>
              </label>
            </div>

            <label className="block space-y-2 text-sm font-medium">
              <span>อีเมล</span>
              <span className="flex h-11 items-center gap-3 rounded-xl border bg-background px-3 text-muted-foreground">
                <Mail className="size-4" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="your@email.com"
                  type="email"
                />
              </span>
            </label>

            <label className="block space-y-2 text-sm font-medium">
              <span>เบอร์โทรศัพท์</span>
              <span className="flex h-11 items-center gap-3 rounded-xl border bg-background px-3 text-muted-foreground">
                <Phone className="size-4" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="081-234-5678"
                  type="tel"
                />
              </span>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium">
                <span>รหัสผ่าน</span>
                <span className="flex h-11 items-center gap-3 rounded-xl border bg-background px-3 text-muted-foreground">
                  <Lock className="size-4" />
                  <input
                    className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                    placeholder="••••••••"
                    type="password"
                  />
                  <Eye className="size-4" />
                </span>
              </label>

              <label className="space-y-2 text-sm font-medium">
                <span>ยืนยันรหัสผ่าน</span>
                <span className="flex h-11 items-center rounded-xl border bg-background px-3">
                  <input
                    className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                    placeholder="••••••••"
                    type="password"
                  />
                </span>
              </label>
            </div>

            <label className="flex items-start gap-3 pt-1 text-sm text-muted-foreground">
              <input
                className="mt-1 size-4 rounded border bg-background accent-primary"
                type="checkbox"
              />
              <span>
                ฉันยอมรับ{' '}
                <Link className="font-medium text-primary" href="/terms">
                  ข้อกำหนดการใช้งาน
                </Link>{' '}
                และ{' '}
                <Link className="font-medium text-primary" href="/privacy">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </span>
            </label>

            <Button
              className="mt-2 h-12 w-full rounded-xl text-base"
              type="button"
            >
              สมัครสมาชิก
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            มีบัญชีแล้ว?{' '}
            <Link className="font-medium text-primary" href="/login">
              เข้าสู่ระบบ
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
