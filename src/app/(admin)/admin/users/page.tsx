import { Metadata } from 'next';
import AdminUsersContent from '@/components/features/admin/AdminUsersContent';

export const metadata: Metadata = {
  title: 'Admin Users',
};

export default function AdminUsersPage() {
  return <AdminUsersContent />;
}
