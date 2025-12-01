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

## Planned APIs (Future Integration)

### 2. Exercises API

- **Endpoint:** `/exercises`
- **Method:** `GET`
- **Query:** `muscle`, `type`, `difficulty`
- **Description:** Get workout exercises for every muscle group.
- **Potential Use:** "Workouts" page to suggest exercises.

### 3. Calories Burned API

- **Endpoint:** `/caloriesburned`
- **Method:** `GET`
- **Query:** `activity`
- **Description:** Calculate calories burned for various activities.
- **Potential Use:** "Activity Log" to track daily movement.

### 4. Recipe API

- **Endpoint:** `/recipe`
- **Method:** `GET`
- **Query:** `query`
- **Description:** Search over 200,000 recipes.
- **Potential Use:** "Meal Ideas" or "Recipe Search" feature.
