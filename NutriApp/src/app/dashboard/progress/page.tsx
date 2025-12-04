import ProgressViewPage from '@/features/progress/components/progress-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard : Progress',
  description: 'Track your weight and calorie progress.'
};

export default function Page() {
  return <ProgressViewPage />;
}
