'use client';

import { useCallback, useState } from 'react';
import { useInfiniteScrollDown } from '@/hooks/useInfiniteScrollDown';
import { useInfiniteScrollUp } from '@/hooks/useInfiniteScrollUp';
import { getNextMonthDateList, getPrevMonthDateList } from '@/utils/date';
import CalendarContent from './calendarContent';

interface ContentProps {
  value: Date;
  onSelect: (date: Date) => void;
}

export default function DatePickerContent({ value, onSelect }: ContentProps) {
  const [dateList, setDateList] = useState<Date[]>([value]);

  const handleTopIntersect = useCallback(() => {
    setDateList(prev => [...getPrevMonthDateList(prev[0], 5), ...prev]);
  }, []);

  const handleDownIntersect = useCallback(() => {
    setDateList(prev => [...prev, ...getNextMonthDateList(prev[prev.length - 1], 5)]);
  }, []);

  const { containerRef, targetRef: topRef } = useInfiniteScrollUp<HTMLDivElement, HTMLDivElement>({
    onIntersect: handleTopIntersect,
  });

  const { targetRef: bottomRef } = useInfiniteScrollDown<HTMLDivElement>({ onIntersect: handleDownIntersect });

  return (
    <div className="flex h-full flex-col gap-12 overflow-auto pb-2" ref={containerRef}>
      <div className="h-1 w-full" ref={topRef} />
      {dateList.map(d => (
        <CalendarContent
          key={`${d.getFullYear()}.${d.getMonth() + 1}`}
          date={d}
          currentDate={value}
          onSelect={onSelect}
        />
      ))}
      <div className="h-10 w-full" ref={bottomRef} />
    </div>
  );
}
