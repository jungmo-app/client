'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditExpense({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link href={`/expenses/${params.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-medium">지출 수정</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <p>Edit form for expense {params.id} goes here</p>
      </div>
    </div>
  )
}

