'use client';

import { useState } from 'react';
import { Button, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui';
import { cn } from '@/utils/styles';

interface TimePickerSheetProps {
  value?: string;
  onSelect: (time: { hours: number; minutes: number }) => void;
  classNames?: string;
}

export default function TimePickerSheet({ value, onSelect, classNames }: TimePickerSheetProps) {
  const [selectedHour, setSelectedHour] = useState(value ? Number(value.split(':')[0]) : new Date().getHours());
  const [selectedMinute, setSelectedMinute] = useState(value ? Number(value.split(':')[1]) : new Date().getMinutes());

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
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
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="scrollbar-hide h-[200px] w-[80px] snap-y snap-mandatory overflow-auto">
            {hours.map(hour => (
              <div
                key={hour}
                className={`flex h-[40px] snap-center items-center justify-center ${selectedHour === hour ? 'text-lg font-bold text-blue-500' : 'text-gray-600'}`}
                onClick={() => {
                  setSelectedHour(hour);
                  onSelect({ hours: hour, minutes: selectedMinute });
                }}
              >
                {hour.toString().padStart(2, '0')}
              </div>
            ))}
          </div>
          <div className="text-2xl font-bold">:</div>
          <div className="scrollbar-hide h-[200px] w-[80px] snap-y snap-mandatory overflow-auto">
            {minutes.map(minute => (
              <div
                key={minute}
                className={`flex h-[40px] snap-center items-center justify-center ${selectedMinute === minute ? 'text-lg font-bold text-blue-500' : 'text-gray-600'}`}
                onClick={() => {
                  setSelectedMinute(minute);
                  onSelect({ hours: selectedHour, minutes: minute });
                }}
              >
                {minute.toString().padStart(2, '0')}
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
