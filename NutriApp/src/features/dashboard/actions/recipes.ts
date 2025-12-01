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
