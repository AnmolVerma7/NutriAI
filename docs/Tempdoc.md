User clicks "Get AI Meal Plan"
↓
[Agent 1: Nutrition Analyzer]

- Fetches today's logged meals from Supabase
- Calculates total calories, protein, carbs, fats
- Returns nutritional summary
  ↓
  [Agent 2: Goal Evaluator]
- Compares against user's daily goals
- Determines: over/under/on-track
  ↓
  [CONDITIONAL BRANCH 1: Calorie Status]
  IF remaining calories > 500:
  → Suggest larger, filling meals
  ELSE IF remaining calories < 100:
  → Suggest light snacks only
  ELSE:
  → Suggest balanced meals
  ↓
  [Agent 3: Dietary Filter]
- Checks user's dietary restrictions from settings
  ↓
  [CONDITIONAL BRANCH 2: Diet Type]
  IF user is vegan:
  → Filter for plant-based only
  ELSE IF user is keto:
  → Filter for low-carb
  ELSE IF has allergies:
  → Exclude allergens
  ↓
  [Agent 4: Recipe Recommender]
- Calls Spoonacular API with filters
- Returns 3-5 personalized recipe suggestions
- Includes reasoning for each suggestion

```javascript
// src/features/ai-meal-plan/api/route.ts
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  const { userId } = await req.json();

  // Agent 1: Get today's meals and analyze
  const todaysMeals = await getTodaysMeals(userId);
  const totalNutrition = calculateTotals(todaysMeals);

  // Agent 2: Evaluate against goals
  const userGoals = await getUserGoals(userId);
  const remaining = userGoals.calories - totalNutrition.calories;

  // CONDITIONAL BRANCH 1: Calorie status
  let calorieGuidance = "";
  if (remaining > 500) {
    calorieGuidance = "plenty of room for larger meals";
  } else if (remaining < 100) {
    calorieGuidance = "almost at goal, suggest light options";
  } else {
    calorieGuidance = "moderate room, balanced meals";
  }

  // Agent 3: Check dietary restrictions
  const userProfile = await getUserProfile(userId);

  // CONDITIONAL BRANCH 2: Diet type
  let dietFilter = "";
  if (userProfile.diet === "vegan") {
    dietFilter = "plant-based only, no animal products";
  } else if (userProfile.diet === "keto") {
    dietFilter = "low-carb, high-fat";
  }

  // Agent 4: Call Claude to generate meal plan
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a nutrition AI. Generate a meal plan.
      
      Current status:
      - Calories consumed: ${totalNutrition.calories}
      - Remaining: ${remaining} calories
      - Guidance: ${calorieGuidance}
      - Dietary restriction: ${dietFilter}
      
      Suggest 3 meals that fit the remaining calories and diet.
      Format as JSON array with: name, calories, reasoning.`,
      },
    ],
  });

  // Parse AI response and call Spoonacular for actual recipes
  const suggestions = JSON.parse(message.content[0].text);
  const recipes = await fetchRecipesFromSpoonacular(suggestions, dietFilter);

  return Response.json({ mealPlan: recipes });
}
```
