'use client';

import PageContainer from '@/components/layout/page-container';
import { FoodSearch } from '@/features/dashboard/components/food-search';
import { ManualFoodForm } from '@/features/dashboard/components/manual-food-form';
import { logFoodAction } from '@/features/dashboard/actions';
import { NutritionData } from '@/lib/calorie-ninjas';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      <div className='space-y-4 max-w-7xl mx-auto'>
        <h2 className='text-2xl font-bold tracking-tight'>Log a Meal 🥗</h2>
        <p className='text-muted-foreground'>
          Search for what you ate, or enter it manually.
        </p>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Database</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          <TabsContent value="search" className="mt-4">
            <FoodSearch onSelect={handleSelectFood} />
          </TabsContent>
          <TabsContent value="manual" className="mt-4">
            <ManualFoodForm />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
