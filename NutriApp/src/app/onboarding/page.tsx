'use client';

import { ProfileForm } from '@/features/profile/components/profile-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Hand } from 'lucide-react';
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
          <CardTitle className='flex items-center justify-center gap-2 text-2xl'>
            Welcome to NutriAI! <Hand className='h-6 w-6 text-yellow-500' />
          </CardTitle>
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
