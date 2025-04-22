'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { isSameDay } from '@/utils/date';
import { cn } from '@/utils/styles';

interface CalendarProps {
  date: Date;
  selectedDate?: Date;
  fontSize?: number;
  showAdjacentDays?: boolean;
  selected?: boolean;
  onSelect?: (day: Date) => void;
  className?: string;
}

const DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export default function Calendar({
  date,
  selectedDate,
  fontSize,
  showAdjacentDays = false,
  onSelect,
  selected,
  className,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0);

  const prevMonthLastDate = new Date(year, month, 0).getDate();
  const totalDays = firstDay + lastDay.getDate();
  const nextMonthDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);

  const isToday = (dayNum: number) => {
    const date = new Date();
    return date.getDate() === dayNum && year === date.getFullYear() && month === date.getMonth();
  };

  const handleClickDay = (value: number, targetMonth: number) => {
    if (!onSelect) {
      return;
    }
    onSelect(new Date(year, targetMonth, value));
  };

  useEffect(() => {
    const nextMidNight = new Date(currentDate);
    nextMidNight.setHours(24, 0, 0, 0);
    const timeDiff = nextMidNight.getTime() - currentDate.getTime();
    const timer = setTimeout(() => {
      setCurrentDate(new Date());
    }, timeDiff);

    return () => {
      clearTimeout(timer);
    };
  }, [currentDate]);

  return (
    <div className={cn('flex size-full min-w-32 flex-col gap-2', className)}>
      <div className="grid flex-shrink flex-grow grid-cols-7 gap-[calc(3%)]">
        {DAYS.map(dayName => (
          <div key={dayName} className="flex size-full items-center justify-center">
            <div
              className={`select-none text-center font-medium ${dayName === '토' ? 'text-blue-500' : dayName === '일' ? 'text-red-500' : ''} border border-transparent`}
              style={{
                fontSize: fontSize ? `${fontSize}px` : 'calc(85%)',
                width: '100%',
                height: '100%',
                padding: '2%',
              }}
            >
              <div
                className="flex size-full items-center justify-center rounded-md"
                style={{ fontSize: fontSize ? `${fontSize}px` : 'calc(85%)' }}
              >
                {dayName}
              </div>
            </div>
          </div>
        ))}
        {Array(firstDay)
          .fill(null)
          .map((_, i) => {
            const prevDate = prevMonthLastDate - (firstDay - 1) + i;
            return showAdjacentDays ? (
              <div key={`prev-${prevDate}`} className="flex size-full items-center justify-center">
                <Button
                  variant="ghost"
                  aria-label="이전 달"
                  className={`border border-solid border-transparent font-normal ${i === 0 ? 'text-red-300' : 'text-gray-400'}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    padding: '2%',
                  }}
                  onClick={() => handleClickDay(prevDate, month - 1)}
                >
                  <div
                    className="flex size-full items-center justify-center rounded-md"
                    style={{ fontSize: fontSize ? `${fontSize}px` : 'calc(85%)' }}
                  >
                    {prevDate}
                  </div>
                </Button>
              </div>
            ) : (
              <div key={`empty-prev-${i}`} />
            );
          })}

        {Array.from({ length: lastDay.getDate() }, (_, i) => i + 1).map(num => (
          <div key={`day-${num}`} className="flex size-full items-center justify-center">
            <Button
              variant="ghost"
              className={`border border-solid font-normal ${selectedDate && isSameDay(new Date(year, month, num), selectedDate) ? 'border-gray-400' : 'border-transparent'} ${(firstDay + num) % 7 === 0 ? 'text-blue-500' : (firstDay + num) % 7 === 1 ? 'text-red-500' : ''}`}
              style={{ width: '100%', height: '100%', padding: '2%' }}
              aria-label={`${num}일`}
              onClick={() => handleClickDay(num, month)}
            >
              <div
                className={`flex size-full items-center justify-center ${isToday(num) && selected === true ? 'bg-black text-gray-100' : ''} rounded-md`}
                style={{ fontSize: fontSize ? `${fontSize}px` : 'calc(85%)' }}
              >
                {num}
              </div>
            </Button>
          </div>
        ))}

        {Array(nextMonthDays)
          .fill(null)
          .map((_, i) => {
            const nextDate = i + 1;
            return showAdjacentDays ? (
              <div key={`next-${nextDate}`} className="flex size-full items-center justify-center text-gray-400">
                <Button
                  variant="ghost"
                  className={`border border-solid border-transparent font-normal ${i === nextMonthDays - 1 ? 'text-blue-300' : 'text-gray-400'}`}
                  style={{ width: '100%', height: '100%', padding: '2%' }}
                  aria-label="다음 달"
                  onClick={() => handleClickDay(nextDate, month + 1)}
                >
                  <div
                    className="flex size-full items-center justify-center rounded-md"
                    style={{ fontSize: fontSize ? `${fontSize}px` : 'calc(85%)' }}
                  >
                    {nextDate}
                  </div>
                </Button>
              </div>
            ) : (
              <div key={`empty-next-${i}`} />
            );
          })}
      </div>
    </div>
  );
}
