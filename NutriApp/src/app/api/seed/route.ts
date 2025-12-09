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

  // 1. Update Profile (Keep Anmol's stats)
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
      dietary_restrictions: []
    })
    .eq('id', user.id);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // 2. Clear existing test data to avoid duplicates/mess
  await supabase.from('food_logs').delete().eq('user_id', user.id);
  await supabase.from('user_progress').delete().eq('user_id', user.id);

  // 3. Generate 7 Days of Data
  const logs = [];
  const progressEntries = [];

  // Meal Templates to rotate
  const mealTemplates = [
    [
      // Day A (Balanced)
      {
        name: 'Oatmeal & Whey',
        c: 450,
        p: 30,
        cb: 50,
        f: 10,
        g: 300,
        u: 'bowl',
        h: 8
      },
      {
        name: 'Chicken & Rice',
        c: 700,
        p: 60,
        cb: 80,
        f: 15,
        g: 500,
        u: 'plate',
        h: 13
      },
      {
        name: 'Salmon & Asparagus',
        c: 600,
        p: 40,
        cb: 20,
        f: 30,
        g: 400,
        u: 'plate',
        h: 19
      }
    ],
    [
      // Day B (Higher Carb)
      {
        name: 'Eggs & Toast',
        c: 550,
        p: 25,
        cb: 40,
        f: 30,
        g: 250,
        u: '2 slices',
        h: 8
      },
      {
        name: 'Pasta with Meat Sauce',
        c: 800,
        p: 35,
        cb: 100,
        f: 20,
        g: 450,
        u: 'bowl',
        h: 13
      },
      {
        name: 'Greek Yogurt Bowl',
        c: 300,
        p: 20,
        cb: 30,
        f: 5,
        g: 200,
        u: 'bowl',
        h: 19
      }
    ],
    [
      // Day C (Cheatish)
      {
        name: 'Protein Pancakes',
        c: 500,
        p: 30,
        cb: 60,
        f: 12,
        g: 300,
        u: 'stack',
        h: 9
      },
      {
        name: 'Turkey Sandwich',
        c: 450,
        p: 30,
        cb: 45,
        f: 10,
        g: 250,
        u: 'sandwich',
        h: 13
      },
      {
        name: 'Steak & Potatoes',
        c: 900,
        p: 60,
        cb: 50,
        f: 45,
        g: 500,
        u: 'plate',
        h: 19
      }
    ]
  ];

  const today = new Date();

  // Loop back 7 days (0 to 6)
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Pick a meal set (Stable based on date, not relative 'i')
    // Use the day of the month/year or epoch to pick consistent template
    const daySeed = d.getDate(); // 1-31
    const dayPlan = mealTemplates[daySeed % 3];

    // Day's totals
    let dailyCals = 0;
    let dailyPro = 0;
    let dailyCarbs = 0;
    let dailyFats = 0;

    // Create logs for this day
    for (const meal of dayPlan) {
      // Don't log dinner for "Today" (i === 0) so the AI has room to suggest
      if (i === 0 && meal.h > 18) continue;

      const createdTime = new Date(d);
      createdTime.setHours(meal.h, 0, 0, 0);

      logs.push({
        user_id: user.id,
        name: meal.name,
        calories: meal.c,
        protein_g: meal.p,
        carbs_g: meal.cb,
        fat_g: meal.f,
        serving_size_g: meal.g,
        serving_unit: meal.u,
        date: dateStr,
        created_at: createdTime.toISOString()
      });

      dailyCals += meal.c;
      dailyPro += meal.p;
      dailyCarbs += meal.cb;
      dailyFats += meal.f;
    }

    // Progress Entry (Simulate weight loss: 86kg -> 85kg)
    // Starting 86, losing ~0.15kg per day approx
    const simulatedWeight = 86 - (6 - i) * 0.15;

    progressEntries.push({
      user_id: user.id,
      date: dateStr,
      weight: Number(simulatedWeight.toFixed(1)),
      calories: dailyCals,
      protein: dailyPro,
      carbs: dailyCarbs,
      fats: dailyFats
    });
  }

  // Insert Logs
  const { error: logsError } = await supabase.from('food_logs').insert(logs);
  if (logsError)
    return NextResponse.json(
      { error: 'Logs: ' + logsError.message },
      { status: 500 }
    );

  // Insert Progress
  const { error: progressError } = await supabase
    .from('user_progress')
    .insert(progressEntries);
  if (progressError)
    return NextResponse.json(
      { error: 'Progress: ' + progressError.message },
      { status: 500 }
    );

  return NextResponse.json({
    success: true,
    message: `Seeded 7 days of data! (${logs.length} meals, 7 progress entries)`
  });
}
