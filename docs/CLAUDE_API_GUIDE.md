# Claude API Integration Guide 🤖

NutriAI uses Anthropic's Claude 3.5 Sonnet to power its intelligent meal planning system. This guide explains how the integration works and how to use it.

## 1. Setup

Ensure your `.env.local` file contains your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

## 2. Architecture

The AI system is built on a **Multi-Agent Architecture** located in `src/lib/agents/`.

### The Agents

1.  **Nutrition Analyst** (`nutrition-analyst.ts`)

    - **Role:** Analyzes the user's current food intake for the day.
    - **Input:** List of food logs.
    - **Output:** Total calories, macros, and nutritional gaps.

2.  **Goal Evaluator** (`goal-evaluator.ts`)

    - **Role:** Compares intake against the user's specific profile goals.
    - **Input:** Current totals vs. Daily Goals (from `profiles` table).
    - **Output:** Remaining budget and adherence status.

3.  **Meal Planner** (`meal-planner.ts`)

    - **Role:** Generates the high-level meal plan strategy.
    - **Input:** Remaining calories, dietary restrictions, and time of day.
    - **Output:** 3 specific meal suggestions with reasoning.

4.  **Recipe Recommender** (`recipe-recommender.ts`)
    - **Role:** Finds actual executable recipes.
    - **Input:** Meal suggestions from the Planner.
    - **Output:** Spoonacular recipe IDs and details.

## 3. Usage

The main entry point is the API route `/api/ai-meal-plan`.

### Request

```typescript
// POST /api/ai-meal-plan
// No body required (uses authenticated user's session)
```

### Response (Streamed)

The API uses **Server-Sent Events (SSE)** to stream the progress of each agent to the UI.

```json
// Stream events:
{ "step": "analyzing", "message": "Analyzing your nutrition..." }
{ "step": "evaluating", "message": "Checking your goals..." }
{ "step": "planning", "message": "Creating meal plan..." }
{ "step": "searching", "message": "Finding recipes..." }
{ "step": "complete", "plan": { ... } }
```

## 4. Adding New Agents

To add a new agent (e.g., a "Motivation Coach"):

1.  Create `src/lib/agents/motivation-coach.ts`.
2.  Define the interface and prompt.
3.  Instantiate `Anthropic` client.
4.  Add the call to the orchestration flow in `/api/ai-meal-plan/route.ts`.

## 5. Best Practices

- **Prompt Engineering:** Keep prompts in the agent files. Use clear system instructions.
- **Error Handling:** Always wrap API calls in try/catch blocks.
- **Rate Limits:** Be mindful of Anthropic's rate limits. The frontend handles loading states.
