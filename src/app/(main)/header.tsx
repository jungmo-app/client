'use client';

import { CalendarRange, ChevronLeft, ChevronRight, User } from 'lucide-react';
import Link from 'next/link';
import { useShallow } from 'zustand/react/shallow';
import NotificationButton from '@/components/notificationButton';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { useDateStore } from '@/store/appointmentStore';

export default function Header() {
  const { date, setDate } = useDateStore(
    useShallow(state => ({
      date: state.date,
      setDate: state.setDate,
    }))
  );
  const handleClickPrevMonthButton = () => {
    setDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleClickNextMonthButton = () => {
    setDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };
  return (
    <header className="flex h-14 items-center justify-between bg-background p-4">
      <Link href="/account">
        <Button variant="ghost" size="icon" aria-label="계정 정보">
          <User className="h-5 w-5" />
        </Button>
      </Link>
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" aria-label="이전 달" onClick={handleClickPrevMonthButton}>
          <ChevronLeft />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex select-none items-center gap-2 text-nowrap" type="button" aria-label="날짜">
              <h1 className="text-xl font-semibold">
                {date.getFullYear()}. {(date.getMonth() + 1).toString().padStart(2, '0')}
              </h1>
              <CalendarRange className="h-5 w-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <div>test</div>
          </PopoverContent>
        </Popover>

        <Button size="icon" variant="ghost" aria-label="다음 달" onClick={handleClickNextMonthButton}>
          <ChevronRight />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <NotificationButton />
      </div>
    </header>
  );
}
