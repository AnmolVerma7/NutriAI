import { redirect } from 'next/navigation';

export default async function Dashboard() {
  // TODO: Add Supabase auth check here
  redirect('/dashboard/overview');
}
