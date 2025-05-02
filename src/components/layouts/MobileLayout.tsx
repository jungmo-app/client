import { StrictPropsWithChildren } from '@/types/common';
import { cn } from '@/utils/styles';

type MobileLayoutProps = StrictPropsWithChildren<{
  className?: string;
}>;

const MobileLayout = ({ children, className }: MobileLayoutProps) => {
  return (
    <div
      id="mobile-root"
      className="relative mx-auto flex h-screen max-w-mobile flex-col overflow-hidden bg-background"
    >
      <div className={cn('h-full w-full overflow-auto', className)}>{children}</div>
    </div>
  );
};

export default MobileLayout;
