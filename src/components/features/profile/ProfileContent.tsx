"use client";

import { useState, useEffect } from 'react';
import { Camera, User, Lock, Globe, Moon, Sun, LogOut, Shield, Bell, Loader2 } from 'lucide-react';
import { Card, Button, Input, Badge, ConfirmDialog } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserApi } from '@/lib/api/admin.api';

export default function ProfileContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [section, setSection] = useState('info');
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState('th');
  const [showLogout, setShowLogout] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', phone: '' });
  const [pwForm, setPwForm] = useState({ current: '', newpw: '', confirm: '' });
  const [pwError, setPwError] = useState('');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => UserApi.getProfile(),
    retry: false,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        firstname: profile.firstname ?? '',
        lastname: profile.lastname ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await UserApi.updateProfile({ firstname: form.firstname, lastname: form.lastname, phone: form.phone });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Update profile failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPwError('');
    if (pwForm.newpw !== pwForm.confirm) {
      setPwError('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }
    try {
      await UserApi.changePassword({ oldPassword: pwForm.current, newPassword: pwForm.newpw });
      setPwForm({ current: '', newpw: '', confirm: '' });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setPwError(err?.message ?? 'เกิดข้อผิดพลาด');
    }
  };

  const toggleDark = () => { setDark(d => !d); document.documentElement.classList.toggle('dark'); };

  const sections = [
    { id: 'info', label: 'ข้อมูลส่วนตัว', icon: User },
    { id: 'security', label: 'ความปลอดภัย', icon: Shield },
    { id: 'preferences', label: 'การตั้งค่า', icon: Globe },
    { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell },
  ];

  const initials = profile
    ? `${profile.firstname?.[0] ?? ''}${profile.lastname?.[0] ?? ''}`.toUpperCase() || 'U'
    : 'U';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3 mb-5 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="relative">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="avatar" className="w-16 h-16 rounded-full object-cover ring-2 ring-white dark:ring-slate-900 shadow" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow text-white text-xl font-bold">
                    {initials}
                  </div>
                )}
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{form.firstname} {form.lastname}</p>
                <p className="text-xs text-slate-400">{form.email}</p>
                <Badge variant={profile?.role === 'ADMIN' ? 'warning' : 'success'} className="mt-1.5">
                  {profile?.role === 'ADMIN' ? 'Admin' : 'Member'}
                </Badge>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${section === s.id ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <s.icon className="w-4 h-4" />{s.label}
                </button>
              ))}
              <button
                onClick={() => setShowLogout(true)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all mt-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> ออกจากระบบ
              </button>
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {section === 'info' && (
            <Card className="p-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-5">ข้อมูลส่วนตัว</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input label="ชื่อ" value={form.firstname} onChange={e => setForm(f => ({ ...f, firstname: e.target.value }))} />
                <Input label="นามสกุล" value={form.lastname} onChange={e => setForm(f => ({ ...f, lastname: e.target.value }))} />
                <div className="col-span-2">
                  <Input label="อีเมล" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} disabled />
                </div>
                <div className="col-span-2">
                  <Input label="เบอร์โทร" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="text-xs text-slate-400">สมาชิกตั้งแต่ {profile?.createdAt?.split('T')[0] ?? '-'}</p>
                <div className="flex gap-2">
                  {saved && <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">✓ บันทึกแล้ว</span>}
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'บันทึกการเปลี่ยนแปลง'}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {section === 'security' && (
            <Card className="p-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-5">เปลี่ยนรหัสผ่าน</h2>
              <div className="flex flex-col gap-4">
                <Input label="รหัสผ่านปัจจุบัน" type="password" placeholder="••••••••" value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} />
                <Input label="รหัสผ่านใหม่" type="password" placeholder="••••••••" value={pwForm.newpw} onChange={e => setPwForm(f => ({ ...f, newpw: e.target.value }))} />
                <Input label="ยืนยันรหัสผ่านใหม่" type="password" placeholder="••••••••" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} />
                {pwError && <p className="text-sm text-red-500">{pwError}</p>}
                {saved && <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">✓ เปลี่ยนรหัสผ่านแล้ว</p>}
                <div className="mt-2">
                  <Button onClick={handleChangePassword}>เปลี่ยนรหัสผ่าน</Button>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">เปิดใช้งาน 2FA</p>
                    <p className="text-xs text-slate-400 mt-0.5">เพิ่มความปลอดภัยด้วยรหัส OTP</p>
                  </div>
                  <Badge variant="neutral">ปิดอยู่</Badge>
                </div>
              </div>
            </Card>
          )}

          {section === 'preferences' && (
            <Card className="p-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-5">การตั้งค่า</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    {dark ? <Moon className="w-5 h-5 text-slate-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode</p>
                      <p className="text-xs text-slate-400">เปลี่ยนธีมหน้าจอ</p>
                    </div>
                  </div>
                  <button onClick={toggleDark} className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${dark ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${dark ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">ภาษา</p>
                      <p className="text-xs text-slate-400">Language</p>
                    </div>
                  </div>
                  <select value={lang} onChange={e => setLang(e.target.value)} className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                    <option value="th">ภาษาไทย</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </Card>
          )}

          {section === 'notifications' && (
            <Card className="p-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-5">การแจ้งเตือน</h2>
              <div className="flex flex-col gap-4">
                {[
                  { label: 'ราคาหุ้นเปลี่ยนแปลง', desc: 'รับแจ้งเตือนเมื่อราคาเปลี่ยนแปลงเกิน 5%', default: true },
                  { label: 'เป้าหมายทางการเงิน', desc: 'รับแจ้งเตือนเมื่อบรรลุเป้าหมาย', default: true },
                  { label: 'Email สรุปรายสัปดาห์', desc: 'รับสรุปพอร์ตทุกวันจันทร์', default: false },
                  { label: 'การแจ้งเตือนระบบ', desc: 'อัปเดต, บำรุงรักษา', default: true },
                ].map((n, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{n.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.desc}</p>
                    </div>
                    <NotiToggle defaultOn={n.default} />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={() => router.push('/login')}
        title="ออกจากระบบ?"
        description="คุณต้องการออกจากระบบใช่หรือไม่?"
      />
    </div>
  );
}

function NotiToggle({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn(v => !v)} className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${on ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${on ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  );
}
