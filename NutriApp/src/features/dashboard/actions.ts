'use server';

import { searchFood } from '@/lib/calorie-ninjas';

export async function searchFoodAction(query: string) {
  try {
    const data = await searchFood(query);
    return { success: true, data };
  } catch (error) {
    console.error('Search food error:', error);
    return { success: false, error: 'Failed to fetch food data' };
  }
}
