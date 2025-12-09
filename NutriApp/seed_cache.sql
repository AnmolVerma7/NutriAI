-- Clear existing cache to ensure clean slate (optional)
-- TRUNCATE TABLE food_search_cache;

-- Macro: Helper to insert food
-- Note: Supabase SQL editor doesn't support variables/macros easily, so we use direct INSERTs.

-- 1. EGGS (egg, eggs, boiled eggs, scrambled eggs)
INSERT INTO food_search_cache (query, results, created_at)
VALUES 
('egg', '[{"name": "Hard Boiled Egg", "calories": 78, "protein_g": 6, "carbohydrates_total_g": 0.6, "fat_total_g": 5, "serving_size_g": 50}]'::jsonb, NOW()),
('eggs', '[{"name": "Hard Boiled Egg", "calories": 78, "protein_g": 6, "carbohydrates_total_g": 0.6, "fat_total_g": 5, "serving_size_g": 50}]'::jsonb, NOW()),
('scrambled eggs', '[{"name": "Scrambled Egg", "calories": 91, "protein_g": 6, "carbohydrates_total_g": 1, "fat_total_g": 7, "serving_size_g": 60}]'::jsonb, NOW())
ON CONFLICT (query) DO UPDATE SET results = EXCLUDED.results;

-- 2. CHICKEN (chicken, chicken breast, grilled chicken)
INSERT INTO food_search_cache (query, results, created_at)
VALUES 
('chicken', '[{"name": "Chicken Breast (Cooked)", "calories": 165, "protein_g": 31, "carbohydrates_total_g": 0, "fat_total_g": 3.6, "serving_size_g": 100}]'::jsonb, NOW()),
('chicken breast', '[{"name": "Chicken Breast (Cooked)", "calories": 165, "protein_g": 31, "carbohydrates_total_g": 0, "fat_total_g": 3.6, "serving_size_g": 100}]'::jsonb, NOW()),
('grilled chicken', '[{"name": "Grilled Chicken", "calories": 237, "protein_g": 27, "carbohydrates_total_g": 0, "fat_total_g": 13, "serving_size_g": 100}]'::jsonb, NOW())
ON CONFLICT (query) DO UPDATE SET results = EXCLUDED.results;

-- 3. RICE (rice, white rice, brown rice)
INSERT INTO food_search_cache (query, results, created_at)
VALUES 
('rice', '[{"name": "White Rice (Cooked)", "calories": 130, "protein_g": 2.7, "carbohydrates_total_g": 28, "fat_total_g": 0.3, "serving_size_g": 100}]'::jsonb, NOW()),
('white rice', '[{"name": "White Rice (Cooked)", "calories": 130, "protein_g": 2.7, "carbohydrates_total_g": 28, "fat_total_g": 0.3, "serving_size_g": 100}]'::jsonb, NOW()),
('brown rice', '[{"name": "Brown Rice (Cooked)", "calories": 111, "protein_g": 2.6, "carbohydrates_total_g": 23, "fat_total_g": 0.9, "serving_size_g": 100}]'::jsonb, NOW())
ON CONFLICT (query) DO UPDATE SET results = EXCLUDED.results;

-- 4. BANANA (banana, bananas)
INSERT INTO food_search_cache (query, results, created_at)
VALUES 
('banana', '[{"name": "Banana", "calories": 89, "protein_g": 1.1, "carbohydrates_total_g": 23, "fat_total_g": 0.3, "serving_size_g": 100}]'::jsonb, NOW()),
('bananas', '[{"name": "Banana", "calories": 89, "protein_g": 1.1, "carbohydrates_total_g": 23, "fat_total_g": 0.3, "serving_size_g": 100}]'::jsonb, NOW())
ON CONFLICT (query) DO UPDATE SET results = EXCLUDED.results;

