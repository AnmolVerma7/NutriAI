'use client';

import { useEffect } from 'react';

export function AddToHistory({ id }: { id: number }) {
  useEffect(() => {
    if (!id) return;

    const stored = localStorage.getItem('recent_recipes');
    let recent: number[] = stored ? JSON.parse(stored) : [];

    // Remove if exists (to move to top)
    recent = recent.filter((r) => r !== id);

    // Add to front
    recent.unshift(id);

    // Limit to 5
    if (recent.length > 5) {
      recent = recent.slice(0, 5);
    }

    localStorage.setItem('recent_recipes', JSON.stringify(recent));
  }, [id]);

  return null;
}
