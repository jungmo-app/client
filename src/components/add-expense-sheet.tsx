'use client';

import { CreditCard, PenLine, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function AddExpenseSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg" size="icon">
          <Plus className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader className="pb-6">
          <SheetTitle>등록을 어떻게 할건가요?</SheetTitle>
          <SheetDescription>카드 내역에서 손쉽게 추가할 수 있어요</SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-4">
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
