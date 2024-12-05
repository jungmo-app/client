import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/utils/styles';

export type LoadingButtonProps = ButtonProps & {
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ className, isLoading, loadingText, icon, children, disabled, variant = 'default', ...props }, ref) => {
    return (
      <Button
        className={cn('gap-2', className)}
        disabled={isLoading || disabled}
        ref={ref}
        variant={variant}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{loadingText || 'loading...'}</span>
          </>
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';

export { LoadingButton };
