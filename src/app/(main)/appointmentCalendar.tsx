'use client';

import { useContext } from 'react';
import { Calendar } from '@/components';
import { DateContext } from '@/contexts/DateProvider';

export default function AppointmentCalendar() {
  const { date, updateDate } = useContext(DateContext);

  const handleClickDay = (value: Date) => {
    updateDate(value);
  };

  return (
    <Calendar
      showAdjacentDays
      date={date}
      className="my-3 h-[240px] w-[500px] max-w-full gap-5 px-3"
      onSelect={handleClickDay}
    />
  );
}
