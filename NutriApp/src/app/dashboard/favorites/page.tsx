import { getFavoriteRecipesAction } from '@/features/dashboard/actions/recipes';
import { getFavoriteFoodsAction } from '@/features/dashboard/actions';
import { FavoritesView } from '@/features/dashboard/components/favorites-view';
import PageContainer from '@/components/layout/page-container';

export const metadata = {
  title: 'My Favorites | NutriAI'
};

export default async function FavoritesPage() {
  const [recipesResult, favoriteFoods] = await Promise.all([
    getFavoriteRecipesAction(),
    getFavoriteFoodsAction()
  ]);

  const favoriteRecipes =
    recipesResult.success && recipesResult.data ? recipesResult.data : [];

  return (
    <PageContainer>
      <FavoritesView
        initialRecipes={favoriteRecipes}
        initialFoods={favoriteFoods}
      />
    </PageContainer>
  );
}
