'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { SessionContext } from '@/contexts/SessionProvider';

export default function AuthPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const { connectSession } = useContext(SessionContext);

  const handleButtonClick = async () => {
    setIsPending(true);
    await connectSession();
    router.push('/');
    setIsPending(false);
  };

  return (
    <div>
      <div>카카오 로그인 redirect</div>
      <Button type="button" disabled={isPending} onClick={handleButtonClick}>
        메인 페이지로 돌아가기
      </Button>
    </div>
  );
}
