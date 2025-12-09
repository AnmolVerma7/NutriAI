'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getProgressDataAction(
  startDate?: string,
  endDate?: string
) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'User not authenticated' };
  }

  let query = supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true });

  if (startDate) {
    query = query.gte('date', startDate);
  }
  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching progress data:', error);
    return { error: 'Failed to fetch progress data' };
  }

  // Fetch user profile for unit preference
  const { data: profile } = await supabase
    .from('profiles')
    .select('preferred_weight_unit')
    .eq('id', user.id)
    .single();

  return { data, preferredUnit: profile?.preferred_weight_unit || 'kg' };
}

export async function logWeightAction(date: string, weight: number) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'User not authenticated' };
  }

  // Check if entry exists for this date
  const { data: existing } = await supabase
    .from('user_progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('date', date)
    .single();

  let error;

  if (existing) {
    const { error: updateError } = await supabase
      .from('user_progress')
      .update({ weight })
      .eq('id', existing.id);
    error = updateError;
  } else {
    const { error: insertError } = await supabase.from('user_progress').insert({
      user_id: user.id,
      date,
      weight
    });
    error = insertError;
  }

  if (error) {
    console.error('Error logging weight:', error);
    return { error: 'Failed to log weight' };
  }

  revalidatePath('/dashboard/progress');
  return { success: true };
}

export async function seedProgressDataAction() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'User not authenticated' };
  }

  // --- COPIED FROM api/seed/route.ts ---
  // 1. Delete existing data
  await supabase.from('food_logs').delete().eq('user_id', user.id);
  await supabase.from('user_progress').delete().eq('user_id', user.id);

  const logs = [];
  const progressEntries = [];

  const mealTemplates = [
    [
      // Day A
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
      // Day B
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
      // Day C
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

  // Loop back 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // DETERMINISTIC SELECTION: Use date for template
    const daySeed = d.getDate();
    const dayPlan = mealTemplates[daySeed % 3];

    let dailyCals = 0;
    let dailyPro = 0;
    let dailyCarbs = 0;
    let dailyFats = 0;

    for (const meal of dayPlan) {
      if (i === 0 && meal.h > 18) continue; // Skip dinner for Today

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

    // Progress Entry
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

  const { error: logsError } = await supabase.from('food_logs').insert(logs);
  if (logsError) return { error: 'Logs: ' + logsError.message };

  const { error: progressError } = await supabase
    .from('user_progress')
    .insert(progressEntries);
  if (progressError) return { error: 'Progress: ' + progressError.message };

  revalidatePath('/dashboard/progress');
  revalidatePath('/dashboard/history'); // Make sure history page updates too
  return { success: true };
}
