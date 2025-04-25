'use client';

import { useEffect, useRef, useState } from 'react';
import Calendar from '@/components/calendar';
import { getNextMonthDateList, getPrevMonthDateList } from '@/utils/date';

interface ContentProps {
  value: Date;
  onSelect: (date: Date) => void;
}

export default function DatePickerContent({ value, onSelect }: ContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [dateList, setDateList] = useState<Date[]>([value]);

  const handleSelect = (date: Date) => {
    onSelect(date);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && containerRef.current) {
          const prevScrollHeight = containerRef.current.scrollHeight;
          setDateList(prev => [...getPrevMonthDateList(prev[0], 5), ...prev]);

          requestAnimationFrame(() => {
            if (!containerRef.current) {
              return;
            }
            const newScrollHeight = containerRef.current.scrollHeight;
            const heightDiff = newScrollHeight - prevScrollHeight;
            containerRef.current.scrollTop += heightDiff;
          });
        }
      });
    });
    if (topRef.current) {
      observer.observe(topRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setDateList(prev => [...prev, ...getNextMonthDateList(prev[prev.length - 1], 5)]);
        }
      });
    });

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

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
