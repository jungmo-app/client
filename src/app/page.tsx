'use client';

import { useState } from 'react';
import { CalendarRange, Menu, PlusCircle, Search, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { APPOINTMENT_DATA } from '@/mocks/appointment';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const getMonthDays = (date: Date) => {
  return {
    firstDay: new Date(date.getFullYear(), date.getMonth(), 1),
    lastDay: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  };
};

const isToday = (day: number, currentMonth: Date) => {
  const today = new Date();
  return (
    day === today.getDate() &&
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear()
  );
};

export default function Main() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderCalendar = () => {
    const { firstDay, lastDay } = getMonthDays(currentMonth);
    const calendar = [];

    // Add empty cells for days before the first day of the month
    const emptyDays = Array(firstDay.getDay())
      .fill(null)
      .map((_, i) => <div key={`empty-${i}`} className="h-10" />);
    calendar.push(...emptyDays);

    // Add days of the month
    const monthDays = Array.from({ length: lastDay.getDate() }, (_, i) => i + 1).map(day => (
      <Button
        key={`day-${day}`}
        variant={isToday(day, currentMonth) ? 'default' : 'ghost'}
        className={`h-10 w-10 p-0 font-normal ${isToday(day, currentMonth) ? 'rounded-full' : ''}`}
      >
        {day}
      </Button>
    ));
    calendar.push(...monthDays);

    return <div className="grid grid-cols-7 gap-1">{calendar}</div>;
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="flex h-14 items-center justify-between p-4">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
        <div />
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">
            {currentMonth.getFullYear()}. {currentMonth.getMonth() + 1}
          </h1>
          <CalendarRange className="h-5 w-5" />
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
      </div>

      <div key="day-names" className="mb-2 mt-8 grid grid-cols-7 gap-1">
        {DAYS.map(day => (
          <div key={day} className="text-center text-sm font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="p-4">{renderCalendar()}</div>

      <div className="space-y-6 p-4">
        <h2 className="text-lg font-semibold">나의 일정 {APPOINTMENT_DATA.length}</h2>

        <Button asChild variant="outline" className="h-auto w-full justify-start gap-2 py-4">
          <Link href="/appointment/create">
            <PlusCircle className="h-5 w-5 text-blue-500" />
            <span className="text-muted-foreground">새로운 일정을 추가해보세요</span>
          </Link>
        </Button>

        <div className="space-y-4">
          {APPOINTMENT_DATA.map(trip => (
            <Link key={trip.id} href={`/appointment/${trip.id}`} className="flex items-center gap-4 p-2">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                <Image fill src={trip.image} alt={trip.title} className="object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{trip.title}</h4>
                <p className="text-sm text-muted-foreground">{trip.datetime}</p>
                <p className="text-sm text-muted-foreground">{trip.location.name}</p>
              </div>
              <Button variant="ghost" size="icon">
                <span className="sr-only">More options</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* <div className="fixed-mobile-bottom-right">
        <Button size="icon" className="block h-14 w-14 rounded-full shadow-lg fixed-mobile-bottom-right-button">
          <PlusCircle className="h-6 w-6" />
        </Button>
      </div> */}
    </main>
  );
}
