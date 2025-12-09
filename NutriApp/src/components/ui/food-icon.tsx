import {
  Drumstick, // Chicken, Turkey
  Beef, // Beef, Steak, Burger
  Fish, // Fish, Seafood, Salmon, Tuna
  Egg, // Egg
  Milk, // Milk, Yogurt, Dairy, Cheese
  Wheat, // Bread, Pasta, Rice, Grains, Oats
  Carrot, // Carrot, Veggies
  Apple, // Apple, Fruit
  Banana, // Banana
  Cherry, // Berries
  Coffee, // Coffee
  CupSoda, // Coke, Soda
  Sandwich, // Sandwich, Burger
  Pizza, // Pizza
  IceCream, // Dessert, Sweets
  Utensils, // Default
  LucideIcon,
  Leaf, // Salad, Spinach
  Bean, // Beans, Tofu
  Croissant, // Pastries
  Grape, // Grapes
  Wine, // Alcohol
  Beer, // Beer
  GlassWater, // Water
  Cake, // Cake
  Cookie, // Cookie
  Citrus, // Orange, Lemon
  Nut // Nuts
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FoodIconProps {
  name: string;
  className?: string;
}

export function FoodIcon({ name, className }: FoodIconProps) {
  const lowerName = name.toLowerCase();

  let Icon: LucideIcon = Utensils;

  // Proteins
  if (
    lowerName.includes('chicken') ||
    lowerName.includes('turkey') ||
    lowerName.includes('duck')
  ) {
    Icon = Drumstick;
  } else if (
    lowerName.includes('beef') ||
    lowerName.includes('steak') ||
    lowerName.includes('pork') ||
    lowerName.includes('meat')
  ) {
    Icon = Beef;
  } else if (
    lowerName.includes('fish') ||
    lowerName.includes('salmon') ||
    lowerName.includes('tuna') ||
    lowerName.includes('shrimp') ||
    lowerName.includes('seafood')
  ) {
    Icon = Fish;
  } else if (lowerName.includes('egg')) {
    Icon = Egg;
  } else if (
    lowerName.includes('tofu') ||
    lowerName.includes('bean') ||
    lowerName.includes('soy')
  ) {
    Icon = Bean;
  }

  // Dairy
  else if (
    lowerName.includes('milk') ||
    lowerName.includes('yogurt') ||
    lowerName.includes('cheese') ||
    lowerName.includes('dairy') ||
    lowerName.includes('butter')
  ) {
    Icon = Milk;
  }

  // Carbs/Grains
  else if (
    lowerName.includes('rice') ||
    lowerName.includes('pasta') ||
    lowerName.includes('bread') ||
    lowerName.includes('oat') ||
    lowerName.includes('wheat') ||
    lowerName.includes('grain') ||
    lowerName.includes('cereal') ||
    lowerName.includes('toast') ||
    lowerName.includes('spaghetti') ||
    lowerName.includes('quinoa')
  ) {
    Icon = Wheat;
  } else if (
    lowerName.includes('croissant') ||
    lowerName.includes('pastry') ||
    lowerName.includes('bagel')
  ) {
    Icon = Croissant;
  }

  // Fruits
  else if (lowerName.includes('apple')) {
    Icon = Apple;
  } else if (lowerName.includes('banana')) {
    Icon = Banana;
  } else if (
    lowerName.includes('berry') ||
    lowerName.includes('strawberry') ||
    lowerName.includes('blueberry')
  ) {
    Icon = Cherry;
  } else if (lowerName.includes('grape')) {
    Icon = Grape;
  } else if (
    lowerName.includes('orange') ||
    lowerName.includes('lemon') ||
    lowerName.includes('lime') ||
    lowerName.includes('citrus')
  ) {
    Icon = Citrus;
  }

  // Veggies
  else if (
    lowerName.includes('carrot') ||
    lowerName.includes('veg') ||
    lowerName.includes('broccoli') ||
    lowerName.includes('cucumber')
  ) {
    Icon = Carrot;
  } else if (
    lowerName.includes('salad') ||
    lowerName.includes('spinach') ||
    lowerName.includes('lettuce') ||
    lowerName.includes('kale') ||
    lowerName.includes('green')
  ) {
    Icon = Leaf;
  }

  // Meals/Junk
  else if (lowerName.includes('sandwich') || lowerName.includes('burger')) {
    Icon = Sandwich;
  } else if (lowerName.includes('pizza')) {
    Icon = Pizza;
  } else if (lowerName.includes('ice cream')) {
    Icon = IceCream;
  } else if (lowerName.includes('cake') || lowerName.includes('muffin')) {
    Icon = Cake;
  } else if (lowerName.includes('cookie') || lowerName.includes('biscuit')) {
    Icon = Cookie;
  } else if (
    lowerName.includes('nut') ||
    lowerName.includes('almond') ||
    lowerName.includes('peanut')
  ) {
    Icon = Nut;
  }

  // Drinks
  else if (
    lowerName.includes('coffee') ||
    lowerName.includes('espresso') ||
    lowerName.includes('latte')
  ) {
    Icon = Coffee;
  } else if (
    lowerName.includes('coke') ||
    lowerName.includes('soda') ||
    lowerName.includes('cola') ||
    lowerName.includes('pepsi') ||
    lowerName.includes('drink') ||
    lowerName.includes('juice')
  ) {
    Icon = CupSoda;
  } else if (lowerName.includes('wine')) {
    Icon = Wine;
  } else if (lowerName.includes('beer')) {
    Icon = Beer;
  } else if (lowerName.includes('water')) {
    Icon = GlassWater;
  }

  return <Icon className={cn('text-muted-foreground', className)} />;
}
