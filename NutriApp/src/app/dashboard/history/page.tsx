import { createClient } from '@/lib/supabase/server';
import PageContainer from '@/components/layout/page-container';
import { HistoryView } from '@/features/dashboard/components/history-view';

export const metadata = {
  title: 'History - NutriAI',
  description: 'View your meal history.'
};

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let logs: any[] | null = null;

  if (user) {
    const { data } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }); // Newest first

    logs = data;
  }

  return (
    <PageContainer>
      <HistoryView logs={logs} />
    </PageContainer>
  );
}
