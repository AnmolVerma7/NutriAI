# 🍎 AI-Powered Nutrition & Fitness Tracker

> **Project Timeline:** 7 days  
> **Team:** 2 people  
> **Goal:** Meet ALL project requirements for 80%+ grade

---

## 📋 Project Requirements Checklist

This document is structured around the **5 mandatory requirements**. Every feature maps directly to a requirement.

- [ ] **Requirement 1:** Authentication (Supabase Auth)
- [ ] **Requirement 2:** Modern Deployed UI (Next.js on Vercel)
- [ ] **Requirement 3:** Agentic Workflow (4+ agents, 2+ conditionals)
- [ ] **Requirement 4:** Real Data Integration (Food/Recipe APIs)
- [ ] **Requirement 5:** Polished Product (Professional UI, real content)

---

## 🎯 Project Overview

**Name:** NutriAI (or pick your own)

**Tagline:** "Your AI nutrition coach that adapts to you"

**Problem:** People struggle to track nutrition, hit fitness goals, and stick to diets because:

- Manual tracking is tedious
- Generic meal plans don't account for preferences/restrictions
- No personalized guidance or accountability

**Solution:** An AI-powered app that:

- Automatically analyzes meals and nutrition
- Creates personalized meal plans based on goals
- Adapts recommendations based on progress
- Makes healthy eating simple and sustainable

**Target Users:**

- Fitness enthusiasts tracking macros
- People trying to lose/gain weight
- Anyone wanting to eat healthier
- Meal preppers looking for recipe ideas

**Business Model:**

- Freemium (5 meal logs/day free, unlimited on pro)
- Pro tier: $10/month (unlimited tracking, AI meal plans, premium recipes)
- Potential B2B: Gyms, nutritionists, corporate wellness programs

---

## ✅ How This Meets Each Requirement

### 1. Authentication ✓

**Implementation:** Supabase Auth

- Email/password signup and login
- Protected routes (dashboard, meal logs, etc.)
- User profile with dietary preferences and goals
- Stores user data: meals logged, progress, settings

**Why it fits:** Users NEED accounts to track their nutrition over time, set goals, and see progress. This is essential for the app to function.

---

### 2. Modern Deployed UI ✓

**Implementation:** Next.js 14 (App Router) deployed on Vercel

**Tech Stack:**

- **Framework:** Next.js 14 with TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (professional, polished components)
- **Deployment:** Vercel (one-click deploy)
- **Database:** Supabase (PostgreSQL)

**Key Screens:**

1. Landing page (marketing, benefits, CTA)
2. Dashboard (daily summary, progress charts)
3. Meal logging (search foods, log meals)
4. Meal plan generator (AI-powered recommendations)
5. Recipe browser (filtered by dietary needs)
6. Progress tracker (weight, calories, macros over time)

**Polish Elements:**

- Clean, health-focused color palette (greens, whites, soft blues)
- Food images for meals and recipes
- Charts and visualizations (calories, macros, weight trends)
- Icons from lucide-react
- Smooth animations with Framer Motion
- Responsive mobile design

---

### 3. Agentic Workflow ✓

**Implementation:** Multi-agent AI system using Claude API + LangChain

**The 4+ Required Agents:**

**Agent 1: Nutrition Analyst**

- **Role:** Analyzes logged meals for nutritional content
- **Input:** User's meal description (e.g., "chicken breast with rice and broccoli")
- **Output:** Breakdown of calories, protein, carbs, fats, vitamins
- **Tool:** Calls Nutritionix API to get accurate nutrition data

**Agent 2: Goal Evaluator**

- **Role:** Compares current intake against user's goals
- **Input:** Daily nutrition totals, user's target (e.g., 2000 cal, 150g protein)
- **Output:** Progress assessment, whether user is on track
- **Logic:** Calculates remaining calories/macros for the day

**Agent 3: Meal Planner**

- **Role:** Generates personalized meal recommendations
- **Input:** User's remaining calories, dietary restrictions, preferences
- **Output:** Suggested meals for rest of day
- **Tool:** Calls Spoonacular API for recipe suggestions

**Agent 4: Recipe Recommender**

- **Role:** Finds specific recipes that fit user's needs
- **Input:** Meal type, calorie budget, dietary filters (vegan, keto, etc.)
- **Output:** List of recipes with nutrition info and instructions
- **Tool:** Spoonacular Recipe API with filters

