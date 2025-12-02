'use client';

import { ProfileForm } from '@/features/profile/components/profile-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/dashboard/overview');
  };

  return (
    <div className='bg-muted/30 flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-2xl'>
        <CardHeader>
          <CardTitle className='text-2xl'>Welcome to NutriAI! 👋</CardTitle>
          <CardDescription>
            Let's get to know you better so we can personalize your AI meal
            plans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm isOnboarding={true} onComplete={handleComplete} />
        </CardContent>
      </Card>
    </div>
  );
}
