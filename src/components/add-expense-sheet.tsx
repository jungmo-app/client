'use client';

import { CreditCard, PenLine, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function AddExpenseSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="fixed-mobile-bottom-right">
          <Button className="h-12 w-12 rounded-full shadow-lg fixed-mobile-bottom-right-button" size="icon">
            <Plus />
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader className="pb-6">
          <SheetTitle>지출 내역을 등록해볼까요?</SheetTitle>
          <SheetDescription>카드 내역에서 손쉽게 추가할 수 있어요</SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-1 gap-4">
          <Link href="/expenses/card">
            <Button variant="outline" className="w-full justify-start gap-2 rounded-2xl p-6 text-center">
              <CreditCard className="h-5 w-5" />
              카드 내역에서 추가하기
            </Button>
          </Link>
          <Link href="/expenses/manual">
            <Button variant="outline" className="w-full justify-start gap-2 rounded-2xl p-6 text-center">
              <PenLine className="h-5 w-5" />
              직접 등록하기
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
