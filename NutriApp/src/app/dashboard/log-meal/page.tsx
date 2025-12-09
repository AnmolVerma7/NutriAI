'use client';

import PageContainer from '@/components/layout/page-container';
import { FoodSearch } from '@/features/dashboard/components/food-search';
import { ManualFoodForm } from '@/features/dashboard/components/manual-food-form';
import { NaturalLanguageInput } from '@/features/dashboard/components/natural-language-input';
import { logFoodAction } from '@/features/dashboard/actions';
import { NutritionData } from '@/types/nutrition';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Utensils, Sparkles, Search } from 'lucide-react';

export default function LogMealPage() {
  const handleSelectFood = async (item: NutritionData) => {
    const result = await logFoodAction(item);

    if (result.success) {
      toast.success(`Logged ${item.name} successfully!`);
    } else {
      toast.error('Failed to log food');
    }
  };

  return (
    <PageContainer>
      <div className='mx-auto max-w-7xl space-y-4'>
        <div className='flex items-center gap-2'>
          <h2 className='text-2xl font-bold tracking-tight'>Log a Meal</h2>
          <Utensils className='text-primary h-6 w-6' />
        </div>
        <p className='text-muted-foreground'>
          Search for what you ate, or enter it manually.
        </p>

        <Tabs defaultValue='search' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='search'>Search Database</TabsTrigger>
            <TabsTrigger value='ai' className='flex gap-2'>
              AI Log <Sparkles className='h-3 w-3 text-purple-500' />
            </TabsTrigger>
            <TabsTrigger value='manual'>Manual Entry</TabsTrigger>
          </TabsList>
          <TabsContent value='search' className='mt-4'>
            <FoodSearch onSelect={handleSelectFood} />
          </TabsContent>
          <TabsContent value='ai' className='mt-4'>
            <NaturalLanguageInput />
          </TabsContent>
          <TabsContent value='manual' className='mt-4'>
            <ManualFoodForm />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
