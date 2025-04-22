'use client';

import { useShallow } from 'zustand/react/shallow';
import { Calendar } from '@/components';
import { useDateStore } from '@/store/appointmentStore';
import { isSameDay } from '@/utils/date';

export default function AppointmentCalendar() {
  const { date, setDate } = useDateStore(
    useShallow(state => ({
      date: state.date,
      setDate: state.setDate,
    }))
  );

  const handleClickDay = (value: Date) => {
    if (isSameDay(date, value)) {
      return;
    }
    setDate(value);
  };

  return (
    <Calendar
      showAdjacentDays
      selected
      date={date}
      selectedDate={date}
      className="my-3 h-[240px] w-[500px] max-w-full gap-3 px-3"
      onSelect={handleClickDay}
    />
  );
}
