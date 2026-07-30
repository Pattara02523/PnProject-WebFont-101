import { Metadata } from 'next';
import TransactionContent from '@/components/features/transaction/TransactionContent';

export const metadata: Metadata = {
  title: 'Transaction',
};

export default function TransactionPage() {
  return <TransactionContent />;
}
