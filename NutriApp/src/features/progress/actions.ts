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

  // Generate 30 days of data
  const data = [];
  const today = new Date();

  // Starting stats (simulated)
  let currentWeight = 85; // kg
  const targetCalories = 2200;

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Simulate weight loss trend with some fluctuation
    const fluctuation = (Math.random() - 0.5) * 0.5; // +/- 0.25kg
    const trend = -0.05; // -0.05kg per day
    currentWeight = currentWeight + trend + fluctuation;

    // Simulate calorie adherence
    // 80% chance of being close to target, 20% chance of cheat day
    let calories;
    if (Math.random() > 0.2) {
      calories = targetCalories + (Math.random() - 0.5) * 200; // +/- 100
    } else {
      calories = targetCalories + 500 + Math.random() * 500; // Cheat day
    }

    data.push({
      user_id: user.id,
      date: dateStr,
      weight: Number(currentWeight.toFixed(1)),
      calories: Math.round(calories),
      protein: Math.round((calories * 0.3) / 4), // 30% protein
      carbs: Math.round((calories * 0.4) / 4), // 40% carbs
      fats: Math.round((calories * 0.3) / 9) // 30% fats
    });
  }

  // Delete existing data for clean slate (optional, but good for demo)
  await supabase.from('user_progress').delete().eq('user_id', user.id);

  const { error } = await supabase.from('user_progress').insert(data);

  if (error) {
    console.error('Error seeding data:', error);
    return { error: 'Failed to seed data' };
  }

  revalidatePath('/dashboard/progress');
  return { success: true };
}
