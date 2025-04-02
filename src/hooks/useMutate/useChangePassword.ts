'use client';

import { useMutation } from '@tanstack/react-query';
import { apis } from '@/apis';
import { ChangePasswordPayload } from '@/types/auth';

export const useChangePassword = (onSuccess?: () => void, onError?: () => void) => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => apis.auth.changePassword(payload),
    onSuccess: () => {
      alert('비밀번호를 변경하였습니다');
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: () => {
      if (onError) {
        onError();
      }
    },
  });
};
