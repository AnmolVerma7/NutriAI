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

export async function searchFood(query: string): Promise<NutritionData[]> {
  const apiKey = process.env.CALORIE_NINJAS_API_KEY;

  if (!apiKey) {
    throw new Error('CALORIE_NINJAS_API_KEY is not defined');
  }

  const url = `${API_URL}${encodeURIComponent(query)}`;
  console.log('Fetching URL:', url);
  console.log('API Key present:', !!apiKey);

  const response = await fetch(url, {
    headers: {
      'X-Api-Key': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch nutrition data: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('API Response:', JSON.stringify(data).slice(0, 100)); // Log first 100 chars
  return data;
}
