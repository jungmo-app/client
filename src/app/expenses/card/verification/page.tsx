'use client';

import { useState } from 'react';
import { AlertCircle, Check, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VerificationInput from '@/components/card/VerificationInput';
import { Button } from '@/components/ui/button';

export default function CardVerificationPage() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async () => {
    if (verificationCode.length === 6) {
      setIsLoading(true);
      setIsError(false);

      try {
        // 실제 API 호출 대신 임시로 실패 케이스 구현
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            // 50% 확률로 실패하도록 설정
            if (Math.random() < 0.5) {
              reject(new Error('인증 실패'));
            }
            resolve(true);
          }, 2000);
        });

        setIsLoading(false);
        setIsSuccess(true);

        // 성공 시 5초 후 다음 페이지로 이동
        setTimeout(() => {
          router.push('/expenses/card/complete');
        }, 5000);
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
      }
    }
  };

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-medium">정상적으로 불러오지 못했어요</h2>
        <p className="mt-2 text-gray-500">처음부터 다시 시도해주세요</p>
        <div className="w-full border-t bg-white p-4 fixed-mobile-bottom">
          <Button className="w-full" size="lg" onClick={() => router.push('/expenses/card')}>
            다시 시도하기
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || isSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        {isLoading ? (
          <div className="mb-8 h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        ) : (
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500">
            <Check className="h-8 w-8 text-white" />
          </div>
        )}
        <h2 className="text-xl font-medium">{isLoading ? '연동하고 있어요' : '카드 내역을 성공적으로 불러왔습니다'}</h2>
        <p className="mt-2 text-gray-500">
          {isLoading ? '잠시만 기다려주세요...' : '잠시 후 다음 페이지로 이동합니다'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/expenses/card/terms">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-medium">인증번호 입력</h1>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-4">
        <div className="space-y-2">
          <strong className="text-lg font-medium">인증번호를 입력해주세요</strong>
          <div className="text-sm text-gray-500">입력하신 휴대폰 번호로 인증번호가 발송되었습니다.</div>
        </div>

        <div className="space-y-4">
          <VerificationInput value={verificationCode} onChange={setVerificationCode} />
        </div>
      </div>

      <div className="border-t bg-white p-4 fixed-mobile-bottom">
        <Button className="w-full" size="lg" disabled={verificationCode.length !== 6} onClick={handleSubmit}>
          다음
        </Button>
      </div>
    </div>
  );
}
