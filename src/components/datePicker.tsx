'use client';

import * as React from 'react';
import dayjs from 'dayjs';
import { Calendar as CalendarIcon } from 'lucide-react';
import Calendar from '@/components/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/styles';

type DatePickerProps = {
  date?: Date;
  onSelect: (date: Date) => void;
  className?: string;
};

export function DatePicker({ date, onSelect, className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date) => {
    onSelect(date);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground', className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? dayjs(date).format('YYYY년 MM월 DD일') : '날짜를 선택하세요'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar date={date ?? new Date()} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}
