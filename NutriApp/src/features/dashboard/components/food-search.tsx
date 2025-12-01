'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { searchFoodAction } from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function FoodSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    const res = await searchFoodAction(query);
    setLoading(false);
    if (res.success && res.data) {
      setResults(res.data);
    }
  };

  return (
    <div className='space-y-4 p-4'>
      <div className='flex gap-2'>
        <Input
          placeholder='e.g., 3 eggs and an apple'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {results.map((item, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className='capitalize'>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-sm space-y-1'>
                <p><strong>Calories:</strong> {item.calories}</p>
                <p><strong>Protein:</strong> {item.protein_g}g</p>
                <p><strong>Carbs:</strong> {item.carbohydrates_total_g}g</p>
                <p><strong>Fat:</strong> {item.fat_total_g}g</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
