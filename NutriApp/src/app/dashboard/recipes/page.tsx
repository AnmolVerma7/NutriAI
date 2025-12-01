import PageContainer from '@/components/layout/page-container';
import { RecipeSearch } from '@/features/dashboard/components/recipe-search';

export default function RecipeSearchPage() {
  return (
    <PageContainer>
      <div className="flex flex-col space-y-6 items-center text-center w-full">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Recipe Search</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Search for delicious recipes powered by Spoonacular.
          </p>
        </div>
        <div className="w-full">
          <RecipeSearch />
        </div>
      </div>
    </PageContainer>
  );
}
