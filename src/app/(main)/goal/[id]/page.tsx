"use client";

import Link from 'next/link';
import { ArrowLeft, Target, Calendar } from 'lucide-react';
import { Card, Button } from '@/components/ui';

export default function GoalDetailPage({ params }: { params: { id: string } }) {
  const goal = {
    name: 'ซื้อบ้าน',
    target: 3000000,
    current: 1460000,
    deadline: 'ธ.ค. 2028'
  };

  const progressPercent = Math.min(100, Math.round((goal.current / goal.target) * 100));

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <Link href="/dashboard" className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 w-fit">
        <ArrowLeft className="w-4 h-4" /> กลับ
      </Link>

      <Card className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{goal.name}</h1>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <Calendar className="w-4 h-4" /> เป้าหมาย: {goal.deadline}
              </p>
            </div>
          </div>
          <Button variant="outline">แก้ไขเป้าหมาย</Button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">สะสมแล้ว</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">฿{(goal.current).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 mb-1">จากเป้าหมาย</p>
              <p className="text-xl font-semibold text-slate-700 dark:text-slate-300">฿{(goal.target).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2">
            <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 text-right">{progressPercent}% สำเร็จ</p>
        </div>
      </Card>
    </div>
  );
}
