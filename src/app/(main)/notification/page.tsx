import { Metadata } from 'next';
import NotificationContent from '@/components/features/notification/NotificationContent';

export const metadata: Metadata = {
  title: 'Notification',
};

export default function NotificationPage() {
  return <NotificationContent />;
}
