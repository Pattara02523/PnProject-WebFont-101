import { Metadata } from 'next';
import AdminActivityLogsContent from '@/components/features/admin/AdminActivityLogsContent';

export const metadata: Metadata = {
  title: 'Admin Activity Logs',
};

export default function AdminActivityLogsPage() {
  return <AdminActivityLogsContent />;
}
