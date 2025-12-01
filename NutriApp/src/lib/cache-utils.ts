import { unstable_cache } from 'next/cache';

/**
 * Wraps a function with Next.js unstable_cache for data caching.
 * @param fetcher The data fetching function to cache.
 * @param keyParts An array of strings to uniquely identify the cache entry.
 * @param options Options for revalidation (e.g., tags, revalidate time).
 */
export function cacheData<T, Args extends any[]>(
  fetcher: (...args: Args) => Promise<T>,
  keyParts: string[],
  options: { tags?: string[]; revalidate?: number } = {}
) {
  return unstable_cache(
    async (...args: Args) => {
      return await fetcher(...args);
    },
    keyParts,
    options
  );
}
