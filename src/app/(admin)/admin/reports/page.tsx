import { Metadata } from 'next';
import AdminReportsContent from '@/components/features/admin/AdminReportsContent';

export const metadata: Metadata = {
  title: 'Admin Reports',
};

export default function AdminReportsPage() {
  return <AdminReportsContent />;
}
