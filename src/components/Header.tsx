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
}

export default function Header({ title, className, children, onClose, ...props }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onClose) {
      onClose();
      return;
    }
    router.back();
  };

  return (
    <header className={cn('z-10 bg-white fixed-mobile-top', className)} {...props}>
      <div className="flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={handleBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-medium">{title}</h1>
        </div>
        {children}
      </div>
    </header>
  );
}
