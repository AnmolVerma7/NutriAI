import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='bg-background relative flex min-h-screen w-full items-center justify-center overflow-hidden'>

      {/* Back Button - Top Left */}
      <div className='absolute left-4 top-4 z-20 md:left-8 md:top-8'>
        <Button asChild variant='ghost' size='sm' className='gap-2 pl-2'>
          <Link href='/'>
            <ChevronLeft className='size-4' />
            Back
          </Link>
        </Button>
      </div>

      <div className='relative z-10 w-full max-w-md px-4'>{children}</div>
    </div>
  );
}
