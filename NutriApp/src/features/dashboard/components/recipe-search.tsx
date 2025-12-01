'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, X } from 'lucide-react';
import { searchRecipesAction, getRecipesByIdsAction } from '@/features/dashboard/actions/recipes';
import { RecipeSearchResult, RecipeInformation } from '@/lib/spoonacular';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function RecipeSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<RecipeSearchResult[]>([]);
  const [recentRecipes, setRecentRecipes] = useState<RecipeInformation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Load recent recipes on mount
  useEffect(() => {
    const loadRecent = async () => {
      const stored = localStorage.getItem('recent_recipes');
      if (stored) {
        const ids: number[] = JSON.parse(stored);
        if (ids.length > 0) {
          const result = await getRecipesByIdsAction(ids);
          if (result.success && result.data) {
            setRecentRecipes(result.data);
          }
        }
      }
    };
    loadRecent();
  }, []);

  // Perform search when the URL query parameter changes or on initial load if present
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    } else {
      setResults([]);
      setHasSearched(false);
    }
  }, [searchParams]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const result = await searchRecipesAction(searchTerm);
      if (result.success && result.data) {
        setResults(result.data);
      } else {
        toast.error(result.error || 'Failed to fetch recipes');
      }
    } catch (error) {
      toast.error('An error occurred while searching');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Update URL with search query
    const params = new URLSearchParams(searchParams);
    params.set('q', query);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const removeRecent = (e: React.MouseEvent, id: number) => {
    e.preventDefault(); // Prevent link click
    e.stopPropagation();
    
    const updated = recentRecipes.filter(r => r.id !== id);
    setRecentRecipes(updated);
    
    const stored = localStorage.getItem('recent_recipes');
    if (stored) {
      const ids: number[] = JSON.parse(stored);
      const newIds = ids.filter(i => i !== id);
      localStorage.setItem('recent_recipes', JSON.stringify(newIds));
    }
  };

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col items-center space-y-4">
        <form onSubmit={handleSearch} className="flex w-full max-w-4xl flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="text"
            placeholder="Search recipes (e.g., pasta, chicken, vegetarian)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Search
          </Button>
        </form>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && !hasSearched && recentRecipes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">Recently Viewed</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 max-w-7xl mx-auto">
            {recentRecipes.map((recipe) => (
              <Card key={recipe.id} className="group overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border-muted/60 flex flex-col relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 z-10 h-6 w-6 bg-background/80 hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                  onClick={(e) => removeRecent(e, recipe.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="line-clamp-1 text-lg text-center">{recipe.title}</CardTitle>
                </CardHeader>
                <CardFooter className="p-4 pt-0 mt-auto">
                  <Link href={`/dashboard/recipes/${recipe.id}`} className="w-full">
                    <Button variant="secondary" className="w-full hover:bg-primary hover:text-primary-foreground transition-colors">
                      View Recipe
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!isLoading && hasSearched && results.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No recipes found. Try a different search term.
        </div>
      )}

      {!isLoading && hasSearched && results.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 max-w-7xl mx-auto">
          {results.map((recipe) => (
            <Card key={recipe.id} className="group overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border-muted/60 flex flex-col">
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="line-clamp-1 text-lg text-center">{recipe.title}</CardTitle>
              </CardHeader>
              <CardFooter className="p-4 pt-0 mt-auto">
                <Link href={`/dashboard/recipes/${recipe.id}`} className="w-full">
                  <Button variant="secondary" className="w-full hover:bg-primary hover:text-primary-foreground transition-colors">
                    View Recipe
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
