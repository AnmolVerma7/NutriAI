import PageContainer from '@/components/layout/page-container';
import { RecipeSearch } from '@/features/dashboard/components/recipe-search';

export default function RecipeSearchPage() {
  return (
    <PageContainer>
      <div className='flex w-full flex-col items-center space-y-6 text-center'>
        <div className='space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>Recipe Search</h2>
          <p className='text-muted-foreground mx-auto max-w-2xl'>
            Search for delicious recipes powered by Spoonacular.
          </p>
        </div>
        <div className='w-full'>
          <RecipeSearch />
        </div>
      </div>
    </PageContainer>
  );
}
