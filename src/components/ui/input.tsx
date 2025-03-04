import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/utils/styles';
import { useFormField } from './form';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    const { error, name } = useFormField();
    const { clearErrors } = useFormContext();

    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base outline-none ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          error ? 'border-red-500' : 'border-black',
          className
        )}
        onFocus={e => {
          props.onFocus && props.onFocus(e);
          clearErrors(name);
        }}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
