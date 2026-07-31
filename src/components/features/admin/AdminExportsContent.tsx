'use client';

import { useState, useEffect, useCallback } from 'react';
import { Download, FileText, FileSpreadsheet, User, Calendar, Loader2, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { AdminApi, AdminUser } from '@/lib/api/admin.api';

export default function AdminExportsContent() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Form State
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [reportType, setReportType] = useState<'portfolio' | 'transactions'>('portfolio');
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await AdminApi.getUsers({ limit: '100' });
      const list = res.data ?? [];
      setUsers(list);
      if (list.length > 0) {
        setSelectedUserId(list[0].id);
      }
    } catch (e: any) {
      setError(e?.message ?? 'ดึงรายชื่อผู้ใช้งานไม่สำเร็จ');
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError('กรุณาเลือกผู้ใช้งานที่ต้องการส่งออกข้อมูล');
      return;
    }

    try {
      setExporting(true);
      setError(null);
      setSuccess(null);

      const params: Record<string, string> = {
        type: reportType,
      };
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const Cookies = require('js-cookie');
      const token = Cookies.get('auth_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
      const queryString = new URLSearchParams(params).toString();

      const response = await fetch(
        `${API_URL}/admin/users/${selectedUserId}/export/${format}?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let msg = 'ดาวน์โหลดรายงานไม่สำเร็จ';
        try {
          const errBody = await response.json();
          msg = errBody.message || msg;
        } catch (_) {}
        throw new Error(msg);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const targetUser = users.find(u => u.id === selectedUserId);
      const userLabel = targetUser ? `${targetUser.firstname}_${targetUser.lastname}` : 'user';
      a.download = `${reportType}-${userLabel}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(`ดาวน์โหลดรายงาน ${reportType.toUpperCase()} (${format.toUpperCase()}) สำเร็จแล้ว!`);
    } catch (err: any) {
      setError(err?.message ?? 'ส่งออกรายงานไม่สำเร็จ');
    } finally {
      setExporting(false);
    }
  };

  const selectedUser = users.find(u => u.id === selectedUserId);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-500">
          <Download className="size-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">ส่งออกรายงาน (Admin Export Reports)</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            เครื่องมือสำหรับผู้ดูแลระบบ (Admin) เลือกส่งออกรายงานการลงทุนและธุรกรรมของผู้ใช้งานเป็นไฟล์ PDF หรือ CSV
          </p>
        </div>
      </div>

      {/* Alert Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive animate-in fade-in duration-200">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">ข้อผิดพลาดในการส่งออกรายงาน</p>
            <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Alert Success */}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-200">
          <CheckCircle2 className="size-5 shrink-0" />
          <p className="font-semibold text-sm">{success}</p>
        </div>
      )}

      {/* Main Export Card Form */}
      <Card className="p-6 border border-border bg-card shadow-sm">
        <form onSubmit={handleExport} className="flex flex-col gap-6">

          {/* Step 1: Select User */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="size-4 text-violet-500" /> 1. เลือกผู้ใช้งาน (Select Target User) *
            </label>
            {loadingUsers ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                <Loader2 className="size-4 animate-spin text-violet-500" /> โหลดรายชื่อผู้ใช้งาน...
              </div>
            ) : (
              <select
                value={selectedUserId}
                onChange={e => setSelectedUserId(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 font-medium"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.firstname} {u.lastname} ({u.email}) — Role: {u.role}
                  </option>
                ))}
              </select>
            )}

            {selectedUser && (
              <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl bg-muted/40 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">ผู้ใช้ที่เลือก:</span>
                <span>{selectedUser.firstname} {selectedUser.lastname} ({selectedUser.email})</span>
                <Badge variant={selectedUser.role === 'ADMIN' ? 'warning' : 'neutral'}>
                  {selectedUser.role}
                </Badge>
              </div>
            )}
          </div>

          {/* Step 2: Select Report Type */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="size-4 text-violet-500" /> 2. ประเภทรายงาน (Report Type) *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setReportType('portfolio')}
                className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  reportType === 'portfolio'
                    ? 'border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold shadow-sm'
                    : 'border-border bg-muted/20 text-muted-foreground hover:border-border/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">พอร์ตการลงทุน (Portfolio)</span>
                  {reportType === 'portfolio' && <span className="size-2 rounded-full bg-violet-500" />}
                </div>
                <span className="text-xs text-muted-foreground font-normal">
                  รายงานมูลค่าพอร์ต สัดส่วนสินทรัพย์ กำไร/ขาดทุน และ ROI
                </span>
              </button>

              <button
                type="button"
                onClick={() => setReportType('transactions')}
                className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  reportType === 'transactions'
                    ? 'border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold shadow-sm'
                    : 'border-border bg-muted/20 text-muted-foreground hover:border-border/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">รายการธุรกรรม (Transactions)</span>
                  {reportType === 'transactions' && <span className="size-2 rounded-full bg-violet-500" />}
                </div>
                <span className="text-xs text-muted-foreground font-normal">
                  ประวัติการซื้อ ขาย ปันผล ฝาก และถอนเงินย้อนหลัง
                </span>
              </button>
            </div>
          </div>

          {/* Step 3: Select File Format */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileSpreadsheet className="size-4 text-violet-500" /> 3. รูปแบบไฟล์ (File Format) *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                  format === 'pdf'
                    ? 'border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400 font-bold'
                    : 'border-border bg-muted/20 text-muted-foreground hover:border-border/80'
                }`}
              >
                <FileText className="size-5 text-red-500" />
                <div className="text-left">
                  <p className="text-sm">เอกสาร PDF (.pdf)</p>
                  <p className="text-[11px] text-muted-foreground font-normal">เหมาะสำหรับการพิมพ์หรืออ่านรายงาน</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                  format === 'csv'
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'border-border bg-muted/20 text-muted-foreground hover:border-border/80'
                }`}
              >
                <FileSpreadsheet className="size-5 text-emerald-500" />
                <div className="text-left">
                  <p className="text-sm">ตาราง CSV (.csv)</p>
                  <p className="text-[11px] text-muted-foreground font-normal">เหมาะสำหรับการวิเคราะห์ใน Excel</p>
                </div>
              </button>
            </div>
          </div>

          {/* Step 4: Optional Date Range Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="size-4 text-violet-500" /> 4. ช่วงวันที่ (Optional Date Range)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">ตั้งแต่วันที่ (Date From)</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                />
              </div>
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">ถึงวันที่ (Date To)</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-border">
            <button
              type="submit"
              disabled={exporting || !selectedUserId}
              className="w-full py-3 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition-all shadow-md active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {exporting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> กำลังสร้างและส่งออกไฟล์...
                </>
              ) : (
                <>
                  <Download className="size-4" /> ส่งออกรายงาน {format.toUpperCase()}
                </>
              )}
            </button>
          </div>

        </form>
      </Card>
    </div>
  );
}
