'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { searchFoodAction } from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { NutritionData } from '@/lib/calorie-ninjas';

interface FoodSearchProps {
  onSelect?: (item: NutritionData) => void;
}

export function FoodSearch({ onSelect }: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NutritionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await searchFoodAction(query);
      if (res.success && res.data) {
        setResults(res.data);
      } else {
        setError('No results found');
      }
    } catch (err) {
      setError('Failed to search food');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-4'>
      <form onSubmit={handleSearch} className='flex gap-2'>
        <Input
          placeholder="Search for food (e.g., '1 cup rice')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type='submit' disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {error && <p className='text-sm text-red-500'>{error}</p>}

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {results.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className='capitalize'>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-1 text-sm'>
                <p>Calories: {item.calories}</p>
                <p>Protein: {item.protein_g}g</p>
                <p>Carbs: {item.carbohydrates_total_g}g</p>
                <p>Fat: {item.fat_total_g}g</p>
              </div>
              {onSelect && (
                <Button
                  className='mt-4 w-full'
                  onClick={() => onSelect(item)}
                  variant='secondary'
                >
                  Add to Log
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
