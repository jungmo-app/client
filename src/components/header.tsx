'use client';

import { HTMLAttributes } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { cn } from '@/utils/styles';

interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  title?: string;
  onClose?: () => void;
  className?: string;
  routeUrl?: string;
}
export default function Header({ title, className, children, onClose, routeUrl, ...props }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onClose) {
      onClose();
    }
    if (routeUrl) {
      router.push(routeUrl);
      return;
    }
  };

  return (
    <header className={cn('sticky top-0 z-10 bg-background', className)} {...props}>
      <div className="flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" aria-label="뒤로 가기" onClick={handleBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-medium">{title}</h1>
        </div>
        {children}
      </div>
    </header>
  );
}
