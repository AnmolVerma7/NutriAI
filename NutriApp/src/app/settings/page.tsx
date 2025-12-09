'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Trash2, Save, Database, Palette, Heart, Salad } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { clearCacheAction } from '@/features/dashboard/actions/recipes';
import { ThemeSelector } from '@/components/theme-selector';

import PageContainer from '@/components/layout/page-container';

import { ProfileForm } from '@/features/profile/components/profile-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'app';
  
  const [confirmDelete, setConfirmDelete] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    const storedPref = localStorage.getItem('nutri-confirm-delete');
    if (storedPref !== null) {
      setConfirmDelete(storedPref === 'true');
    }
  }, []);

  const handleToggleConfirm = (checked: boolean) => {
    setConfirmDelete(checked);
    localStorage.setItem('nutri-confirm-delete', String(checked));
    toast.success('Preference saved');
  };

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      const result = await clearCacheAction();
      if (result.success) {
        toast.success('Recipe cache cleared successfully!');
      } else {
        toast.error(result.error || 'Failed to clear recipe cache');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className='bg-background min-h-screen p-4 md:p-8'>
      <div className='mx-auto max-w-2xl space-y-8'>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' size='icon' onClick={() => router.back()}>
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
            <p className='text-muted-foreground'>
              Manage your preferences and data.
            </p>
          </div>
        </div>

        <Tabs defaultValue={defaultTab} className='w-full'>
          <TabsList className='mb-8 grid w-full grid-cols-2'>
            <TabsTrigger value='app'>App Settings</TabsTrigger>
            <TabsTrigger value='profile'>Profile & Goals</TabsTrigger>
          </TabsList>

          <TabsContent value='app'>
            <div className='grid gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle>General Preferences</CardTitle>
                  <CardDescription>
                    Customize how the app behaves.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center justify-between space-x-2'>
                      <div className='space-y-1'>
                        <Label htmlFor='confirm-delete' className='font-medium'>
                          Confirm before delete
                        </Label>
                        <p className='text-muted-foreground text-sm'>
                          Show a confirmation dialog when deleting meals.
                        </p>
                      </div>
                    <Switch
                      id='confirm-delete'
                      checked={confirmDelete}
                      onCheckedChange={handleToggleConfirm}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Palette className='h-5 w-5' />
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of the application.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ThemeSelector />
                </CardContent>
              </Card>

              <Card className='border-destructive/20'>
                <CardHeader>
                  <CardTitle className='text-destructive flex items-center gap-2'>
                    <Database className='h-5 w-5' />
                    Data Management
                  </CardTitle>
                  <CardDescription>Manage cached data.</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='bg-muted text-muted-foreground rounded-md p-4 text-sm'>
                    <p className='mb-2'>
                      <strong>Clear Cached Data:</strong> This will remove
                      cached data from the database.
                    </p>
                    <ul className='list-disc space-y-1 pl-4'>
                      <li>
                        Your <strong>Favorites</strong> will be safe. <Heart className='inline h-3 w-3 text-red-500' />
                      </li>
                      <li>
                        Your <strong>Meal Logs</strong> will be safe. <Salad className='inline h-3 w-3 text-green-500' />
                      </li>
                    </ul>
                  </div>
                  <div className='flex flex-col gap-4 sm:flex-row'>
                    <Button
                      variant='destructive'
                      onClick={handleClearCache}
                      disabled={isClearing}
                      className='w-full sm:w-auto'
                    >
                      {isClearing ? 'Clearing...' : 'Clear Recipe Cache'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='profile'>
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                  Update your stats and goals for better AI recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
