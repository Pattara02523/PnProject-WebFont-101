import { Metadata } from 'next';
import AdminExportsContent from '@/components/features/admin/AdminExportsContent';

export const metadata: Metadata = {
  title: 'Admin Export Reports',
};

export default function AdminExportsPage() {
  return <AdminExportsContent />;
}
