// ─── Mock Data ตรงตาม Backend Prisma Schema ─────────────────────────
// ใช้เป็น fallback เมื่อ API ยังไม่พร้อม

export const mockUser = {
  id: '1',
  firstname: 'Pattara',
  lastname: 'Naksakul',
  email: 'test@mail.com',
  phone: '0912345678',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format',
  role: 'USER' as 'USER' | 'ADMIN',
  status: 'ACTIVE' as 'ACTIVE' | 'SUSPENDED' | 'DELETED',
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-07-10T00:00:00Z',
};

export const mockAdmin = {
  id: 'admin-1',
  firstname: 'Admin',
  lastname: 'System',
  email: 'admin@mail.com',
  role: 'ADMIN' as 'USER' | 'ADMIN',
  status: 'ACTIVE' as 'ACTIVE' | 'SUSPENDED' | 'DELETED',
};

export const mockPortfolios = [
  { id: '1', userId: '1', name: 'หุ้นไทย', description: 'พอร์ตหุ้นในตลาดหลักทรัพย์ไทย', color: '#10b981', icon: 'briefcase', isFavorite: true, isDefault: true, createdAt: '2024-01-20T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z', _count: { investments: 4 } },
  { id: '2', userId: '1', name: 'หุ้นต่างประเทศ', description: 'ETF และหุ้นสหรัฐอเมริกา', color: '#6366f1', icon: 'globe', isFavorite: false, isDefault: false, createdAt: '2024-02-10T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z', _count: { investments: 2 } },
  { id: '3', userId: '1', name: 'คริปโต', description: 'สินทรัพย์ดิจิทัล', color: '#f59e0b', icon: 'bitcoin', isFavorite: false, isDefault: false, createdAt: '2024-03-05T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z', _count: { investments: 2 } },
];

