'use client';

import { useContext } from 'react';
import { CalendarRange, ChevronLeft, ChevronRight, Menu, Search, User } from 'lucide-react';
import Link from 'next/link';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { DateContext } from '@/contexts/DateProvider';

export default function Header() {
  const { date, updateDate } = useContext(DateContext);
  const handleClickPrevMonthButton = () => {
    updateDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleClickNextMonthButton = () => {
    updateDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };
  return (
    <header className="flex h-14 items-center justify-between p-4">
      <Button variant="ghost" size="icon">
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" onClick={handleClickPrevMonthButton}>
          <ChevronLeft />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2">
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

        <Button size="icon" variant="ghost" onClick={handleClickNextMonthButton}>
          <ChevronRight />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
        <Link href="/account">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
