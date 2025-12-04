'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { WeightChart } from './weight-chart';
import { CalorieChart } from './calorie-chart';
import { LogWeightDialog } from './log-weight-dialog';
import { getProgressDataAction } from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function ProgressViewPage() {
  const [data, setData] = useState<any[]>([]);
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, preferredUnit, error } = await getProgressDataAction();
      if (data) {
        setData(data);
      }
      if (preferredUnit) {
        setUnit(preferredUnit as 'kg' | 'lbs');
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  // Calculate some summary stats
  const currentWeightKg = data.length > 0 ? data[data.length - 1].weight : 0;
  const startWeightKg = data.length > 0 ? data[0].weight : 0;
  const weightChangeKg = currentWeightKg - startWeightKg;

  // Convert for display
  const displayCurrentWeight =
    unit === 'lbs' ? currentWeightKg * 2.20462 : currentWeightKg;
  const displayWeightChange =
    unit === 'lbs' ? weightChangeKg * 2.20462 : weightChangeKg;

  return (
    <PageContainer>
      <div className='flex flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Progress Tracking'
            description='Visualize your fitness journey over time.'
          />
          <LogWeightDialog defaultUnit={unit} />
        </div>
        <Separator />

        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
          </div>
        ) : data.length === 0 ? (
          <div className='text-muted-foreground flex h-64 flex-col items-center justify-center space-y-4'>
            <p>No data available yet.</p>
            <p className='text-sm'>Log your weight to get started!</p>
          </div>
        ) : (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Current Weight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {displayCurrentWeight.toFixed(1)} {unit}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Change
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${weightChangeKg <= 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {displayWeightChange > 0 ? '+' : ''}
                  {displayWeightChange.toFixed(1)} {unit}
                </div>
                <p className='text-muted-foreground text-xs'>Last 30 days</p>
              </CardContent>
            </Card>
            {/* Add more summary cards if needed */}
          </div>
        )}

        {!isLoading && data.length > 0 && (
          <div className='grid gap-4 md:grid-cols-1 lg:grid-cols-2'>
            <WeightChart data={data} unit={unit} />
            <CalorieChart data={data} />
          </div>
        )}
      </div>
    </PageContainer>
  );
}
