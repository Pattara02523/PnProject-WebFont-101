import { Metadata } from 'next';
import PortfolioDetailContent from '@/components/features/portfolio/PortfolioDetailContent';

export const metadata: Metadata = {
  title: 'Portfolio Detail',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <PortfolioDetailContent id={id} />;
}
