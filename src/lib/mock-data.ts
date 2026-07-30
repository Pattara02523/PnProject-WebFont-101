export const mockUser = {
  id: '1',
  firstName: 'Somchai',
  lastName: 'Jaidee',
  email: 'somchai@example.com',
  phone: '081-234-5678',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format',
  role: 'user' as 'user' | 'admin',
  plan: 'Go',
  joinDate: '2024-01-15',
  language: 'th',
};

export const mockAdmin = {
  id: 'admin-1',
  firstName: 'Admin',
  lastName: 'System',
  email: 'admin@investpro.com',
  role: 'admin' as 'user' | 'admin',
};

export const mockPortfolios = [
  { id: '1', name: 'หุ้นไทย', description: 'พอร์ตหุ้นในตลาดหลักทรัพย์ไทย', totalValue: 850000, invested: 700000, profit: 150000, roi: 21.43, assets: 8, color: '#10b981', createdAt: '2024-01-20' },
  { id: '2', name: 'หุ้นต่างประเทศ', description: 'ETF และหุ้นสหรัฐอเมริกา', totalValue: 420000, invested: 380000, profit: 40000, roi: 10.53, assets: 5, color: '#6366f1', createdAt: '2024-02-10' },
  { id: '3', name: 'คริปโต', description: 'สินทรัพย์ดิจิทัล', totalValue: 195000, invested: 250000, profit: -55000, roi: -22.0, assets: 4, color: '#f59e0b', createdAt: '2024-03-05' },
];

export const mockInvestments = [
  { id: '1', name: 'PTT Global Chemical', symbol: 'PTTGC', type: 'หุ้น', category: 'พลังงาน', buyPrice: 65.5, currentPrice: 78.25, quantity: 1000, investDate: '2024-01-25', risk: 'medium', roi: 19.47, profit: 12750, status: 'active', portfolioId: '1' },
  { id: '2', name: 'Kasikorn Bank', symbol: 'KBANK', type: 'หุ้น', category: 'การเงิน', buyPrice: 138.0, currentPrice: 155.5, quantity: 500, investDate: '2024-02-01', risk: 'low', roi: 12.68, profit: 8750, status: 'active', portfolioId: '1' },
  { id: '3', name: 'Apple Inc.', symbol: 'AAPL', type: 'หุ้น', category: 'เทคโนโลยี', buyPrice: 182.0, currentPrice: 205.5, quantity: 50, investDate: '2024-02-15', risk: 'low', roi: 12.91, profit: 1175, status: 'active', portfolioId: '2' },
  { id: '4', name: 'Bitcoin', symbol: 'BTC', type: 'คริปโต', category: 'สินทรัพย์ดิจิทัล', buyPrice: 1800000, currentPrice: 1650000, quantity: 0.1, investDate: '2024-03-10', risk: 'high', roi: -8.33, profit: -15000, status: 'active', portfolioId: '3' },
  { id: '5', name: 'S&P 500 ETF', symbol: 'SPY', type: 'ETF', category: 'ดัชนี', buyPrice: 450.0, currentPrice: 512.0, quantity: 20, investDate: '2024-02-20', risk: 'medium', roi: 13.78, profit: 1240, status: 'active', portfolioId: '2' },
  { id: '6', name: 'Ethereum', symbol: 'ETH', type: 'คริปโต', category: 'สินทรัพย์ดิจิทัล', buyPrice: 95000, currentPrice: 85000, quantity: 0.5, investDate: '2024-03-15', risk: 'high', roi: -10.53, profit: -5000, status: 'active', portfolioId: '3' },
];

