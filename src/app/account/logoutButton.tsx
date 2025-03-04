'use client';

import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';

export default function LogoutButton() {
  return (
    <Button
      variant="ghost"
      className="flex w-full justify-between px-0 text-red-500 hover:bg-transparent hover:text-red-400"
    >
      <span>로그아웃</span>
      <ChevronRight className="h-5 w-5" />
    </Button>
  );
}
