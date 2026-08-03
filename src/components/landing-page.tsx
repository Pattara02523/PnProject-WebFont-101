/**
 * ==========================================
 * ลำดับการทำงาน: [ลำดับที่ 34 / Flow ขั้นตอนที่ 34]
 * ชื่อไฟล์: landing-page.tsx
 * หน้าที่หลัก: Component แสดงรายละเอียดหน้า Landing Page (Hero section, Features overview, Call to Action ไปยัง Login/Register)
 * รับอะไรมาจากไหน (Input): User Interactions
 * ส่งอะไรไปที่ไหนต่อ (Output / Target): Render หน้าต้อนรับสวยงามพร้อมปุ่มเริ่มต้นใช้งาน
 * ==========================================
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Sun,
  Moon,
  ArrowRight,
  Menu,
  X,
  BarChart3,
  ShieldCheck,
  Target,
  BellRing,
  Globe,
  FileDown,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeChartBar, setActiveChartBar] = useState<number | null>(null);

  // Initialize theme based on HTML document classes
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  // Mock data for the interactive portfolio growth chart
  const chartData = [
    { month: 'ม.ค.', value: 240000, height: '28%' },
    { month: 'ก.พ.', value: 380000, height: '40%' },
    { month: 'มี.ค.', value: 310000, height: '34%' },
    { month: 'เม.ย.', value: 520000, height: '52%' },
    { month: 'พ.ค.', value: 450000, height: '46%' },
    { month: 'มิ.ย.', value: 680000, height: '62%' },
    { month: 'ก.ค.', value: 590000, height: '55%' },
    { month: 'ส.ค.', value: 890000, height: '76%' },
    { month: 'ก.ย.', value: 810000, height: '70%' },
    { month: 'ต.ค.', value: 1150000, height: '88%' },
    { month: 'พ.ย.', value: 1080000, height: '82%' },
    { month: 'ธ.ค.', value: 1465000, height: '100%' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden font-sans selection:bg-primary/30">
      
      {/* Decorative Glow Elements - Only visible in dark mode or soft in light mode */}
      <div className="absolute top-[-10%] left-1/2 -z-10 h-[600px] w-[600px] sm:h-[800px] sm:w-[800px] -translate-x-1/2 rounded-full bg-primary/10 dark:bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] -z-10 h-[400px] w-[400px] rounded-full bg-teal-500/5 dark:bg-teal-500/3 blur-[100px] pointer-events-none"></div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-transform group-hover:scale-105">
              <TrendingUp className="size-5" />
            </span>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              InvestPro
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              ฟีเจอร์
            </a>
            <a href="#preview" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              ตัวอย่าง
            </a>
            <a href="#reviews" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              รีวิว
            </a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>

          {/* Desktop Action Buttons & Theme Switcher */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
            </button>

            <Link href="/login">
              <Button variant="ghost" className="rounded-xl px-4 py-2 hover:bg-muted text-foreground transition-colors">
                เข้าสู่ระบบ
              </Button>
            </Link>

            <Link href="/register">
              <button className="h-9 px-4 rounded-xl text-sm font-medium bg-primary text-primary-foreground shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:bg-primary/95 hover:shadow-[0_6px_20px_rgba(16,185,129,0.45)] transition-all cursor-pointer active:scale-[0.98]">
                สมัครสมาชิก
              </button>
            </Link>
          </div>

          {/* Mobile Menu & Theme Controls */}
          <div className="flex items-center gap-2.5 md:hidden">
            {/* Theme Switcher for Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md py-4 px-6 space-y-4 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col gap-3">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium py-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                ฟีเจอร์
              </a>
              <a
                href="#preview"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium py-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                ตัวอย่าง
              </a>
              <a
                href="#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium py-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                รีวิว
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium py-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </a>
            </nav>
            <div className="h-px bg-border/40 my-2" />
            <div className="flex flex-col gap-3">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full h-10 rounded-xl justify-center">
                  เข้าสู่ระบบ
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full h-10 rounded-xl font-medium bg-primary text-primary-foreground shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:bg-primary/95 transition-all cursor-pointer">
                  สมัครสมาชิก
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-5xl">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-primary/20 bg-primary/5 text-primary dark:text-emerald-400 mb-6 backdrop-blur-sm animate-fade-in">
            <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
            บริหารพอร์ตการลงทุนอย่างชาญฉลาด
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6 text-foreground max-w-4xl mx-auto">
            ระบบจัดการพอร์ต
            <span className="block mt-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
              การลงทุนระดับ Pro
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            บริหารจัดการพอร์ตการลงทุนอย่างมืออาชีพ ติดตามภาพรวมสินทรัพย์ สรุปผลตอบแทน และตั้งเป้าหมายทางการเงินได้อย่างแม่นยำและปลอดภัย
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/register">
              <button className="h-12 px-6 rounded-xl font-medium bg-primary text-primary-foreground shadow-[0_6px_20px_rgba(16,185,129,0.4)] hover:bg-primary/95 hover:shadow-[0_8px_25px_rgba(16,185,129,0.5)] transition-all cursor-pointer active:scale-[0.98] inline-flex items-center gap-2">
                เริ่มต้นฟรี
                <ArrowRight className="size-4" />
              </button>
            </Link>
          </div>

          {/* Subtext info */}
          <p className="text-xs text-muted-foreground/80 tracking-wide">
            ใช้งานฟรี 100% <span className="mx-2">•</span> ความปลอดภัยระดับสถาบันการเงิน <span className="mx-2">•</span> ไม่จำกัดจำนวนสินทรัพย์
          </p>

        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="preview" className="relative pb-24 md:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          
          {/* Section Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-8 text-foreground animate-fade-in">
            ตัวอย่าง Dashboard
          </h1>

          {/* Dashboard Window Mockup */}
          <div className="w-full rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-300">
            
            {/* Window Header */}
            <div className="h-11 border-b border-border/60 px-4 flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-rose-500/80"></span>
                <span className="size-3 rounded-full bg-amber-500/80"></span>
                <span className="size-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <div className="text-xs text-muted-foreground font-medium select-none">
                dashboard.investpro.com
              </div>
              <div className="w-12"></div> {/* Spacer */}
            </div>

            {/* Window Content */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: 'มูลค่าพอร์ต',
                    value: '฿1,465,000',
                    change: '+8.2%',
                    isPositive: true,
                  },
                  {
                    title: 'กำไรสุทธิ',
                    value: '฿135,000',
                    change: '+10.2%',
                    isPositive: true,
                  },
                  {
                    title: 'ROI รวม',
                    value: '10.15%',
                    change: '+2.1%',
                    isPositive: true,
                  },
                  {
                    title: 'สินทรัพย์',
                    value: '17',
                    change: '3 Portfolio',
                    isPositive: null,
                  },
                ].map((metric, i) => (
                  <div
                    key={i}
                    className="p-4 sm:p-5 rounded-xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold tracking-tight mt-1.5 text-foreground">
                      {metric.value}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs font-semibold">
                      {metric.isPositive === true && (
                        <span className="text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          {metric.change}
                        </span>
                      )}
                      {metric.isPositive === false && (
                        <span className="text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">
                          {metric.change}
                        </span>
                      )}
                      {metric.isPositive === null && (
                        <span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          {metric.change}
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chart Mockup */}
              <div className="p-5 rounded-xl border border-border/60 bg-card/40 relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">แนวโน้มการเติบโตของพอร์ต</h3>
                    <p className="text-xs text-muted-foreground">สรุปผลการลงทุนรายเดือนตลอดปีนี้</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                    <TrendingUp className="size-3.5" />
                    +610% จากเริ่มต้น
                  </div>
                </div>

                {/* Grid Lines behind the chart */}
                <div className="absolute inset-x-5 top-20 bottom-12 flex flex-col justify-between pointer-events-none opacity-40">
                  <span className="w-full h-px border-t border-dashed border-border" />
                  <span className="w-full h-px border-t border-dashed border-border" />
                  <span className="w-full h-px border-t border-dashed border-border" />
                  <span className="w-full h-px border-t border-dashed border-border" />
                </div>

                {/* Growth Bars */}
                <div className="h-44 sm:h-52 flex items-end justify-between gap-1.5 sm:gap-3 px-1 pt-4 relative z-10">
                  {chartData.map((item, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center group h-full justify-end"
                      onMouseEnter={() => setActiveChartBar(index)}
                      onMouseLeave={() => setActiveChartBar(null)}
                    >
                      {/* Hover value tooltip */}
                      <div
                        className={`absolute bottom-[105%] bg-slate-900 text-slate-50 text-[10px] sm:text-xs font-medium px-2 py-1 rounded shadow-lg transition-opacity duration-200 pointer-events-none whitespace-nowrap ${
                          activeChartBar === index ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        ฿{item.value.toLocaleString()}
                      </div>

                      {/* Bar fill */}
                      <div
                        style={{ height: item.height }}
                        className={`w-full rounded-t-[4px] sm:rounded-t-md transition-all duration-300 relative ${
                          activeChartBar === index
                            ? 'bg-primary shadow-[0_0_15px_rgba(16,185,129,0.6)] scale-x-105'
                            : 'bg-primary/80 dark:bg-emerald-500/20 dark:hover:bg-primary/80 hover:bg-primary'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                {/* X Axis Months */}
                <div className="flex justify-between mt-3 text-[10px] sm:text-xs text-muted-foreground font-medium select-none px-1 border-t border-border/60 pt-2.5">
                  {chartData.map((item, index) => (
                    <span key={index} className="w-full text-center">
                      {item.month}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 md:py-28 bg-muted/15 border-t border-border/40 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
              ฟีเจอร์ครบครัน
            </h2>
            <p className="text-base text-muted-foreground">
              ทุกสิ่งที่นักลงทุนต้องการ ในแพลตฟอร์มเดียว
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <BarChart3 className="size-6 text-primary dark:text-emerald-400" />,
                title: 'Analytics ขั้นสูง',
                desc: 'วิเคราะห์พอร์ตด้วยกราฟและข้อมูลเชิงลึกแบบ Real-time',
              },
              {
                icon: <ShieldCheck className="size-6 text-primary dark:text-emerald-400" />,
                title: 'ปลอดภัยสูงสุด',
                desc: 'ข้อมูลเข้ารหัส 256-bit พร้อม 2FA ป้องกันทุกขั้นตอน',
              },
              {
                icon: <Target className="size-6 text-primary dark:text-emerald-400" />,
                title: 'ติดตามเป้าหมาย',
                desc: 'ตั้งเป้าหมายทางการเงิน ติดตามความคืบหน้าแบบ Visual',
              },
              {
                icon: <BellRing className="size-6 text-primary dark:text-emerald-400" />,
                title: 'แจ้งเตือนอัจฉริยะ',
                desc: 'รับแจ้งเตือนราคาหุ้น, เป้าหมาย และข่าวสำคัญทันที',
              },
              {
                icon: <Globe className="size-6 text-primary dark:text-emerald-400" />,
                title: 'รองรับสินทรัพย์หลากหลาย',
                desc: 'หุ้นไทย, หุ้นต่างประเทศ, ETF, กองทุน, คริปโต',
              },
              {
                icon: <FileDown className="size-6 text-primary dark:text-emerald-400" />,
                title: 'Export รายงาน',
                desc: 'Export PDF และ Excel พร้อมใช้เสียภาษีและวิเคราะห์',
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="p-6 sm:p-8 rounded-2xl border border-border/60 bg-card hover:border-primary/40 shadow-sm hover:shadow-[0_10px_30px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Glowing background card accent */}
                <div className="absolute top-0 right-0 size-24 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-300" />
                
                {/* Icon wrapper */}
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                  {feat.icon}
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2.5">
                  {feat.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="relative py-20 md:py-28 border-t border-border/40 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
              รีวิวจากผู้ใช้งานจริง
            </h2>
            <p className="text-base text-muted-foreground">
              สิ่งที่นักลงทุนพูดถึงหลังจากเปลี่ยนมาจัดการพอร์ตกับ InvestPro
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'คุณ ณัฐวุฒิ ศรีสุข',
                role: 'นักเทรดหุ้นอิสระ',
                quote: 'ตั้งแต่ใช้ InvestPro การดูแลพอร์ตหุ้นและกองทุนรวมง่ายขึ้นเยอะครับ ฟีเจอร์ AI แนะนำการลงทุนมีประโยชน์มากในการปรับสัดส่วนสินทรัพย์',
                rating: 5
              },
              {
                name: 'คุณ ณิชาภัทร วงศ์ษา',
                role: 'นักลงทุนรายย่อย',
                quote: 'ระบบมีความปลอดภัยสูงและกราฟที่ดูง่ายมากค่ะ สามารถดูภาพรวมพอร์ตจากหลายๆ โบรกเกอร์ได้ครบจบในที่เดียว แนะนำเลย!',
                rating: 5
              },
              {
                name: 'คุณ ทัชพล เลิศวิจิตร',
                role: 'Cryptocurrency Trader',
                quote: 'ประทับใจความเร็วในการอัปเดตราคาแบบ Real-time และการจัดการหลายพอร์ตแยกกันได้สะดวกมากครับ การ Export รายงานก็รวดเร็วและครบถ้วน',
                rating: 5
              }
            ].map((review, i) => (
              <div key={i} className="p-6 sm:p-8 rounded-2xl border border-border/60 bg-card/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: review.rating }).map((_, rIdx) => (
                      <span key={rIdx} className="text-amber-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-foreground italic leading-relaxed mb-6">
                    "{review.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {review.name.charAt(4)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{review.name}</h4>
                    <p className="text-xs text-muted-foreground">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative py-20 md:py-28 bg-muted/15 border-t border-border/40 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
              คำถามที่พบบ่อย (FAQ)
            </h2>
            <p className="text-base text-muted-foreground">
              ข้อสงสัยเบื้องต้นเกี่ยวกับการใช้งานและระบบความปลอดภัย
            </p>
          </div>

          {/* Accordion list */}
          <div className="space-y-4">
            {[
              {
                q: 'ระบบ InvestPro ปลอดภัยแค่ไหน?',
                a: 'ข้อมูลพอร์ตและธุรกรรมทั้งหมดของคุณจะถูกเข้ารหัสระดับเดียวกับระบบธนาคารด้วยเทคโนโลยี AES 256-bit และรองรับการยืนยันตัวตนแบบหลายปัจจัย (2FA) เพื่อป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาตสูงสุด'
              },
              {
                q: 'มีค่าใช้จ่ายสำหรับการเริ่มต้นใช้งานหรือไม่?',
                a: 'ไม่มีค่าใช้จ่ายครับ! คุณสามารถลงทะเบียนเข้าใช้งานฟีเจอร์การติดตามพอร์ตและวิเคราะห์ผลการลงทุนเบื้องต้นได้ฟรีตลอดชีพโดยไม่ต้องกรอกข้อมูลบัตรเครดิตใดๆ'
              },
              {
                q: 'ระบบ AI แนะนำการลงทุนทำงานอย่างไร?',
                a: 'ระบบ AI ของเราจะประมวลสัดส่วนสินทรัพย์ปัจจุบันในพอร์ตการลงทุนของคุณ (Asset Allocation) ร่วมกับระดับความเสี่ยงที่รับได้ และนำเสนอข้อเสนอแนะในการปรับสมดุลพอร์ต (Rebalancing) เพื่อให้สอดคล้องกับทิศทางตลาดปัจจุบัน'
              },
              {
                q: 'รองรับประเภทสินทรัพย์ใดบ้างในพอร์ต?',
                a: 'InvestPro รองรับการติดตามสินทรัพย์ที่หลากหลาย ครอบคลุมทั้งหุ้นไทย หุ้นต่างประเทศ กองทุนรวม (Mutual Funds) กองทุนลดหย่อนภาษี (SSF/RMF) ETF รวมถึงสินทรัพย์ดิจิทัลและคริปโตเคอเรนซีชั้นนำ'
              }
            ].map((faqItem, i) => (
              <details
                key={i}
                className="group border border-border/60 bg-card rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all duration-300"
              >
                <summary className="flex items-center justify-between gap-4 p-5 text-sm sm:text-base font-semibold text-foreground cursor-pointer select-none">
                  <span>{faqItem.q}</span>
                  <span className="shrink-0 transition duration-300 group-open:-rotate-180 text-muted-foreground">
                    ▼
                  </span>
                </summary>
                <div className="border-t border-border/40 p-5 text-sm text-muted-foreground leading-relaxed bg-muted/10">
                  {faqItem.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-border/40 py-10 bg-background text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© 2026 InvestPro. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
