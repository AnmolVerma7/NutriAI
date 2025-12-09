import Squares from '@/components/squares';
import { AnimatedTitle } from '@/components/ui/animated-title';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
  return (
    <div className='bg-background relative flex h-screen w-full flex-col items-center justify-center gap-8 overflow-hidden'>
      {/* Background Squares Effect */}
      <div className='absolute inset-0 z-0 opacity-60'>
        <Squares
          direction='up'
          speed={0.25}
          squareSize={40}
          borderColor='var(--primary)'
        />
      </div>

      <div className='relative z-10 flex flex-col items-center gap-8'>
        <AnimatedTitle />

        <div className='flex gap-4'>
          <Button asChild variant='default' size='lg'>
            <Link href='/auth/sign-in'>Sign In</Link>
          </Button>
          <Button asChild variant='outline' size='lg'>
            <Link href='/auth/sign-up'>Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
