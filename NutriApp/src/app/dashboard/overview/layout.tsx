import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { IconFlame, IconMeat, IconGrain, IconDroplet } from '@tabler/icons-react'; // Using approximate icons
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { FoodSearch } from '@/features/dashboard/components/food-search';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
  const { data: { user } } = await supabase.auth.getUser();

  let dailyTotals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };

  if (user) {
    const today = new Date().toISOString().split('T')[0];
    const { data: logs } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);

    if (logs) {
      dailyTotals = logs.reduce((acc, log) => ({
        calories: acc.calories + (Number(log.calories) || 0),
        protein: acc.protein + (Number(log.protein_g) || 0),
        carbs: acc.carbs + (Number(log.carbs_g) || 0),
        fat: acc.fat + (Number(log.fat_g) || 0)
      }), dailyTotals);
    }
  }

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Daily Overview 🥗
          </h2>
          <Button asChild>
            <Link href="/dashboard/log-meal">Log Meal</Link>
          </Button>
        </div>

        {/* Nutrition Summary Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories</CardTitle>
              <IconFlame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(dailyTotals.calories)}</div>
              <p className="text-xs text-muted-foreground">kcal consumed today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Protein</CardTitle>
              <IconMeat className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(dailyTotals.protein)}g</div>
              <p className="text-xs text-muted-foreground">muscle builder</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carbs</CardTitle>
              <IconGrain className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(dailyTotals.carbs)}g</div>
              <p className="text-xs text-muted-foreground">energy source</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fat</CardTitle>
              <IconDroplet className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(dailyTotals.fat)}g</div>
              <p className="text-xs text-muted-foreground">essential nutrients</p>
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
        
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            Charts coming soon...
        </div>

      </div>
    </PageContainer>
  );
}
