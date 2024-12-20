'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { terms } from '@/data/terms';

export default function CardTermsPage() {
  const router = useRouter();
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [checkedTerms, setCheckedTerms] = useState<string[]>([]);

  const handleAllCheck = () => {
    if (checkedTerms.length === terms.length) {
      setCheckedTerms([]);
    } else {
      setCheckedTerms(terms.map(term => term.id));
    }
  };

  const handleSingleCheck = (termId: string) => {
    if (checkedTerms.includes(termId)) {
      setCheckedTerms(checkedTerms.filter(id => id !== termId));
    } else {
      setCheckedTerms([...checkedTerms, termId]);
    }
  };

  const handleSubmit = () => {
    if (terms.every(term => !term.required || checkedTerms.includes(term.id))) {
      router.push('/expenses/card/verification');
    }
  };

  const isAllChecked = checkedTerms.length === terms.length;
  const canProceed = terms.every(term => !term.required || checkedTerms.includes(term.id));

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-10 bg-white">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Link href="/expenses">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-medium">오픈뱅킹 서비스 이용 동의</h1>
            </div>
          </div>
        </div>

        <div className="space-y-8 p-4">
          <div className="space-y-2">
            <strong className="text-lg font-medium">오픈 뱅킹 서비스 이용 동의</strong>
            <div className="text-sm text-gray-500">원활한 서비스 이용을 위해 아래 약관에 동의해주세요.</div>
          </div>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="all" checked={isAllChecked} onCheckedChange={handleAllCheck} />
              <label htmlFor="all" className="text-sm font-medium">
                전체 동의
              </label>
            </div>
          </Card>

          <div className="space-y-4">
            {terms.map(term => (
              <Card key={term.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={term.id}
                      checked={checkedTerms.includes(term.id)}
                      onCheckedChange={() => handleSingleCheck(term.id)}
                    />
                    <label htmlFor={term.id} className="text-sm">
                      {term.required && <span className="mr-1 text-red-500">*</span>}
                      {term.title}
                    </label>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedTermId(term.id)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="border-t bg-white p-4 fixed-mobile-bottom">
          <Button className="w-full" size="lg" disabled={!canProceed} onClick={handleSubmit}>
            동의하고 계속하기
          </Button>
        </div>
      </div>
    </>
  );
}
