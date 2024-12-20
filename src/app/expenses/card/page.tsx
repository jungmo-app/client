'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type CardCompany = {
  id: string;
  name: string;
  color: string;
};

const cardCompanies: CardCompany[] = [
  { id: 'kb', name: '국민카드', color: 'bg-yellow-500' },
  { id: 'samsung', name: '삼성카드', color: 'bg-blue-700' },
  { id: 'shinhan', name: '신한카드', color: 'bg-blue-500' },
  { id: 'hyundai', name: '현대카드', color: 'bg-gray-900' },
  { id: 'bc', name: 'BC카드', color: 'bg-red-500' },
  { id: 'woori', name: '우리카드', color: 'bg-blue-400' },
  { id: 'lotte', name: '롯데카드', color: 'bg-red-600' },
  { id: 'nonghyup', name: '농협카드', color: 'bg-yellow-600' },
  { id: 'citi', name: '씨티카드', color: 'bg-blue-800' },
  { id: 'hana', name: '하나카드', color: 'bg-teal-600' },
];

export default function CardSelectionPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/expenses">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-medium">새로운 구독 등록하기</h1>
          </div>
        </div>
      </div>
      <div className="px-4 pb-6 pt-8">
        <h2 className="text-lg font-semibold">어디서 결제 중인 구독을 등록할까요?</h2>
        <p className="mt-3 text-sm text-gray-500">카드를 선택하면 결제 내역을 확인할 수 있어요</p>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">카드</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {cardCompanies.map(company => (
            <Link key={company.id} href={`/expenses/card/terms?company=${company.id}`}>
              <Card className="flex h-24 flex-col items-center justify-center p-2 transition-colors hover:bg-gray-50">
                <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full ${company.color}`}>
                  <span className="text-xs font-medium text-white">{company.name[0]}</span>
                </div>
                <span className="text-center text-xs font-medium">{company.name}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
