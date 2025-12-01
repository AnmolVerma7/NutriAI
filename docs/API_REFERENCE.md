# API Reference - NutriAI

We use [API Ninjas](https://api-ninjas.com/) for our data sources.

## Authentication

All requests require an `X-Api-Key` header.

- **Key:** Stored in `CALORIE_NINJAS_API_KEY` (in `.env.local`)
- **Base URL:** `https://api.api-ninjas.com/v1`

## Integrated APIs

### 1. Nutrition API

**Status:** ✅ Integrated

- **Endpoint:** `/nutrition`
- **Method:** `GET`
- **Query:** `query` (string, e.g., "3 eggs and an apple")
- **Description:** Extracts nutrition data from natural language text.
- **Usage:** Used in Dashboard Overview for food search.

### 2. Spoonacular API (Recipes)

**Status:** ✅ Integrated

- **Base URL:** `https://api.spoonacular.com`
- **Key:** Stored in `SPOONACULAR_API_KEY`
- **Features:**
  - **Recipe Search:** Search by query, diet, and nutritional limits.
  - **Recipe Information:** Get detailed ingredients, instructions, and nutrition.
  - **Bulk Fetch:** Get details for multiple recipes at once (used for Favorites).

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
