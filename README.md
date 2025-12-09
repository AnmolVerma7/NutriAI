# NutriAI

NutriAI is an AI-powered nutrition tracking application designed to simplify meal logging and health monitoring. It leverages Next.js 16, Supabase for authentication and data storage, and the FatSecret Platform API for robust food data.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

### 1. Node.js

Node.js is the runtime environment required to run this application.

- **Download:** Visit the [official Node.js website](https://nodejs.org/).
- **Version:** We recommend the **LTS (Long Term Support)** version (v18 or higher).
- **Verification:** Open your terminal and run `node -v` to check if it's installed.

### 2. Git

Git is used for version control to manage the project code.

- **Download:** Visit [git-scm.com](https://git-scm.com/downloads).
- **Verification:** Run `git --version` in your terminal.

## Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository

Open your terminal and run the following command to download the project code:

```bash
git clone https://github.com/AnmolVerma7/NutriAI.git
```

### 2. Navigate to the Project Directory

Move into the application folder:

```bash
cd NutriAI/NutriApp
```

_Note: The main application code is located in the `NutriApp` subdirectory._

### 3. Install Dependencies

Install the necessary software packages required for the app to run:

```bash
npm install
```

### 4. Configure Environment Variables

The application needs specific keys to connect to external services (Supabase, FatSecret, Spoonacular).

1.  Create a file named `.env.local` in the `NutriApp` directory.
2.  Copy and paste the following content into the file:

```env
# Supabase Configuration (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# FatSecret (Food Search)
FATSECRET_CLIENT_ID=your_client_id
FATSECRET_CLIENT_SECRET=your_client_secret

# Spoonacular (Recipes)
SPOONACULAR_API_KEY=your_spoonacular_key
```

_Ask the project lead for the actual values of these keys._

### 5. Run the Application

Start the development server:

```bash
npm run dev
```

Once the server starts, open your web browser and visit:
[http://localhost:3000](http://localhost:3000)

## Project Structure

- **src/app**: Contains the pages and routing logic.
- **src/components**: Reusable UI components (buttons, forms, etc.).
- **src/features**: Feature-specific code (e.g., `auth` for login, `dashboard` for the main app).
- **src/lib**: Helper functions and API clients.

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **APIs:**
  - **Anthropic Claude 3.5 Sonnet:** AI Agent Orchestration
  - **FatSecret:** Nutrition Data (OAuth 2.0)
  - **Spoonacular:** Recipe Search & Details

## Key Features

- **🤖 AI Meal Planner:** Intelligent multi-agent system (powered by Claude 3.5) that generates personalized meal plans based on your goals and leftovers.
- **👤 Smart Onboarding:** Dedicated wizard to set up your profile, goals, and unit preferences (cm/ft, kg/lbs).
- **🍎 Smart Meal Logging:** Search for foods or manually enter details.
- **🍳 Recipe Discovery:** Browse thousands of recipes with filters (Diet, Calories, etc.).
- **❤️ Favorites System:** Save your favorite recipes and foods for quick access.
- **⚙️ Settings:** Manage preferences, appearance themes, and edit your profile/goals.
- **📊 Progress Analytics:** Track weight trends and calorie adherence over time with interactive charts.
- **⚡ Smart Caching:** Minimizes API usage by caching recipes and food searches in Supabase.
- **🌱 Demo Readiness:** Includes a built-in seeding tool (`/api/seed`) to instantly populate the account with realistic data for presentations.

## 🧠 AI Architecture

NutriAI employs a sophisticated **Multi-Agent System** to deliver personalized nutrition advice:

1.  **Nutrition Analyst:** Analyzes your daily food logs to identify nutritional gaps.
2.  **Goal Evaluator:** Compares your intake against your specific profile goals (calories, macros).
3.  **Meal Planner:** Formulates a high-level meal strategy based on remaining budget and dietary restrictions.
4.  **Recipe Recommender:** Finds concrete, executable recipes that match the planner's strategy.

_For a deep dive into the AI implementation, check out the [Claude API Guide](docs/CLAUDE_API_GUIDE.md)._

## Documentation

- [API Reference](docs/API_REFERENCE.md)
- [AI Workflow & Architecture](docs/AI_WORKFLOW.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Idea Explanation](docs/IDEA_EXPLANATION.md)
- [B-Roll Demo Script](docs/DEMO_SCRIPT.md)

## Contributing

Please refer to `CONTRIBUTING.md` for guidelines on how to contribute to this project.
