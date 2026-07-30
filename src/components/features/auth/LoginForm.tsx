'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Lock, Mail, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthContext';
import { Button } from '@/components/ui/button';

const loginSchema = z.object({
  email: z.string().min(1, 'กรุณากรอกอีเมล').email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get('registered') === 'true';
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await login(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="dark grid min-h-screen bg-background text-foreground lg:grid-cols-[0.82fr_1fr]">
      {/* Left side panel (hidden on mobile) */}
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

      {/* Right side form */}
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

          {isRegistered && !errorMsg && (
            <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-emerald-500/15 p-3.5 text-sm text-emerald-400 border border-emerald-500/25">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>สมัครสมาชิกสำเร็จแล้ว! กรุณาเข้าสู่ระบบ</span>
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 rounded-xl bg-destructive/15 p-3 text-sm text-destructive border border-destructive/25">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium">อีเมล</label>
              <span className={`flex h-11 items-center gap-3 rounded-xl border bg-card px-3 text-muted-foreground focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/60 transition-all ${errors.email ? 'border-destructive' : 'border-border'}`}>
                <Mail className="size-4" />
                <input
                  {...register('email')}
                  className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground text-sm"
                  placeholder="your@email.com"
                  type="email"
                />
              </span>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">รหัสผ่าน</label>
              <span className={`flex h-11 items-center gap-3 rounded-xl border bg-card px-3 text-muted-foreground focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/60 transition-all ${errors.password ? 'border-destructive' : 'border-border'}`}>
                <Lock className="size-4" />
                <input
                  {...register('password')}
                  className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground text-sm"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-foreground text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </span>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input
                  className="size-4 rounded border bg-card accent-primary"
                  type="checkbox"
                />
                <span>จดจำไว้</span>
              </label>
              <Link
                className="font-medium text-primary hover:underline"
                href="/forgot-password"
              >
                ลืมรหัสผ่าน?
              </Link>
            </div>

            <Button
              className="h-12 w-full rounded-xl text-base"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            <span>ยังไม่มีบัญชี?</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            สมัครสมาชิกใหม่?{' '}
            <Link className="font-medium text-primary hover:underline" href="/register">
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
