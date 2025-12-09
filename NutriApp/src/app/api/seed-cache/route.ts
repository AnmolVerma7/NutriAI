import { NextResponse } from 'next/server';
import { searchFoodFatSecret } from '@/lib/fatsecret';

// List of common foods to seed
const COMMON_FOODS = [
  // Proteins
  'chicken breast', 'chicken', 'grilled chicken',
  'ground beef', 'beef', 'steak',
  'salmon fillet', 'salmon',
  'tuna canned', 'tuna',
  'egg', 'eggs', 'boiled eggs', 'scrambled eggs',
  'tofu',
  'greek yogurt', 'yogurt',
  // Carbs
  'white rice', 'rice',
  'brown rice',
  'oats', 'oatmeal',
  'sweet potato',
  'potato', 'potatoes',
  'pasta', 'spaghetti',
  'whole wheat bread', 'bread', 'toast',
  'quinoa',
  // Fruits
  'banana', 'bananas',
  'apple', 'apples',
  'orange', 'oranges',
  'avocado',
  'blueberries',
  'strawberries',
  // Veggies
  'broccoli',
  'spinach',
  'carrot', 'carrots',
  'onion', 'onions',
  'tomato', 'tomatoes',
  'bell pepper',
  'cucumber',
  // Drinks
  'coffee',
  'black tea', 'tea',
  'milk',
  'orange juice',
  'coke', 'soda'
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
