import { getFavoriteRecipesAction } from '@/features/dashboard/actions/recipes';
import { FavoritesView } from '@/features/dashboard/components/favorites-view';
import PageContainer from '@/components/layout/page-container';

export const metadata = {
  title: 'My Favorites | NutriAI'
};

export default async function FavoritesPage() {
  const result = await getFavoriteRecipesAction();
  const favorites = result.success && result.data ? result.data : [];

  return (
    <PageContainer>
      <FavoritesView initialData={favorites} />
    </PageContainer>
  );
}
