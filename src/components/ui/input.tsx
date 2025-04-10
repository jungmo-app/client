import * as React from 'react';
import { cn } from '@/utils/styles';

interface InputProps {
  error?: boolean;
  clearError?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'> & InputProps>(
  ({ className, type, error, clearError, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base outline-none ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-gray-600 dark:bg-[#020916]',
          error ? 'border-red-500' : 'border-black',
          props.readOnly && 'select-none',
          className
        )}
        onFocus={e => {
          props.onFocus && props.onFocus(e);
          clearError && clearError();
        }}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
