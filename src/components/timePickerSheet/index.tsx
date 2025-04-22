'use client';

import { useState } from 'react';
import { Button, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui';
import { cn } from '@/utils/styles';
import TimePickerContent from './timePickerContext';

interface TimePickerSheetProps {
  value?: string;
  onSelect: (time: { hours: number; minutes: number }) => void;
  classNames?: string;
}

export default function TimePickerSheet({ value, onSelect, classNames }: TimePickerSheetProps) {
  const [selectedHour, setSelectedHour] = useState(value ? Number(value.split(':')[0]) : new Date().getHours());
  const [selectedMinute, setSelectedMinute] = useState(value ? Number(value.split(':')[1]) : new Date().getMinutes());

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const handleClickHourButton = (hours: number) => {
    setSelectedHour(hours);
    onSelect({ hours, minutes: selectedMinute });
  };

  const handleClickMinuteButton = (minutes: number) => {
    setSelectedMinute(minutes);
    onSelect({ hours: selectedHour, minutes });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', classNames)}
          aria-label="시간 변경"
        >
          {formatTime(selectedHour, selectedMinute)}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[300px]">
        <SheetHeader>
          <SheetTitle className="text-center">시간 선택</SheetTitle>
          <SheetDescription>시간 선택 시트</SheetDescription>
        </SheetHeader>
        <TimePickerContent
          selectedHour={selectedHour}
          selectedMinute={selectedMinute}
          onSelectHour={handleClickHourButton}
          onSelectMinute={handleClickMinuteButton}
        />
      </SheetContent>
    </Sheet>
  );
}
