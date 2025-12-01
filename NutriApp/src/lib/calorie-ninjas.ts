const API_URL = 'https://api.api-ninjas.com/v1/nutrition?query=';

export interface NutritionData {
  name: string;
  calories: number;
  serving_size_g: number;
  fat_total_g: number;
  fat_saturated_g: number;
  protein_g: number;
  sodium_mg: number;
  potassium_mg: number;
  cholesterol_mg: number;
  carbohydrates_total_g: number;
  fiber_g: number;
  sugar_g: number;
}

// Helper to safely parse numbers from the API
function safeParseFloat(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

export async function searchFood(
  query: string
): Promise<{ success: boolean; data?: NutritionData[]; error?: string }> {
  const apiKey = process.env.CALORIE_NINJAS_API_KEY;

  if (!apiKey) {
    throw new Error('CALORIE_NINJAS_API_KEY is not defined');
  }

  const url = `${API_URL}${encodeURIComponent(query)}`;
  console.log('Fetching URL:', url);

  try {
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch nutrition data: ${response.statusText}`);
    }

    const rawData = await response.json();

    // API Ninjas returns an array directly
    if (Array.isArray(rawData)) {
      const sanitizedData: NutritionData[] = rawData.map((item: any) => ({
        name: item.name,
        calories: safeParseFloat(item.calories),
        serving_size_g: safeParseFloat(item.serving_size_g),
        fat_total_g: safeParseFloat(item.fat_total_g),
        fat_saturated_g: safeParseFloat(item.fat_saturated_g),
        protein_g: safeParseFloat(item.protein_g),
        sodium_mg: safeParseFloat(item.sodium_mg),
        potassium_mg: safeParseFloat(item.potassium_mg),
        cholesterol_mg: safeParseFloat(item.cholesterol_mg),
        carbohydrates_total_g: safeParseFloat(item.carbohydrates_total_g),
        fiber_g: safeParseFloat(item.fiber_g),
        sugar_g: safeParseFloat(item.sugar_g)
      }));

      return { success: true, data: sanitizedData };
    }

    // Fallback for unexpected structure
    console.error('Unexpected API response structure:', rawData);
    return { success: false, error: 'Unexpected API response format' };
  } catch (error) {
    console.error('API Request Error:', error);
    return { success: false, error: 'Failed to fetch nutrition data' };
  }
}
