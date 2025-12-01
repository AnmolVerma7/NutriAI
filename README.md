# NutriAI

NutriAI is an AI-powered nutrition tracking application designed to simplify meal logging and health monitoring. It leverages Next.js 16, Supabase for authentication and data storage, and the API Ninjas Nutrition API for natural language food processing.

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

The application needs specific keys to connect to external services (Supabase and API Ninjas).

1.  Create a file named `.env.local` in the `NutriApp` directory.
2.  Copy and paste the following content into the file:

```env
# Supabase Configuration (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Ninjas (Food Search)
CALORIE_NINJAS_API_KEY=your_api_ninjas_key
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
- **Styling:** Tailwind CSS
- **Database:** Supabase
- **Authentication:** Supabase Auth

## Contributing

Please refer to `CONTRIBUTING.md` for guidelines on how to contribute to this project.
