'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title?: string;
  onClose?: () => void;
}

export default function Header({ title, onClose }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onClose) {
      onClose();
      return;
    }
    router.back();
  };

  return (
    <header className="z-10 bg-white">
      <div className="flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={handleBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-medium">{title ?? '장소 추가하기'}</h1>
        </div>
      </div>
    </header>
  );
}
