'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { SessionContext } from '@/contexts/SessionProvider';
import { useUserData } from '@/hooks/useMutate/useUserData';

export default function AuthPage() {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);
  const { openSession } = useContext(SessionContext);

  const { mutateAsync: getUserData } = useUserData();

  const handleButtonClick = async () => {
    setIsPending(true);
    try {
      await Promise.all([openSession, getUserData]);
      router.push('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <div>카카오 로그인 redirect</div>
      <Button type="button" disabled={isPending} aria-label="메인 페이지 이동" onClick={handleButtonClick}>
        메인 페이지로 돌아가기
      </Button>
    </div>
  );
}
