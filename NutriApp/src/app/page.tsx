import { redirect } from 'next/navigation';

export default async function Page() {
  // TODO: Add Supabase auth check here
  // For now, redirect to dashboard or sign-in
  redirect('/dashboard/overview');
}
