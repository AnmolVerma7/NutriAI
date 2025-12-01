import { unstable_cache } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
export const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

export interface RecipeSearchResult {
  id: number;
  title: string;
  image: string;
  imageType: string;
}

export interface RecipeSearchResponse {
  results: RecipeSearchResult[];
  offset: number;
  number: number;
  totalResults: number;
}

export async function searchRecipes(
  query: string,
  number: number = 10
): Promise<RecipeSearchResponse | null> {
  return unstable_cache(
    async () => {
      if (!SPOONACULAR_API_KEY) {
        console.error('SPOONACULAR_API_KEY is not defined');
        return null;
      }

      try {
        const response = await fetch(
          `${SPOONACULAR_BASE_URL}/recipes/complexSearch?query=${encodeURIComponent(query)}&number=${number}&apiKey=${SPOONACULAR_API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`Spoonacular API error: ${response.statusText}`);
        }

        const data: RecipeSearchResponse = await response.json();
        return data;
      } catch (error) {
        console.error('Error searching recipes:', error);
        return null;
      }
    },
    ['spoonacular-search', query, number.toString()],
    { revalidate: 3600, tags: ['recipes'] }
  )();
}

export interface RecipeInformation {
  id: number;
  title: string;
  image: string;
  summary: string;
  readyInMinutes: number;
  servings: number;
  extendedIngredients: {
    id: number;
    original: string;
  }[];
  analyzedInstructions: {
    name: string;
    steps: {
      number: number;
      step: string;
    }[];
  }[];
}

export async function getRecipeInformation(
  id: number
): Promise<RecipeInformation | null> {
  const supabase = await createClient();

  // 1. Check Database
  const { data: dbRecipe, error: dbError } = await supabase
    .from('recipes')
    .select('data, updated_at')
    .eq('id', id)
    .single();

  if (dbRecipe && dbRecipe.data) {
    const updatedAt = new Date(dbRecipe.updated_at);
    const now = new Date();
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
    const isStale = now.getTime() - updatedAt.getTime() > oneWeekInMs;

    if (!isStale) {
      console.log(`Cache hit (DB) for recipe ${id}`);
      return dbRecipe.data as RecipeInformation;
    }
    console.log(`Cache stale (DB) for recipe ${id}, re-fetching...`);
  }

  // 2. Fetch from API
  if (!SPOONACULAR_API_KEY) {
    console.error('SPOONACULAR_API_KEY is not defined');
    return null;
  }

  try {
    console.log(`Fetching from API for recipe ${id}`);
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.statusText}`);
    }

    const data: RecipeInformation = await response.json();

    // 3. Save to Database (Upsert)
    const { error: upsertError } = await supabase.from('recipes').upsert({
      id: data.id,
      title: data.title,
      image: data.image,
      data: data,
      updated_at: new Date().toISOString()
    });

    if (upsertError) {
      console.error('Error caching recipe to DB:', upsertError);
    }

    return data;
  } catch (error) {
    console.error('Error fetching recipe information:', error);
    // Fallback: If API fails but we have stale data, return it
    if (dbRecipe && dbRecipe.data) {
      console.log(`API failed, returning stale data for recipe ${id}`);
      return dbRecipe.data as RecipeInformation;
    }
    return null;
  }
}

export async function getRecipesByIds(
  ids: number[]
): Promise<RecipeInformation[]> {
  if (ids.length === 0) return [];

  const supabase = await createClient();

  const { data: dbRecipes, error } = await supabase
    .from('recipes')
    .select('data')
    .in('id', ids);

  if (error) {
    console.error('Error fetching recipes by IDs:', error);
    return [];
  }

  return dbRecipes?.map((row) => row.data as RecipeInformation) || [];
}