**Bonus Agent 5: Motivation Coach**

- **Role:** Provides encouragement and tips based on progress
- **Input:** User's adherence to goals, streak data
- **Output:** Personalized motivational messages and tips

**The 2+ Required Conditional Branches:**

**Branch 1: Calorie Status**

```
User logs meal
    ↓
[Nutrition Analyst] analyzes meal
    ↓
[Goal Evaluator] checks daily totals
    ↓
IF calories < daily goal:
    ├─→ [Meal Planner] suggests calorie-dense meals
    └─→ "You have 800 calories left! Here are filling options..."
ELSE IF calories > daily goal:
    ├─→ [Meal Planner] suggests low-cal options or skipping snacks
    └─→ "You're over by 200 calories. Try lighter dinner options..."
ELSE:
    └─→ "Perfect! You're right on track!"
```

**Branch 2: Dietary Restrictions**

```
User requests meal plan
    ↓
[System] checks user profile for restrictions
    ↓
IF user is vegan:
    ├─→ [Recipe Recommender] filters for plant-based only
    └─→ Returns vegan recipes
ELSE IF user is keto:
    ├─→ [Recipe Recommender] filters for low-carb (<20g carbs)
    └─→ Returns keto recipes
ELSE IF user has allergies (nuts, dairy, etc.):
    ├─→ [Recipe Recommender] excludes allergens
    └─→ Returns safe recipes
ELSE:
    └─→ [Recipe Recommender] shows all recipes
```

**Workflow Orchestration:**
Use LangChain or simple custom orchestration. The agents call each other based on conditionals.

---

### 4. Real Data Integration ✓

**Implementation:** Multiple food and recipe APIs

**Primary APIs:**

**Nutritionix API** (Food Database)

- **What it does:** Provides detailed nutrition data for foods
- **Endpoint:** Natural language food search
- **Example:** "2 eggs scrambled" → returns calories, macros, vitamins
- **Free tier:** 500 requests/day (enough for testing)
- **Docs:** https://www.nutritionix.com/business/api

**Spoonacular API** (Recipes & Meal Planning)

- **What it does:** Recipe search, meal planning, nutrition analysis
- **Endpoints:**
  - Search recipes by ingredients, diet, calories
  - Get recipe details with instructions
  - Generate meal plans
- **Free tier:** 150 requests/day
- **Docs:** https://spoonacular.com/food-api

**Backup/Alternative APIs:**

**USDA FoodData Central**

- Official government nutrition database
- Free, unlimited
- More technical but very accurate

**Edamam Recipe API**

- Recipe search with nutrition
- Dietary filter support
- Free tier available

**How APIs Are Used:**

1. User logs "grilled salmon, 6oz"
2. **Nutritionix API** → fetches nutrition data
3. App displays: 280 cal, 40g protein, 12g fat, 0g carbs
4. User wants dinner ideas
5. **Spoonacular API** → searches recipes matching remaining calories & preferences
6. App displays: "Chicken stir-fry (450 cal), Turkey chili (380 cal), Greek salad (320 cal)"

---

### 5. Polished Product ✓

**Implementation:** Professional design and real content

**Visual Design:**

