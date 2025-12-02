import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { analyzeNutrition } from '@/lib/agents/nutrition-analyst';
import { evaluateGoals } from '@/lib/agents/goal-evaluator';
import { generateMealStrategy } from '@/lib/agents/meal-planner';
import { findRecipes } from '@/lib/agents/recipe-recommender';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Nutrition Analyst 📊
    const currentNutrition = await analyzeNutrition(user.id);

    // 2. Goal Evaluator 🎯
    const evaluation = await evaluateGoals(user.id, currentNutrition);

    // 3. Meal Planner 📝
    const strategy = await generateMealStrategy(currentNutrition, evaluation);

    // 4. Recipe Recommender 🍳
    const suggestions = await findRecipes(strategy);

    // 5. Persistence 💾
    const { error: saveError } = await supabase.from('meal_plans').insert({
      user_id: user.id,
      analysis: strategy.analysis,
      suggestions: suggestions
    });

    if (saveError) {
      console.error('Failed to save meal plan:', saveError);
      // We don't fail the request, just log the error
    }

    return NextResponse.json({
      analysis: strategy.analysis,
      suggestions
    });
  } catch (error) {
    console.error('Meal Plan Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate meal plan' },
      { status: 500 }
    );
  }
}
