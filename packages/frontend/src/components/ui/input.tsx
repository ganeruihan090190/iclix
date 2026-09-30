import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-md bg-card px-3 py-2 text-sm text-white placeholder:text-text-muted border border-border focus:border-white focus:outline-none transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-primary focus:border-primary',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-primary">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
