import { Metadata } from 'next';
import AdminDashboardContent from '@/components/features/admin/AdminDashboardContent';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

export default function AdminDashboardPage() {
  return <AdminDashboardContent />;
}
