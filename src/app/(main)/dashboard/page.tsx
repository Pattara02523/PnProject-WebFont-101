import { Metadata } from 'next';
import DashboardContent from '@/components/features/dashboard/DashboardContent';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return <DashboardContent />;
}
