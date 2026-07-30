import { Metadata } from 'next';
import ProfileContent from '@/components/features/profile/ProfileContent';

export const metadata: Metadata = {
  title: 'Profile',
};

export default function ProfilePage() {
  return <ProfileContent />;
}
