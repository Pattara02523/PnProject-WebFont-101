import { Metadata } from 'next';
import SettingsContent from '@/components/features/settings/SettingsContent';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return <SettingsContent />;
}