export const mockTransactions = [
  { id: '1', type: 'buy', asset: 'PTT Global Chemical', symbol: 'PTTGC', amount: 65500, quantity: 1000, price: 65.5, date: '2024-01-25', portfolioId: '1', note: 'เข้าซื้อในจังหวะย่อ' },
  { id: '2', type: 'deposit', asset: 'เงินฝาก', symbol: '-', amount: 500000, quantity: 1, price: 500000, date: '2024-01-20', portfolioId: '1', note: 'เพิ่มเงินทุนเริ่มต้น' },
  { id: '3', type: 'buy', asset: 'Kasikorn Bank', symbol: 'KBANK', amount: 69000, quantity: 500, price: 138.0, date: '2024-02-01', portfolioId: '1', note: '' },
  { id: '4', type: 'dividend', asset: 'PTT Global Chemical', symbol: 'PTTGC', amount: 2500, quantity: 1000, price: 2.5, date: '2024-02-28', portfolioId: '1', note: 'เงินปันผลประจำปี' },
  { id: '5', type: 'buy', asset: 'Apple Inc.', symbol: 'AAPL', amount: 9100, quantity: 50, price: 182.0, date: '2024-02-15', portfolioId: '2', note: '' },
  { id: '6', type: 'sell', asset: 'Kasikorn Bank', symbol: 'KBANK', amount: 15500, quantity: 100, price: 155.0, date: '2024-05-10', portfolioId: '1', note: 'ทำกำไรบางส่วน' },
  { id: '7', type: 'buy', asset: 'Bitcoin', symbol: 'BTC', amount: 180000, quantity: 0.1, price: 1800000, date: '2024-03-10', portfolioId: '3', note: '' },
  { id: '8', type: 'withdraw', asset: 'ถอนเงิน', symbol: '-', amount: 50000, quantity: 1, price: 50000, date: '2024-04-01', portfolioId: '1', note: 'ถอนกำไร' },
];

export const mockCategories = [
  { id: '1', name: 'พลังงาน', icon: 'Zap', color: '#f59e0b', count: 3 },
  { id: '2', name: 'การเงิน', icon: 'Building2', color: '#6366f1', count: 2 },
  { id: '3', name: 'เทคโนโลยี', icon: 'Cpu', color: '#10b981', count: 5 },
  { id: '4', name: 'สินทรัพย์ดิจิทัล', icon: 'Bitcoin', color: '#f97316', count: 3 },
  { id: '5', name: 'ดัชนี', icon: 'TrendingUp', color: '#8b5cf6', count: 2 },
  { id: '6', name: 'อสังหาริมทรัพย์', icon: 'Home', color: '#ec4899', count: 1 },
];

export const mockGoals = [
  { id: '1', name: 'ซื้อบ้าน', icon: 'Home', targetAmount: 3000000, currentAmount: 1465000, deadline: '2027-12-31', color: '#10b981', description: 'บ้านเดี่ยวชานเมือง' },
  { id: '2', name: 'เกษียณ', icon: 'Palmtree', targetAmount: 10000000, currentAmount: 1465000, deadline: '2045-01-01', color: '#6366f1', description: 'กองทุนเกษียณ' },
  { id: '3', name: 'ซื้อรถ', icon: 'Car', targetAmount: 1500000, currentAmount: 850000, deadline: '2025-06-30', color: '#f59e0b', description: 'รถยนต์ไฟฟ้า' },
];

export const mockNotifications = [
  { id: '1', type: 'price', title: 'PTTGC ขึ้น 5%', message: 'ราคาหุ้น PTTGC ปรับตัวขึ้น 5% วันนี้ ปิดที่ 78.25 บาท', time: '10 นาทีที่แล้ว', read: false },
  { id: '2', type: 'goal', title: 'เป้าหมายซื้อรถ 56%', message: 'คุณบรรลุ 56% ของเป้าหมายซื้อรถแล้ว ยังขาดอีก 650,000 บาท', time: '1 ชั่วโมงที่แล้ว', read: false },
  { id: '3', type: 'system', title: 'อัปเดตแผน Go สำเร็จ', message: 'ชำระค่าสมาชิก Plan Go สำเร็จ ใช้งานได้ถึง 10 ก.ค. 2025', time: '2 วันที่แล้ว', read: true },
  { id: '4', type: 'reminder', title: 'ตรวจสอบพอร์ตรายสัปดาห์', message: 'ครบกำหนดตรวจสอบพอร์ตการลงทุนประจำสัปดาห์แล้ว', time: '3 วันที่แล้ว', read: true },
  { id: '5', type: 'price', title: 'BTC ลง 8%', message: 'Bitcoin ราคาลดลง 8% ในช่วง 24 ชั่วโมงที่ผ่านมา', time: '5 วันที่แล้ว', read: true },
];

