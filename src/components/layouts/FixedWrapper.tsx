import { StrictPropsWithChildren } from '@/types/common';
import { cn } from '@/utils/styles';

type FixedWrapperProps = StrictPropsWithChildren<{
  className?: string;
  position?: 'top' | 'bottom';
}>;

const FixedWrapper = ({ children, className, position = 'top' }: FixedWrapperProps) => {
  return (
    <div
      className={cn(
        'fixed left-1/2 w-full max-w-mobile -translate-x-1/2 bg-background',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
    >
      {children}
    </div>
  );
};

export default FixedWrapper;
