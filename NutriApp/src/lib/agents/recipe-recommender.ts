import { searchRecipes, RecipeSearchResult } from '@/lib/spoonacular';
import { MealStrategy } from './meal-planner';

export interface RecipeRecommendation {
  title: string;
  searchQuery: string;
  reasoning: string;
  recipe: RecipeSearchResult | null;
}

export async function findRecipes(
  strategy: MealStrategy
): Promise<RecipeRecommendation[]> {
  const results = await Promise.all(
    strategy.suggestions.map(async (suggestion) => {
      // 1. Try specific search
      let searchRes = await searchRecipes(suggestion.searchQuery, 1);
      let recipe = searchRes?.results[0];

      // 2. Fallback: If not found, try a simpler search (first 3 words)
      if (!recipe) {
        const simplifiedQuery = suggestion.searchQuery
          .split(' ')
          .slice(0, 3)
          .join(' ');
        if (simplifiedQuery !== suggestion.searchQuery) {
          console.log(
            `Retrying search with simplified query: "${simplifiedQuery}"`
          );
          searchRes = await searchRecipes(simplifiedQuery, 1);
          recipe = searchRes?.results[0];
        }
      }

      return {
        ...suggestion,
        recipe: recipe || null
      };
    })
  );

  return results;
}
