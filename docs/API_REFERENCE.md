# API Reference - NutriAI

We use robust data sources for our nutrition and recipe data.

## Integrated APIs

### 1. FatSecret Platform API

**Status:** ✅ Integrated

- **Endpoint:** `/rest/foods/search/v1`
- **Method:** `GET` (via OAuth 2.0)
- **Query:** `search_expression`
- **Description:** Search for food items and parse nutrition from description.
- **Usage:** Used in "Log Meal" -> "Search Database".

### 2. Spoonacular API (Recipes)

**Status:** ✅ Integrated

- **Base URL:** `https://api.spoonacular.com`
- **Key:** Stored in `SPOONACULAR_API_KEY`
- **Features:**
  - **Recipe Search:** Search by query, diet, and nutritional limits.
  - **Recipe Information:** Get detailed ingredients, instructions, and nutrition.
  - **Recipe Information:** Get detailed ingredients, instructions, and nutrition.
  - **Bulk Fetch:** Get details for multiple recipes at once (used for Favorites).

### 3. Anthropic Claude API (AI Agents)

**Status:** ✅ Integrated

- **Model:** `claude-3-5-sonnet-20241022`
- **Usage:** Powers the 4-agent workflow for meal planning.
- **Endpoint:** `/api/ai-meal-plan`
- **Method:** `POST`
- **Response:** Server-Sent Events (SSE) stream.

## Planned APIs (Future Integration)

### 3. Exercises API

- **Endpoint:** `/exercises`
- **Method:** `GET`
- **Query:** `muscle`, `type`, `difficulty`
- **Description:** Get workout exercises for every muscle group.
- **Potential Use:** "Workouts" page to suggest exercises.

### 4. Calories Burned API

- **Endpoint:** `/caloriesburned`
- **Method:** `GET`
- **Query:** `activity`
- **Description:** Calculate calories burned for various activities.
- **Potential Use:** "Activity Log" to track daily movement.
