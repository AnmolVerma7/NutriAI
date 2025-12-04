-- ==========================================
-- 1. PROFILES
-- ==========================================

-- Create a table for public profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  
  -- Fitness & Health Data
  age integer,
  gender text check (gender in ('male', 'female', 'other')),
  height numeric, -- Stored in cm
  weight numeric, -- Stored in kg
  goal_weight numeric, -- Stored in kg
  activity_level text check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  dietary_restrictions jsonb default '[]'::jsonb,
  daily_calorie_goal integer,
  daily_protein_goal integer,
  daily_carbs_goal integer,
  daily_fats_goal integer,
  
  -- Preferences
  preferred_height_unit text default 'cm', -- 'cm' or 'ft'
  preferred_weight_unit text default 'kg', -- 'kg' or 'lbs'

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Policies (using DO block to avoid errors if they exist)
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Public profiles are viewable by everyone.') then
        create policy "Public profiles are viewable by everyone." on profiles for select using (true);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can insert their own profile.') then
        create policy "Users can insert their own profile." on profiles for insert with check ((select auth.uid()) = id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can update own profile.') then
        create policy "Users can update own profile." on profiles for update using ((select auth.uid()) = id);
    end if;
end
$$;

-- Trigger for new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid duplication error
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==========================================
-- 2. FOOD LOGS
-- ==========================================

-- Create a table for food logs
create table if not exists food_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  calories numeric not null,
  protein_g numeric not null,
  carbs_g numeric not null,
  fat_g numeric not null,
  serving_size_g numeric not null,
  serving_unit text, -- e.g., "1 cup", "2 slices"
  date date default current_date not null,
  created_at timestamp with time zone default now() not null
);

-- Set up Row Level Security (RLS)
alter table food_logs enable row level security;

-- Policies
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'food_logs' and policyname = 'Users can view their own food logs.') then
        create policy "Users can view their own food logs." on food_logs for select using ((select auth.uid()) = user_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'food_logs' and policyname = 'Users can insert their own food logs.') then
        create policy "Users can insert their own food logs." on food_logs for insert with check ((select auth.uid()) = user_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'food_logs' and policyname = 'Users can delete their own food logs.') then
        create policy "Users can delete their own food logs." on food_logs for delete using ((select auth.uid()) = user_id);
    end if;
end
$$;


-- ==========================================
-- 3. RECIPES CACHE
-- ==========================================

-- Create a table for caching recipes
create table if not exists recipes (
  id bigint primary key, -- Spoonacular ID
  title text not null,
  image text,
  data jsonb not null, -- Stores the full RecipeInformation object
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table recipes enable row level security;

-- Policies
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'recipes' and policyname = 'Recipes are viewable by everyone.') then
        create policy "Recipes are viewable by everyone." on recipes for select using (true);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'recipes' and policyname = 'Authenticated users can insert recipes.') then
        create policy "Authenticated users can insert recipes." on recipes for insert with check (auth.role() = 'authenticated');
    end if;

    if not exists (select 1 from pg_policies where tablename = 'recipes' and policyname = 'Authenticated users can update recipes.') then
        create policy "Authenticated users can update recipes." on recipes for update using (auth.role() = 'authenticated');
    end if;

    if not exists (select 1 from pg_policies where tablename = 'recipes' and policyname = 'Authenticated users can delete recipes.') then
        create policy "Authenticated users can delete recipes." on recipes for delete using (auth.role() = 'authenticated');
    end if;
end
$$;


-- ==========================================
-- 4. FAVORITE RECIPES
-- ==========================================

-- Create a table for favorite recipes
create table if not exists public.favorite_recipes (
  user_id uuid references auth.users not null,
  recipe_id bigint references public.recipes(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, recipe_id)
);

-- Set up Row Level Security (RLS)
alter table public.favorite_recipes enable row level security;

-- Policies
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'favorite_recipes' and policyname = 'Users can view their own favorites') then
        create policy "Users can view their own favorites" on public.favorite_recipes for select using (auth.uid() = user_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'favorite_recipes' and policyname = 'Users can insert their own favorites') then
        create policy "Users can insert their own favorites" on public.favorite_recipes for insert with check (auth.uid() = user_id);
    end if;
