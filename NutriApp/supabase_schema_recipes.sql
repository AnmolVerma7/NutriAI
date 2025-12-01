-- Create a table for caching recipes
create table recipes (
  id bigint primary key, -- Spoonacular ID
  title text not null,
  image text,
  data jsonb not null, -- Stores the full RecipeInformation object
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table recipes enable row level security;

-- Allow everyone to read recipes (public cache)
create policy "Recipes are viewable by everyone." on recipes
  for select using (true);

-- Allow authenticated users to insert recipes (when they fetch from API)
create policy "Authenticated users can insert recipes." on recipes
  for insert with check (auth.role() = 'authenticated');

-- Allow authenticated users to update recipes (if we ever need to refresh)
create policy "Authenticated users can update recipes." on recipes
  for update using (auth.role() = 'authenticated');
