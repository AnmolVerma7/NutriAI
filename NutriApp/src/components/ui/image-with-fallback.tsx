'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallbackClassName?: string;
  iconClassName?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackClassName,
  iconClassName,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={cn(
          'bg-muted flex h-full w-full items-center justify-center rounded-md',
          className,
          fallbackClassName
        )}
      >
        <ChefHat
          className={cn('text-muted-foreground/50 h-8 w-8', iconClassName)}
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
