'use client';

import PageContainer from '@/components/layout/page-container';
import { FoodSearch } from '@/features/dashboard/components/food-search';
import { logFoodAction } from '@/features/dashboard/actions';
import { NutritionData } from '@/lib/calorie-ninjas';
import { toast } from 'sonner';

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
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Log a Meal 🥗</h2>
        <p className="text-muted-foreground">
          Search for what you ate, and we'll add it to your daily log.
        </p>
        
        <FoodSearch onSelect={handleSelectFood} />
      </div>
    </PageContainer>
  );
}
