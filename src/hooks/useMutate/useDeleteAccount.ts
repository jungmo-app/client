'use client';

import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { SessionContext } from '@/contexts/SessionProvider';
import { ApiError } from '@/utils/error';

interface DeleteAccountProps {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}

export const useDeleteAccount = ({ onSuccess, onError }: DeleteAccountProps = {}) => {
  const queryClient = useQueryClient();
  const { closeSession } = useContext(SessionContext);
  return useMutation<unknown, ApiError>({
    mutationFn: apis.user.deleteAccount,
    onSuccess: () => {
      closeSession();
      queryClient.clear();
      onSuccess?.();
      alert('계정이 삭제되었습니다.');
      window.location.replace('/login');
    },
    onError: error => {
      onError?.(error);
    },
  });
};
