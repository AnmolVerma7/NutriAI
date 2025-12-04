'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { logWeightAction } from '../actions';
import { Plus, Loader2 } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface LogWeightDialogProps {
  defaultUnit?: 'kg' | 'lbs';
}

export function LogWeightDialog({ defaultUnit = 'kg' }: LogWeightDialogProps) {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lbs'>(defaultUnit);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUnit(defaultUnit);
  }, [defaultUnit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !date) return;

    setIsLoading(true);
    try {
      let weightInKg = Number(weight);
      if (unit === 'lbs') {
        weightInKg = weightInKg / 2.20462;
      }

      const result = await logWeightAction(date, weightInKg);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Weight logged successfully!');
        setOpen(false);
        setWeight('');
      }
    } catch (error) {
      toast.error('Failed to log weight');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Log Weight
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Log Weight</DialogTitle>
          <DialogDescription>
            Enter your weight for a specific date.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='date' className='text-right'>
                Date
              </Label>
              <Input
                id='date'
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className='col-span-3'
                required
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='weight' className='text-right'>
                Weight
              </Label>
              <div className='col-span-3 flex gap-2'>
                <Input
                  id='weight'
                  type='number'
                  step='0.1'
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={unit === 'kg' ? 'e.g. 75.5' : 'e.g. 166'}
                  required
                  className='flex-1'
                />
                <ToggleGroup
                  type='single'
                  value={unit}
                  onValueChange={(val) => {
                    if (val) setUnit(val as 'kg' | 'lbs');
                  }}
                  className='rounded-md border'
                >
                  <ToggleGroupItem value='kg' className='h-9 px-2 text-xs'>
                    kg
                  </ToggleGroupItem>
                  <ToggleGroupItem value='lbs' className='h-9 px-2 text-xs'>
                    lbs
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={isLoading}>
              {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
