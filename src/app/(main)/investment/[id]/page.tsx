import { Metadata } from 'next';
import InvestmentDetailContent from '@/components/features/investment/InvestmentDetailContent';

export const metadata: Metadata = {
  title: 'Investment Detail',
};

export default function InvestmentDetailPage() {
  return <InvestmentDetailContent />;
}
