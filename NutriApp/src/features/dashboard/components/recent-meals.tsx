'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Settings2 } from 'lucide-react';
import { deleteFoodLogAction } from '@/features/dashboard/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface FoodLog {
  id: string;
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  serving_size_g: number;
  created_at: string;
}

interface RecentMealsProps {
  logs: FoodLog[] | null;
}

export function RecentMeals({ logs }: RecentMealsProps) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const storedPref = localStorage.getItem('nutri-confirm-delete');
    if (storedPref !== null) {
      setConfirmDelete(storedPref === 'true');
    }
  }, []);

  const toggleConfirmDelete = (checked: boolean) => {
    setConfirmDelete(checked);
    localStorage.setItem('nutri-confirm-delete', String(checked));
  };

  const handleDeleteClick = async (id: string) => {
    if (confirmDelete) {
      setDeleteId(id);
    } else {
      await performDelete(id);
    }
  };

  const performDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteFoodLogAction(id);
      if (result.success) {
        toast.success('Meal deleted');
        router.refresh();
      } else {
        toast.error('Failed to delete meal');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-xl font-semibold tracking-tight'>
          Recent Meals 🍽️
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
              <Settings2 className='h-4 w-4' />
              <span className='sr-only'>Settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>List Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={confirmDelete}
              onCheckedChange={toggleConfirmDelete}
            >
              Confirm before delete
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {logs && logs.length > 0 ? (
        <div className='rounded-md border'>
          <div className='relative w-full overflow-auto'>
            <table className='w-full caption-bottom text-sm'>
              <thead className='[&_tr]:border-b'>
                <tr className='hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors'>
                  <th className='text-muted-foreground h-12 px-4 text-left align-middle font-medium'>
                    Time
                  </th>
                  <th className='text-muted-foreground h-12 px-4 text-left align-middle font-medium'>
                    Food
                  </th>
                  <th className='text-muted-foreground h-12 px-4 text-right align-middle font-medium'>
                    Serving (g)
                  </th>
                  <th className='text-muted-foreground h-12 px-4 text-right align-middle font-medium'>
                    Calories
                  </th>
                  <th className='text-muted-foreground h-12 px-4 text-right align-middle font-medium'>
                    Protein
                  </th>
                  <th className='text-muted-foreground h-12 px-4 text-right align-middle font-medium'>
                    Carbs
                  </th>
                  <th className='text-muted-foreground h-12 px-4 text-right align-middle font-medium'>
                    Fat
                  </th>
                  <th className='text-muted-foreground h-12 px-4 text-right align-middle font-medium'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='[&_tr:last-child]:border-0'>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className='hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors'
                  >
                    <td className='p-4 align-middle'>
                      {new Date(log.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className='p-4 align-middle font-medium'>
                      {log.name}
                    </td>
                    <td className='p-4 text-right align-middle'>
                      {log.serving_size_g}g
                    </td>
                    <td className='p-4 text-right align-middle'>
                      {log.calories}
                    </td>
                    <td className='p-4 text-right align-middle'>
                      {log.protein_g}g
                    </td>
                    <td className='p-4 text-right align-middle'>
                      {log.carbs_g}g
                    </td>
                    <td className='p-4 text-right align-middle'>
                      {log.fat_g}g
                    </td>
                    <td className='p-4 text-right align-middle'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100'
                        onClick={() => handleDeleteClick(log.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className='h-4 w-4' />
                        <span className='sr-only'>Delete</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className='text-muted-foreground flex h-[150px] w-full flex-col items-center justify-center rounded-md border border-dashed text-sm'>
          No meals logged today.
          <Button variant='link' asChild className='mt-2'>
            <Link href='/dashboard/log-meal'>Log your first meal</Link>
          </Button>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this meal entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteId && performDelete(deleteId)}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
