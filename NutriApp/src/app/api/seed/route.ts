import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. Update Profile with Anmol's Stats
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      age: 23,
      gender: 'male',
      height: 170, // 5'7"
      weight: 85,
      goal_weight: 75,
      activity_level: 'active',
      daily_calorie_goal: 2609,
      daily_protein_goal: 196,
      daily_carbs_goal: 261,
      daily_fats_goal: 87,
      preferred_height_unit: 'ft',
      preferred_weight_unit: 'kg',
      dietary_restrictions: [] // Reset to empty, user can set Keto manually now that it's fixed
    })
    .eq('id', user.id);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // 2. Insert Food Logs
  // We'll insert logs for Yesterday (Full day) and Today (Half day)
  
  // Helper to get ISO string for a date at a specific time (UTC)
  // Assuming user is roughly in MST/PDT (UTC-7), we'll shift times accordingly to appear correct in their local view.
  // Actually, logging functions usually use `now()`. The `date` column in `food_logs` is type `date`.
  // The `created_at` is timestamp.
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const logs = [
    // --- YESTERDAY (Balanced/Good Day) ---
    {
      user_id: user.id,
      name: 'Oatmeal & Whey Protein',
      calories: 450,
      protein_g: 30,
      carbs_g: 50,
      fat_g: 10,
      serving_size_g: 300,
      serving_unit: 'bowl',
      date: yesterday.toISOString().split('T')[0],
      created_at: new Date(yesterday.setHours(8, 0, 0, 0)).toISOString() // 8 AM
    },
    {
      user_id: user.id,
      name: 'Chicken Breast & Rice',
      calories: 700,
      protein_g: 60,
      carbs_g: 80,
      fat_g: 15,
      serving_size_g: 500,
      serving_unit: 'plate',
      date: yesterday.toISOString().split('T')[0],
      created_at: new Date(yesterday.setHours(13, 0, 0, 0)).toISOString() // 1 PM
    },
    {
      user_id: user.id,
      name: 'Salmon & Asparagus',
      calories: 600,
      protein_g: 40,
      carbs_g: 20,
      fat_g: 30,
      serving_size_g: 400,
      serving_unit: 'plate',
      date: yesterday.toISOString().split('T')[0],
      created_at: new Date(yesterday.setHours(19, 0, 0, 0)).toISOString() // 7 PM
    },

    // --- TODAY (Needs Dinner) ---
    {
      user_id: user.id,
      name: 'Avocado Toast & Eggs',
      calories: 550,
      protein_g: 25,
      carbs_g: 40,
      fat_g: 30,
      serving_size_g: 250,
      serving_unit: '2 slices',
      date: today.toISOString().split('T')[0],
      created_at: new Date(today.setHours(8, 30, 0, 0)).toISOString() // 8:30 AM
    },
    {
      user_id: user.id,
      name: 'Protein Smoothie',
      calories: 300,
      protein_g: 35,
      carbs_g: 20,
      fat_g: 5,
      serving_size_g: 500,
      serving_unit: 'shaker',
      date: today.toISOString().split('T')[0],
      created_at: new Date(today.setHours(11, 0, 0, 0)).toISOString() // 11:00 AM
    },
    {
      user_id: user.id,
      name: 'Beef Burrito Bowl',
      calories: 800,
      protein_g: 50,
      carbs_g: 90,
      fat_g: 25,
      serving_size_g: 600,
      serving_unit: 'bowl',
      date: today.toISOString().split('T')[0],
      created_at: new Date(today.setHours(14, 0, 0, 0)).toISOString() // 2:00 PM
    }
  ];

  // Total Today so far: 1650 calories. 
  // Goal: 2609.
  // Remaining: ~959 calories. 
  // Perfect for the AI to suggest a hearty dinner!

  const { error: logsError } = await supabase.from('food_logs').insert(logs);

  if (logsError) {
    return NextResponse.json({ error: logsError.message }, { status: 500 });
  }

  return NextResponse.json({ 
    success: true, 
    message: 'Profile updated & 6 food logs inserted (3 yesterday, 3 today).' 
  });
}
