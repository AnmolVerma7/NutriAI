'use server';

import { searchRecipes } from '@/lib/spoonacular';

export async function searchRecipesAction(query: string) {
  try {
    const data = await searchRecipes(query);
    if (!data) {
      return { success: false, error: 'Failed to fetch recipes' };
    }
    return { success: true, data: data.results };
  } catch (error) {
    console.error('Server action error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

import { getRecipeInformation } from '@/lib/spoonacular';

export async function getRecipeInformationAction(id: number) {
  try {
    const data = await getRecipeInformation(id);
    if (!data) {
      return { success: false, error: 'Failed to fetch recipe details' };
    }
    return { success: true, data };
  } catch (error) {
    console.error('Server action error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

import { getRecipesByIds } from '@/lib/spoonacular';

export async function getRecipesByIdsAction(ids: number[]) {
  try {
    const data = await getRecipesByIds(ids);
    return { success: true, data };
  } catch (error) {
    console.error('Server action error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

import { createClient } from '@/lib/supabase/server';

export async function toggleFavoriteAction(recipeId: number, isFavorite: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    if (isFavorite) {
      // Add to favorites
      const { error } = await supabase
        .from('favorite_recipes')
        .insert({ user_id: user.id, recipe_id: recipeId });
      
      if (error) throw error;
    } else {
      // Remove from favorites
      const { error } = await supabase
        .from('favorite_recipes')
        .delete()
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId);

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return { success: false, error: 'Failed to update favorite status' };
  }
}

export async function getFavoriteStatusAction(recipeId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: true, isFavorite: false };

  try {
    const { data, error } = await supabase
      .from('favorite_recipes')
      .select('recipe_id')
      .eq('user_id', user.id)
      .eq('recipe_id', recipeId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking favorite status:', error);
    }

    return { success: true, isFavorite: !!data };
  } catch (error) {
    return { success: true, isFavorite: false };
  }
}

export async function clearCacheAction() {
  const supabase = await createClient();
  
  try {
    // 1. Get all recipe IDs that are favorited by ANYONE
    const { data: favorites, error: favError } = await supabase
      .from('favorite_recipes')
      .select('recipe_id');
    
    if (favError) throw favError;

    const favoriteIds = favorites?.map(f => f.recipe_id) || [];

    // 2. Delete recipes that are NOT in the favorite list
    if (favoriteIds.length > 0) {
       const { error } = await supabase
        .from('recipes')
        .delete()
        .not('id', 'in', `(${favoriteIds.join(',')})`);
       if (error) throw error;
    } else {
       const { error } = await supabase
        .from('recipes')
        .delete()
        .neq('id', 0); // Hack to delete all (id is never 0)
       if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error clearing cache:', error);
    return { success: false, error: 'Failed to clear cache' };
  }
}

export async function getFavoriteRecipesAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // 1. Get favorite recipe IDs
    const { data: favorites, error: favError } = await supabase
      .from('favorite_recipes')
      .select('recipe_id')
      .eq('user_id', user.id);

    if (favError) throw favError;

    if (!favorites || favorites.length === 0) {
      return { success: true, data: [] };
    }

    const recipeIds = favorites.map(f => f.recipe_id);

    // 2. Fetch recipe details from recipes table
    const { data: recipes, error: recipeError } = await supabase
      .from('recipes')
      .select('*')
      .in('id', recipeIds);

    if (recipeError) throw recipeError;

    // Parse the JSONB data
    const parsedRecipes = recipes.map(r => r.data);

    return { success: true, data: parsedRecipes };
  } catch (error) {
    console.error('Error fetching favorite recipes:', error);
    return { success: false, error: 'Failed to fetch favorite recipes' };
  }
}