-- 5. PASTA (pasta, spaghetti)
INSERT INTO food_search_cache (query, results, created_at)
VALUES 
('pasta', '[{"name": "Pasta (Cooked)", "calories": 131, "protein_g": 5, "carbohydrates_total_g": 25, "fat_total_g": 1.1, "serving_size_g": 100}]'::jsonb, NOW()),
('spaghetti', '[{"name": "Spaghetti (Cooked)", "calories": 158, "protein_g": 6, "carbohydrates_total_g": 31, "fat_total_g": 0.9, "serving_size_g": 100}]'::jsonb, NOW())
ON CONFLICT (query) DO UPDATE SET results = EXCLUDED.results;

-- 6. APPLE (apple, apples)
INSERT INTO food_search_cache (query, results, created_at)
VALUES 
('apple', '[{"name": "Apple", "calories": 52, "protein_g": 0.3, "carbohydrates_total_g": 14, "fat_total_g": 0.2, "serving_size_g": 100}]'::jsonb, NOW()),
('apples', '[{"name": "Apple", "calories": 52, "protein_g": 0.3, "carbohydrates_total_g": 14, "fat_total_g": 0.2, "serving_size_g": 100}]'::jsonb, NOW())
ON CONFLICT (query) DO UPDATE SET results = EXCLUDED.results;

-- 7. MILK (milk)
INSERT INTO food_search_cache (query, results, created_at)
VALUES 
('milk', '[{"name": "Whole Milk", "calories": 61, "protein_g": 3.2, "carbohydrates_total_g": 4.8, "fat_total_g": 3.3, "serving_size_g": 100}]'::jsonb, NOW())
ON CONFLICT (query) DO UPDATE SET results = EXCLUDED.results;

-- 8. BEEF (beef, ground beef, steak)
INSERT INTO food_search_cache (query, results, created_at)
VALUES 
('beef', '[{"name": "Ground Beef (Cooked)", "calories": 250, "protein_g": 26, "carbohydrates_total_g": 0, "fat_total_g": 15, "serving_size_g": 100}]'::jsonb, NOW()),
('ground beef', '[{"name": "Ground Beef (Cooked)", "calories": 250, "protein_g": 26, "carbohydrates_total_g": 0, "fat_total_g": 15, "serving_size_g": 100}]'::jsonb, NOW()),
('steak', '[{"name": "Beef Steak (Grilled)", "calories": 271, "protein_g": 25, "carbohydrates_total_g": 0, "fat_total_g": 19, "serving_size_g": 100}]'::jsonb, NOW())
ON CONFLICT (query) DO UPDATE SET results = EXCLUDED.results;

-- 9. POTATO (potato, potatoes)
INSERT INTO food_search_cache (query, results, created_at)
VALUES 
('potato', '[{"name": "Potato (Baked)", "calories": 93, "protein_g": 2.5, "carbohydrates_total_g": 21, "fat_total_g": 0.1, "serving_size_g": 100}]'::jsonb, NOW()),
('potatoes', '[{"name": "Potato (Baked)", "calories": 93, "protein_g": 2.5, "carbohydrates_total_g": 21, "fat_total_g": 0.1, "serving_size_g": 100}]'::jsonb, NOW())
ON CONFLICT (query) DO UPDATE SET results = EXCLUDED.results;

-- 10. OATS (oats, oatmeal)
INSERT INTO food_search_cache (query, results, created_at)
VALUES 
('oats', '[{"name": "Oats (Rolled)", "calories": 379, "protein_g": 13, "carbohydrates_total_g": 67, "fat_total_g": 6.5, "serving_size_g": 100}]'::jsonb, NOW()),
('oatmeal', '[{"name": "Oatmeal (Cooked)", "calories": 71, "protein_g": 2.5, "carbohydrates_total_g": 12, "fat_total_g": 1.5, "serving_size_g": 100}]'::jsonb, NOW())
ON CONFLICT (query) DO UPDATE SET results = EXCLUDED.results;
