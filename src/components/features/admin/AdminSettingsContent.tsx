"use client";

import { useState } from 'react';
import { Settings, Mail, Bell, Shield, Database, Palette } from 'lucide-react';
import { Card, Button, Input, Tabs } from '@/components/ui';

function AdminToggle({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
      </div>
      <button onClick={() => setOn(v => !v)} className={`w-12 h-6 rounded-full transition-colors relative ${on ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${on ? 'translate-x-7' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

export default function AdminSettingsContent() {
  const [tab, setTab] = useState('general');
  const [general, setGeneral] = useState({ siteName: 'InvestPro', siteUrl: 'https://investpro.app', supportEmail: 'support@investpro.app', maintenanceMode: false });
  const [smtp, setSmtp] = useState({ host: 'smtp.gmail.com', port: '587', user: 'noreply@investpro.app', pass: '' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Tabs
          tabs={[
            { label: 'General', value: 'general' },
            { label: 'SMTP Email', value: 'smtp' },
            { label: 'การแจ้งเตือน', value: 'notifications' },
            { label: 'ความปลอดภัย', value: 'security' },
            { label: 'Backup', value: 'backup' },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {tab === 'general' && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Settings className="w-5 h-5 text-slate-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">General Settings</h2>
          </div>
          <div className="flex flex-col gap-4">
            <Input label="ชื่อเว็บไซต์" value={general.siteName} onChange={e => setGeneral(g => ({ ...g, siteName: e.target.value }))} />
            <Input label="URL เว็บไซต์" value={general.siteUrl} onChange={e => setGeneral(g => ({ ...g, siteUrl: e.target.value }))} />
            <Input label="อีเมลติดต่อ" type="email" value={general.supportEmail} onChange={e => setGeneral(g => ({ ...g, supportEmail: e.target.value }))} />
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Maintenance Mode</p>
                <p className="text-xs text-slate-400">ปิดการเข้าถึงสำหรับผู้ใช้ทั่วไป</p>
              </div>
              <button onClick={() => setGeneral(g => ({ ...g, maintenanceMode: !g.maintenanceMode }))} className={`w-12 h-6 rounded-full transition-colors relative ${general.maintenanceMode ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${general.maintenanceMode ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            {saved && <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">✓ บันทึกแล้ว</span>}
            <Button onClick={handleSave}>บันทึก</Button>
          </div>
        </Card>
      )}

      {tab === 'smtp' && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Mail className="w-5 h-5 text-slate-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">SMTP Settings</h2>
          </div>
          <div className="flex flex-col gap-4">
            <Input label="SMTP Host" value={smtp.host} onChange={e => setSmtp(s => ({ ...s, host: e.target.value }))} />
            <Input label="Port" value={smtp.port} onChange={e => setSmtp(s => ({ ...s, port: e.target.value }))} />
            <Input label="Username" value={smtp.user} onChange={e => setSmtp(s => ({ ...s, user: e.target.value }))} />
            <Input label="Password" type="password" value={smtp.pass} onChange={e => setSmtp(s => ({ ...s, pass: e.target.value }))} placeholder="••••••••" />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">ทดสอบการส่ง</Button>
              <Button className="flex-1" onClick={handleSave}>บันทึก</Button>
            </div>
          </div>
        </Card>
      )}

      {tab === 'notifications' && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-5 h-5 text-slate-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">การแจ้งเตือน</h2>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'แจ้งเตือนผู้ใช้ใหม่', desc: 'รับ Email เมื่อมีผู้สมัครใหม่', on: true },
              { label: 'แจ้งเตือนการชำระเงิน', desc: 'รับ Email เมื่อมีรายการชำระเงินใหม่', on: true },
              { label: 'Weekly Summary', desc: 'รายงานสรุปรายสัปดาห์', on: false },
              { label: 'System Alerts', desc: 'แจ้งเตือนเมื่อระบบมีปัญหา', on: true },
            ].map((n, i) => (
              <AdminToggle key={i} label={n.label} desc={n.desc} defaultOn={n.on} />
            ))}
          </div>
        </Card>
      )}

      {tab === 'security' && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-5 h-5 text-slate-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">ความปลอดภัย</h2>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'บังคับ 2FA สำหรับ Admin', desc: 'Admin ต้องยืนยัน OTP ทุกครั้ง', on: true },
              { label: 'Rate Limiting', desc: 'จำกัดการ Login ผิดพลาด 5 ครั้ง/ชั่วโมง', on: true },
              { label: 'IP Whitelist', desc: 'อนุญาตเฉพาะ IP ที่กำหนด', on: false },
              { label: 'Session Timeout', desc: 'ออกจากระบบอัตโนมัติหลัง 30 นาที', on: true },
            ].map((n, i) => (
              <AdminToggle key={i} label={n.label} desc={n.desc} defaultOn={n.on} />
            ))}
          </div>
        </Card>
      )}

      {tab === 'backup' && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Database className="w-5 h-5 text-slate-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Backup & Restore</h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Backup ล่าสุด</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">2025-07-09 02:00:00 (อัตโนมัติ)</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">Backup ตอนนี้</Button>
              <Button variant="secondary" className="flex-1">Restore</Button>
            </div>
            <AdminToggle label="Auto Backup" desc="Backup อัตโนมัติทุกวัน เวลา 02:00" defaultOn={true} />
          </div>
        </Card>
      )}
    </div>
  );
}
