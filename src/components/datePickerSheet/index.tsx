'use client';

import { useState } from 'react';
import { Button, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui';
import { formattedDateKr } from '@/utils/date';
import { cn } from '@/utils/styles';
import DatePickerContent from './datePickerContent';

interface DatePickerSheetProps {
  value?: Date;
  onSelect: (date: Date) => void;
  classNames?: string;
}

export default function DatePickerSheet({ value, onSelect, classNames }: DatePickerSheetProps) {
  const [currentDate, setCurrentDate] = useState(value ?? new Date());
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelectDay = (date: Date) => {
    setCurrentDate(date);
    onSelect(date);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', classNames)}
          aria-label="현재 날짜"
        >
          {formattedDateKr(currentDate)}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[600px]">
        <SheetHeader>
          <SheetTitle>날짜 선택</SheetTitle>
          <SheetDescription>날짜 선택 시트</SheetDescription>
        </SheetHeader>
        <DatePickerContent value={currentDate} onSelect={handleSelectDay} />
      </SheetContent>
    </Sheet>
  );
}
