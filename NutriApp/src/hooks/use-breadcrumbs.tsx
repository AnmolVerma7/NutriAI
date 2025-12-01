'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    
    // Get the last segment to show only the current page
    const lastSegment = segments[segments.length - 1];
    
    if (!lastSegment) return [];

    let title = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    
    // Custom title mappings
    if (lastSegment === 'dashboard') title = 'Dashboard'; // Should rarely happen if redirect works
    if (lastSegment === 'overview') title = 'Dashboard';
    if (lastSegment === 'log-meal') title = 'Log Meal';

    return [{
      title,
      link: pathname // Link to current page (or could be '#')
    }];
  }, [pathname]);

  return breadcrumbs;
}
