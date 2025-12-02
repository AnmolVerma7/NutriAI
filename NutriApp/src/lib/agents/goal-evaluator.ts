import { createClient } from '@/lib/supabase/server';
import { NutritionSummary } from './nutrition-analyst';

export interface GoalEvaluation {
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    diet: string[];
  };
  remaining: {
    calories: number;
    protein: number;
  };
  status: 'under' | 'near' | 'over';
  guidance: string;
}

export async function evaluateGoals(
  userId: string,
  current: NutritionSummary
): Promise<GoalEvaluation> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  const goals = {
    calories: profile?.daily_calorie_goal || 2000,
    protein: profile?.daily_protein_goal || 150,
    carbs: profile?.daily_carbs_goal || 200,
    fat: profile?.daily_fats_goal || 70,
    diet: Array.isArray(profile?.dietary_restrictions)
      ? profile.dietary_restrictions
      : []
  };

  const remaining = {
    calories: goals.calories - current.calories,
    protein: goals.protein - current.protein
  };

  let status: 'under' | 'near' | 'over' = 'under';
  let guidance = '';

  if (remaining.calories > 500) {
    status = 'under';
    guidance =
      'User has plenty of calories left. Suggest hearty, filling meals.';
  } else if (remaining.calories < 200 && remaining.calories > 0) {
    status = 'near';
    guidance =
      'User is almost at calorie limit. Suggest light, high-volume, low-calorie options.';
  } else if (remaining.calories <= 0) {
    status = 'over';
    guidance =
      'User has exceeded calorie limit. Suggest extremely light snacks or planning for tomorrow.';
  } else {
    status = 'near';
    guidance = 'User has moderate calories left. Suggest balanced meals.';
  }

  return { goals, remaining, status, guidance };
}
