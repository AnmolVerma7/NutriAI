'use server';

import { searchFood } from '@/lib/calorie-ninjas';

export async function searchFoodAction(query: string) {
  try {
    const result = await searchFood(query);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Search food error:', error);
    return { success: false, error: 'Failed to search food' };
  }
}

// New imports needed for logFoodAction
import { createClient } from '@/lib/supabase/server';
import { NutritionData } from '@/lib/calorie-ninjas';

export async function logFoodAction(foodItem: NutritionData) {
  const supabase = await createClient();
  
  const {
    data: { user },
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
  });

  if (error) {
    console.error('Error logging food:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
