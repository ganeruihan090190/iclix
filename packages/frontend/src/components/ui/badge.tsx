import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'rating' | 'featured';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-card text-white border border-border',
    outline: 'border border-text-muted text-text-secondary bg-transparent',
    rating: 'border border-text-muted text-white bg-black/40 font-bold px-1.5 py-0.5 text-xs tracking-wider',
    featured: 'bg-primary text-white font-bold text-xs px-2 py-0.5 uppercase tracking-wide',
  };

  return (
    <div
      className={cn('inline-flex items-center rounded text-xs font-medium px-2 py-0.5', variants[variant], className)}
      {...props}
    />
  );
}
