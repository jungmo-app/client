'use client';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDateStore } from '@/store/appointmentStore';
import { isSameMonth } from '@/utils/date';

interface MonthPickerProps {
  startYear: number;
  endYear: number;
  value: Date;
  type: 'month' | 'year';
  transition: 'month' | 'year';
  onTransitionEnd: () => void;
  onClickMonth: (date: Date) => void;
  onClickYear: () => void;
}

const MonthRow = memo(
  ({
    year,
    currentYear,
    selectedDate,
    onClick,
    setRef,
  }: {
    year: number;
    currentYear: number;
    selectedDate: Date;
    onClick: (year: number, month: number) => void;
    setRef: (el: HTMLButtonElement | null) => void;
  }) => (
    <div key={year}>
      <div className="grid grid-cols-4">
        {Array.from({ length: 12 }, (_, month) => {
          const isSelected = isSameMonth(selectedDate, new Date(year, month));
          return (
            <button
              key={month}
              data-year={year}
              ref={month === 0 ? setRef : undefined}
              className={`flex aspect-square items-center justify-center rounded-full py-3 text-center hover:bg-gray-100 dark:hover:bg-gray-500 ${
                isSelected ? 'bg-sky-200 hover:bg-sky-100 dark:bg-sky-600 dark:hover:bg-sky-500' : ''
              } ${year !== currentYear ? 'opacity-50' : 'opacity-100'} hover:opacity-100`}
              onClick={() => onClick(year, month)}
            >
              {month + 1}
            </button>
          );
        })}
      </div>
    </div>
  )
);

export default function MonthPicker({
  startYear,
  endYear,
  value,
  type,
  transition,
  onTransitionEnd,
  onClickMonth,
  onClickYear,
}: MonthPickerProps) {
  const years = useMemo(
    () => Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
    [startYear, endYear]
  );

  const yearArr = useMemo(() => Array.from({ length: endYear - startYear + 1 }, () => null), [startYear, endYear]);
  const date = useDateStore(state => state.date);

  const yearRef = useRef<(HTMLButtonElement | null)[]>(yearArr);
  const isYearView = useRef<Map<number, boolean>>(new Map());

  const [currentYear, setCurrentYear] = useState<number>(value.getFullYear());

  const handleClickDayButton = useCallback(
    (year: number, month: number) => {
      onClickMonth(new Date(year, month));
    },
    [onClickMonth]
  );

  const handleSetRef = useCallback((el: HTMLButtonElement | null, index: number) => {
    yearRef.current[index] = el;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          isYearView.current.set(Number(entry.target.getAttribute('data-year')), entry.isIntersecting);
        });
        const visibleYear = Array.from(isYearView.current.entries())
          .filter(([, visible]) => visible)
          .sort((a, b) => a[0] - b[0]);

        const year = visibleYear[0]?.[0];
        if (year) {
          setCurrentYear(year);
        }
      },
      {
        threshold: 0.01,
      }
    );

    yearRef.current.forEach(el => {
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const index = value.getFullYear() - startYear;
    const el = yearRef.current[index];

    if (el) {
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [startYear, value]);

  return (
    <>
      <button
        className="bg-background py-2 text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-500"
        onClick={onClickYear}
      >
        {currentYear}년
      </button>
      <div
        className={`scrollbar-hide relative mb-2 flex-1 space-y-2 overflow-auto px-4 py-2 transition-all duration-200 ease-in-out ${transition === 'year' && type === 'month' ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}
        onTransitionEnd={() => {
          if (transition === 'year' && type === 'month') {
            onTransitionEnd();
          }
        }}
      >
        {years.map((year, index) => (
          <MonthRow
            key={year}
            year={year}
            currentYear={currentYear}
            selectedDate={date}
            setRef={el => handleSetRef(el, index)}
            onClick={handleClickDayButton}
          />
        ))}
      </div>
    </>
  );
}

MonthRow.displayName = 'MonthRow';
