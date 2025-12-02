import { NutritionData } from '@/types/nutrition';

const FATSECRET_TOKEN_URL = 'https://oauth.fatsecret.com/connect/token';
const FATSECRET_SEARCH_URL =
  'https://platform.fatsecret.com/rest/foods/search/v1';

interface FatSecretFood {
  food_id: string;
  food_name: string;
  food_type: string;
  food_url: string;
  food_description: string; // "Per 100g - Calories: 200kcal | Fat: 10.00g | Carbs: 5.00g | Protein: 25.00g"
}

interface FatSecretSearchResponse {
  foods: {
    food: FatSecretFood[];
    max_results: string;
    page_number: string;
    total_results: string;
  };
}

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.FATSECRET_CLIENT_ID;
  const clientSecret = process.env.FATSECRET_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('FatSecret API keys are missing.');
    return null;
  }

  // Check if cached token is valid (with 60s buffer)
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - 60000) {
    return cachedToken;
  }

  try {
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64'
    );
    const response = await fetch(FATSECRET_TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&scope=basic'
    });

    if (!response.ok) {
      throw new Error(`Failed to get token: ${response.statusText}`);
    }

    const data = await response.json();
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000;
    return cachedToken;
  } catch (error) {
    console.error('Error fetching FatSecret token:', error);
    return null;
  }
}

function parseNutritionFromDescription(
  description: string
): Partial<NutritionData> {
  // Example: "Per 100g - Calories: 52kcal | Fat: 0.17g | Carbs: 13.81g | Protein: 0.26g"
  // Example: "Per 1 medium (182g) - Calories: 95kcal | Fat: 0.31g | Carbs: 25.13g | Protein: 0.47g"

  const parts = description.split(' - ');
  const servingInfo = parts[0].replace('Per ', ''); // "100g" or "1 medium (182g)"

  // Extract serving size in grams if possible
  let servingSize = 100; // Default
  const gramMatch = servingInfo.match(/(\d+(?:\.\d+)?)g/);
  if (gramMatch) {
    servingSize = parseFloat(gramMatch[1]);
  }

  const nutritionPart = parts[1] || '';

  const getValue = (key: string) => {
    const regex = new RegExp(`${key}:\\s*(\\d+(?:\\.\\d+)?)`);
    const match = nutritionPart.match(regex);
    return match ? parseFloat(match[1]) : 0;
  };

  return {
    calories: getValue('Calories'),
    protein_g: getValue('Protein'),
    carbohydrates_total_g: getValue('Carbs'),
    fat_total_g: getValue('Fat'),
    serving_size_g: servingSize,
    // FatSecret doesn't always provide these in the summary, set to 0 for now
    sugar_g: 0,
    fiber_g: 0,
    sodium_mg: 0,
    potassium_mg: 0,
    cholesterol_mg: 0,
    fat_saturated_g: 0
  };
}

import { createClient } from '@/lib/supabase/server';

// In-memory cache for super-fast repeated searches in the same session
const memoryCache = new Map<string, NutritionData[]>();

export async function searchFoodFatSecret(
  query: string
): Promise<NutritionData[]> {
  const normalizedQuery = query.toLowerCase().trim();

  // 1. Check Memory Cache
  if (memoryCache.has(normalizedQuery)) {
    console.log(`Cache hit (Memory) for "${normalizedQuery}"`);
    return memoryCache.get(normalizedQuery)!;
  }

  const supabase = await createClient();

  // 2. Check Database Cache
  try {
    const { data: dbCache, error } = await supabase
      .from('food_search_cache')
      .select('results, created_at')
      .eq('query', normalizedQuery)
      .single();

    if (dbCache && dbCache.results) {
      // Optional: Check freshness (e.g., 30 days)
      const createdAt = new Date(dbCache.created_at);
      const now = new Date();
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

      if (now.getTime() - createdAt.getTime() < thirtyDaysInMs) {
        console.log(`Cache hit (DB) for "${normalizedQuery}"`);
        const results = dbCache.results as NutritionData[];
        memoryCache.set(normalizedQuery, results); // Populate memory
        return results;
      }
      console.log(`Cache stale (DB) for "${normalizedQuery}", re-fetching...`);
    }
  } catch (err) {
    console.warn('Error checking DB cache:', err);
    // Continue to API if DB fails
  }

  // 3. Fetch from API
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const url = `${FATSECRET_SEARCH_URL}?method=foods.search&search_expression=${encodeURIComponent(query)}&format=json`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`FatSecret search failed: ${response.statusText}`);
    }

    const data: any = await response.json();

    if (data.error) {
      console.error('FatSecret API returned error:', data.error);
      return [];
    }

    // Handle case where 'food' is not an array (single result) or undefined
    const foodList = Array.isArray(data.foods?.food)
      ? data.foods.food
      : data.foods?.food
        ? [data.foods.food]
        : [];

    const results = foodList.map((item: any) => {
      // Type assertion needed as API response might vary
      const nutrition = parseNutritionFromDescription(item.food_description);
      return {
        name: item.food_name,
        calories: nutrition.calories || 0,
        protein_g: nutrition.protein_g || 0,
        carbohydrates_total_g: nutrition.carbohydrates_total_g || 0,
        fat_total_g: nutrition.fat_total_g || 0,
        serving_size_g: nutrition.serving_size_g || 100,
        sugar_g: 0,
        fiber_g: 0,
        sodium_mg: 0,
        potassium_mg: 0,
        cholesterol_mg: 0,
        fat_saturated_g: 0
      };
    });

    // 4. Save to Cache (Memory & DB)
    memoryCache.set(normalizedQuery, results);

    // Fire-and-forget DB update to not block UI
    (async () => {
      try {
        await supabase.from('food_search_cache').upsert({
          query: normalizedQuery,
          results: results,
          created_at: new Date().toISOString()
        });
      } catch (err) {
        console.error('Error saving to DB cache:', err);
      }
    })();

    return results;
  } catch (error) {
    console.error('Error searching FatSecret:', error);
    return [];
  }
}
