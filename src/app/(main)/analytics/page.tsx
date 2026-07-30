import { Metadata } from 'next';
import AnalyticsContent from '@/components/features/analytics/AnalyticsContent';

export const metadata: Metadata = {
  title: 'Analytics',
};

export default function AnalyticsPage() {
  return <AnalyticsContent />;
}
