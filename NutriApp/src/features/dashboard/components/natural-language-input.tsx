'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  parseFoodLogAction,
  logFoodAction
} from '@/features/dashboard/actions';
import { toast } from 'sonner';
import { Loader2, Plus, Sparkles, Check } from 'lucide-react';
import { NutritionData } from '@/types/nutrition';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export function NaturalLanguageInput() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [parsedItems, setParsedItems] = useState<NutritionData[]>([]);

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await parseFoodLogAction(input);
      if (result.success && result.data) {
        setParsedItems(result.data);
        toast.success(`Found ${result.data.length} items!`);
      } else {
        toast.error('Could not understand that. Try again?');
      }
    } catch (error) {
      toast.error('AI service unavailable');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const [loggedIndices, setLoggedIndices] = useState<Set<number>>(new Set());

  const handleLogItem = async (item: NutritionData, index: number) => {
    if (loggedIndices.has(index)) return;

    try {
      const result = await logFoodAction(item);
      if (result.success) {
        toast.success(`Logged ${item.name}`);
        setLoggedIndices((prev) => new Set(prev).add(index));
        router.refresh();
      } else {
        toast.error('Failed to log item');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <div className='relative'>
          <Textarea
            placeholder='e.g., I had 2 scrambled eggs, a slice of toast, and a black coffee for breakfast...'
            className='min-h-[120px] resize-none pr-12 text-base'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleAnalyze();
              }
            }}
          />
          <div className='absolute right-3 bottom-3'>
            <Button
              size='icon'
              disabled={!input.trim() || isAnalyzing}
              onClick={handleAnalyze}
              className='h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700'
            >
              {isAnalyzing ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Sparkles className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>
        <p className='text-muted-foreground text-xs'>
          Tip: Press{' '}
          <kbd className='bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none'>
            Ctrl + Enter
          </kbd>{' '}
          to analyze
        </p>
      </div>

      {parsedItems.length > 0 && (
        <div className='animate-in fade-in slide-in-from-bottom-4 space-y-4 duration-500'>
          <div className='flex items-center justify-between'>
            <h3 className='text-muted-foreground text-sm font-medium'>
              Detected Items
            </h3>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            {parsedItems.map((item, idx) => {
              const isLogged = loggedIndices.has(idx);
              return (
                <div
                  key={idx}
                  className='bg-card flex flex-col justify-between rounded-xl border p-4 shadow-sm transition-all hover:shadow-md'
                >
                  <div className='space-y-3'>
                    <div className='flex items-start justify-between gap-2'>
                      <div>
                        <h4 className='leading-none font-semibold tracking-tight'>
                          {item.name}
                        </h4>
                        <p className='text-muted-foreground mt-1 text-sm'>
                          {item.serving_unit
                            ? `${item.serving_unit} (${item.serving_size_g}g)`
                            : `${item.serving_size_g}g serving`}
                        </p>
                      </div>
                      <span className='bg-secondary text-secondary-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold'>
                        {item.calories} kcal
                      </span>
                    </div>

                    <div className='bg-muted/50 grid grid-cols-3 gap-2 rounded-lg p-2'>
                      <div className='text-center'>
                        <span className='text-muted-foreground block text-[10px] font-bold uppercase'>
                          Protein
                        </span>
                        <span className='text-sm font-medium'>
                          {item.protein_g}g
                        </span>
                      </div>
                      <div className='border-border/50 border-l text-center'>
                        <span className='text-muted-foreground block text-[10px] font-bold uppercase'>
                          Carbs
                        </span>
                        <span className='text-sm font-medium'>
                          {item.carbohydrates_total_g}g
                        </span>
                      </div>
                      <div className='border-border/50 border-l text-center'>
                        <span className='text-muted-foreground block text-[10px] font-bold uppercase'>
                          Fat
                        </span>
                        <span className='text-sm font-medium'>
                          {item.fat_total_g}g
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size='sm'
                    variant={isLogged ? 'ghost' : 'default'}
                    className={`mt-4 w-full ${isLogged ? 'text-green-600 hover:bg-green-50 hover:text-green-700' : ''}`}
                    onClick={() => handleLogItem(item, idx)}
                    disabled={isLogged}
                  >
                    {isLogged ? (
                      <>
                        <span className='mr-2'>
                          <Check className='h-4 w-4' />
                        </span>
                        Logged
                      </>
                    ) : (
                      <>
                        <Plus className='mr-2 h-3 w-3' />
                        Log Item
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
