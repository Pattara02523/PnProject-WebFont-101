import { Metadata } from 'next';
import InvestmentContent from '@/components/features/investment/InvestmentContent';

export const metadata: Metadata = {
  title: 'Investment',
};

export default function InvestmentPage() {
  return <InvestmentContent />;
}