export const mockInvestments = [
  { id: '1', portfolioId: '1', categoryId: '1', assetName: 'PTT Global Chemical', symbol: 'PTTGC', assetType: 'STOCK' as const, purchasePrice: 65.5, currentPrice: 78.25, quantity: 1000, averageCost: 65.5, riskLevel: 'MEDIUM' as const, status: 'ACTIVE' as const, investmentDate: '2024-01-25', note: 'เข้าซื้อในจังหวะย่อ', createdAt: '2024-01-25T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z' },
  { id: '2', portfolioId: '1', categoryId: '2', assetName: 'Kasikorn Bank', symbol: 'KBANK', assetType: 'STOCK' as const, purchasePrice: 138.0, currentPrice: 155.5, quantity: 500, averageCost: 138.0, riskLevel: 'LOW' as const, status: 'ACTIVE' as const, investmentDate: '2024-02-01', note: '', createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z' },
  { id: '3', portfolioId: '2', categoryId: '3', assetName: 'Apple Inc.', symbol: 'AAPL', assetType: 'STOCK' as const, purchasePrice: 182.0, currentPrice: 205.5, quantity: 50, averageCost: 182.0, riskLevel: 'LOW' as const, status: 'ACTIVE' as const, investmentDate: '2024-02-15', note: '', createdAt: '2024-02-15T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z' },
  { id: '4', portfolioId: '3', categoryId: '4', assetName: 'Bitcoin', symbol: 'BTC', assetType: 'CRYPTO' as const, purchasePrice: 1800000, currentPrice: 1650000, quantity: 0.1, averageCost: 1800000, riskLevel: 'HIGH' as const, status: 'ACTIVE' as const, investmentDate: '2024-03-10', note: '', createdAt: '2024-03-10T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z' },
  { id: '5', portfolioId: '2', categoryId: '5', assetName: 'S&P 500 ETF', symbol: 'SPY', assetType: 'ETF' as const, purchasePrice: 450.0, currentPrice: 512.0, quantity: 20, averageCost: 450.0, riskLevel: 'MEDIUM' as const, status: 'ACTIVE' as const, investmentDate: '2024-02-20', note: '', createdAt: '2024-02-20T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z' },
  { id: '6', portfolioId: '3', categoryId: '4', assetName: 'Ethereum', symbol: 'ETH', assetType: 'CRYPTO' as const, purchasePrice: 95000, currentPrice: 85000, quantity: 0.5, averageCost: 95000, riskLevel: 'HIGH' as const, status: 'ACTIVE' as const, investmentDate: '2024-03-15', note: '', createdAt: '2024-03-15T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z' },
];

export const mockTransactions = [
  {
    id: '1',
    investmentId: '1',
    type: 'BUY' as const,
    amount: 65500,
    quantity: 1000,
    price: 65.5,
    fee: 100,
    tax: 0,
    transactionDate: '2024-01-25T00:00:00Z',
    note: 'เข้าซื้อในจังหวะย่อ',
    createdAt: '2024-01-25T00:00:00Z',
    investment: {
      id: '1',
      assetName: 'PTT Global Chemical',
      symbol: 'PTTGC',
      portfolioId: '1',
      portfolio: { id: '1', name: 'หุ้นไทย' }
    }
  },
  {
    id: '2',
    investmentId: '2',
    type: 'BUY' as const,
    amount: 69000,
    quantity: 500,
    price: 138.0,
    fee: 120,
    tax: 0,
    transactionDate: '2024-02-01T00:00:00Z',
    note: '',
    createdAt: '2024-02-01T00:00:00Z',
    investment: {
      id: '2',
      assetName: 'Kasikorn Bank',
      symbol: 'KBANK',
      portfolioId: '1',
      portfolio: { id: '1', name: 'หุ้นไทย' }
    }
  },
  {
    id: '3',
    investmentId: '3',
    type: 'BUY' as const,
    amount: 9100,
    quantity: 50,
    price: 182.0,
    fee: 15,
    tax: 0,
    transactionDate: '2024-02-15T00:00:00Z',
    note: '',
    createdAt: '2024-02-15T00:00:00Z',
    investment: {
      id: '3',
      assetName: 'Apple Inc.',
      symbol: 'AAPL',
      portfolioId: '2',
      portfolio: { id: '2', name: 'หุ้นต่างประเทศ' }
    }
  },
  {
    id: '4',
    investmentId: '1',
    type: 'DIVIDEND' as const,
    amount: 2500,
    quantity: 1000,
    price: 2.5,
    fee: 0,
    tax: 250,
    transactionDate: '2024-02-28T00:00:00Z',
    note: 'เงินปันผลประจำปี',
    createdAt: '2024-02-28T00:00:00Z',
    investment: {
      id: '1',
      assetName: 'PTT Global Chemical',
      symbol: 'PTTGC',
      portfolioId: '1',
      portfolio: { id: '1', name: 'หุ้นไทย' }
    }
  },
  {
    id: '5',
    investmentId: '4',
    type: 'BUY' as const,
    amount: 180000,
    quantity: 0.1,
    price: 1800000,
    fee: 360,
    tax: 0,
    transactionDate: '2024-03-10T00:00:00Z',
    note: '',
    createdAt: '2024-03-10T00:00:00Z',
    investment: {
      id: '4',
      assetName: 'Bitcoin',
      symbol: 'BTC',
      portfolioId: '3',
      portfolio: { id: '3', name: 'คริปโต' }
    }
  },
  {
    id: '6',
    investmentId: '2',
    type: 'SELL' as const,
    amount: 15500,
    quantity: 100,
    price: 155.0,
    fee: 30,
    tax: 0,
    transactionDate: '2024-05-10T00:00:00Z',
    note: 'ทำกำไรบางส่วน',
    createdAt: '2024-05-10T00:00:00Z',
    investment: {
      id: '2',
      assetName: 'Kasikorn Bank',
      symbol: 'KBANK',
      portfolioId: '1',
      portfolio: { id: '1', name: 'หุ้นไทย' }
    }
  },
];

export const mockCategories = [
  { id: '1', userId: '1', name: 'พลังงาน', icon: 'Zap', color: '#f59e0b', description: 'หุ้นกลุ่มพลังงานและปิโตรเคมี', isDefault: false, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z', _count: { investments: 1 } },
  { id: '2', userId: '1', name: 'การเงิน', icon: 'Building2', color: '#6366f1', description: 'หุ้นกลุ่มธนาคารและการเงิน', isDefault: false, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z', _count: { investments: 1 } },
  { id: '3', userId: '1', name: 'เทคโนโลยี', icon: 'Cpu', color: '#10b981', description: 'หุ้นกลุ่มเทคโนโลยี', isDefault: false, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z', _count: { investments: 1 } },
  { id: '4', userId: '1', name: 'สินทรัพย์ดิจิทัล', icon: 'Bitcoin', color: '#f97316', description: 'คริปโตเคอเรนซี่', isDefault: false, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z', _count: { investments: 2 } },
  { id: '5', userId: '1', name: 'ดัชนี', icon: 'TrendingUp', color: '#8b5cf6', description: 'กองทุนดัชนี ETF', isDefault: false, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z', _count: { investments: 1 } },
  { id: '6', userId: '1', name: 'อสังหาริมทรัพย์', icon: 'Home', color: '#ec4899', description: 'กองทุนอสังหาริมทรัพย์', isDefault: false, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z', _count: { investments: 0 } },
];

export const mockGoals = [
  { id: '1', userId: '1', title: 'ซื้อบ้าน', description: 'บ้านเดี่ยวชานเมือง', targetAmount: 3000000, currentAmount: 1465000, deadline: '2027-12-31', status: 'IN_PROGRESS' as const, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z' },
  { id: '2', userId: '1', title: 'เกษียณ', description: 'กองทุนเกษียณ', targetAmount: 10000000, currentAmount: 1465000, deadline: '2045-01-01', status: 'IN_PROGRESS' as const, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z' },
  { id: '3', userId: '1', title: 'ซื้อรถ', description: 'รถยนต์ไฟฟ้า', targetAmount: 1500000, currentAmount: 850000, deadline: '2025-06-30', status: 'IN_PROGRESS' as const, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-07-10T00:00:00Z' },
];

export const mockNotifications = [
  { id: '1', userId: '1', type: 'INVESTMENT' as const, title: 'PTTGC ขึ้น 5%', message: 'ราคาหุ้น PTTGC ปรับตัวขึ้น 5% วันนี้ ปิดที่ 78.25 บาท', isRead: false, createdAt: '2024-07-10T10:00:00Z' },
  { id: '2', userId: '1', type: 'GOAL' as const, title: 'เป้าหมายซื้อรถ 56%', message: 'คุณบรรลุ 56% ของเป้าหมายซื้อรถแล้ว ยังขาดอีก 650,000 บาท', isRead: false, createdAt: '2024-07-10T09:00:00Z' },
  { id: '3', userId: '1', type: 'REMINDER' as const, title: 'ตรวจสอบพอร์ตรายสัปดาห์', message: 'ครบกำหนดตรวจสอบพอร์ตการลงทุนประจำสัปดาห์แล้ว', isRead: true, createdAt: '2024-07-08T14:00:00Z' },
  { id: '4', userId: '1', type: 'INVESTMENT' as const, title: 'BTC ลง 8%', message: 'Bitcoin ราคาลดลง 8% ในช่วง 24 ชั่วโมงที่ผ่านมา', isRead: true, createdAt: '2024-07-05T10:00:00Z' },
];

export const mockPaymentHistory = [
  { id: '1', date: '2024-06-10', plan: 'Go', amount: 99, status: 'success', method: 'PromptPay', receipt: '#INV-001' },
  { id: '2', date: '2024-05-10', plan: 'Go', amount: 99, status: 'success', method: 'Credit Card', receipt: '#INV-002' },
];

export const mockPortfolioGrowth = [
  { month: 'ม.ค.', value: 700000 },
  { month: 'ก.พ.', value: 820000 },
  { month: 'มี.ค.', value: 910000 },
  { month: 'เม.ย.', value: 875000 },
  { month: 'พ.ค.', value: 960000 },
  { month: 'มิ.ย.', value: 1050000 },
  { month: 'ก.ค.', value: 1200000 },
  { month: 'ส.ค.', value: 1180000 },
  { month: 'ก.ย.', value: 1310000 },
  { month: 'ต.ค.', value: 1290000 },
  { month: 'พ.ย.', value: 1420000 },
  { month: 'ธ.ค.', value: 1465000 },
];

export const mockMonthlyInvestment = [
  { month: 'ม.ค.', invested: 120000, profit: 15000 },
  { month: 'ก.พ.', invested: 80000, profit: 22000 },
  { month: 'มี.ค.', invested: 150000, profit: -8000 },
  { month: 'เม.ย.', invested: 50000, profit: 35000 },
  { month: 'พ.ค.', invested: 200000, profit: 42000 },
  { month: 'มิ.ย.', invested: 75000, profit: 28000 },
];

export const mockAllocation = [
  { name: 'หุ้นไทย', value: 58, color: '#10b981' },
  { name: 'หุ้นต่างประเทศ', value: 28.6, color: '#6366f1' },
  { name: 'คริปโต', value: 13.4, color: '#f59e0b' },
];

export const mockActivityLogs = [
  { id: '1', userId: '1', action: 'LOGIN' as const, module: 'auth', description: 'เข้าสู่ระบบสำเร็จ', ipAddress: '192.168.1.1', createdAt: '2024-07-10T10:30:00Z', user: { firstname: 'Pattara', lastname: 'Naksakul' } },
  { id: '2', userId: '1', action: 'CREATE' as const, module: 'portfolio', description: 'สร้าง Portfolio หุ้นไทย', ipAddress: '10.0.0.5', createdAt: '2024-07-09T15:45:00Z', user: { firstname: 'Pattara', lastname: 'Naksakul' } },
  { id: '3', userId: 'admin-1', action: 'CREATE' as const, module: 'announcement', description: 'สร้างประกาศ: ปรับปรุงระบบ', ipAddress: '127.0.0.1', createdAt: '2024-07-09T16:00:00Z', user: { firstname: 'Admin', lastname: 'System' } },
  { id: '4', userId: '1', action: 'REGISTER' as const, module: 'auth', description: 'สมัครสมาชิกใหม่', ipAddress: '172.16.0.10', createdAt: '2024-03-05T09:15:00Z', user: { firstname: 'Pattara', lastname: 'Naksakul' } },
];

// ─── Helpers ─────────────────────────────────────────────────────────

export function formatCurrency(value: number, currency = '฿'): string {
  return `${currency}${Math.abs(value).toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}
