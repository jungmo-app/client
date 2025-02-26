'use client';

import { useState } from 'react';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { CalendarRange, ChevronLeft, ChevronRight, Menu, PlusCircle, Search, User } from 'lucide-react';
import Link from 'next/link';
import Calendar from '@/components/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent } from '@/components/ui/popover';
import AppointmentList from './appointmetList';

export default function Main() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const handleClickDay = (date: Date) => {
    setCurrentDate(date);
  };

  const handleClickPrevMonthButton = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleClickNextMonthButton = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const APPOINTMENT_DATA = [
    {
      id: 1,
      title: '프로젝트 오프라인 회의',
      datetime: '2024.11.27 13:00',
      description: '와이어프레임 완성하기',
      image: 'https://picsum.photos/id/517/200/200',
      totalAmount: 100000,
      location: {
        name: '이마트 용산점',
        address: '서울 용산구 한강대로23길 55',
      },
    },
    {
      id: 2,
      title: '프로젝트 오프라인 회의2',
      datetime: '2024.11.27 13:00',
      description: '와이어프레임 완성하기',
      image: 'https://picsum.photos/id/513/200/200',
      totalAmount: 100000,
      location: {
        name: '이마트 용산점',
        address: '서울 용산구 한강대로23길 55',
      },
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="flex h-14 items-center justify-between p-4">
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
                  {currentDate.getFullYear()}. {(currentDate.getMonth() + 1).toString().padStart(2, '0')}
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
      </div>

      <Calendar
        showAdjacentDays
        date={currentDate}
        className="my-3 h-[240px] w-[500px] gap-5 px-3"
        onSelect={handleClickDay}
      />

      <div className="space-y-6 p-4">
        <h2 className="text-lg font-semibold">나의 일정 {APPOINTMENT_DATA.length}</h2>

        <Button asChild variant="outline" className="h-auto w-full justify-start gap-2 py-4">
          <Link href="/appointment/create">
            <PlusCircle className="h-5 w-5 text-blue-500" />
            <span className="text-muted-foreground">새로운 일정을 추가해보세요</span>
          </Link>
        </Button>
      </div>
      <AppointmentList />

      {/* <div className="fixed-mobile-bottom-right">
        <Button size="icon" className="block h-14 w-14 rounded-full shadow-lg fixed-mobile-bottom-right-button">
          <PlusCircle className="h-6 w-6" />
        </Button>
      </div> */}
    </main>
  );
}
