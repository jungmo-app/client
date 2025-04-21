'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

interface YearPickerProps {
  startYear: number;
  endYear: number;
  value: Date;
  type: 'month' | 'year';
  transition: 'month' | 'year';
  onTransitionEnd: () => void;
  onClickYear: (year: Date) => void;
}

export default function YearPicker({
  startYear,
  endYear,
  value,
  type,
  transition,
  onTransitionEnd,
  onClickYear,
}: YearPickerProps) {
  const years = useMemo(
    () => Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
    [startYear, endYear]
  );

  const decadeYears = useMemo(
    () => Array.from({ length: Math.floor(endYear / 10) - Math.floor(startYear / 10) }, () => null),
    [startYear, endYear]
  );

  const [currentDecade, setCurrentDecade] = useState<number>(Math.floor(value.getFullYear() / 10) * 10);

  const decadeStartYears = useRef<(HTMLButtonElement | null)[]>(decadeYears);
  const isDecadeView = useRef<Map<number, boolean>>(new Map());

  const handleClickYearButton = (year: number) => {
    onClickYear(new Date(year, 0));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          isDecadeView.current.set(Number(entry.target.getAttribute('data-year')), entry.isIntersecting);
        });
        const visibleDecades = Array.from(isDecadeView.current.entries())
          .filter(([, visible]) => visible)
          .sort((a, b) => a[0] - b[0]);

        const decade = visibleDecades[0]?.[0];
        if (decade) {
          setCurrentDecade(decade);
        }
      },
      {
        threshold: 0.01,
      }
    );

    decadeStartYears.current.forEach(el => {
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const index = Math.ceil((value.getFullYear() - Math.ceil(startYear / 10) * 10) / 10);
    const el = decadeStartYears.current[index];
    if (el) {
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [value, startYear]);

  return (
    <>
      <div className="top-0 z-10 cursor-default bg-background py-2 text-center text-lg font-semibold">
        {currentDecade} – {currentDecade + 9}
      </div>
      <div
        className={`scrollbar-hide grid grid-cols-4 gap-2 overflow-y-auto px-4 py-2 transition-all duration-200 ease-in-out ${transition === 'month' && type === 'year' ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}
        onTransitionEnd={() => {
          if (transition === 'month' && type === 'year') {
            onTransitionEnd();
          }
        }}
      >
        {years.map(year => (
          <button
            key={year}
            data-year={year % 10 === 0 ? year : undefined}
            className={`aspect-square w-full rounded-full text-center hover:bg-gray-100 dark:hover:bg-gray-500 ${year >= currentDecade && year <= currentDecade + 9 ? 'opacity-100' : 'opacity-50'} hover:opacity-100`}
            ref={el => {
              if (year % 10 === 0) {
                decadeStartYears.current[Math.ceil((year - startYear) / 10)] = el;
              }
            }}
            onClick={() => handleClickYearButton(year)}
          >
            {year}
          </button>
        ))}
      </div>
    </>
  );
}
