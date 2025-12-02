'use client';

import { useState } from 'react';
import { RecipeInformation } from '@/lib/spoonacular';
import { NutritionData } from '@/types/nutrition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LayoutGrid,
  List,
  Clock,
  Users,
  Heart,
  ArrowRight,
  Utensils
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toggleFavoriteAction } from '@/features/dashboard/actions/recipes';
import {
  toggleFavoriteFoodAction,
  logFoodAction
} from '@/features/dashboard/actions';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';

interface FavoritesViewProps {
  initialRecipes: RecipeInformation[];
  initialFoods: NutritionData[];
}

export function FavoritesView({
  initialRecipes,
  initialFoods
}: FavoritesViewProps) {
  const [recipes, setRecipes] = useState<RecipeInformation[]>(initialRecipes);
  const [foods, setFoods] = useState<NutritionData[]>(initialFoods);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const router = useRouter();

  const handleRemoveFavoriteRecipe = async (
    e: React.MouseEvent,
    id: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const result = await toggleFavoriteAction(id, false);
      if (result.success) {
        setRecipes((prev) => prev.filter((r) => r.id !== id));
        toast.success('Removed from favorites');
        router.refresh();
      } else {
        toast.error('Failed to remove favorite');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleRemoveFavoriteFood = async (
    e: React.MouseEvent,
    food: NutritionData
  ) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const result = await toggleFavoriteFoodAction(food, false);
      if (result.success) {
        setFoods((prev) => prev.filter((f) => f.name !== food.name));
        toast.success('Removed from favorites');
        router.refresh();
      } else {
        toast.error('Failed to remove favorite');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleLogFood = async (e: React.MouseEvent, food: NutritionData) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const result = await logFoodAction(food);
      if (result.success) {
        toast.success(`Logged ${food.name} successfully!`);
        router.refresh();
      } else {
        toast.error('Failed to log food');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className='mx-auto w-full max-w-7xl space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>My Favorites ❤️</h2>
        <div className='bg-muted/50 flex items-center space-x-2 rounded-lg border p-1'>
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size='sm'
            className='h-8 w-8 p-0'
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className='h-4 w-4' />
            <span className='sr-only'>Grid View</span>
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size='sm'
            className='h-8 w-8 p-0'
            onClick={() => setViewMode('list')}
          >
            <List className='h-4 w-4' />
            <span className='sr-only'>List View</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue='recipes' className='w-full'>
        <TabsList className='grid w-full max-w-md grid-cols-2'>
          <TabsTrigger value='recipes'>Recipes ({recipes.length})</TabsTrigger>
          <TabsTrigger value='foods'>Foods ({foods.length})</TabsTrigger>
        </TabsList>

        <TabsContent value='recipes' className='mt-6'>
          {recipes.length === 0 ? (
            <div className='flex h-[40vh] flex-col items-center justify-center space-y-4 text-center'>
              <div className='bg-muted/50 rounded-full p-6'>
                <Heart className='text-muted-foreground h-12 w-12' />
              </div>
              <h3 className='text-xl font-semibold'>No favorite recipes yet</h3>
              <Button asChild>
                <Link href='/dashboard/recipes'>Explore Recipes</Link>
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5'>
              {recipes.map((recipe) => (
                <Link key={recipe.id} href={`/dashboard/recipes/${recipe.id}`}>
                  <Card className='group border-muted/60 h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
                    <div className='relative aspect-video w-full overflow-hidden'>
                      <Image
                        src={recipe.image}
                        alt={recipe.title}
                        fill
                        className='object-cover transition-transform duration-300 group-hover:scale-105'
                      />
                      <div className='absolute top-2 right-2 z-10'>
                        <Button
                          variant='secondary'
                          size='icon'
                          className='h-8 w-8 rounded-full bg-white/90 text-red-500 shadow-sm hover:bg-white'
                          onClick={(e) =>
                            handleRemoveFavoriteRecipe(e, recipe.id)
                          }
                        >
                          <Heart className='h-4 w-4 fill-current' />
                        </Button>
                      </div>
                    </div>
                    <CardHeader className='p-4 pb-2'>
                      <CardTitle className='group-hover:text-primary line-clamp-1 text-center text-lg transition-colors'>
                        {recipe.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='p-4 pt-0'>
                      <div className='text-muted-foreground flex items-center justify-center gap-4 text-sm'>
                        <div className='flex items-center gap-1.5'>
                          <Clock className='h-3.5 w-3.5' />
                          <span>{recipe.readyInMinutes}m</span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                          <Users className='h-3.5 w-3.5' />
                          <span>{recipe.servings}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className='rounded-md border'>
              <div className='relative w-full overflow-auto'>
                <table className='w-full caption-bottom text-sm'>
                  <thead className='[&_tr]:border-b'>
                    <tr className='hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors'>
                      <th className='text-muted-foreground h-12 w-[80px] px-4 text-left align-middle font-medium'>
                        Image
                      </th>
                      <th className='text-muted-foreground h-12 px-4 text-left align-middle font-medium'>
                        Title
                      </th>
                      <th className='text-muted-foreground h-12 px-4 text-left align-middle font-medium'>
                        Prep Time
                      </th>
                      <th className='text-muted-foreground h-12 px-4 text-left align-middle font-medium'>
                        Servings
                      </th>
                      <th className='text-muted-foreground h-12 px-4 text-right align-middle font-medium'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='[&_tr:last-child]:border-0'>
                    {recipes.map((recipe) => (
                      <tr
                        key={recipe.id}
                        className='hover:bg-muted/50 border-b transition-colors'
                      >
                        <td className='p-4 align-middle'>
                          <div className='relative h-10 w-16 overflow-hidden rounded-md'>
                            <Image
                              src={recipe.image}
                              alt={recipe.title}
                              fill
                              className='object-cover'
                            />
                          </div>
                        </td>
                        <td className='p-4 align-middle font-medium'>
                          <Link
                            href={`/dashboard/recipes/${recipe.id}`}
                            className='hover:underline'
                          >
                            {recipe.title}
                          </Link>
                        </td>
                        <td className='p-4 align-middle'>
                          {recipe.readyInMinutes}m
                        </td>
                        <td className='p-4 align-middle'>{recipe.servings}</td>
                        <td className='p-4 text-right align-middle'>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='text-red-500'
                            onClick={(e) =>
                              handleRemoveFavoriteRecipe(e, recipe.id)
                            }
                          >
                            <Heart className='h-4 w-4 fill-current' />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value='foods' className='mt-6'>
          {foods.length === 0 ? (
            <div className='flex h-[40vh] flex-col items-center justify-center space-y-4 text-center'>
              <div className='bg-muted/50 rounded-full p-6'>
                <Utensils className='text-muted-foreground h-12 w-12' />
              </div>
              <h3 className='text-xl font-semibold'>No favorite foods yet</h3>
              <Button asChild>
                <Link href='/dashboard/log-meal'>Search Foods</Link>
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5'>
              {foods.map((food, idx) => (
                <Card
                  key={idx}
                  className='group border-muted/60 relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
                >
                  <div className='absolute top-2 right-2 z-10 flex gap-1'>
                    <Button
                      variant='secondary'
                      size='icon'
                      className='h-8 w-8 rounded-full bg-white/90 text-green-600 shadow-sm hover:bg-white'
                      onClick={(e) => handleLogFood(e, food)}
                      title='Log this food'
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='secondary'
                      size='icon'
                      className='h-8 w-8 rounded-full bg-white/90 text-red-500 shadow-sm hover:bg-white'
                      onClick={(e) => handleRemoveFavoriteFood(e, food)}
                      title='Remove from favorites'
                    >
                      <Heart className='h-4 w-4 fill-current' />
                    </Button>
                  </div>
                  <CardHeader className='p-4'>
                    <CardTitle className='group-hover:text-primary line-clamp-1 text-lg capitalize transition-colors'>
                      {food.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='p-4 pt-0'>
                    <div className='space-y-1 text-sm'>
                      <div className='flex justify-between'>
                        <span>Calories:</span>{' '}
                        <span className='font-medium'>{food.calories}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Protein:</span>{' '}
                        <span className='font-medium'>{food.protein_g}g</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Carbs:</span>{' '}
                        <span className='font-medium'>
                          {food.carbohydrates_total_g}g
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Fat:</span>{' '}
                        <span className='font-medium'>{food.fat_total_g}g</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className='rounded-md border'>
              <div className='relative w-full overflow-auto'>
                <table className='w-full caption-bottom text-sm'>
                  <thead className='[&_tr]:border-b'>
                    <tr className='hover:bg-muted/50 border-b transition-colors'>
                      <th className='text-muted-foreground h-12 px-4 text-left align-middle font-medium'>
                        Name
                      </th>
                      <th className='text-muted-foreground h-12 px-4 text-left align-middle font-medium'>
                        Calories
                      </th>
                      <th className='text-muted-foreground h-12 px-4 text-left align-middle font-medium'>
                        Protein
                      </th>
                      <th className='text-muted-foreground h-12 px-4 text-left align-middle font-medium'>
                        Carbs
                      </th>
                      <th className='text-muted-foreground h-12 px-4 text-left align-middle font-medium'>
                        Fat
                      </th>
                      <th className='text-muted-foreground h-12 px-4 text-right align-middle font-medium'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='[&_tr:last-child]:border-0'>
                    {foods.map((food, idx) => (
                      <tr
                        key={idx}
                        className='hover:bg-muted/50 border-b transition-colors'
                      >
                        <td className='p-4 align-middle font-medium capitalize'>
                          {food.name}
                        </td>
                        <td className='p-4 align-middle'>{food.calories}</td>
                        <td className='p-4 align-middle'>{food.protein_g}g</td>
                        <td className='p-4 align-middle'>
                          {food.carbohydrates_total_g}g
                        </td>
                        <td className='p-4 align-middle'>
                          {food.fat_total_g}g
                        </td>
                        <td className='p-4 text-right align-middle'>
                          <div className='flex justify-end gap-2'>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='text-green-600 hover:text-green-700'
                              onClick={(e) => handleLogFood(e, food)}
                              title='Log this food'
                            >
                              <Plus className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='text-red-500'
                              onClick={(e) => handleRemoveFavoriteFood(e, food)}
                              title='Remove from favorites'
                            >
                              <Heart className='h-4 w-4 fill-current' />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