end
$$;


-- ==========================================
-- 5. FOOD SEARCH CACHE
-- ==========================================

-- Create a table for caching food search results
create table if not exists food_search_cache (
  query text primary key, -- Normalized query string (lowercase, trimmed)
  results jsonb not null, -- Stores the list of NutritionData objects
  created_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table food_search_cache enable row level security;

-- Policies
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'food_search_cache' and policyname = 'Cache is viewable by everyone.') then
        create policy "Cache is viewable by everyone." on food_search_cache for select using (true);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'food_search_cache' and policyname = 'Authenticated users can insert cache.') then
        create policy "Authenticated users can insert cache." on food_search_cache for insert with check (auth.role() = 'authenticated');
    end if;

    if not exists (select 1 from pg_policies where tablename = 'food_search_cache' and policyname = 'Authenticated users can update cache.') then
        create policy "Authenticated users can update cache." on food_search_cache for update using (auth.role() = 'authenticated');
    end if;
    
    if not exists (select 1 from pg_policies where tablename = 'food_search_cache' and policyname = 'Authenticated users can delete cache.') then
        create policy "Authenticated users can delete cache." on food_search_cache for delete using (auth.role() = 'authenticated');
    end if;
end
$$;


-- ==========================================
-- 6. FAVORITE FOODS
-- ==========================================

-- Create a table for favorite foods
create table if not exists public.favorite_foods (
  user_id uuid references auth.users not null,
  food_id text not null, -- FatSecret ID or unique name if ID missing
  name text not null,
  calories numeric not null,
  macros jsonb not null, -- Stores protein, carbs, fat, etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, food_id)
);

-- Enable RLS
alter table public.favorite_foods enable row level security;

-- Policies
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'favorite_foods' and policyname = 'Users can view their own favorite foods') then
        create policy "Users can view their own favorite foods" on public.favorite_foods for select using (auth.uid() = user_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'favorite_foods' and policyname = 'Users can insert their own favorite foods') then
        create policy "Users can insert their own favorite foods" on public.favorite_foods for insert with check (auth.uid() = user_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'favorite_foods' and policyname = 'Users can delete their own favorite foods') then
        create policy "Users can delete their own favorite foods" on public.favorite_foods for delete using (auth.uid() = user_id);
    end if;
end
$$;


-- ==========================================
-- 7. MEAL PLANS
-- ==========================================

-- Create a table for storing generated meal plans
create table if not exists public.meal_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default now() not null,
  analysis text, -- The high-level summary
  suggestions jsonb not null -- The array of suggested meals with recipes
);

-- Enable RLS
alter table public.meal_plans enable row level security;

-- Policies
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'meal_plans' and policyname = 'Users can view their own meal plans') then
        create policy "Users can view their own meal plans" on public.meal_plans for select using (auth.uid() = user_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'meal_plans' and policyname = 'Users can insert their own meal plans') then
        create policy "Users can insert their own meal plans" on public.meal_plans for insert with check (auth.uid() = user_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'meal_plans' and policyname = 'Users can delete their own meal plans') then
        create policy "Users can delete their own meal plans" on public.meal_plans for delete using (auth.uid() = user_id);
    end if;
end
$$;

-- ==========================================
-- 8. USER PROGRESS
-- ==========================================

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  weight NUMERIC,
  calories INTEGER,
  protein INTEGER,
  carbs INTEGER,
  fats INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policies
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'user_progress' and policyname = 'Users can view their own progress') then
        create policy "Users can view their own progress" on user_progress for select using (auth.uid() = user_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'user_progress' and policyname = 'Users can insert their own progress') then
        create policy "Users can insert their own progress" on user_progress for insert with check (auth.uid() = user_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'user_progress' and policyname = 'Users can update their own progress') then
        create policy "Users can update their own progress" on user_progress for update using (auth.uid() = user_id);
    end if;

    if not exists (select 1 from pg_policies where tablename = 'user_progress' and policyname = 'Users can delete their own progress') then
        create policy "Users can delete their own progress" on user_progress for delete using (auth.uid() = user_id);
    end if;
end
$$;
