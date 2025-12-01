'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Trash2, Save, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { clearCacheAction } from '@/features/dashboard/actions/recipes';
import PageContainer from '@/components/layout/page-container';

export default function SettingsPage() {
  const router = useRouter();
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
        toast.success('Cache cleared successfully! Favorites were preserved.');
      } else {
        toast.error(result.error || 'Failed to clear cache');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your preferences and data.</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>General Preferences</CardTitle>
              <CardDescription>Customize how the app behaves.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-1">
                  <Label htmlFor="confirm-delete" className="font-medium">
                    Confirm before delete
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show a confirmation dialog when deleting meals.
                  </p>
                </div>
                <Switch
                  id="confirm-delete"
                  checked={confirmDelete}
                  onCheckedChange={handleToggleConfirm}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Manage cached data and storage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
                <p className="mb-2">
                  <strong>Clear Cached Data:</strong> This will remove all non-favorited recipes from the database cache.
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Your <strong>Favorites</strong> will be safe. ❤️</li>
                  <li>Your <strong>Meal Logs</strong> will be safe. 🥗</li>
                  <li>Recently visited history (browser) will remain, but details will be re-fetched on click.</li>
                </ul>
              </div>
              <Button 
                variant="destructive" 
                onClick={handleClearCache} 
                disabled={isClearing}
                className="w-full sm:w-auto"
              >
                {isClearing ? 'Clearing...' : 'Clear Cached Data'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
