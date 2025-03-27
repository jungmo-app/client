'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { Button } from '@/components/ui';
import { NotificationContext } from '@/contexts/NotificationProvider';

export default function AuthPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const { changeNotification } = useContext(NotificationContext);

  const handleButtonClick = async () => {
    setIsPending(true);
    const response = await apis.notification.getNotification();
    if (response?.data) {
      changeNotification(response.data);
    }
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
