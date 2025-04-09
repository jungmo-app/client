'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { ResetPasswordPayload } from '@/types/auth';
import { ApiError } from '@/utils/error';

export const usePasswordReset = () => {
  const router = useRouter();

  return useMutation<unknown, ApiError, ResetPasswordPayload>({
    mutationFn: payload => apis.auth.resetPassword(payload),
    onSuccess: () => {
      alert('비밀번호가 변경되었습니다');
    },
    onError: error => {
      if (error.status === 401) {
        alert('만료된 url입니다');
        router.push('/login');
        return;
      }
      alert('비밀번호 초기화에 실패하였습니다');
    },
  });
};
