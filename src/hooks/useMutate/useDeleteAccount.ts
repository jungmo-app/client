'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';

export const useDeleteAccount = (onSuccess?: () => void, onError?: () => void) => {
  const router = useRouter();
  return useMutation({
    mutationFn: apis.user.deleteAccount,
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
      alert('계정이 삭제되었습니다.');
      router.push('/login');
    },
    onError: () => {
      if (onError) {
        onError();
      }
      alert('계정 삭제에 실패하였습니다.');
    },
  });
};
