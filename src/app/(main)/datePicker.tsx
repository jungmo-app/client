'use client';

import { useCallback, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useDateStore } from '@/store/appointmentStore';
import MonthPicker from './monthPicker';
import YearPicker from './yearPicker';

interface DatePickerProps {
  onClickMonth?: () => void;
  startYear: number;
  endYear: number;
}

export default function DatePicker({ startYear, endYear, onClickMonth }: DatePickerProps) {
  const [type, setType] = useState<'month' | 'year'>('month');
  const [transition, setTransition] = useState<'month' | 'year'>('month');
  const { date, setDate } = useDateStore(
    useShallow(state => ({
      date: state.date,
      setDate: state.setDate,
    }))
  );

  const [currentDate, setCurrentDate] = useState(date);

  const handleClickMonthButton = useCallback(
    (updateDate: Date) => {
      setCurrentDate(updateDate);
      setDate(updateDate);
      onClickMonth?.();
    },
    [onClickMonth, setDate]
  );

  const handleClickYearButton = useCallback((year: Date) => {
    setCurrentDate(year);
    setTransition('month');
  }, []);

  const handleClickHeader = useCallback(() => {
    setTransition('year');
  }, []);

  const handleTransitionEnd = useCallback(() => {
    setType(transition);
  }, [transition]);

  return (
    <div className="flex size-full flex-col overflow-hidden">
      {type === 'month' ? (
        <MonthPicker
          startYear={startYear}
          endYear={endYear}
          type={type}
          transition={transition}
          value={currentDate}
          onTransitionEnd={handleTransitionEnd}
          onClickMonth={handleClickMonthButton}
          onClickYear={handleClickHeader}
        />
      ) : (
        <YearPicker
          startYear={startYear}
          endYear={endYear}
          value={currentDate}
          type={type}
          transition={transition}
          onTransitionEnd={handleTransitionEnd}
          onClickYear={handleClickYearButton}
        />
      )}
    </div>
  );
}
