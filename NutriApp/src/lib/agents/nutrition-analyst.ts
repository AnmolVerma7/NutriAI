import { createClient } from '@/lib/supabase/server';

export interface NutritionSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export async function analyzeNutrition(
  userId: string
): Promise<NutritionSummary> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: logs } = await supabase
    .from('food_logs')
    .select('calories, protein_g, carbs_g, fat_g')
    .eq('user_id', userId)
    .eq('date', today);

  const totals = (logs || []).reduce(
    (acc, log) => ({
      calories: acc.calories + Number(log.calories),
      protein: acc.protein + Number(log.protein_g),
      carbs: acc.carbs + Number(log.carbs_g),
      fat: acc.fat + Number(log.fat_g)
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return totals;
}
