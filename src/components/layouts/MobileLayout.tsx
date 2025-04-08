import { StrictPropsWithChildren } from '@/types/common';
import { cn } from '@/utils/styles';

type MobileLayoutProps = StrictPropsWithChildren<{
  className?: string;
}>;

const MobileLayout = ({ children, className }: MobileLayoutProps) => {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-mobile flex-col bg-background">
      <div className={cn('h-full w-full', className)}>{children}</div>
    </div>
  );
};

export default MobileLayout;
