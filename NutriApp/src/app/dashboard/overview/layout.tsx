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
  
  let logs: any[] | null = null;

  if (user) {
    const today = new Date().toISOString().split('T')[0];
    const { data: fetchedLogs } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);
      
    logs = fetchedLogs;

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
        
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground hidden">
            Charts coming soon...
        </div>

        {/* Recent Meals List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-tight">Recent Meals 🍽️</h3>
          {user && logs && logs.length > 0 ? (
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Time</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Food</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Serving (g)</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Calories</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Protein</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Carbs</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Fat</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle">
                          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-4 align-middle font-medium">{log.name}</td>
                        <td className="p-4 align-middle text-right">{log.serving_size_g}g</td>
                        <td className="p-4 align-middle text-right">{log.calories}</td>
                        <td className="p-4 align-middle text-right">{log.protein_g}g</td>
                        <td className="p-4 align-middle text-right">{log.carbs_g}g</td>
                        <td className="p-4 align-middle text-right">{log.fat_g}g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex h-[150px] w-full flex-col items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
              No meals logged today.
              <Button variant="link" asChild className="mt-2">
                <Link href="/dashboard/log-meal">Log your first meal</Link>
              </Button>
            </div>
          )}
        </div>

      </div>
    </PageContainer>
  );
}
