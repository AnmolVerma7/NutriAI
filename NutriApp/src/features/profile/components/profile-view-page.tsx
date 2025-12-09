import { createClient } from '@/lib/supabase/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Settings } from 'lucide-react';

export default async function ProfileViewPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const fullName = user.user_metadata?.full_name || 'User';
  const email = user.email || '';
  const avatarUrl = user.user_metadata?.avatar_url || '';
  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Helper to format values
  const formatHeight = (cm: number | null) => {
    if (!cm) return 'Not set';
    if (profile?.preferred_height_unit === 'ft') {
      const totalInches = cm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return `${feet}'${inches}"`;
    }
    return `${cm} cm`;
  };

  const formatWeight = (kg: number | null) => {
    if (!kg) return 'Not set';
    if (profile?.preferred_weight_unit === 'lbs') {
      return `${Math.round(kg * 2.20462)} lbs`;
    }
    return `${kg} kg`;
  };

  return (
    <div className='mx-auto flex w-full max-w-5xl flex-col space-y-6 p-4 md:p-8'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Avatar className='border-primary/10 h-20 w-20 border-2'>
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback className='text-lg'>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>{fullName}</h2>
            <p className='text-muted-foreground'>{email}</p>
          </div>
        </div>
        <Button variant='outline' size='sm' asChild>
          <Link href='/settings?tab=profile'>
            <Settings className='mr-2 h-4 w-4' />
            Edit Profile
          </Link>
        </Button>
      </div>

      <Separator />

      <div className='grid gap-6 md:grid-cols-2'>
        {/* Physical Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Physical Stats</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Age
                </div>
                <div className='text-lg font-semibold'>
                  {profile?.age || '-'}
                </div>
              </div>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Gender
                </div>
                <div className='text-lg font-semibold capitalize'>
                  {profile?.gender || '-'}
                </div>
              </div>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Height
                </div>
                <div className='text-lg font-semibold'>
                  {formatHeight(profile?.height)}
                </div>
              </div>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Activity Level
                </div>
                <div className='text-lg font-semibold capitalize'>
                  {profile?.activity_level?.replace('_', ' ') || '-'}
                </div>
              </div>
            </div>
            <Separator />
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Current Weight
                </div>
                <div className='text-lg font-semibold'>
                  {formatWeight(profile?.weight)}
                </div>
              </div>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Goal Weight
                </div>
                <div className='text-primary text-lg font-semibold'>
                  {formatWeight(profile?.goal_weight)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nutritional Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Nutritional Goals</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div>
              <div className='text-muted-foreground mb-2 text-sm font-medium'>
                Daily Targets
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-muted/50 rounded-lg p-3'>
                  <div className='text-muted-foreground text-xs font-bold uppercase'>
                    Calories
                  </div>
                  <div className='text-primary text-2xl font-bold'>
                    {profile?.daily_calorie_goal || '-'}
                  </div>
                  <div className='text-muted-foreground text-xs'>kcal/day</div>
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Protein</span>
                    <span className='font-semibold'>
                      {profile?.daily_protein_goal || '-'}g
                    </span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span>Carbs</span>
                    <span className='font-semibold'>
                      {profile?.daily_carbs_goal || '-'}g
                    </span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span>Fats</span>
                    <span className='font-semibold'>
                      {profile?.daily_fats_goal || '-'}g
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {profile?.dietary_restrictions &&
              profile.dietary_restrictions.length > 0 && (
                <div>
                  <div className='text-muted-foreground mb-2 text-sm font-medium'>
                    Dietary Restrictions
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {profile.dietary_restrictions.map((diet: string) => (
                      <Badge
                        key={diet}
                        variant='secondary'
                        className='capitalize'
                      >
                        {diet.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
