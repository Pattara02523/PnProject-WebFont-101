import { Metadata } from 'next';
import AnnouncementsContent from '@/components/features/announcements/AnnouncementsContent';

export const metadata: Metadata = {
  title: 'Announcements',
};

export default function AnnouncementsPage() {
  return <AnnouncementsContent />;
}
