'use client';

import { useState } from 'react';
import { RecipeInformation } from '@/lib/spoonacular';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutGrid, List, Clock, Users, Heart, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toggleFavoriteAction } from '@/features/dashboard/actions/recipes';
import { toast } from 'sonner';

interface FavoritesViewProps {
  initialData: RecipeInformation[];
}

export function FavoritesView({ initialData }: FavoritesViewProps) {
  const [recipes, setRecipes] = useState<RecipeInformation[]>(initialData);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const router = useRouter();

  const handleRemoveFavorite = async (e: React.MouseEvent, id: number) => {
    e.preventDefault(); // Prevent navigation if clicking the heart
    e.stopPropagation();
    
    try {
      const result = await toggleFavoriteAction(id, false);
      if (result.success) {
        setRecipes(prev => prev.filter(r => r.id !== id));
        toast.success('Removed from favorites');
        router.refresh();
      } else {
        toast.error('Failed to remove favorite');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4 text-center">
        <div className="bg-muted/50 p-6 rounded-full">
          <Heart className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">No favorites yet</h2>
        <p className="text-muted-foreground max-w-sm">
          Start exploring recipes and click the heart icon to save your favorites here.
        </p>
        <Button asChild>
          <Link href="/dashboard/recipes">Explore Recipes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Favorite Recipes</h2>
          <p className="text-muted-foreground">
            {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} saved
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-muted/50 p-1 rounded-lg border">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only">Grid View</span>
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List View</span>
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          {recipes.map((recipe) => (
            <Link key={recipe.id} href={`/dashboard/recipes/${recipe.id}`}>
              <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-muted/60 hover:-translate-y-1">
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 z-10">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/90 hover:bg-white text-red-500 shadow-sm"
                      onClick={(e) => handleRemoveFavorite(e, recipe.id)}
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="line-clamp-1 text-lg text-center group-hover:text-primary transition-colors">
                    {recipe.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{recipe.readyInMinutes}m</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      <span>{recipe.servings}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[80px]">Image</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Prep Time</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Servings</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {recipes.map((recipe) => (
                  <tr key={recipe.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">
                      <div className="relative h-10 w-16 overflow-hidden rounded-md">
                        <Image
                          src={recipe.image}
                          alt={recipe.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4 align-middle font-medium">
                      <Link href={`/dashboard/recipes/${recipe.id}`} className="hover:underline">
                        {recipe.title}
                      </Link>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {recipe.readyInMinutes}m
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {recipe.servings}
                      </div>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={(e) => handleRemoveFavorite(e, recipe.id)}
                        >
                          <Heart className="h-4 w-4 fill-current" />
                          <span className="sr-only">Remove</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/dashboard/recipes/${recipe.id}`}>
                            <ArrowRight className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
