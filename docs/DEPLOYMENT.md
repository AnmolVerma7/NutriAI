# Deployment Guide 🚀

NutriAI is designed to be deployed on **Vercel**, the creators of Next.js.

## Option 1: Automatic Deployments (Recommended) 🔄

Connect your GitHub repository to Vercel to enable automatic deployments on every push.

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Select your project (e.g., `nutri-app`).
3.  Navigate to **Settings** > **Git**.
4.  Click **Connect Git Repository**.
5.  Select `AnmolVerma7/NutriAI`.

**Result:** Every time you run `git push origin main`, Vercel will automatically build and deploy the new version.

## Option 2: Manual Deployment 🛠️

If you prefer to deploy manually from your local machine (without pushing to GitHub first):

1.  **Preview Deployment** (Test changes):

    ```bash
    npx vercel
    ```

2.  **Production Deployment** (Live site):
    ```bash
    npx vercel --prod
    ```

## Environment Variables 🔑

For the application to function correctly, you **MUST** configure the following environment variables in your Vercel Project Settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`
- `SPOONACULAR_API_KEY`
- `FATSECRET_CLIENT_ID`
- `FATSECRET_CLIENT_SECRET`

Go to **Settings** > **Environment Variables** on Vercel to add them.
