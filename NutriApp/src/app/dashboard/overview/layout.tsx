import { LayoutDashboard } from 'lucide-react';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  IconFlame,
  IconMeat,
  IconGrain,
  IconDroplet
} from '@tabler/icons-react'; // Using approximate icons
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { FoodSearch } from '@/features/dashboard/components/food-search';
import { RecentMeals } from '@/features/dashboard/components/recent-meals';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';

export default async function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let dailyTotals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };

  let logs: any[] | null = null;

  if (user) {
    // Adjust for timezone (UTC-7 for MST/PDT coverage)
    // We want logs where the LOCAL time is "today".
    // So we query from Today 00:00 MST (Today 07:00 UTC) to Tomorrow 00:00 MST (Tomorrow 07:00 UTC)
    const now = new Date();
    now.setHours(now.getHours() - 7); // Shift to user's local time to get "today" string
    const todayStr = now.toISOString().split('T')[0];

    // Create UTC boundaries for the query
    const startUtc = new Date(`${todayStr}T07:00:00.000Z`).toISOString();

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const endUtc = new Date(`${tomorrowStr}T07:00:00.000Z`).toISOString();

    const { data: fetchedLogs } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startUtc)
      .lt('created_at', endUtc);

    logs = fetchedLogs;

    if (logs) {
      dailyTotals = logs.reduce(
        (acc, log) => ({
          calories: acc.calories + (Number(log.calories) || 0),
          protein: acc.protein + (Number(log.protein_g) || 0),
          carbs: acc.carbs + (Number(log.carbs_g) || 0),
          fat: acc.fat + (Number(log.fat_g) || 0)
        }),
        dailyTotals
      );
    }
  }

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        <div className='flex items-center justify-between space-y-2'>
          <Heading
            title={
              <div className='flex items-center gap-2'>
                Daily Overview <LayoutDashboard className='h-8 w-8 text-primary' />
              </div>
            }
            description='Track your daily nutrition and progress towards your goals.'
          />
          <Button asChild>
            <Link href='/dashboard/log-meal'>Log Meal</Link>
          </Button>
        </div>

        {/* Nutrition Summary Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Calories</CardTitle>
              <IconFlame className='h-6 w-6 text-orange-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {Math.round(dailyTotals.calories)}
              </div>
              <p className='text-muted-foreground text-xs'>
                kcal consumed today
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Protein</CardTitle>
              <IconMeat className='h-6 w-6 text-red-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {Math.round(dailyTotals.protein)}g
              </div>
              <p className='text-muted-foreground text-xs'>muscle builder</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Carbs</CardTitle>
              <IconGrain className='h-6 w-6 text-yellow-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {Math.round(dailyTotals.carbs)}g
              </div>
              <p className='text-muted-foreground text-xs'>energy source</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Fat</CardTitle>
              <IconDroplet className='h-6 w-6 text-blue-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {Math.round(dailyTotals.fat)}g
              </div>
              <p className='text-muted-foreground text-xs'>
                essential nutrients
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder for charts - keeping the structure but removing fake data for now */}
        {/* 
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>
            {sales}
          </div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div> 
        */}

        <div className='text-muted-foreground hidden rounded-lg border border-dashed p-8 text-center'>
          Charts coming soon...
        </div>

        {/* Recent Meals List */}
        <RecentMeals logs={logs} />
      </div>
    </PageContainer>
  );
}
