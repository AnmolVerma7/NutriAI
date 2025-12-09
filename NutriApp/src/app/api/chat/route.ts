import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getAIHelper } from '@/lib/ai-helper';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // --- 1. Fetch Context Data ---
    // Fetch Profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Fetch Last 7 Days of Food Logs
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const { data: foodLogs } = await supabase
      .from('food_logs')
      .select('name, calories, protein_g, carbs_g, fat_g, date')
      .eq('user_id', user.id)
      .gte('date', sevenDaysAgo.toISOString().split('T')[0])
      .order('date', { ascending: true });

    // Fetch Last 14 Days of Progress
    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(today.getDate() - 14);

    const { data: progress } = await supabase
      .from('user_progress')
      .select('date, weight')
      .eq('user_id', user.id)
      .gte('date', fourteenDaysAgo.toISOString().split('T')[0])
      .order('date', { ascending: true });

    // --- 2. Construct System Prompt ---
    const now = new Date();
    // Use a clear date format for the AI
    const todayStr = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let contextString = `Current Date: ${todayStr}\n\n`;

    contextString += `Current User Profile:\n`;
    if (profile) {
      contextString += `- Age: ${profile.age}\n- Gender: ${profile.gender}\n- Height: ${profile.height}cm\n- Weight: ${profile.weight}kg\n- Goal: ${profile.goal_weight ? `Reach ${profile.goal_weight}kg` : 'Maintain'}\n- Calorie Goal: ${profile.daily_calorie_goal} kcal\n`;
    } else {
      contextString += 'No profile data available.\n';
    }

    contextString += `\nRecent Weight History (Last 14 Days):\n`;
    if (progress && progress.length > 0) {
      contextString +=
        progress.map((p) => `- ${p.date}: ${p.weight}kg`).join('\n') + '\n';
    } else {
      contextString += 'No recent weight logs.\n';
    }

    contextString += `\nRecent Meals (Last 7 Days):\n`;
    if (foodLogs && foodLogs.length > 0) {
      // Group by date for brevity
      const logsByDate: Record<string, any[]> = {};

      foodLogs.forEach((log) => {
        if (!logsByDate[log.date]) logsByDate[log.date] = [];
        // DEDUPLICATION: Check if this exact meal matches an existing one in the day's list (Name + Cals)
        const isDuplicate = logsByDate[log.date].some(
          (existing) =>
            existing.name === log.name && existing.calories === log.calories
        );
        if (!isDuplicate) {
          logsByDate[log.date].push(log);
        }
      });

      Object.entries(logsByDate).forEach(([date, meals]) => {
        const dayCals = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
        const dayItems = meals.map((m) => m.name).join(', ');
        contextString += `- ${date}: ${dayCals} kcal (${dayItems})\n`;
      });
    } else {
      contextString += 'No recent meals logged.\n';
    }

    const systemPrompt = `You are NutriAI, a friendly, casual, and highly personalized nutrition assistant.
You have access to the user's real-time data below. Use it to give specific, customized advice.

**GUIDELINES:**
1. **Structure**: Use Headers (###) for sections.
2. **Lists**: ALL lists must use bullet points (- ).
3. **Dates**: Use friendly names like "Yesterday" or "Mon, Dec 8th" instead of ISO dates (2025-12-08).
4. **Directness**: NO filler phrases.
   - BANNED: "Let's take a look", "Based on your logs", "Here is", "I can see that".
   - Start directly with the data or answer.
5. **Key Data**: Bold calories and macros (e.g., **1650 kcal**).
6. **Tables**: Use Markdown Tables for data comparisons (e.g., Intake vs Goal).
   | Metric | Intake | Goal | Status |
   | :--- | :--- | :--- | :--- |
   | Protein | 150g | 196g | ❌ Under |
7. **Math Logic**: CAREFULLY compare Intake vs Goal.
   - If Intake < Goal, Status is "Under".
   - If Intake > Goal, Status is "Over".
6. **Math Logic**: CAREFULLY compare Intake vs Goal.
   - If Intake (e.g., 1850) < Goal (e.g., 2600), say "Under goal".
   - If Intake > Goal, say "Over goal".
   - 1850 is LESS THAN 2609. Do not say it is above.

--- USER DATA CONTEXT ---
${contextString}
-------------------------`;

    // --- 3. Generate Response ---
    const aiHelper = getAIHelper();
    const reply = await aiHelper.chat(messages, systemPrompt);

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
