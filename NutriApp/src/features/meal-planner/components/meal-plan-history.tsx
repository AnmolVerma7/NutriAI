'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ChevronRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface SavedPlan {
  id: string;
  created_at: string;
  analysis: string;
  suggestions: {
    title: string;
    reasoning: string;
    recipe: {
      id: number;
      title: string;
      image: string;
    } | null;
  }[];
}

export function MealPlanHistory() {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('meal_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setPlans(data as SavedPlan[]);
      setLoading(false);
    };

    fetchHistory();
  }, []);

  if (loading)
    return (
      <div className='text-muted-foreground py-8 text-center'>
        Loading history...
      </div>
    );
  if (plans.length === 0)
    return (
      <div className='text-muted-foreground py-8 text-center'>
        No saved plans yet.
      </div>
    );

  return (
    <div className='space-y-4'>
      <Accordion type='single' collapsible className='w-full'>
        {plans.map((plan) => (
          <AccordionItem key={plan.id} value={plan.id}>
            <AccordionTrigger className='hover:no-underline'>
              <div className='flex flex-col items-start gap-1 text-left'>
                <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                  <Calendar className='h-3 w-3' />
                  {new Date(plan.created_at).toLocaleDateString()}
                  <Clock className='ml-2 h-3 w-3' />
                  {new Date(plan.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <span className='line-clamp-1 font-medium'>
                  {plan.analysis}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className='grid gap-4 pt-2'>
                {plan.suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className='bg-card/50 flex gap-4 rounded-lg border p-3'
                  >
                    {item.recipe?.image && (
                      <img
                        src={item.recipe.image}
                        alt={item.recipe.title}
                        className='h-16 w-16 shrink-0 rounded-md object-cover'
                      />
                    )}
                    <div className='min-w-0 flex-1'>
                      <h4 className='truncate text-sm font-medium'>
                        {item.title}
                      </h4>
                      <p className='text-muted-foreground mt-1 line-clamp-2 text-xs'>
                        {item.reasoning}
                      </p>
                      {item.recipe && (
                        <Button
                          asChild
                          variant='link'
                          className='mt-1 h-auto p-0 text-xs'
                        >
                          <Link href={`/dashboard/recipes/${item.recipe.id}`}>
                            View Recipe <ChevronRight className='h-3 w-3' />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <div className='mt-2 flex justify-end'>
                  <Button
                    variant='destructive'
                    size='sm'
                    className='h-8'
                    onClick={async () => {
                      const { deleteMealPlanAction } = await import(
                        '../actions'
                      );
                      const toast = (await import('sonner')).toast;

                      const result = await deleteMealPlanAction(plan.id);
                      if (result.success) {
                        setPlans((prev) =>
                          prev.filter((p) => p.id !== plan.id)
                        );
                        toast.success('Meal plan deleted');
                      } else {
                        toast.error(result.error || 'Failed to delete plan');
                      }
                    }}
                  >
                    <Trash2 className='mr-2 h-4 w-4' />
                    Delete Plan
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
