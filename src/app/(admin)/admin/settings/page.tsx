import { Metadata } from 'next';
import AdminSettingsContent from '@/components/features/admin/AdminSettingsContent';

export const metadata: Metadata = {
  title: 'Admin Settings',
};

export default function AdminSettingsPage() {
  return <AdminSettingsContent />;
}