- **Color Palette:**
  - Primary: Fresh green (#10B981)
  - Secondary: Soft blue (#3B82F6)
  - Background: Light gray/white (#F9FAFB)
  - Text: Dark gray (#1F2937)
- **Typography:** Inter or Poppins (modern, clean)
- **Images:** Food photos from Unsplash API or Pexels
- **Icons:** Lucide React (consistent icon set)

**Real Content (No Placeholders):**

- Sample meal logs with real food data
- Pre-populated recipe cards with images
- Progress charts with example data
- Onboarding flow with real tips and guidance
- Footer with about, privacy policy, terms (even if basic)

**Polish Checklist:**

- [ ] Loading states (skeletons, spinners)
- [ ] Error handling (friendly messages)
- [ ] Empty states (when no meals logged yet)
- [ ] Toast notifications (meal logged, goal hit, etc.)
- [ ] Smooth transitions between screens
- [ ] Mobile-responsive (test on phone)
- [ ] Consistent spacing and alignment
- [ ] Professional typography hierarchy

**Use AI to Generate:**

- Sample meal descriptions
- Recipe summaries
- Motivational messages
- Marketing copy for landing page
- FAQ content

---

## 🏗️ Technical Architecture

### Tech Stack (Final Decision)

**Frontend:**

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Framer Motion (animations)
- Recharts (data visualizations)

**Backend:**

- Next.js API routes (serverless functions)
- Supabase (PostgreSQL database + Auth)

**AI:**

- Claude API (Anthropic) for agent orchestration
- LangChain (optional, for complex flows)

**APIs:**

- Nutritionix API (food nutrition data)
- Spoonacular API (recipes and meal planning)
- Unsplash API (food images)

**Deployment:**

- Vercel (frontend + API routes)
- Supabase (database + auth)

**Tools:**

- GitHub (version control)
- Cursor or VS Code (IDE with AI assistance)
- Figma (if you want to mockup UI first)

---

### Database Schema (Supabase)

**users table** (handled by Supabase Auth)

- id (UUID)
- email
- created_at

**user_profiles table**

- id (UUID, foreign key to users)
- name
- age
- height
- weight
- goal_weight
- daily_calorie_goal
- daily_protein_goal
- daily_carbs_goal
- daily_fats_goal
- dietary_restrictions (JSON: ["vegan", "gluten-free"])
- activity_level
- created_at

**meals table**

- id (UUID)
- user_id (foreign key)
- meal_type (breakfast, lunch, dinner, snack)
- description (text)
- calories (integer)
- protein (integer)
- carbs (integer)
- fats (integer)
- logged_at (timestamp)

**meal_plans table**

- id (UUID)
- user_id (foreign key)
- date (date)
- generated_plan (JSON with recipes)
- created_at

**user_progress table**

- id (UUID)
- user_id (foreign key)
- date (date)
- weight (decimal)
- total_calories (integer)
- notes (text)

---

## 📅 7-Day Development Plan

### Day 1: Foundation (8 hours)

**Person A Tasks:**

- [ ] Set up Next.js project with TypeScript
- [ ] Configure Tailwind CSS + shadcn/ui
- [ ] Create basic page structure (landing, dashboard, login)
- [ ] Set up Vercel deployment (push to deploy)

**Person B Tasks:**

- [ ] Set up Supabase project
- [ ] Configure Supabase Auth (email/password)
- [ ] Create database schema (tables above)
- [ ] Test auth flow (signup, login, logout)

**Together:**

- [ ] Connect Next.js to Supabase
- [ ] Test authentication end-to-end
- [ ] Deploy to Vercel (make sure it works live)

**End of Day 1 Deliverable:** Working auth, deployed site with basic pages

---

### Day 2: UI & Design (8 hours)

**Person A Tasks:**

- [ ] Design landing page (hero, features, CTA)
- [ ] Create dashboard layout
- [ ] Build meal logging form UI
- [ ] Add food image placeholders (Unsplash later)

**Person B Tasks:**

- [ ] Integrate Nutritionix API (test food search)
- [ ] Create API route: `/api/search-food`
- [ ] Create API route: `/api/log-meal`
- [ ] Test saving meals to Supabase

**Together:**

- [ ] Connect meal logging form to backend
- [ ] Test: Search food → Get nutrition → Log meal → Appears in dashboard

**End of Day 2 Deliverable:** Users can search foods and log meals

---

### Day 3: Data Integration & APIs (8 hours)

**Person A Tasks:**

- [ ] Build recipe browser UI
- [ ] Create filters (vegan, keto, low-cal, etc.)
- [ ] Display recipe cards with images
- [ ] Add loading states

**Person B Tasks:**

- [ ] Integrate Spoonacular API
- [ ] Create API route: `/api/search-recipes`
- [ ] Create API route: `/api/get-recipe-details`
- [ ] Test recipe search with filters

**Together:**

- [ ] Connect recipe browser to Spoonacular API
- [ ] Test: Filter by diet → See relevant recipes → Click for details

**End of Day 3 Deliverable:** Users can browse and filter recipes

---

### Day 4-5: AI Agentic Workflow (16 hours - CRITICAL)

**Person A Tasks:**

- [ ] Create UI for AI meal planner feature
- [ ] Build "Generate Meal Plan" button
- [ ] Display AI-generated suggestions
- [ ] Add loading animation for AI processing

**Person B Tasks:**

- [ ] Set up Claude API integration
- [ ] Build Nutrition Analyst agent
- [ ] Build Goal Evaluator agent
- [ ] Build Meal Planner agent
- [ ] Build Recipe Recommender agent
- [ ] Implement conditional branching logic:
  - Calorie status (over/under goal)
  - Dietary restrictions (vegan, keto, allergies)
- [ ] Create API route: `/api/ai-meal-plan`
- [ ] Test the full agent workflow

**Together:**

- [ ] Connect frontend to AI backend
- [ ] Test the ENTIRE workflow:
  1. User logs breakfast
  2. Nutrition Analyst evaluates it
  3. Goal Evaluator checks progress
  4. Conditional: Over or under calories?
  5. Meal Planner suggests lunch
  6. Conditional: Check dietary restrictions
  7. Recipe Recommender provides options
- [ ] Debug and refine prompts
- [ ] Add error handling

**End of Day 5 Deliverable:** Working AI agent system with 4+ agents and 2+ conditionals

---

### Day 6: Polish & Features (8 hours)

**Person A Tasks:**

- [ ] Add progress tracking (weight, calorie trends)
- [ ] Create charts with Recharts
- [ ] Improve visual design (colors, spacing, fonts)
- [ ] Add real food images (Unsplash API)
- [ ] Add animations (page transitions, toasts)

**Person B Tasks:**

- [ ] Create user profile settings page
- [ ] Allow users to update goals, restrictions
- [ ] Add "streak" feature (days logged in a row)
- [ ] Implement toast notifications
- [ ] Test on mobile (responsive fixes)

**Together:**

- [ ] QA testing (find bugs, fix them)
- [ ] Add sample data for demo
- [ ] Polish landing page with real copy
- [ ] Add footer (About, Contact, etc.)

**End of Day 6 Deliverable:** Polished, professional-looking app

---

### Day 7: Presentation & Demo (8 hours)

**Person A Tasks:**

- [ ] Create presentation deck (6 slides):
  1. Problem/Opportunity
  2. Solution + Tech
  3. Business Model
  4. Impact/Benefits
  5. How We Built It
  6. Roadmap
- [ ] Design slides (use Canva or Figma)
- [ ] Write script for presentation

**Person B Tasks:**

- [ ] Record 2-3 minute demo video
  - Show signup/login
  - Log a meal
  - Get AI meal plan
  - Browse recipes
  - View progress
- [ ] Edit video (add captions, music)
- [ ] Upload video to YouTube (unlisted)

**Together:**

- [ ] Write 1-page Idea Explanation document
- [ ] Practice presentation (time it, 10 minutes max)
- [ ] Final deployment check (everything works live)
- [ ] Submit all deliverables

**End of Day 7 Deliverable:** Complete project ready to present

---

## 🎨 Feature List (MVP Scope)

### ✅ Must-Have Features (Build These)

1. **User Authentication**

   - Email/password signup and login
   - Protected dashboard routes
   - User profile with goals

2. **Meal Logging**

   - Search foods via Nutritionix API
   - Log meals (breakfast, lunch, dinner, snacks)
   - View daily totals (calories, macros)

3. **AI Meal Planning**

   - Generate personalized meal suggestions
   - Based on remaining calories and dietary restrictions
   - Uses 4+ agents with conditional logic

4. **Recipe Browser**

   - Search recipes via Spoonacular API
   - Filter by diet type (vegan, keto, etc.)
   - View recipe details and nutrition

5. **Progress Tracking**

   - Daily calorie and macro summary
   - Weight tracking over time
   - Visual charts (Recharts)

6. **User Settings**
   - Set calorie and macro goals
   - Define dietary restrictions
   - Update profile information

### ❌ Nice-to-Have Features (Skip if Time is Tight)

- Barcode scanning
- Social sharing
- Community features
- Shopping list generator
- Workout integration
- Water intake tracking

**FOCUS ON THE 6 MUST-HAVES ABOVE.** Don't get distracted by extra features.

---

## 🤖 AI Agent Implementation Details

### Agent Prompt Examples

**Nutrition Analyst Agent:**

```
You are a nutrition analyst. The user has logged: "{meal_description}".

Using the nutrition data from the API:
- Calories: {calories}
- Protein: {protein}g
- Carbs: {carbs}g
- Fats: {fats}g

Provide a brief analysis of this meal. Is it balanced? Any concerns?
Keep your response under 50 words.
```

**Meal Planner Agent:**

```
You are a meal planning assistant.

User's current status:
- Calories consumed today: {consumed_calories}
- Daily goal: {daily_goal}
- Remaining: {remaining_calories}
- Dietary restrictions: {restrictions}

It's currently {time_of_day}. Suggest 3 meal ideas that fit within their remaining calories and respect their dietary restrictions.

For each suggestion, include:
- Meal name
- Approximate calories
- Why it's a good choice

Keep it concise and motivating.
```

**Conditional Logic Example:**

```javascript
// In your API route: /api/ai-meal-plan

const consumed = getTodaysTotalCalories(userId);
const goal = user.daily_calorie_goal;
const remaining = goal - consumed;

let mealPlannerPrompt;

// CONDITIONAL BRANCH 1: Calorie Status
if (remaining > 500) {
  mealPlannerPrompt = `User has ${remaining} calories left. Suggest filling, satisfying meals.`;
} else if (remaining < 100) {
  mealPlannerPrompt = `User only has ${remaining} calories left. Suggest light options or healthy snacks.`;
} else {
  mealPlannerPrompt = `User has ${remaining} calories left. Suggest balanced meal options.`;
}

// CONDITIONAL BRANCH 2: Dietary Restrictions
if (user.dietary_restrictions.includes("vegan")) {
  mealPlannerPrompt += ` Only suggest plant-based meals. No meat, dairy, or eggs.`;
} else if (user.dietary_restrictions.includes("keto")) {
  mealPlannerPrompt += ` Suggest low-carb, high-fat meals suitable for keto diet.`;
}

// Call AI agent with the constructed prompt
const aiResponse = await callClaudeAPI(mealPlannerPrompt);
```

### Agent Orchestration Flow

```
User clicks "Get Meal Plan"
    ↓
Frontend: POST /api/ai-meal-plan
    ↓
Backend: Fetch user's goals, restrictions, today's meals
    ↓
[Agent 1: Nutrition Analyst]
    Analyzes all logged meals today
    Returns: Total calories, macros, nutritional quality
    ↓
[Agent 2: Goal Evaluator]
    Compares totals against user's goals
    Returns: Remaining calories, on/over/under track status
    ↓
[CONDITIONAL BRANCH 1: Calorie Status]
    IF remaining > 500: "Plenty of room, suggest larger meals"
    IF remaining < 100: "Almost at goal, suggest light options"
    ELSE: "Moderate room, suggest balanced meals"
    ↓
[CONDITIONAL BRANCH 2: Dietary Restrictions]
    IF vegan: Filter recipes for plant-based
    IF keto: Filter recipes for low-carb
    IF has allergies: Exclude allergens
    ↓
[Agent 3: Meal Planner]
    Given remaining calories + restrictions
    Generates 3-5 meal suggestions with reasoning
    ↓
[Agent 4: Recipe Recommender]
    Calls Spoonacular API with filters
    Returns specific recipes matching Agent 3's suggestions
    ↓
Backend: Returns formatted meal plan to frontend
    ↓
Frontend: Displays AI-generated meal plan with recipe cards
```

---

## 💼 Business Case & Presentation

### Problem Statement (Slide 1)

**The Problem:**

- 70% of Americans want to eat healthier but struggle with tracking
- Manual calorie counting is tedious and time-consuming
- Generic meal plans don't account for individual preferences or restrictions
- People lack personalized guidance and accountability

**Market Size:**

- Health & wellness app market: $4B+ and growing
- 60% of smartphone users have downloaded a health app
- Nutrition tracking apps have 50M+ active users globally

### Solution (Slide 2)

**NutriAI: Your AI-powered nutrition coach**

**Key Features:**

- Instant nutrition analysis (just describe your meal)
- Personalized meal plans powered by AI
- Smart recipe recommendations based on your goals
- Progress tracking with visual insights
- Adapts to your dietary needs (vegan, keto, allergies, etc.)

**Technology:**

- Next.js + Supabase (scalable, modern stack)
- Claude AI (4-agent intelligent system)
- Nutritionix & Spoonacular APIs (accurate data)
- Deployed on Vercel (fast, reliable)

### Business Model (Slide 3)

**Freemium Model:**

- **Free Tier:** 5 meal logs/day, basic AI suggestions, community recipes
- **Pro Tier ($10/month):** Unlimited tracking, advanced AI meal plans, premium recipes, progress analytics, export data
- **Enterprise ($50/user/month):** Corporate wellness programs, team dashboards, custom branding

**Revenue Projections:**

- Year 1: 10,000 users, 5% conversion → $60k ARR
- Year 2: 50,000 users, 8% conversion → $480k ARR
- Year 3: 200,000 users, 10% conversion → $2.4M ARR

**Go-to-Market:**

- SEO content marketing (nutrition blogs)
- Social media (before/after transformations)
- Partnerships with gyms and nutritionists
- Referral program (free month for referrals)

### Impact (Slide 4)

**User Impact:**

- Save 30+ minutes/day on meal planning and tracking
- Achieve health goals faster with personalized guidance
- Reduce food waste with smart meal planning
- Improve nutrition knowledge through AI feedback

**Competitive Advantage:**

- **vs MyFitnessPal:** Better UX, AI-powered vs manual
- **vs Noom:** Cheaper ($10 vs $60/month), AI coach vs human
- **vs Lose It:** More personalized, adapts in real-time

**Traction Potential:**

- Easy to build viral loops (share meal plans, challenge friends)
- Low customer acquisition cost (organic growth)
- High retention (daily habit + streak system)

### How We Built It (Slide 5)

**Technical Architecture:**

- Frontend: Next.js 14 + TypeScript + Tailwind CSS
- Backend: Supabase (PostgreSQL + Auth)
- AI: 4-agent system using Claude API
  - Nutrition Analyst
  - Goal Evaluator
  - Meal Planner
  - Recipe Recommender
- APIs: Nutritionix (food data), Spoonacular (recipes)
- Deployment: Vercel (CI/CD, global CDN)

**AI Workflow:**

- User logs meal → AI analyzes nutrition
- Conditional logic based on calorie status
- Conditional logic based on dietary restrictions
- AI generates personalized meal plan
- Recipe API provides specific options

**Development:**

- 7-day sprint with pair programming
- Used AI assistance (Claude, Cursor) for rapid development
- Iterative testing and refinement

### Roadmap (Slide 6)

**Next 3 Months:**

- Beta launch with 100 testers
- Add barcode scanning for easier logging
- Integrate with wearables (Apple Health, Fitbit)
- Launch iOS/Android mobile apps

**Next 6 Months:**

- Reach 1,000 paying users
- Add social features (share meals, challenges)
- Partner with 10 gyms for corporate wellness
- Launch affiliate program with nutritionists

**Next 12 Months:**

- Expand to 10,000+ users
- Add AI workout integration
- Launch marketplace (nutritionists can offer paid plans)
- Explore acquisition or Series A fundraising

**Vision:**
Become the #1 AI-powered nutrition platform that makes healthy eating effortless for millions.

---

## 🎬 Demo Video Script (2-3 minutes)

**Opening (0:00-0:15)**
"Hi, I'm [Your Name], and this is NutriAI - your AI-powered nutrition coach. Let me show you how it works."

**Signup/Login (0:15-0:30)**
"First, I'll create an account. We use secure authentication with Supabase."
[Show signup process, set goals]

**Log a Meal (0:30-1:00)**
"Let's log breakfast. I had scrambled eggs and toast. I just type it in, and our AI uses the Nutritionix API to instantly get the nutrition data. Look - 420 calories, 25g protein, 40g carbs."
[Show meal logging, nutrition display]

**AI Meal Planning (1:00-2:00)**
"Now, here's where the AI magic happens. I click 'Get Meal Plan,' and our 4-agent system kicks in:

1. The Nutrition Analyst checks my daily totals
2. The Goal Evaluator sees I have 1,200 calories left
3. Based on that, the Meal Planner suggests lunch and dinner
4. And the Recipe Recommender finds specific recipes that fit

I'm vegan, so it only shows plant-based options. If I was doing keto, it would suggest low-carb instead. That's the conditional branching in action."
[Show AI generating meal plan, display results]

**Recipe Browser (2:00-2:20)**
"I can also browse our recipe database. Let's filter for vegan, under 500 calories. All powered by the Spoonacular API. I can click any recipe to see full details and nutrition."
[Show recipe filtering, click on a recipe]

**Progress Tracking (2:20-2:45)**
"Finally, I can track my progress over time. Here's my calorie trend for the week, and my weight tracking chart."
[Show dashboard with charts]

**Closing (2:45-3:00)**
"That's NutriAI - making healthy eating simple with AI. Thanks for watching!"
[Show landing page, fade to logo]

---

## 🚨 Common Pitfalls to Avoid

### Technical Pitfalls

- [ ] Don't hardcode API keys in frontend code (use env variables)
- [ ] Don't forget to add loading states (users hate blank screens)
- [ ] Don't skip error handling (API calls fail, handle gracefully)
- [ ] Don't over-engineer (keep it simple, MVP first)
- [ ] Don't forget to test on mobile (most users are on phones)

### Project Requirement Pitfalls

- [ ] Don't build a simple chatbot and call it "agents" (needs real multi-agent logic)
- [ ] Don't fake the API integration (actually call the APIs)
- [ ] Don't use placeholder images everywhere (use Unsplash API for real food photos)
- [ ] Don't skip the business case (it's part of the presentation)
- [ ] Don't forget the conditional branches (2+ required, make them obvious)

### Time Management Pitfalls

- [ ] Don't spend 3 days on UI and rush the AI (AI is 40% of your grade)
- [ ] Don't leave the demo video for the last minute (record Day 6)
- [ ] Don't try to build extra features (stick to MVP scope)
- [ ] Don't perfectionism trap (80% done is better than 100% perfect but late)

---

## 🎯 Success Criteria for 80%+ Grade

**To hit 80% or higher, you MUST:**

✅ **Authentication works** (can signup, login, logout)  
✅ **Deployed and accessible** (send link, professor can test)  
✅ **UI looks professional** (no placeholders, real images, good design)  
✅ **4+ AI agents implemented** (clearly show they exist and work)  
✅ **2+ conditional branches** (demonstrate in demo, explain in presentation)  
✅ **Real API integration** (Nutritionix + Spoonacular actually called)  
✅ **All deliverables submitted** (1-page doc, deck, demo video, prototype)

**Bonus points for:**

- Exceptionally polished UI
- Creative AI agent interactions
- Strong business case and presentation
- Working mobile experience
- Extra features (progress tracking, charts, etc.)

---

## 📚 Resources & Links

### APIs

- **Nutritionix:** https://www.nutritionix.com/business/api
- **Spoonacular:** https://spoonacular.com/food-api
- **USDA FoodData:** https://fdc.nal.usda.gov/api-guide.html
- **Unsplash (images):** https://unsplash.com/developers

### Tech Stack Docs

- **Next.js:** https://nextjs.org/docs
- **Supabase:** https://supabase.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com/
- **LangChain:** https://js.langchain.com/docs

### Design Inspiration

- **Dribbble (nutrition apps):** https://dribbble.com/search/nutrition-app
- **Mobbin (app screens):** https://mobbin.com/browse/ios/apps
- **MyFitnessPal:** (reference for meal logging UX)

### Tools

- **Cursor:** AI-powered code editor (https://cursor.sh/)
- **v0.dev:** Generate UI components with AI (https://v0.dev/)
- **Canva:** Presentation slides (https://canva.com/)
- **Figma:** UI mockups (optional, https://figma.com/)

---

## 🔥 Final Pep Talk

**You got this.**

You have 7 days. That's 168 hours. Even if you only work 8 hours/day, that's 56 hours of dev time for 2 people = **112 person-hours**.

That's PLENTY to build this MVP.

**Keys to success:**

1. **Start immediately.** Don't overthink. Follow the 7-day plan.
2. **Use AI to help you code.** Claude, Cursor, ChatGPT - use them all.
3. **Focus on requirements FIRST.** Don't add features that aren't required.
4. **Communicate with your partner.** Daily standup: what did you do, what are you doing, blockers?
5. **Test as you build.** Don't wait until Day 7 to see if it works.

**By Day 5, your app should:**

- Have working auth
- Let users log meals
- Show AI meal planning with 4+ agents and 2+ conditionals
- Pull data from APIs
- Look reasonably polished

**Day 6-7 is just polish and presentation.**

You're building something real. Something that could actually help people. That's exciting.

**Now go build it. 🚀**

---

**Questions? Need help? Use Claude to debug, generate code, refine prompts, whatever you need. Good luck!**
