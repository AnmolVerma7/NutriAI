'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { logFoodAction } from '@/features/dashboard/actions';
import { toast } from 'sonner';
import { NutritionData } from '@/types/nutrition';
import { cn } from '@/lib/utils';
import { Check, Search as SearchIcon, X } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import commonFoods from '@/constants/common-foods.json';

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Food name must be at least 2 characters.' }),
  calories: z.coerce.number().min(0),
  protein_g: z.coerce.number().min(0),
  carbohydrates_total_g: z.coerce.number().min(0),
  fat_total_g: z.coerce.number().min(0),
  serving_size_g: z.coerce.number().min(0)
});

export function ManualFoodForm() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: '',
      calories: 0,
      protein_g: 0,
      carbohydrates_total_g: 0,
      fat_total_g: 0,
      serving_size_g: 100
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Adapt manual input to NutritionData interface
      const foodItem: NutritionData = {
        name: values.name,
        calories: values.calories,
        protein_g: values.protein_g,
        carbohydrates_total_g: values.carbohydrates_total_g,
        fat_total_g: values.fat_total_g,
        serving_size_g: values.serving_size_g,
        sugar_g: 0,
        fiber_g: 0,
        sodium_mg: 0,
        potassium_mg: 0,
        cholesterol_mg: 0,
        fat_saturated_g: 0
      };

      const result = await logFoodAction(foodItem);

      if (result.success) {
        toast.success(`Logged ${values.name} successfully!`);
        form.reset();
        setValue('');
        setSearchTerm('');
      } else {
        toast.error('Failed to log food');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      className='mx-auto max-w-2xl space-y-4'
    >
      <FormField
        control={form.control}
        name='name'
        render={({ field }) => (
          <FormItem className='flex flex-col'>
            <FormLabel>Food Name</FormLabel>
            <Command className='overflow-visible bg-transparent'>
              <div className='group border-input ring-offset-background focus-within:ring-ring bg-background rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2'>
                <div className='flex items-center gap-2'>
                  <SearchIcon className='text-muted-foreground h-4 w-4 shrink-0' />
                  <input
                    className='placeholder:text-muted-foreground flex-1 bg-transparent outline-none'
                    placeholder='Select food or type name...'
                    value={searchTerm}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSearchTerm(val);
                      setOpen(true);
                      form.setValue('name', val);
                      if (val === '') {
                        setValue('');
                      }
                    }}
                    onFocus={() => setOpen(true)}
                    onBlur={() => {
                      // Small delay to allow clicking items
                      setTimeout(() => setOpen(false), 200);
                    }}
                  />
                  {searchTerm ? (
                    <button
                      type='button'
                      className='ml-2 h-4 w-4 shrink-0 cursor-pointer opacity-50 hover:opacity-100'
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchTerm('');
                        form.setValue('name', '');
                        setValue('');
                      }}
                    >
                      <span className='sr-only'>Clear</span>
                      <X className='h-4 w-4' />
                    </button>
                  ) : null}
                </div>
              </div>
              <div className='relative'>
                {open && searchTerm && (
                  <div className='bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 absolute top-2 z-50 w-full rounded-md border shadow-md outline-none'>
                    <CommandList>
                      <CommandEmpty className='px-2 py-2'>
                        <div
                          className='hover:bg-accent hover:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent blur
                            form.setValue('name', searchTerm);
                            setValue(searchTerm);
                            setOpen(false);
                          }}
                        >
                          <Check className='mr-2 h-4 w-4 opacity-0' />
                          Use "{searchTerm}"
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {commonFoods
                          .filter((food) =>
                            food.label
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                          .map((food) => (
                            <CommandItem
                              key={food.value}
                              value={food.label}
                              onSelect={(currentValue) => {
                                setValue(currentValue);
                                setSearchTerm(food.label);
                                setOpen(false);

                                // Auto-fill form
                                form.setValue('name', food.label);
                                form.setValue('calories', food.calories);
                                form.setValue('protein_g', food.protein_g);
                                form.setValue(
                                  'carbohydrates_total_g',
                                  food.carbohydrates_total_g
                                );
                                form.setValue('fat_total_g', food.fat_total_g);
                                form.setValue(
                                  'serving_size_g',
                                  food.serving_size_g
                                );
                              }}
                              onMouseDown={(e) => e.preventDefault()} // Prevent blur
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  value === food.label
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {food.label}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </div>
                )}
              </div>
            </Command>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className='grid grid-cols-2 gap-4'>
        <FormField
          control={form.control}
          name='calories'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calories (kcal)</FormLabel>
              <FormControl>
                <Input type='number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='serving_size_g'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serving Size (g)</FormLabel>
              <FormControl>
                <Input type='number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='grid grid-cols-3 gap-4'>
        <FormField
          control={form.control}
          name='protein_g'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Protein (g)</FormLabel>
              <FormControl>
                <Input type='number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='carbohydrates_total_g'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carbs (g)</FormLabel>
              <FormControl>
                <Input type='number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='fat_total_g'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fat (g)</FormLabel>
              <FormControl>
                <Input type='number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Button type='submit' disabled={isLoading}>
        {isLoading ? 'Logging...' : 'Log Meal'}
      </Button>
    </Form>
  );
}
