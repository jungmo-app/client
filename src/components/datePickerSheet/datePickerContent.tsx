'use client';

import { useCallback, useState } from 'react';
import Calendar from '@/components/calendar';
import { useInfiniteScrollDown } from '@/hooks/useInfiniteScrollDown';
import { useInfiniteScrollUp } from '@/hooks/useInfiniteScrollUp';
import { getNextMonthDateList, getPrevMonthDateList } from '@/utils/date';

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

  const handleSelect = (date: Date) => {
    onSelect(date);
  };

  return (
    <div className="flex h-full flex-col gap-12 overflow-auto pb-2" ref={containerRef}>
      <div className="h-1 w-full" ref={topRef} />
      {dateList.map(d => (
        <div key={`${d.getFullYear()}.${d.getMonth() + 1}`} className="flex flex-col gap-5 text-lg font-semibold">
          <p className="ml-4 text-xl">{`${d.getFullYear()}년 ${d.getMonth() + 1}월`}</p>
          <div className="h-80">
            <Calendar showAdjacentDays date={d} selectedDate={value} onSelect={handleSelect} />
          </div>
        </div>
      ))}
      <div className="h-10 w-full" ref={bottomRef} />
    </div>
  );
}
