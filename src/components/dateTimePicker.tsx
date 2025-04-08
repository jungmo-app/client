'use client';

import { useState } from 'react';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';

export default function DateTimePicker({ onSelect }: { onSelect: (date: Date) => void }) {
  const [date, setDate] = useState(new Date());

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleSelect = (value: string, type: 'year' | 'month' | 'day' | 'hour' | 'minute') => {
    const newDate = new Date(date);
    switch (type) {
      case 'year':
        newDate.setFullYear(parseInt(value));
        break;
      case 'month':
        newDate.setMonth(parseInt(value));
        break;
      case 'day':
        newDate.setDate(parseInt(value));
        break;
      case 'hour':
        newDate.setHours(parseInt(value));
        break;
      case 'minute':
        newDate.setMinutes(parseInt(value));
        break;
    }
    setDate(newDate);
  };

  const handleConfirm = () => {
    onSelect(date);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
          aria-label={date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        >
          {date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>날짜 및 시간 선택</SheetTitle>
          <SheetDescription>시간 선택 시트</SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-5 gap-4 py-4">
          <Select defaultValue={date.getFullYear().toString()} onValueChange={value => handleSelect(value, 'year')}>
            <SelectTrigger>
              <SelectValue placeholder="년" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}년
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue={date.getMonth().toString()} onValueChange={value => handleSelect(value, 'month')}>
            <SelectTrigger>
              <SelectValue placeholder="월" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={month} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue={date.getDate().toString()} onValueChange={value => handleSelect(value, 'day')}>
            <SelectTrigger>
              <SelectValue placeholder="일" />
            </SelectTrigger>
            <SelectContent>
              {days.map(day => (
                <SelectItem key={day} value={day.toString()}>
                  {day}일
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue={date.getHours().toString()} onValueChange={value => handleSelect(value, 'hour')}>
            <SelectTrigger>
              <SelectValue placeholder="시" />
            </SelectTrigger>
            <SelectContent>
              {hours.map(hour => (
                <SelectItem key={hour} value={hour.toString()}>
                  {hour}시
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue={date.getMinutes().toString()} onValueChange={value => handleSelect(value, 'minute')}>
            <SelectTrigger>
              <SelectValue placeholder="분" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map(minute => (
                <SelectItem key={minute} value={minute.toString()}>
                  {minute}분
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full" aria-label="확인" onClick={handleConfirm}>
          확인
        </Button>
      </SheetContent>
    </Sheet>
  );
}
