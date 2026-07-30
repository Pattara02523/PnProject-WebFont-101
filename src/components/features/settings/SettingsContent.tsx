"use client";

import { useState, useEffect } from 'react'
import { Bell, Moon, Sun, Globe, Shield, User, Palette, Check } from 'lucide-react'
import { Card, Button } from '@/components/ui'

type Tab = 'general' | 'notifications' | 'security' | 'appearance'

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: 'general',       label: 'ทั่วไป',        icon: User },
  { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell },
  { id: 'security',      label: 'ความปลอดภัย',  icon: Shield },
  { id: 'appearance',    label: 'ธีม & ภาษา',    icon: Palette },
]

export default function SettingsContent() {
  const [tab, setTab] = useState<Tab>('general')
  const [saved, setSaved] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [language, setLanguage] = useState('th')
  const [currency, setCurrency] = useState('THB')
  const [notifs, setNotifs] = useState({ priceAlert: true, goalReached: true, weeklyReport: false, systemNews: true, emailDigest: false })
  const [profile, setProfile] = useState({ displayName: 'สมชาย ใจดี', email: 'user@example.com', phone: '081-234-5678' })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [twoFA, setTwoFA] = useState(false)
  const [sessions, setSessions] = useState([
    { id: '1', device: 'Chrome · Windows', location: 'Bangkok, TH', time: 'ออนไลน์ตอนนี้', current: true },
    { id: '2', device: 'Safari · iPhone', location: 'Chiang Mai, TH', time: '2 ชั่วโมงที่แล้ว', current: false },
  ])

  useEffect(() => {
    setDarkMode(localStorage.getItem('theme') === 'dark')
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode, mounted])

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      {/* Tab nav */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${tab === t.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* General */}
      {tab === 'general' && (
        <Card className="p-6 flex flex-col gap-5">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">ข้อมูลทั่วไป</h2>
          {[
            ['ชื่อที่แสดง', 'displayName', 'text', 'ชื่อ-นามสกุล'],
            ['อีเมล', 'email', 'email', 'email@example.com'],
            ['เบอร์โทรศัพท์', 'phone', 'tel', '08x-xxx-xxxx']
          ].map(([label, key, type, ph]) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
              <input
                type={type}
                value={(profile as any)[key]}
                onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                placeholder={ph}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">สกุลเงินที่แสดง</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
              <option value="THB">บาท (฿)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>
          <div className="pt-2">
            <Button onClick={handleSave} className="flex items-center gap-2">
              {saved ? <><Check className="w-4 h-4" /> บันทึกแล้ว</> : 'บันทึกการเปลี่ยนแปลง'}
            </Button>
          </div>
        </Card>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <Card className="p-6 flex flex-col gap-5">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">การแจ้งเตือน</h2>
          {[
            { key: 'priceAlert',    label: 'แจ้งเตือนราคาสินทรัพย์', desc: 'เมื่อราคาขึ้น/ลงตาม % ที่ตั้งไว้' },
            { key: 'goalReached',   label: 'บรรลุเป้าหมาย', desc: 'เมื่อเป้าหมายครบ 100%' },
            { key: 'weeklyReport',  label: 'รายงานรายสัปดาห์', desc: 'สรุป Portfolio ทุกวันจันทร์' },
            { key: 'systemNews',    label: 'ข่าวสารระบบ', desc: 'อัปเดต feature ใหม่และข้อมูลสำคัญ' },
            { key: 'emailDigest',   label: 'Email สรุปรายเดือน', desc: 'รับ email สรุปทุกสิ้นเดือน' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${(notifs as any)[item.key] ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${(notifs as any)[item.key] ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          ))}
          <div className="pt-2">
            <Button onClick={handleSave} className="flex items-center gap-2">
              {saved ? <><Check className="w-4 h-4" /> บันทึกแล้ว</> : 'บันทึกการตั้งค่า'}
            </Button>
          </div>
        </Card>
      )}

      {/* Security */}
      {tab === 'security' && (
        <div className="flex flex-col gap-4">
          <Card className="p-6 flex flex-col gap-5">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">เปลี่ยนรหัสผ่าน</h2>
            {[
              ['รหัสผ่านปัจจุบัน', 'current'],
              ['รหัสผ่านใหม่', 'newPass'],
              ['ยืนยันรหัสผ่านใหม่', 'confirm']
            ].map(([label, key]) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
                <input
                  type="password"
                  value={(passwords as any)[key]}
                  onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                  placeholder="••••••••"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            ))}
            <Button onClick={handleSave} variant="outline" className="w-fit">อัปเดตรหัสผ่าน</Button>
          </Card>

          <Card className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">Two-Factor Authentication</h2>
                <p className="text-xs text-slate-400 mt-0.5">เพิ่มความปลอดภัยด้วย OTP</p>
              </div>
              <button
                onClick={() => setTwoFA(v => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${twoFA ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${twoFA ? 'translate-x-5' : ''}`} />
              </button>
            </div>
            {twoFA && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 text-sm text-emerald-700 dark:text-emerald-400">
                2FA เปิดใช้งานแล้ว · OTP จะถูกส่งทาง SMS ที่ลงทะเบียนไว้
              </div>
            )}
          </Card>

          <Card className="p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Session ที่ใช้งานอยู่</h2>
            <div className="flex flex-col gap-3">
              {sessions.map(s => (
                <div key={s.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{s.device}</p>
                      <p className="text-xs text-slate-400">{s.location} · {s.time}</p>
                    </div>
                  </div>
                  {s.current ? (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">ปัจจุบัน</span>
                  ) : (
                    <button onClick={() => setSessions(ss => ss.filter(x => x.id !== s.id))} className="text-xs text-red-500 hover:underline cursor-pointer">ยกเลิก</button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Appearance */}
      {tab === 'appearance' && (
        <Card className="p-6 flex flex-col gap-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">ธีม & การแสดงผล</h2>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">โหมดสี</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDarkMode(false)}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${!darkMode ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
              >
                <span className={`w-5 h-5 flex items-center justify-center ${!darkMode ? 'text-emerald-600' : 'text-slate-400'}`}><Sun className="w-5 h-5" /></span>
                <div className="text-left">
                  <p className={`text-sm font-semibold ${!darkMode ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>Light Mode</p>
                  <p className="text-xs text-slate-400">พื้นหลังขาว</p>
                </div>
                {!darkMode && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
              </button>
              <button
                onClick={() => setDarkMode(true)}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${darkMode ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
              >
                <span className={`w-5 h-5 flex items-center justify-center ${darkMode ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}><Moon className="w-5 h-5" /></span>
                <div className="text-left">
                  <p className={`text-sm font-semibold ${darkMode ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>Dark Mode</p>
                  <p className="text-xs text-slate-400">พื้นหลังดำ</p>
                </div>
                {darkMode && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"><Globe className="w-4 h-4" /> ภาษา</label>
            <select value={language} onChange={e => setLanguage(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
              <option value="th">ภาษาไทย</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="pt-2">
            <Button onClick={handleSave} className="flex items-center gap-2">
              {saved ? <><Check className="w-4 h-4" /> บันทึกแล้ว</> : 'บันทึกการตั้งค่า'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
