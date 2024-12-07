'use client';

import { useState } from 'react';
import { ChevronLeft, MoreHorizontal, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import MemoSheet from '@/components/memo/MemoSheet';
import { Button } from '@/components/ui/button';
import { categories, mockExpenses } from '@/mocks/expenses';

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('ko-KR').format(amount);
};

export default function ExpenseDetail() {
  const router = useRouter();
  const { id } = useParams();
  const expense = mockExpenses.find(e => e.id === parseInt(id[0]));
  const [memo, setMemo] = useState(expense?.memo || '');

  if (!expense) {
    return <div>Expense not found</div>;
  }

  const Icon = categories.find(c => c.id === expense.category)?.icon || MoreHorizontal;

  const handleDelete = () => {
    console.log('Deleting expense:', expense.id);
    router.push('/expenses');
  };

  const handleMemoSave = (newMemo: string) => {
    setMemo(newMemo);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/expenses">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-medium">상세 지출 내역</h1>
          </div>
          <Button variant="ghost" className="text-primary">
            수정
          </Button>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-semibold">{expense.description}</div>
          <div className="text-blue-600">
            <Pencil className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between py-4">
            <span className="text-gray-600">지출 금액</span>
            <span className="font-medium">{formatAmount(expense.amount)}원</span>
          </div>

          <div className="flex justify-between py-4">
            <span className="text-gray-600">지출일</span>
            <span className="font-medium">{expense.date}</span>
          </div>

          <div className="flex justify-between py-4">
            <span className="text-gray-600">지출 수단</span>
            <span className="font-medium">{expense.method}</span>
          </div>

          <div className="flex justify-between py-4">
            <span className="text-gray-600">카테고리</span>
            <div className="flex items-center">
              <span className="font-medium">{expense.category}</span>
              <ChevronLeft className="h-5 w-5 rotate-180" />
            </div>
          </div>

          <div className="space-y-2">
            <MemoSheet initialMemo={memo} onSave={handleMemoSave} />
          </div>
        </div>

        <div className="mt-6">
          <Button className="w-full" variant="outline" size="lg" onClick={handleDelete}>
            삭제하기
          </Button>
        </div>
      </div>
    </div>
  );
}
