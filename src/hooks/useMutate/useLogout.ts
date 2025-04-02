'use client';

import { useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { SessionContext } from '@/contexts/SessionProvider';

export const useLogout = (onSuccess?: () => void, onError?: () => void) => {
  const router = useRouter();
  const { closeSession } = useContext(SessionContext);

  return useMutation({
    mutationFn: apis.auth.logout,
    onSuccess: () => {
      closeSession();
      if (onSuccess) {
        onSuccess();
      }
      alert('로그아웃 되었습니다');
      router.push('/login');
    },
    onError: () => {
      if (onError) {
        onError();
      }
      alert('로그아웃에 실패하였습니다');
    },
  });
};
