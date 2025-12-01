import { AnimatedTitle } from '@/components/ui/animated-title';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8 bg-background">
      <AnimatedTitle />
      
      <div className="flex gap-4">
        <Button asChild variant="default" size="lg">
          <Link href="/auth/sign-in">Sign In</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/auth/sign-up">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
