'use client';

import { useState } from 'react';
import { Camera, Car, Home, MoreHorizontal, Plane, ShoppingBag, Utensils } from 'lucide-react';
import Link from 'next/link';
import { DatePickerSheet } from '@/components/date-picker-sheet';
import { TimePickerSheet } from '@/components/time-picker-sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categories = [
  { id: 'accommodation', icon: Home, label: '숙소' },
  { id: 'flight', icon: Plane, label: '항공' },
  { id: 'transport', icon: Car, label: '교통' },
  { id: 'tourism', icon: Camera, label: '관광' },
  { id: 'food', icon: Utensils, label: '식비' },
  { id: 'shopping', icon: ShoppingBag, label: '쇼핑' },
  { id: 'other', icon: MoreHorizontal, label: '기타' },
];

export default function ExpenseForm() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div className="min-h-screen">
      <div className="flex h-14 items-center justify-between border-b bg-white px-4">
        <div className="flex items-center gap-2">
          <Link href="/expenses">
            <Button variant="ghost" size="icon">
              ✕
            </Button>
          </Link>
          <h1 className="text-lg font-medium">비용 추가</h1>
        </div>
        <Button variant="ghost">⋯</Button>
      </div>

      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <Label>카테고리</Label>
          <div className="grid grid-cols-5 gap-2">
            {categories.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                className={`flex flex-col items-center rounded-xl p-2 text-xs transition-colors ${selectedCategory === id ? 'bg-blue-50 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setSelectedCategory(id)}
              >
                <Icon className="mb-1 h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <Card className="rounded-2xl border-0 bg-[#F7F7F7] p-4">
          <div className="space-y-4">
            <div>
              <Label>통화</Label>
              <Select defaultValue="KRW">
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KRW">KRW(원)</SelectItem>
                  <SelectItem value="USD">USD($)</SelectItem>
                  <SelectItem value="EUR">EUR(€)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>금액</Label>
              <Input type="number" placeholder="금액을 입력해주세요" className="bg-white" />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-0 bg-[#F7F7F7] p-4">
          <div className="space-y-4">
            <div>
              <Label>날짜</Label>
              <DatePickerSheet onSelect={date => console.log(date)} />
            </div>
            <div className="mt-4">
              <Label>시간</Label>
              <TimePickerSheet onSelect={time => console.log(time)} />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-0 bg-[#F7F7F7] p-4">
          <div className="space-y-4">
            <div>
              <Label>결제수단</Label>
              <Input placeholder="현금" className="bg-white" />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-0 bg-[#F7F7F7] p-4">
          <div className="space-y-4">
            <div>
              <Label>내용</Label>
              <Input placeholder="내용을 입력해주세요" className="bg-white" />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-0 bg-[#F7F7F7] p-4">
          <div className="space-y-4">
            <div>
              <Label>장소 (선택)</Label>
              <Input placeholder="장소를 검색하세요" className="bg-white" />
            </div>
          </div>
        </Card>
      </div>
      <div className="sticky bottom-0 left-0 right-0 border-t bg-white p-4">
        <Button className="w-full" size="lg">
          추가하기
        </Button>
      </div>
    </div>
  );
}
