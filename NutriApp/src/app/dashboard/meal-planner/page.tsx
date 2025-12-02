import { MealPlanGenerator } from '@/features/meal-planner/components/meal-plan-generator';
import { MealPlanHistory } from '@/features/meal-planner/components/meal-plan-history';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MealPlannerPage() {
  return (
    <PageContainer>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='AI Meal Planner 🤖'
            description='Get personalized meal suggestions based on your goals and dietary needs.'
          />
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
