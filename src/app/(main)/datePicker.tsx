'use client';

import { useState } from 'react';
import MonthPicker from './monthPicker';
import YearPicker from './yearPicker';

export default function DatePicker() {
  const [type, setType] = useState<'month' | 'year'>('month');
  const [transition, setTransition] = useState<'month' | 'year'>('month');
  const [date, setDate] = useState(new Date());

  const handleClickDayButton = (date: Date) => {
    setDate(date);
  };

  const handleClickYearButton = (year: Date) => {
    setDate(year);
    setTransition('month');
  };

  const handleClickHeader = () => {
    setTransition('year');
  };

  const handleTransitionEnd = () => {
    setType(transition);
  };

  return (
    <div className="flex size-full flex-col overflow-hidden">
      {type === 'month' ? (
        <MonthPicker
          startYear={1925}
          endYear={2125}
          type={type}
          transition={transition}
          value={date}
          onTransitionEnd={handleTransitionEnd}
          onClickDay={handleClickDayButton}
          onClickYear={handleClickHeader}
        />
      ) : (
        <YearPicker
          startYear={1925}
          endYear={2125}
          value={date}
          type={type}
          transition={transition}
          onTransitionEnd={handleTransitionEnd}
          onClickYear={handleClickYearButton}
        />
      )}
    </div>
  );
}
