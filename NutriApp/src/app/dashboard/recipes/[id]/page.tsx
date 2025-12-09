'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  getRecipeInformationAction,
  toggleFavoriteAction,
  getFavoriteStatusAction
} from '@/features/dashboard/actions/recipes';
import { RecipeInformation } from '@/lib/spoonacular';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Clock,
  Flame,
  Utensils,
  ChevronLeft,
  Heart,
  Carrot,
  FileText,
  ChefHat,
  Loader2,
  ArrowLeft,
  Users
} from 'lucide-react';
import Image from 'next/image';
import PageContainer from '@/components/layout/page-container';
import { toast } from 'sonner';
import { AddToHistory } from '@/features/dashboard/components/add-to-history';

export default function RecipeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [recipe, setRecipe] = useState<RecipeInformation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFav, setIsTogglingFav] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [recipeResult, favResult] = await Promise.all([
          getRecipeInformationAction(id),
          getFavoriteStatusAction(id)
        ]);

        if (recipeResult.success && recipeResult.data) {
          setRecipe(recipeResult.data);
        } else {
          toast.error(recipeResult.error || 'Failed to load recipe');
        }

        if (favResult.success) {
          setIsFavorite(favResult.isFavorite);
        }
      } catch (error) {
        toast.error('An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!recipe) return;
    setIsTogglingFav(true);
    try {
      const newStatus = !isFavorite;
      const result = await toggleFavoriteAction(recipe.id, newStatus);
      if (result.success) {
        setIsFavorite(newStatus);
        toast.success(
          newStatus ? 'Added to favorites' : 'Removed from favorites'
        );
      } else {
        toast.error(result.error || 'Failed to update favorite');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsTogglingFav(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className='flex h-[50vh] items-center justify-center'>
          <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
        </div>
      </PageContainer>
    );
  }

  if (!recipe) {
    return (
      <PageContainer>
        <div className='flex flex-col items-center justify-center space-y-4 py-8'>
          <p className='text-muted-foreground'>Recipe not found</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <AddToHistory id={id} />
      <div className='mx-auto max-w-5xl space-y-6'>
        <div className='flex items-center justify-between'>
          <Button
            variant='ghost'
            className='pl-0 hover:bg-transparent'
            onClick={() => router.back()}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Search
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={handleToggleFavorite}
            disabled={isTogglingFav}
            className={
              isFavorite
                ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600'
                : ''
            }
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <div className='grid gap-6 lg:grid-cols-2'>
          {/* Left Column: Image & Ingredients */}
          <div className='space-y-6'>
            <Card className='overflow-hidden border-none shadow-md'>
              <div className='relative aspect-video w-full'>
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className='object-cover'
                  priority
                />
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <span className='text-primary mr-2'>
                    <Carrot className='h-4 w-4' />
                  </span>
                  Ingredients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-3'>
                  {recipe.extendedIngredients.map((ingredient) => (
                    <li
                      key={ingredient.id}
                      className='flex items-start gap-2 text-sm'
                    >
                      <div className='bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full' />
                      <span className='leading-relaxed'>
                        {ingredient.original}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Info, Summary, Instructions */}
          <div className='space-y-6'>
            <div>
              <h1 className='mb-3 text-3xl font-bold tracking-tight'>
                {recipe.title}
              </h1>
              <div className='text-muted-foreground mb-6 flex flex-wrap gap-4'>
                <div className='bg-secondary/50 flex items-center gap-1.5 rounded-full px-3 py-1 text-sm'>
                  <Clock className='h-4 w-4' />
                  <span>{recipe.readyInMinutes} mins</span>
                </div>
                <div className='bg-secondary/50 flex items-center gap-1.5 rounded-full px-3 py-1 text-sm'>
                  <Users className='h-4 w-4' />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <span className='text-primary mr-2'>
                    <FileText className='h-4 w-4' />
                  </span>
                  About this Dish
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className='text-muted-foreground [&>a]:text-primary text-sm leading-relaxed [&>a]:underline'
                  dangerouslySetInnerHTML={{ __html: recipe.summary }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <span className='text-primary mr-2'>
                    <ChefHat className='h-4 w-4' />
                  </span>
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className='space-y-6'>
                  {recipe.analyzedInstructions[0]?.steps.map((step) => (
                    <li key={step.number} className='relative pl-8'>
                      <span className='bg-primary/10 text-primary absolute top-0 left-0 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold'>
                        {step.number}
                      </span>
                      <p className='text-sm leading-relaxed'>{step.step}</p>
                    </li>
                  )) || (
                    <p className='text-muted-foreground'>
                      No instructions available.
                    </p>
                  )}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
