# 📋 NutriAI Project Tasks

## Day 1: Foundation & Auth

- [x] Set up Next.js project with TypeScript
- [x] Configure Tailwind CSS + shadcn/ui
- [x] Create basic page structure (landing, dashboard, login)
- [x] Set up Supabase project
- [x] Configure Supabase Auth (email/password)
- [x] Create database schema (users, profiles)
- [x] Test auth flow (signup, login, logout) <!-- Manual Test Required -->
- [x] Connect Next.js to Supabase
- [ ] Deploy to Vercel

## Day 2: UI & Design

- [x] Design landing page (hero, features, CTA)
- [x] Create dashboard layout
- [x] Build meal logging form UI
- [x] Integrate CalorieNinjas API (Switched to API Ninjas)
- [x] Create API route: `/api/search-food` (Implemented via Server Actions)
- [x] Create API route: `/api/log-meal` (Implemented via Server Actions)
- [x] Test saving meals to Supabase

## Day 3: Data Integration & APIs

- [x] Build recipe browser UI
- [x] Create filters (vegan, keto, low-cal, etc.)
- [x] Integrate Spoonacular API
- [x] Create API route: `/api/search-recipes` (Implemented via Server Actions)
- [x] Create API route: `/api/get-recipe-details` (Implemented via Server Actions)
- [x] Test recipe search with filters
- [x] Implement Database Caching for Recipes (Bonus)
- [x] Implement Recently Visited Recipes (Bonus)

## Day 4-5: AI Agentic Workflow

- [x] Create UI for AI meal planner feature
- [x] Build "Generate Meal Plan" button
- [x] Set up Claude API integration
- [x] Build Agent 1: Nutrition Analyst
- [x] Build Agent 2: Goal Evaluator
- [x] Build Agent 3: Meal Planner
- [x] Build Agent 4: Recipe Recommender
- [x] Implement Conditional Branch 1: Calorie Status
- [x] Implement Conditional Branch 2: Dietary Restrictions
- [x] Create API route: `/api/ai-meal-plan`
- [x] Test the ENTIRE workflow <!-- Manual Test Required -->

## Day 6: Polish & Features

- [ ] **Progress Tracking**
  - [ ] Create `user_progress` table (date, weight, calories, macros)
  - [ ] Build "Progress" page with Recharts (Weight trend, Calorie adherence)
- [ ] **Mobile Responsiveness**
  - [ ] Test Dashboard on mobile view
  - [ ] Fix any overflow or layout issues
- [x] **User Profile & Settings**
  - [x] Create user profile settings page
  - [x] Implement toast notifications
- [ ] **Visual Polish**
  - [ ] Add real food images (Unsplash API or static assets)
  - [ ] Add loading skeletons for all data fetching states

## Day 7: Presentation & Demo

- [ ] **Deliverables**
  - [ ] Write 1-page Idea Explanation document
  - [ ] Create presentation deck (6 slides)
  - [ ] Record 2-3 minute demo video
- [ ] **Final Checks**
  - [ ] Final deployment check on Vercel
  - [ ] Verify all 4 agents and 2 conditionals are working
  - [ ] Verify real data integration (Nutritionix/FatSecret, Spoonacular)
