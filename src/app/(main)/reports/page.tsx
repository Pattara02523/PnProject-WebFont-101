import { Metadata } from 'next';
import ReportsContent from '@/components/features/reports/ReportsContent';

export const metadata: Metadata = {
  title: 'Reports',
};

export default function ReportsPage() {
  return <ReportsContent />;
}
