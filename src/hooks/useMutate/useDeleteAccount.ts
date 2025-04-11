'use client';

import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { SessionContext } from '@/contexts/SessionProvider';

export const useDeleteAccount = (onSuccess?: () => void, onError?: () => void) => {
  const queryClient = useQueryClient();
  const { closeSession } = useContext(SessionContext);
  return useMutation({
    mutationFn: apis.user.deleteAccount,
    onSuccess: () => {
      closeSession();
      if (onSuccess) {
        onSuccess();
      }
      queryClient.clear();
      alert('계정이 삭제되었습니다.');
      window.location.replace('/login');
    },
    onError: () => {
      if (onError) {
        onError();
      }
      alert('계정 삭제에 실패하였습니다.');
    },
  });
};