export const mockPaymentHistory = [
  { id: '1', date: '2024-06-10', plan: 'Go', amount: 99, status: 'success', method: 'PromptPay', receipt: '#INV-001' },
  { id: '2', date: '2024-05-10', plan: 'Go', amount: 99, status: 'success', method: 'Credit Card', receipt: '#INV-002' },
  { id: '3', date: '2024-04-10', plan: 'Basic', amount: 49, status: 'success', method: 'Bank Transfer', receipt: '#INV-003' },
  { id: '4', date: '2024-03-10', plan: 'Basic', amount: 49, status: 'failed', method: 'Credit Card', receipt: '-' },
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

// Admin mock data
export const mockAdminUsers = [
  { id: '1', name: 'Somchai Jaidee', email: 'somchai@example.com', plan: 'Go', status: 'active', joined: '2024-01-15', lastLogin: '2024-07-09' },
  { id: '2', name: 'Siriporn Mala', email: 'siriporn@example.com', plan: 'Plus', status: 'active', joined: '2024-02-20', lastLogin: '2024-07-10' },
  { id: '3', name: 'Wichai Boonma', email: 'wichai@example.com', plan: 'Free', status: 'active', joined: '2024-03-05', lastLogin: '2024-07-08' },
  { id: '4', name: 'Nattaporn Kham', email: 'nattaporn@example.com', plan: 'Basic', status: 'suspended', joined: '2024-04-10', lastLogin: '2024-06-15' },
  { id: '5', name: 'Prawit Sanguan', email: 'prawit@example.com', plan: 'Go', status: 'active', joined: '2024-05-01', lastLogin: '2024-07-10' },
];

export const mockAdminPayments = [
  { id: 'PAY-001', user: 'Somchai Jaidee', email: 'somchai@example.com', plan: 'Go', amount: 99, method: 'Bank Transfer', status: 'pending', date: '2024-07-10', slip: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop' },
  { id: 'PAY-002', user: 'Siriporn Mala', email: 'siriporn@example.com', plan: 'Plus', amount: 199, method: 'PromptPay', status: 'approved', date: '2024-07-09', slip: null },
  { id: 'PAY-003', user: 'Wichai Boonma', email: 'wichai@example.com', plan: 'Basic', amount: 49, method: 'Bank Transfer', status: 'rejected', date: '2024-07-08', slip: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop' },
];

export const mockActivityLogs = [
  { id: '1', user: 'Somchai Jaidee', action: 'login', description: 'เข้าสู่ระบบสำเร็จ', ip: '192.168.1.1', time: '2024-07-10 10:30:00' },
  { id: '2', user: 'Siriporn Mala', action: 'payment', description: 'ชำระค่า Plan Plus', ip: '10.0.0.5', time: '2024-07-09 15:45:00' },
  { id: '3', user: 'Admin System', action: 'admin', description: 'อนุมัติการชำระเงิน PAY-002', ip: '127.0.0.1', time: '2024-07-09 16:00:00' },
  { id: '4', user: 'Wichai Boonma', action: 'register', description: 'สมัครสมาชิกใหม่', ip: '172.16.0.10', time: '2024-03-05 09:15:00' },
  { id: '5', user: 'Nattaporn Kham', action: 'crud', description: 'สร้าง Portfolio ใหม่', ip: '192.168.0.15', time: '2024-07-08 14:20:00' },
];

export function formatCurrency(value: number, currency = '฿'): string {
  return `${currency}${Math.abs(value).toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}
