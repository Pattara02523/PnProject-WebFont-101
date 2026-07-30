import { Metadata } from 'next';
import PortfolioContent from '@/components/features/portfolio/PortfolioContent';

export const metadata: Metadata = {
  title: 'Portfolio',
};

export default function PortfolioPage() {
  return <PortfolioContent />;
}
