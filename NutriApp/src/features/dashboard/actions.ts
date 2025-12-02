'use server';

import { searchFoodFatSecret } from '@/lib/fatsecret';

export async function searchFoodAction(query: string) {
  try {
    const data = await searchFoodFatSecret(query);
    return { success: true, data };
  } catch (error) {
    console.error('Search food error:', error);
    return { success: false, error: 'Failed to search food' };
  }
}

// New imports needed for logFoodAction
import { createClient } from '@/lib/supabase/server';
import { NutritionData } from '@/types/nutrition';
import { revalidatePath } from 'next/cache';

export async function logFoodAction(foodItem: NutritionData) {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  const { error } = await supabase.from('food_logs').insert({
    user_id: user.id,
    name: foodItem.name,
    calories: foodItem.calories,
    protein_g: foodItem.protein_g,
    carbs_g: foodItem.carbohydrates_total_g,
    fat_g: foodItem.fat_total_g,
    serving_size_g: foodItem.serving_size_g,
    serving_unit: foodItem.serving_unit
  });

  if (error) {
    console.error('Error logging food:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/overview');
  return { success: true };
}

export async function deleteFoodLogAction(id: string) {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  const { error } = await supabase
    .from('food_logs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting food log:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function toggleFavoriteFoodAction(
  food: NutritionData,
  isFavorite: boolean
) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'User not authenticated' };

  // Use name as ID if no explicit ID (FatSecret search results don't always have ID in our NutritionData type yet)
  // Ideally we should extend NutritionData to include an ID, but for now name is unique enough for this context
  const foodId = food.name;

  if (isFavorite) {
    // Add to favorites
    const { error } = await supabase.from('favorite_foods').insert({
      user_id: user.id,
      food_id: foodId,
      name: food.name,
      calories: food.calories,
      macros: {
        protein: food.protein_g,
        carbs: food.carbohydrates_total_g,
        fat: food.fat_total_g,
        serving: food.serving_size_g
      }
    });
    if (error) return { success: false, error: error.message };
  } else {
    // Remove from favorites
    const { error } = await supabase
      .from('favorite_foods')
      .delete()
      .eq('user_id', user.id)
      .eq('food_id', foodId);
    if (error) return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getFavoriteFoodsAction() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('favorite_foods')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching favorite foods:', error);
    return [];
  }

  return data.map((item: any) => ({
    name: item.name,
    calories: item.calories,
    protein_g: item.macros.protein,
    carbohydrates_total_g: item.macros.carbs,
    fat_total_g: item.macros.fat,
    serving_size_g: item.macros.serving,
    // Defaults for others
    sugar_g: 0,
    fiber_g: 0,
    sodium_mg: 0,
    potassium_mg: 0,
    cholesterol_mg: 0,
    fat_saturated_g: 0,
    isFavorite: true // Helper flag
  })) as NutritionData[];
}

export async function clearFoodCacheAction() {
  const supabase = await createClient();

  // Only authenticated users can clear cache (via RLS)
  const { error } = await supabase
    .from('food_search_cache')
    .delete()
    .neq('query', ''); // Delete all

  if (error) {
    console.error('Error clearing food cache:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
import { getAIHelper } from '@/lib/ai-helper';

export async function parseFoodLogAction(input: string) {
  try {
    const ai = getAIHelper();

    const systemPrompt = `Extract food items from text into JSON.
    Output format: { "items": [{ "name": string, "calories": number, "protein_g": number, "carbohydrates_total_g": number, "fat_total_g": number, "serving_size_g": number, "serving_unit": string }] }
    Instructions:
    1. Identify the TOTAL quantity consumed (e.g., "2 cups", "2 slices", "100g").
    2. If the user specifies a count (e.g. "2 burgers"), the serving_unit MUST reflect that count (e.g. "2 burgers").
    3. Calculate ALL nutrition values for THAT specific TOTAL amount.
    4. Return the unit as "serving_unit".
    5. Estimate nutrition if unspecified.`;

    const result = await ai.generateJSON<{ items: NutritionData[] }>(
      input,
      systemPrompt
    );

    return { success: true, data: result.items };
  } catch (error) {
    console.error('AI Parse error:', error);
    return { success: false, error: 'Failed to analyze text' };
  }
}
