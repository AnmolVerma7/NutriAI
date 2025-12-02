import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import {
  searchFoodAction,
  toggleFavoriteFoodAction,
  getFavoriteFoodsAction
} from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

import { NutritionData } from '@/types/nutrition';

interface FoodSearchProps {
  onSelect?: (item: NutritionData) => void;
}

export function FoodSearch({ onSelect }: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NutritionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load favorites on mount
    getFavoriteFoodsAction().then((favs) => {
      setFavorites(new Set(favs.map((f) => f.name)));
    });
  }, []);

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

  const toggleFavorite = async (item: NutritionData) => {
    const isFav = favorites.has(item.name);
    const newFavs = new Set(favorites);
    if (isFav) {
      newFavs.delete(item.name);
    } else {
      newFavs.add(item.name);
    }
    setFavorites(newFavs); // Optimistic update

    await toggleFavoriteFoodAction(item, !isFav);
  };

  return (
    <div className='space-y-8'>
      <div className='flex flex-col items-center space-y-4'>
        <form onSubmit={handleSearch} className='flex w-full max-w-2xl gap-2'>
          <Input
            placeholder="Search for food (e.g., '1 cup rice')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='flex-1'
          />
          <Button type='submit' disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>

      {error && <p className='text-center text-sm text-red-500'>{error}</p>}

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
        {results.map((item, index) => (
          <Card key={index} className='group relative'>
            <button
              onClick={() => toggleFavorite(item)}
              className='absolute top-2 right-2 z-10 rounded-full bg-white/80 p-2 transition-colors hover:bg-white'
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  favorites.has(item.name)
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-400 hover:text-red-500'
                }`}
              />
            </button>
            <CardHeader>
              <CardTitle className='pr-8 capitalize'>{item.name}</CardTitle>
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
