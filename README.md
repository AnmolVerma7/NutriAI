# NutriAI 🌿

NutriAI is an intelligent, AI-powered nutrition tracking application designed to simplify meal logging and health monitoring. Built with **Next.js 16**, **Supabase**, and agentic AI, it transforms how users interact with their nutrition data—from natural language logging to personalized meal planning.

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

- **src/app**: Contains the pages and routing logic (App Router).
- **src/components**: Reusable UI components (Shadcn/UI based).
- **src/features**: Feature-driven architecture (e.g., `auth`, `dashboard`, `meal-planner`, `recipes`).
- **src/lib**: Helper functions, API clients, and AI initialization.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Shadcn UI, Lucide React (Icons)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **AI & Agents:**
  - **Anthropic Claude 3.5 Sonnet:** Agent Orchestration
  - **Natural Language Processing:** For intelligent food logging
- **Data & Visualization:**
  - **Recharts:** Interactive progress charts
  - **FatSecret API:** Nutrition Data
  - **Spoonacular API:** Recipe Database

## Key Features

- **🤖 AI Meal Planner:** Intelligent multi-agent system that analyzes your history and generating personalized weekly meal plans.
- **🗣️ Natural Language Logging:** Log complex meals simply by typing "I had a chicken salad and an apple".
- **👤 Smart Onboarding:** Personalized setup wizard for calculating BMR, TDEE, and macro goals.
- **🍳 Recipe Discovery:** Explore thousands of recipes with advanced caching for performance.
- **❤️ Favorites System:** Save go-to meals and recipes for quick access.
- **📊 Progress Analytics:** Visualize weight trends and calorie adherence over time.
- **📱 Responsive & Polished:** Mobile-first design with a clean, professional aesthetic.
- **⚡ Smart Caching:** Optimized API usage with database-level caching.

## 🧠 AI Architecture

NutriAI utilizes a **Multi-Agent System** to drive its core intelligence:

1.  **Nutrition Analyst:** Reviews logs to identify nutritional deficits.
2.  **Goal Evaluator:** Checks progress against personalized goals.
3.  **Meal Planner:** Strategizes meal distribution.
4.  **Recipe Recommender:** Fetches specific recipes to fulfill the plan.

_See [AI Workflow](docs/AI_WORKFLOW.md) for details._

## Documentation

- [API Reference](docs/API_REFERENCE.md)
- [AI Workflow & Architecture](docs/AI_WORKFLOW.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## Contributing

Please refer to `CONTRIBUTING.md` for guidelines on how to contribute to this project.
