import { getAIHelper } from '@/lib/ai-helper';
import { GoalEvaluation } from './goal-evaluator';
import { NutritionSummary } from './nutrition-analyst';

export interface MealStrategy {
  analysis: string;
  suggestions: {
    title: string;
    searchQuery: string;
    reasoning: string;
  }[];
}

export async function generateMealStrategy(
  current: NutritionSummary,
  evaluation: GoalEvaluation
): Promise<MealStrategy> {
  const ai = getAIHelper();

  let dietContext = '';
  const diets = Array.isArray(evaluation.goals.diet)
    ? evaluation.goals.diet
    : [];

  if (diets.includes('vegan')) {
    dietContext = 'STRICTLY VEGAN. No meat, dairy, eggs, or animal products.';
  } else if (diets.includes('keto')) {
    dietContext =
      'KETO FRIENDLY. High fat, very low carb. No sugar, grains, or starchy veg.';
  } else if (diets.includes('vegetarian')) {
    dietContext = 'VEGETARIAN. No meat. Dairy and eggs are okay.';
  } else {
    dietContext =
      'No specific dietary restrictions, but focus on healthy, whole foods.';
  }

  const systemPrompt = `You are an expert meal planner. Generate 3 distinct meal suggestions based on the user's status.
  
  Current Status:
  - Consumed: ${Math.round(current.calories)} kcal
  - Goal: ${evaluation.goals.calories} kcal
  - Remaining: ${Math.round(evaluation.remaining.calories)} kcal
  - Protein Needs: Need ${Math.round(Math.max(0, evaluation.remaining.protein))}g more
  
  Guidance: ${evaluation.guidance}
  Dietary Constraints: ${dietContext}

  Return a JSON object with:
  1. "analysis": A brief, encouraging 1-sentence summary of their status (e.g., "You're doing great on protein, but have 600 calories left for dinner!").
  2. "suggestions": An array of 3 meal objects. Each object must have:
     - "title": A short, catchy name for the dish (e.g., "Grilled Lemon Herb Chicken").
     - "searchQuery": A specific search term to find this recipe (e.g., "lemon herb chicken breast").
     - "reasoning": Why this fits their current needs (e.g., "High protein to hit your goal, low calorie to stay within limit").
  `;

  return await ai.generateJSON<MealStrategy>(
    'Generate meal plan',
    systemPrompt
  );
}
