'use client';

import { Button } from '@/components/ui/button';
import { seedProgressDataAction } from '../actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { Database, Sprout, Rocket, Loader2 } from 'lucide-react';

export function SeedDataButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSeed = async () => {
    setIsLoading(true);
    try {
      const result = await seedProgressDataAction();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Demo data seeded successfully!', {
          icon: <Rocket className="h-4 w-4" />
        });
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant='outline' onClick={handleSeed} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Seeding...
        </>
      ) : (
        <>
          Seed Demo Data <Sprout className='ml-2 h-4 w-4' />
        </>
      )}
    </Button>
  );
}
