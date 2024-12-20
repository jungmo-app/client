'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DatePicker } from '@/components/date-picker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

type CardTransaction = {
  id: number;
  date: string;
  time: string;
  merchant: string;
  amount: number;
  category: string;
};

type DateRange = {
  startDate: Date;
  endDate: Date;
};

// 임시 데이터
const mockTransactions: CardTransaction[] = [
  {
    id: 1,
    date: '2024-03-20',
    time: '12:30',
    merchant: '스타벅스 강남점',
    amount: 4800,
    category: '식비',
  },
  {
    id: 2,
    date: '2024-03-20',
    time: '14:20',
    merchant: '교보문고',
    amount: 15800,
    category: '쇼핑',
  },
  {
    id: 3,
    date: '2024-03-19',
    time: '18:45',
    merchant: '이마트24 삼성점',
    amount: 8900,
    category: '식비',
  },
  {
    id: 4,
    date: '2024-03-19',
    time: '18:45',
    merchant: '이마트24 삼성점',
    amount: 8900,
    category: '식비',
  },
  {
    id: 5,
    date: '2024-03-19',
    time: '18:45',
    merchant: 'Gmarket',
    amount: 8900,
    category: '식비',
  },
  {
    id: 6,
    date: '2024-03-19',
    time: '18:45',
    merchant: '스타벅스 강남점',
    amount: 4800,
    category: '식비',
  },
  {
    id: 7,
    date: '2024-03-19',
    time: '18:45',
    merchant: '스타벅스 강남점',
    amount: 4800,
    category: '식비',
  },
];

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('ko-KR').format(amount);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);
  return { startDate, endDate };
};

const groupTransactionsByDate = (transactions: CardTransaction[]) => {
  return transactions.reduce(
    (acc, transaction) => {
      const date = transaction.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    },
    {} as Record<string, CardTransaction[]>
  );
};

export default function CardTransactions() {
  const { id } = useParams();
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const groupedTransactions = groupTransactionsByDate(mockTransactions);

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setDateRange(prev => ({ ...prev, startDate: date }));
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      setDateRange(prev => ({ ...prev, endDate: date }));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/expenses/card">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-medium">카드 내역</h1>
          </div>
        </div>
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium leading-none">조회 기간</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="start-date" className="text-xs text-gray-500">
                시작일
              </label>
              <DatePicker date={dateRange.startDate} className="w-full" onSelect={handleStartDateSelect} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="end-date" className="text-xs text-gray-500">
                종료일
              </label>
              <DatePicker date={dateRange.endDate} className="w-full" onSelect={handleEndDateSelect} />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {Object.entries(groupedTransactions).map(([date, transactions]) => (
          <div key={date} className="mb-6">
            <h2 className="mb-2 text-sm font-medium text-gray-500">{date}</h2>
            <Card className="overflow-hidden bg-[#F7F7F7]">
              {transactions.map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between border-b border-gray-200 p-4 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox id={`transaction-${transaction.id}`} />
                    <div>
                      <p className="font-medium">{transaction.merchant}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.time} • {transaction.category}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">{formatAmount(transaction.amount)}원</p>
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>

      <div className="border-t bg-white p-4 fixed-mobile-bottom">
        <Button asChild className="w-full" size="lg">
          <Link href="/expenses">선택한 내역 추가하기</Link>
        </Button>
      </div>
    </div>
  );
}
