'use client'

import { useState } from 'react'
import { AddExpenseSheet } from "@/components/add-expense-sheet"
import { Card } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Home, Plane, Car, Camera, Utensils, ShoppingBag, MoreHorizontal, ChevronLeft, Share2, BookmarkIcon, MoreVertical, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

const categories = [
  { id: 'all', label: '전체', icon: MoreHorizontal },
  { id: 'accommodation', label: '숙소', icon: Home },
  { id: 'flight', label: '항공', icon: Plane },
  { id: 'transport', label: '교통', icon: Car },
  { id: 'tourism', label: '관광', icon: Camera },
  { id: 'food', label: '식비', icon: Utensils },
  { id: 'shopping', label: '쇼핑', icon: ShoppingBag },
]

const mockExpenses = [
  { id: 1, category: 'food', amount: 15000, date: '2023-12-07', description: '점심 식사', icon: Utensils },
  { id: 2, category: 'transport', amount: 5000, date: '2023-12-07', description: '택시', icon: Car },
  { id: 3, category: 'shopping', amount: 50000, date: '2023-12-06', description: '옷 구매', icon: ShoppingBag },
  { id: 4, category: 'accommodation', amount: 100000, date: '2023-12-05', description: '호텔', icon: Home },
  { id: 5, category: 'tourism', amount: 30000, date: '2023-12-05', description: '박물관 입장료', icon: Camera },
]

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('ko-KR').format(amount)
}

const groupExpensesByDate = (expenses: typeof mockExpenses) => {
  return expenses.reduce((acc, expense) => {
    if (!acc[expense.date]) {
      acc[expense.date] = []
    }
    acc[expense.date].push(expense)
    return acc
  }, {} as Record<string, typeof mockExpenses>)
}

export default function ExpensesList() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredExpenses = selectedCategory === 'all'
    ? mockExpenses
    : mockExpenses.filter(expense => expense.category === selectedCategory)

  const groupedExpenses = groupExpensesByDate(filteredExpenses)
  
  const totalAmount = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b z-10 pb-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8">
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
            <button className="w-full bg-[#F7F7F7] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">지출 총액</p>
                <p className="text-2xl font-semibold mt-1">{formatAmount(totalAmount)}원</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <ScrollArea className="w-full whitespace-nowrap px-4">
            <div className="flex space-x-2 pb-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-[#F7F7F7] text-gray-800 hover:bg-gray-200'
                    }`}
                >
                  <category.icon className="w-4 h-4 mr-1.5" />
                  {category.label}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
      <div className="max-w-md mx-auto px-4 pb-20 pt-8">
        {Object.entries(groupedExpenses).map(([date, expenses]) => (
          <div key={date} className="mb-6">
            <h2 className="text-sm font-medium text-gray-500 mb-2">{date}</h2>
            <Card className="bg-[#F7F7F7] border-0">
              {expenses.map((expense) => (
                <Link href={`/expenses/${expense.id}`} key={expense.id}>
                  <div className="p-4 flex items-center justify-between border-b border-gray-200 last:border-b-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                        <expense.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-gray-500">{expense.category}</p>
                      </div>
                    </div>
                    <p className="font-medium">{formatAmount(expense.amount)}원</p>
                  </div>
                </Link>
              ))}
            </Card>
          </div>
        ))}
      </div>
      <AddExpenseSheet />
    </div>
  )
}

