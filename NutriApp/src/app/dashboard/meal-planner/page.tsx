import { MealPlanGenerator } from '@/features/meal-planner/components/meal-plan-generator';
import { MealPlanHistory } from '@/features/meal-planner/components/meal-plan-history';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, History } from 'lucide-react';

export default function MealPlannerPage() {
  return (
    <PageContainer>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <div>
            <div className='mb-2 flex items-center space-x-2'>
              <h2 className='text-3xl font-bold tracking-tight'>
                AI Meal Planner
              </h2>
              <Bot className='text-primary h-8 w-8' />
            </div>
            <p className='text-muted-foreground text-sm'>
              Get personalized meal suggestions based on your goals and dietary
              needs.
            </p>
          </div>
        </div>

        <Separator />

        <Tabs defaultValue='generate' className='w-full'>
          <TabsList className='grid w-full max-w-[400px] grid-cols-2'>
            <TabsTrigger value='generate'>Generate Plan</TabsTrigger>
            <TabsTrigger value='history'>History</TabsTrigger>
          </TabsList>
          <TabsContent value='generate' className='mt-4'>
            <MealPlanGenerator />
          </TabsContent>
          <TabsContent value='history' className='mt-4'>
            <MealPlanHistory />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
