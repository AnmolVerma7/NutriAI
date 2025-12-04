'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeightChartProps {
  data: any[];
  unit?: 'kg' | 'lbs';
}

export function WeightChart({ data, unit = 'kg' }: WeightChartProps) {
  // Create a copy of data with converted values if needed
  const chartData = data.map((item) => ({
    ...item,
    displayWeight:
      unit === 'lbs' ? Number((item.weight * 2.20462).toFixed(1)) : item.weight
  }));

  return (
    <Card className='col-span-4'>
      <CardHeader>
        <CardTitle>Weight Trend ({unit})</CardTitle>
      </CardHeader>
      <CardContent className='pl-2'>
        <ResponsiveContainer width='100%' height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis
              dataKey='date'
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              formatter={(value: number) => [`${value} ${unit}`, 'Weight']}
            />
            <Line
              type='monotone'
              dataKey='displayWeight'
              stroke='#2563eb' // primary blue
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
