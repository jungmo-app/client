'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ChevronLeft, Pencil, Trash, Home, Plane, Car, Camera, Utensils, ShoppingBag, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

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

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'food': return Utensils
    case 'transport': return Car
    case 'shopping': return ShoppingBag
    case 'accommodation': return Home
    case 'tourism': return Camera
    default: return MoreHorizontal
  }
}

export default function ExpenseDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isDeleteSheetOpen, setIsDeleteSheetOpen] = useState(false)
  const expense = mockExpenses.find(e => e.id === parseInt(params.id))

  if (!expense) {
    return <div>Expense not found</div>
  }

  const Icon = getCategoryIcon(expense.category)

  const handleDelete = () => {
    // Implement delete logic here
    console.log('Deleting expense:', expense.id)
    setIsDeleteSheetOpen(false)
    router.push('/expenses')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link href="/expenses">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-medium">지출 상세</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="bg-[#F7F7F7] border-0 p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4">
              <Icon className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{expense.description}</h2>
              <p className="text-sm text-gray-500">{expense.category}</p>
            </div>
          </div>
          <p className="text-3xl font-semibold mb-6">{formatAmount(expense.amount)}원</p>
          <div className="space-y-2">
            <p><span className="font-medium">날짜:</span> {expense.date}</p>
          </div>
        </Card>

        <div className="mt-6 space-x-4 flex">
          <Button className="flex-1" onClick={() => router.push(`/expenses/${expense.id}/edit`)}>
            <Pencil className="w-4 h-4 mr-2" />
            수정
          </Button>
          <Sheet open={isDeleteSheetOpen} onOpenChange={setIsDeleteSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Trash className="w-4 h-4 mr-2" />
                삭제
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>정말 삭제하시겠습니까?</SheetTitle>
                <SheetDescription>
                  이 작업은 되돌릴 수 없습니다.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <Button className="w-full bg-red-500 hover:bg-red-600" onClick={handleDelete}>
                  삭제
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}

