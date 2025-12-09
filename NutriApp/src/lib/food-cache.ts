import { NutritionData } from '@/types/nutrition';
import { createClient } from '@/lib/supabase/server';

// In-memory cache for super-fast repeated searches in the same session
const memoryCache = new Map<string, NutritionData[]>();

export async function searchFoodCache(
  query: string
): Promise<NutritionData[]> {
  const normalizedQuery = query.toLowerCase().trim();

  // 1. Check Memory Cache
  if (memoryCache.has(normalizedQuery)) {
    console.log(`Cache hit (Memory) for "${normalizedQuery}"`);
    return memoryCache.get(normalizedQuery)!;
  }

  const supabase = await createClient();

  // 2. Check Database Cache
  try {
    const { data: dbCache, error } = await supabase
      .from('food_search_cache')
      .select('results, created_at')
      .eq('query', normalizedQuery)
      .single();

    if (dbCache && dbCache.results) {
        console.log(`Cache hit (DB) for "${normalizedQuery}"`);
        const results = dbCache.results as NutritionData[];
        memoryCache.set(normalizedQuery, results); // Populate memory
        return results;
    }
  } catch (err) {
    console.warn('Error checking DB cache:', err);
  }

  console.log(`Cache miss for "${normalizedQuery}" (API Disabled)`);
  return [];
}
