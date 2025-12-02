'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Loader2, Sparkles, ChefHat, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface MealSuggestion {
  title: string;
  searchQuery: string;
  reasoning: string;
  recipe: {
    id: number;
    title: string;
    image: string;
    imageType: string;
  } | null;
}

interface MealPlanResponse {
  analysis: string;
  suggestions: MealSuggestion[];
}

export function MealPlanGenerator() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<MealPlanResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { name: 'Nutrition Analyst', action: 'Analyzing your food logs...' },
    { name: 'Goal Evaluator', action: 'Checking your daily targets...' },
    { name: 'Meal Planner', action: 'Devising meal strategy...' },
    { name: 'Recipe Recommender', action: 'Searching for recipes...' }
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setPlan(null);
    setCurrentStep(0);

    // Simulate steps for visual effect (since API is one call)
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1500);

    try {
      const res = await fetch('/api/ai-meal-plan', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to generate plan');

      const data = await res.json();
      clearInterval(interval);
      setCurrentStep(4); // Done
      setPlan(data);
      toast.success('Meal plan generated!');
    } catch (error) {
      clearInterval(interval);
      toast.error('Could not generate meal plan. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      {!plan && !loading && (
        <div className='bg-muted/30 rounded-xl border border-dashed py-8 text-center'>
          <div className='mb-4 flex justify-center'>
            <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full'>
              <Sparkles className='text-primary h-6 w-6' />
            </div>
          </div>
          <h3 className='mb-2 text-lg font-semibold'>
            Need ideas for your next meal?
          </h3>
          <p className='text-muted-foreground mx-auto mb-6 max-w-md'>
            Our AI agents work together to analyze your data and find the
            perfect recipes.
          </p>
          <Button onClick={handleGenerate} size='lg' className='gap-2'>
            <ChefHat className='h-4 w-4' />
            Generate AI Meal Plan
          </Button>
        </div>
      )}

      {loading && (
        <div className='space-y-4 py-8'>
          <div className='mx-auto flex max-w-md flex-col gap-4'>
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-4 rounded-lg border p-4 transition-all duration-500 ${
                  idx === currentStep
                    ? 'bg-primary/10 border-primary scale-105 shadow-md'
                    : idx < currentStep
                      ? 'bg-muted/50 border-transparent opacity-50'
                      : 'opacity-30'
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    idx <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {idx < currentStep ? (
                    <ArrowRight className='h-4 w-4' />
                  ) : idx === currentStep ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <div className='bg-muted-foreground h-2 w-2 rounded-full' />
                  )}
                </div>
                <div>
                  <p className='text-sm font-medium'>{step.name}</p>
                  <p className='text-muted-foreground text-xs'>{step.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {plan && (
        <div className='animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500'>
          <div className='bg-primary/5 border-primary/20 flex items-start gap-3 rounded-lg border p-4'>
            <Sparkles className='text-primary mt-0.5 h-5 w-5 shrink-0' />
            <div>
              <h4 className='text-primary mb-1 font-semibold'>AI Analysis</h4>
              <p className='text-foreground/80 text-sm'>{plan.analysis}</p>
            </div>
          </div>

          <div className='grid gap-6 md:grid-cols-3'>
            {plan.suggestions.map((suggestion, idx) => (
              <Card
                key={idx}
                className='border-primary/20 flex flex-col overflow-hidden shadow-sm transition-all hover:shadow-md'
              >
                {suggestion.recipe?.image && (
                  <div className='relative aspect-video w-full overflow-hidden'>
                    <img
                      src={suggestion.recipe.image}
                      alt={suggestion.recipe.title}
                      className='h-full w-full object-cover transition-transform hover:scale-105'
                    />
                    <div className='absolute top-2 right-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm'>
                      CLAUDE'S PICK
                    </div>
                  </div>
                )}
                <CardHeader className='p-4 pb-2'>
                  <CardTitle
                    className='line-clamp-1 text-base'
                    title={suggestion.title}
                  >
                    {suggestion.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex-1 p-4 pt-0'>
                  <p className='text-muted-foreground mt-2 text-xs italic'>
                    "{suggestion.reasoning}"
                  </p>
                </CardContent>
                <CardFooter className='p-4 pt-0'>
                  {suggestion.recipe ? (
                    <Button
                      asChild
                      variant='secondary'
                      className='h-8 w-full gap-2 text-xs'
                    >
                      <Link href={`/dashboard/recipes/${suggestion.recipe.id}`}>
                        View Recipe <ArrowRight className='h-3 w-3' />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      disabled
                      variant='outline'
                      className='h-8 w-full text-xs'
                    >
                      Recipe Not Found
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className='flex justify-center pt-4'>
            <Button
              variant='outline'
              onClick={handleGenerate}
              disabled={loading}
              className='gap-2 text-xs'
            >
              {loading ? (
                <Loader2 className='h-3 w-3 animate-spin' />
              ) : (
                <Sparkles className='h-3 w-3' />
              )}
              Regenerate Plan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
