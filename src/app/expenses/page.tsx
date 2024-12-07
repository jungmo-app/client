'use client';

import { useState } from 'react';
import { BookmarkIcon, ChevronLeft, MoreHorizontal, MoreVertical, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AddExpenseSheet } from '@/components/add-expense-sheet';
import TotalAmountSummary from '@/components/TotalAmountSummary';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { categories, mockExpenses } from '@/mocks/expenses';

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('ko-KR').format(amount);
};

const groupExpensesByDate = (expenses: typeof mockExpenses) => {
  return expenses.reduce(
    (acc, expense) => {
      if (!acc[expense.date]) {
        acc[expense.date] = [];
      }
      acc[expense.date].push(expense);
      return acc;
    },
    {} as Record<string, typeof mockExpenses>
  );
};

export default function ExpensesList() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredExpenses =
    selectedCategory === 'all' ? mockExpenses : mockExpenses.filter(expense => expense.category === selectedCategory);

  const groupedExpenses = groupExpensesByDate(filteredExpenses);

  const totalAmount = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 border-b bg-white pb-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">가계부</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <BookmarkIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="px-4 py-3">
          <TotalAmountSummary totalAmount={totalAmount} size="lg" />
        </div>

        <ScrollArea className="w-full whitespace-nowrap px-4">
          <div className="flex space-x-2 pb-4">
            {categories.map(category => (
              <button
                key={category.id}
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-[#F7F7F7] text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <category.icon className="mr-1.5 h-4 w-4" />
                {category.label}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="px-4 pb-20 pt-8">
        {Object.entries(groupedExpenses).map(([date, expenses]) => (
          <div key={date} className="mb-6">
            <h2 className="mb-2 text-sm font-medium text-gray-500">{date}</h2>
            <Card className="bg-[#F7F7F7]">
              {expenses.map(expense => {
                const Icon = categories.find(c => c.id === expense.category)?.icon || MoreHorizontal;

                return (
                  <Link
                    key={expense.id}
                    href={`/expenses/${expense.id}`}
                    className="block [&+&]:border-t [&+&]:border-gray-100"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 p-4 last:border-b-0">
                      <div className="flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-white">
                          <Icon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-gray-500">{expense.category}</p>
                        </div>
                      </div>
                      <p className="font-medium">{formatAmount(expense.amount)}원</p>
                    </div>
                  </Link>
                );
              })}
            </Card>
          </div>
        ))}
      </div>
      <AddExpenseSheet />
    </div>
  );
}
