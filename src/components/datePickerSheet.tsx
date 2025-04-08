'use client';

import { useState } from 'react';
import { Button, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui';
import { cn } from '@/utils/styles';

interface DatePickerSheetProps {
  value?: Date;
  onSelect: (date: Date) => void;
  classNames?: string;
}

export default function DatePickerSheet({ value, onSelect, classNames }: DatePickerSheetProps) {
  const generateMonths = (startDate: Date, count: number) => {
    return Array.from({ length: count }, (_, i) => {
      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + i);
      return date;
    });
  };

  const generatePreviousMonths = (endDate: Date, count: number) => {
    return Array.from({ length: count }, (_, i) => {
      const date = new Date(endDate);
      date.setMonth(endDate.getMonth() - (count - i));
      return date;
    });
  };

  const [selectedDate, setSelectedDate] = useState<Date>(value ?? new Date());
  const [months, setMonths] = useState(() => {
    const currentDate = value ?? new Date();
    return generateMonths(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1), 3);
  });

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${weekDays[date.getDay()]}요일`;
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    // Load more months when scrolling down
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      const lastMonth = months[months.length - 1];
      const newMonths = generateMonths(new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1), 3);
      setMonths(prevMonths => [...prevMonths, ...newMonths]);
    }

    // Load previous months when scrolling up
    if (scrollTop <= clientHeight * 0.5) {
      const firstMonth = months[0];
      const newMonths = generatePreviousMonths(new Date(firstMonth.getFullYear(), firstMonth.getMonth(), 1), 3);
      setMonths(prevMonths => [...newMonths, ...prevMonths]);
      e.currentTarget.scrollTop += e.currentTarget.scrollHeight * 0.2; // Adjust scroll position
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', classNames)}
          aria-label="현재 날짜"
        >
          {formatDate(selectedDate)}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[600px]">
        <SheetHeader>
          <SheetTitle>날짜 선택</SheetTitle>
          <SheetDescription>날짜 선택 시트</SheetDescription>
        </SheetHeader>
        <div className="mt-4 h-full overflow-auto" onScroll={handleScroll}>
          <div key={months[0].toISOString()}>
            {months.map((month, index) => (
              <div key={index} className="mb-8 px-4">
                <h2 className="mb-4 text-2xl font-semibold">
                  {month.getFullYear()}년 {month.getMonth() + 1}월
                </h2>
                <div className="mb-2 grid grid-cols-7">
                  {weekDays.map(day => (
                    <div key={day} className="text-center text-sm text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {getDaysInMonth(month).map((date, i) => (
                    <div key={i} className="aspect-square">
                      {date && (
                        <button
                          type="button"
                          aria-label={`${month}월 ${i}일`}
                          className={cn(
                            'flex h-full w-full select-none items-center justify-center rounded-full text-sm',
                            date.getDate() === selectedDate.getDate() &&
                              date.getMonth() === selectedDate.getMonth() &&
                              date.getFullYear() === selectedDate.getFullYear()
                              ? 'bg-black text-white'
                              : 'hover:bg-gray-100'
                          )}
                          onClick={() => {
                            setSelectedDate(date);
                            onSelect(date);
                          }}
                        >
                          {date.getDate()}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
