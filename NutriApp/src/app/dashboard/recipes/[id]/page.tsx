'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getRecipeInformationAction } from '@/features/dashboard/actions/recipes';
import { RecipeInformation } from '@/lib/spoonacular';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Clock, Users } from 'lucide-react';
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

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        const result = await getRecipeInformationAction(id);
        if (result.success && result.data) {
          setRecipe(result.data);
        } else {
          toast.error(result.error || 'Failed to load recipe');
        }
      } catch (error) {
        toast.error('An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageContainer>
    );
  }

  if (!recipe) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <p className="text-muted-foreground">Recipe not found</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <AddToHistory id={id} />
      <div className="space-y-6 max-w-5xl mx-auto">
        <Button variant="ghost" className="mb-4 hover:bg-transparent pl-0" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column: Image & Ingredients */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-none shadow-md">
              <div className="relative aspect-video w-full">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-primary">🥕</span> Ingredients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recipe.extendedIngredients.map((ingredient) => (
                    <li key={ingredient.id} className="flex items-start gap-2 text-sm">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span className="leading-relaxed">{ingredient.original}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Info, Summary, Instructions */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-3">{recipe.title}</h1>
              <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1 rounded-full text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.readyInMinutes} mins</span>
                </div>
                <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1 rounded-full text-sm">
                  <Users className="h-4 w-4" />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-primary">📝</span> About this Dish
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-muted-foreground leading-relaxed text-sm [&>a]:text-primary [&>a]:underline"
                  dangerouslySetInnerHTML={{ __html: recipe.summary }} 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-primary">🍳</span> Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-6">
                  {recipe.analyzedInstructions[0]?.steps.map((step) => (
                    <li key={step.number} className="relative pl-8">
                      <span className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {step.number}
                      </span>
                      <p className="text-sm leading-relaxed">{step.step}</p>
                    </li>
                  )) || <p className="text-muted-foreground">No instructions available.</p>}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
