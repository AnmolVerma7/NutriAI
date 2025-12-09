import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';

export function RecipeSkeleton() {
  return (
    <Card className='border-muted/60 flex flex-col overflow-hidden'>
      <div className='aspect-video w-full'>
        <Skeleton className='h-full w-full' />
      </div>
      <CardHeader className='p-4'>
        <Skeleton className='h-6 w-3/4 self-center' />
      </CardHeader>
      <CardFooter className='mt-auto p-4 pt-0'>
        <Skeleton className='h-10 w-full' />
      </CardFooter>
    </Card>
  );
}

export function RecipeGridSkeleton() {
  return (
    <div className='mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6'>
      {Array.from({ length: 6 }).map((_, i) => (
        <RecipeSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-4 w-4 rounded-full' />
      </CardHeader>
      <CardContent>
        <Skeleton className='mb-2 h-8 w-16' />
        <Skeleton className='h-3 w-32' />
      </CardContent>
    </Card>
  );
}
