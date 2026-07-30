import { Metadata } from 'next';
import CategoryContent from '@/components/features/category/CategoryContent';

export const metadata: Metadata = {
  title: 'Category',
};

export default function CategoryPage() {
  return <CategoryContent />;
}
