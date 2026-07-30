'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Lock, Mail, Phone, TrendingUp, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthContext';
import { Button } from '@/components/ui/button';

const registerSchema = z
  .object({
    firstname: z.string().min(1, 'กรุณากรอกชื่อจริง'),
    lastname: z.string().min(1, 'กรุณากรอกนามสกุล'),
    email: z.string().min(1, 'กรุณากรอกอีเมล').email('รูปแบบอีเมลไม่ถูกต้อง'),
    phone: z.string().optional(),
    password: z.string().min(6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'),
    confirmPassword: z.string().min(6, 'กรุณากรอกยืนยันรหัสผ่าน'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'กรุณายอมรับข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัว',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false as any,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await signup({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    } finally {
      setIsSubmitting(false);
    }
  };

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

          {errorMsg && (
            <div className="mt-4 rounded-xl bg-destructive/15 p-3 text-sm text-destructive border border-destructive/25">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">ชื่อ</label>
                <span className={`flex h-11 items-center gap-3 rounded-xl border bg-background px-3 text-muted-foreground focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/60 transition-all ${errors.firstname ? 'border-destructive' : 'border-border'}`}>
                  <UserIcon className="size-4" />
                  <input
                    {...register('firstname')}
                    className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground text-sm"
                    placeholder="ชื่อจริง"
                  />
                </span>
                {errors.firstname && (
                  <p className="text-xs text-destructive">{errors.firstname.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">นามสกุล</label>
                <span className={`flex h-11 items-center rounded-xl border bg-background px-3 focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/60 transition-all ${errors.lastname ? 'border-destructive' : 'border-border'}`}>
                  <input
                    {...register('lastname')}
                    className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground text-sm"
                    placeholder="นามสกุล"
                  />
                </span>
                {errors.lastname && (
                  <p className="text-xs text-destructive">{errors.lastname.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">อีเมล</label>
              <span className={`flex h-11 items-center gap-3 rounded-xl border bg-background px-3 text-muted-foreground focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/60 transition-all ${errors.email ? 'border-destructive' : 'border-border'}`}>
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
              <label className="block text-sm font-medium">เบอร์โทรศัพท์</label>
              <span className={`flex h-11 items-center gap-3 rounded-xl border bg-background px-3 text-muted-foreground focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/60 transition-all ${errors.phone ? 'border-destructive' : 'border-border'}`}>
                <Phone className="size-4" />
                <input
                  {...register('phone')}
                  className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground text-sm"
                  placeholder="081-234-5678"
                  type="tel"
                />
              </span>
              {errors.phoneNumber && (
                <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">รหัสผ่าน</label>
                <span className={`flex h-11 items-center gap-3 rounded-xl border bg-background px-3 text-muted-foreground focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/60 transition-all ${errors.password ? 'border-destructive' : 'border-border'}`}>
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

              <div className="space-y-2">
                <label className="text-sm font-medium">ยืนยันรหัสผ่าน</label>
                <span className={`flex h-11 items-center rounded-xl border bg-background px-3 focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/60 transition-all ${errors.confirmPassword ? 'border-destructive' : 'border-border'}`}>
                  <input
                    {...register('confirmPassword')}
                    className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground text-sm"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                  />
                </span>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-start gap-3 pt-1 text-sm text-muted-foreground">
                <input
                  {...register('acceptTerms')}
                  className="mt-1 size-4 rounded border bg-background accent-primary"
                  type="checkbox"
                />
                <span>
                  ฉันยอมรับ{' '}
                  <Link className="font-medium text-primary hover:underline" href="/terms">
                    ข้อกำหนดการใช้งาน
                  </Link>{' '}
                  และ{' '}
                  <Link className="font-medium text-primary hover:underline" href="/privacy">
                    นโยบายความเป็นส่วนตัว
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
              )}
            </div>

            <Button
              className="mt-2 h-12 w-full rounded-xl text-base"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            มีบัญชีแล้ว?{' '}
            <Link className="font-medium text-primary hover:underline" href="/login">
              เข้าสู่ระบบ
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
