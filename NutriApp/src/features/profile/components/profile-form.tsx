'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ProfileFormProps {
  onComplete?: () => void;
  isOnboarding?: boolean;
}

export function ProfileForm({
  onComplete,
  isOnboarding = false
}: ProfileFormProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');

  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    height: '', // Stored as cm
    weight: '', // Stored as kg
    goal_weight: '', // Stored as kg
    activity_level: 'moderate',
    dietary_restrictions: [] as string[],
    daily_calorie_goal: '',
    daily_protein_goal: '',
    daily_carbs_goal: '',
    daily_fats_goal: ''
  });

  // Display values (converted)
  const [displayHeight, setDisplayHeight] = useState('');
  const [displayHeightFt, setDisplayHeightFt] = useState('');
  const [displayHeightIn, setDisplayHeightIn] = useState('');
  const [displayWeight, setDisplayWeight] = useState('');
  const [displayGoalWeight, setDisplayGoalWeight] = useState('');

  const dietaryOptions = [
    { id: 'vegan', label: 'Vegan' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'keto', label: 'Keto' },
    { id: 'gluten-free', label: 'Gluten Free' },
    { id: 'dairy-free', label: 'Dairy Free' },
    { id: 'nut-free', label: 'Nut Free' }
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setFormData({
          age: data.age || '',
          gender: data.gender || 'male',
          height: data.height || '',
          weight: data.weight || '',
          goal_weight: data.goal_weight || '',
          activity_level: data.activity_level || 'moderate',
          dietary_restrictions: Array.isArray(data.dietary_restrictions)
            ? data.dietary_restrictions
            : [],
          daily_calorie_goal: data.daily_calorie_goal || '',
          daily_protein_goal: data.daily_protein_goal || '',
          daily_carbs_goal: data.daily_carbs_goal || '',
          daily_fats_goal: data.daily_fats_goal || ''
        });

        // Set preferences
        if (data.preferred_height_unit)
          setHeightUnit(data.preferred_height_unit);
        if (data.preferred_weight_unit)
          setWeightUnit(data.preferred_weight_unit);

        // Initial display conversion
        updateDisplayValues(
          data.height,
          data.weight,
          data.goal_weight,
          data.preferred_height_unit,
          data.preferred_weight_unit
        );
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const updateDisplayValues = (
    h: number,
    w: number,
    gw: number,
    hUnit: string = 'cm',
    wUnit: string = 'kg'
  ) => {
    // Height
    if (h) {
      if (hUnit === 'ft') {
        const totalInches = h / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        setDisplayHeightFt(String(feet));
        setDisplayHeightIn(String(inches));
      } else {
        setDisplayHeight(String(h));
      }
    }

    // Weight
    if (w) {
      setDisplayWeight(
        wUnit === 'lbs' ? String(Math.round(w * 2.20462)) : String(w)
      );
    }
    if (gw) {
      setDisplayGoalWeight(
        wUnit === 'lbs' ? String(Math.round(gw * 2.20462)) : String(gw)
      );
    }
  };

  // Handle Unit Toggles
  const toggleHeightUnit = (val: string) => {
    if (!val) return;
    const newUnit = val as 'cm' | 'ft';
    setHeightUnit(newUnit);

    // Convert current display value to new unit for smooth UX
    const currentCm = Number(formData.height);
    if (currentCm) {
      updateDisplayValues(
        currentCm,
        Number(formData.weight),
        Number(formData.goal_weight),
        newUnit,
        weightUnit
      );
    }
  };

  const toggleWeightUnit = (val: string) => {
    if (!val) return;
    const newUnit = val as 'kg' | 'lbs';
    setWeightUnit(newUnit);

    // Convert current display values
    const currentKg = Number(formData.weight);
    const currentGoalKg = Number(formData.goal_weight);
    if (currentKg || currentGoalKg) {
      updateDisplayValues(
        Number(formData.height),
        currentKg,
        currentGoalKg,
        heightUnit,
        newUnit
      );
    }
  };

  // Handle Input Changes
  const handleHeightChange = (val: string) => {
    setDisplayHeight(val);
    setFormData((prev) => ({ ...prev, height: val })); // Already cm
  };

  const handleHeightFtChange = (ft: string, inch: string) => {
    setDisplayHeightFt(ft);
    setDisplayHeightIn(inch);
    const totalInches = Number(ft) * 12 + Number(inch);
    const cm = Math.round(totalInches * 2.54);
    setFormData((prev) => ({ ...prev, height: String(cm) }));
  };

  const handleWeightChange = (val: string) => {
    setDisplayWeight(val);
    const kg = weightUnit === 'lbs' ? Math.round(Number(val) / 2.20462) : val;
    setFormData((prev) => ({ ...prev, weight: String(kg) }));
  };

  const handleGoalWeightChange = (val: string) => {
    setDisplayGoalWeight(val);
    const kg = weightUnit === 'lbs' ? Math.round(Number(val) / 2.20462) : val;
    setFormData((prev) => ({ ...prev, goal_weight: String(kg) }));
  };

  const handleDietaryChange = (id: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      dietary_restrictions: checked
        ? [...prev.dietary_restrictions, id]
        : prev.dietary_restrictions.filter((d) => d !== id)
    }));
  };

  const calculateMacros = () => {
    const weight = Number(formData.weight); // Always kg
    const height = Number(formData.height); // Always cm
    const age = Number(formData.age);

    if (!weight || !height || !age) {
      toast.error('Please enter weight, height, and age first.');
      return;
    }

    // BMR Calculation (Mifflin-St Jeor)
    // Male: 10W + 6.25H - 5A + 5
    // Female: 10W + 6.25H - 5A - 161
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr += formData.gender === 'female' ? -161 : 5;

    const multipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    const tdee = Math.round(
      bmr * (multipliers[formData.activity_level] || 1.2)
    );

    const goalWeight = Number(formData.goal_weight);
    let targetCalories = tdee;
    if (goalWeight < weight) targetCalories -= 500;
    if (goalWeight > weight) targetCalories += 500;

    const protein = Math.round((targetCalories * 0.3) / 4);
    const carbs = Math.round((targetCalories * 0.4) / 4);
    const fats = Math.round((targetCalories * 0.3) / 9);

    setFormData((prev) => ({
      ...prev,
      daily_calorie_goal: String(targetCalories),
      daily_protein_goal: String(protein),
      daily_carbs_goal: String(carbs),
      daily_fats_goal: String(fats)
    }));

    toast.success('Macros calculated based on your stats!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const { error } = await supabase
        .from('profiles')
        .update({
          age: Number(formData.age) || null,
          gender: formData.gender,
          height: Number(formData.height) || null,
          weight: Number(formData.weight) || null,
          goal_weight: Number(formData.goal_weight) || null,
          activity_level: formData.activity_level,
          dietary_restrictions: formData.dietary_restrictions,
          daily_calorie_goal: Number(formData.daily_calorie_goal) || null,
          daily_protein_goal: Number(formData.daily_protein_goal) || null,
          daily_carbs_goal: Number(formData.daily_carbs_goal) || null,
          daily_fats_goal: Number(formData.daily_fats_goal) || null,
          preferred_height_unit: heightUnit,
          preferred_weight_unit: weightUnit
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
      if (onComplete) onComplete();
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Age & Gender */}
        <div className='space-y-2'>
          <Label>Age</Label>
          <Input
            type='number'
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            placeholder='25'
          />
        </div>
        <div className='space-y-2'>
          <Label>Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(val) => setFormData({ ...formData, gender: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='male'>Male</SelectItem>
              <SelectItem value='female'>Female</SelectItem>
              <SelectItem value='other'>Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Height & Activity */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label>Height</Label>
            <ToggleGroup
              type='single'
              value={heightUnit}
              onValueChange={toggleHeightUnit}
              size='sm'
              className='h-6'
            >
              <ToggleGroupItem
                value='cm'
                aria-label='Toggle cm'
                className='h-6 px-2 text-xs'
              >
                cm
              </ToggleGroupItem>
              <ToggleGroupItem
                value='ft'
                aria-label='Toggle ft'
                className='h-6 px-2 text-xs'
              >
                ft
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {heightUnit === 'cm' ? (
            <Input
              type='number'
              value={displayHeight}
              onChange={(e) => handleHeightChange(e.target.value)}
              placeholder='175'
            />
          ) : (
            <div className='flex gap-2'>
              <div className='relative flex-1'>
                <Input
                  type='number'
                  value={displayHeightFt}
                  onChange={(e) =>
                    handleHeightFtChange(e.target.value, displayHeightIn)
                  }
                  placeholder='5'
                />
                <span className='text-muted-foreground absolute top-2.5 right-3 text-sm'>
                  ft
                </span>
              </div>
              <div className='relative flex-1'>
                <Input
                  type='number'
                  value={displayHeightIn}
                  onChange={(e) =>
                    handleHeightFtChange(displayHeightFt, e.target.value)
                  }
                  placeholder='9'
                />
                <span className='text-muted-foreground absolute top-2.5 right-3 text-sm'>
                  in
                </span>
              </div>
            </div>
          )}
        </div>

        <div className='space-y-2'>
          <Label>Activity Level</Label>
          <Select
            value={formData.activity_level}
            onValueChange={(val) =>
              setFormData({ ...formData, activity_level: val })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='sedentary'>Sedentary (Office job)</SelectItem>
              <SelectItem value='light'>
                Lightly Active (1-3 days/week)
              </SelectItem>
              <SelectItem value='moderate'>
                Moderately Active (3-5 days/week)
              </SelectItem>
              <SelectItem value='active'>Active (6-7 days/week)</SelectItem>
              <SelectItem value='very_active'>
                Very Active (Physical job)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weights */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label>Current Weight</Label>
            <ToggleGroup
              type='single'
              value={weightUnit}
              onValueChange={toggleWeightUnit}
              size='sm'
              className='h-6'
            >
              <ToggleGroupItem
                value='kg'
                aria-label='Toggle kg'
                className='h-6 px-2 text-xs'
              >
                kg
              </ToggleGroupItem>
              <ToggleGroupItem
                value='lbs'
                aria-label='Toggle lbs'
                className='h-6 px-2 text-xs'
              >
                lbs
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className='relative'>
            <Input
              type='number'
              value={displayWeight}
              onChange={(e) => handleWeightChange(e.target.value)}
              placeholder={weightUnit === 'kg' ? '70' : '154'}
            />
            <span className='text-muted-foreground absolute top-2.5 right-3 text-sm'>
              {weightUnit}
            </span>
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label>Goal Weight</Label>
            <span className='text-muted-foreground text-xs'>
              ({weightUnit})
            </span>
          </div>
          <div className='relative'>
            <Input
              type='number'
              value={displayGoalWeight}
              onChange={(e) => handleGoalWeightChange(e.target.value)}
              placeholder={weightUnit === 'kg' ? '65' : '143'}
            />
            <span className='text-muted-foreground absolute top-2.5 right-3 text-sm'>
              {weightUnit}
            </span>
          </div>
        </div>
      </div>

      <div className='space-y-3'>
        <Label>Dietary Restrictions</Label>
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
          {dietaryOptions.map((option) => (
            <div
              key={option.id}
              className='hover:bg-muted/50 flex cursor-pointer items-center space-x-2 rounded-md border p-3 transition-colors'
              onClick={() =>
                handleDietaryChange(
                  option.id,
                  !formData.dietary_restrictions.includes(option.id)
                )
              }
            >
              <Checkbox
                id={option.id}
                checked={formData.dietary_restrictions.includes(option.id)}
                onCheckedChange={(checked) =>
                  handleDietaryChange(option.id, checked as boolean)
                }
              />
              <Label htmlFor={option.id} className='flex-1 cursor-pointer'>
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className='space-y-4 border-t pt-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-medium'>Daily Goals</h3>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={calculateMacros}
          >
            Auto-Calculate ✨
          </Button>
        </div>

        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <div className='space-y-2'>
            <Label>Calories</Label>
            <Input
              type='number'
              value={formData.daily_calorie_goal}
              onChange={(e) =>
                setFormData({ ...formData, daily_calorie_goal: e.target.value })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label>Protein (g)</Label>
            <Input
              type='number'
              value={formData.daily_protein_goal}
              onChange={(e) =>
                setFormData({ ...formData, daily_protein_goal: e.target.value })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label>Carbs (g)</Label>
            <Input
              type='number'
              value={formData.daily_carbs_goal}
              onChange={(e) =>
                setFormData({ ...formData, daily_carbs_goal: e.target.value })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label>Fats (g)</Label>
            <Input
              type='number'
              value={formData.daily_fats_goal}
              onChange={(e) =>
                setFormData({ ...formData, daily_fats_goal: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <Button type='submit' className='w-full' disabled={saving}>
        {saving && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        {isOnboarding ? 'Complete Setup' : 'Save Changes'}
      </Button>
    </form>
  );
}
