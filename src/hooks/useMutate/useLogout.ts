'use client';

import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { SessionContext } from '@/contexts/SessionProvider';

export const useLogout = (onSuccess?: () => void, onError?: () => void) => {
  const { closeSession } = useContext(SessionContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apis.auth.logout,
    onSuccess: () => {
      closeSession();
      if (onSuccess) {
        onSuccess();
      }
      alert('로그아웃 되었습니다');
      queryClient.clear();
      window.location.replace('/login');
    },
    onError: () => {
      if (onError) {
        onError();
      }
      alert('로그아웃에 실패하였습니다');
    },
  });
};
