'use client';

import { useMutation } from '@tanstack/react-query';
import { apis } from '@/apis';
import { ResetPasswordPayload } from '@/types/auth';
import { ApiError } from '@/utils/error';

interface PasswordResetProps {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}

export const usePasswordReset = ({ onSuccess, onError }: PasswordResetProps = {}) => {
  return useMutation<unknown, ApiError, ResetPasswordPayload>({
    mutationFn: payload => apis.auth.resetPassword(payload),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: error => {
      onError?.(error);
    },
  });
};
