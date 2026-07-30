import { Metadata } from 'next';
import GoalContent from '@/components/features/goal/GoalContent';

export const metadata: Metadata = {
  title: 'Goal',
};

export default function GoalPage() {
  return <GoalContent />;
}
