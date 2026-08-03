/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 58 / Flow ขั้นตอนที่ 58]
 * ชื่อไฟล์: page.tsx
 * หน้าที่หลัก: Dynamic Route Page รายละเอียดเป้าหมายการเงินเฉพาะ ID (`/goal/[id]`)
 * รับอะไรมาจากไหน (Input): params.id
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render หน้ารายละเอียดเป้าหมายรายตัว
 * ==========================================
 */

'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Target, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { GoalApi, Goal } from '@/lib/api/goal.api';

export default function GoalDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = use(Promise.resolve(params));
  const id = resolvedParams.id;

  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGoal() {
      try {
        setLoading(true);
        setError(null);
        const data = await GoalApi.findOne(id);
        setGoal(data);
      } catch (err: any) {
        setError(err?.message ?? 'ไม่สามารถดึงข้อมูลเป้าหมายได้');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadGoal();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <Link href="/goal" className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 w-fit font-medium">
          <ArrowLeft className="w-4 h-4" /> ย้อนกลับหน้าเป้าหมาย
        </Link>
        <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-3">
          <AlertCircle className="size-5 shrink-0" />
          <p className="text-sm font-semibold">{error || 'ไม่พบข้อมูลเป้าหมายนี้ในระบบ'}</p>
        </div>
      </div>
    );
  }

  const targetAmount = Number(goal.targetAmount);
  const currentAmount = Number(goal.currentAmount);
  const progressPercent = targetAmount > 0 ? Math.min(100, Math.round((currentAmount / targetAmount) * 100)) : 0;
  const deadlineStr = new Date(goal.deadline).toLocaleDateString('th-TH', {
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <Link href="/goal" className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 w-fit font-medium">
        <ArrowLeft className="w-4 h-4" /> ย้อนกลับหน้าเป้าหมาย
      </Link>

      <Card className="p-8">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">{goal.title}</h1>
                <Badge variant={goal.status === 'COMPLETED' ? 'success' : goal.status === 'FAILED' ? 'danger' : 'neutral'}>
                  {goal.status === 'COMPLETED' ? 'สำเร็จแล้ว' : goal.status === 'FAILED' ? 'ไม่บรรลุ' : 'กำลังดำเนินการ'}
                </Badge>
              </div>
              {goal.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{goal.description}</p>
              )}
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="w-4 h-4 text-emerald-500" /> กำหนดเป้าหมาย: {deadlineStr}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 p-6 rounded-2xl border border-border">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">สะสมแล้ว</p>
              <p className="text-3xl font-bold text-foreground">฿{currentAmount.toLocaleString('th-TH')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">จากเป้าหมาย</p>
              <p className="text-xl font-semibold text-foreground">฿{targetAmount.toLocaleString('th-TH')}</p>
            </div>
          </div>

          <div className="w-full bg-muted rounded-full h-3 mb-2 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                progressPercent >= 100 ? 'bg-emerald-500' : 'bg-primary'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm font-bold text-foreground text-right">{progressPercent}% สำเร็จ</p>
        </div>
      </Card>
    </div>
  );
}
