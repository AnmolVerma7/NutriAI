import { NextResponse } from 'next/server';
import { searchFoodFatSecret } from '@/lib/fatsecret';

// List of common foods to seed
const COMMON_FOODS = [
  // Proteins
  'chicken breast',
  'ground beef',
  'salmon fillet',
  'tuna canned',
  'egg',
  'tofu',
  'greek yogurt',
  // Carbs
  'white rice',
  'brown rice',
  'oats',
  'sweet potato',
  'potato',
  'pasta',
  'whole wheat bread',
  'quinoa',
  // Fruits
  'banana',
  'apple',
  'orange',
  'avocado',
  'blueberries',
  'strawberries',
  // Veggies
  'broccoli',
  'spinach',
  'carrot',
  'onion',
  'tomato',
  'bell pepper',
  'cucumber',
  // Drinks
  'coffee',
  'black tea',
  'milk',
  'orange juice',
  'coke'
];

export async function GET() {
  const results: Record<string, any> = {};
  
  // Using a loop with delay to avoid rate limiting
  for (const food of COMMON_FOODS) {
    try {
      console.log(`Seeding: ${food}...`);
      const data = await searchFoodFatSecret(food);
      results[food] = { success: true, count: data.length };
      
      // Wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to seed ${food}:`, error);
      results[food] = { success: false, error: String(error) };
    }
  }

  return NextResponse.json({
    message: 'Seeding complete',
    results
  });
}
