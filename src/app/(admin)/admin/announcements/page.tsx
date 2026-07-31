import { Metadata } from 'next';
import AdminAnnouncementsContent from '@/components/features/admin/AdminAnnouncementsContent';

export const metadata: Metadata = {
  title: 'Admin Announcements',
};

export default function AdminAnnouncementsPage() {
  return <AdminAnnouncementsContent />;
}
