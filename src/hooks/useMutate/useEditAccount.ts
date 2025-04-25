'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { UserDataResponse } from '@/types/user';
import { ApiError } from '@/utils/error';

interface PayloadType {
  userName: string;
  profileImage?: File | null;
  preview: string;
}

interface EditAccountProps {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}

export const useEditAccount = ({ onSuccess, onError }: EditAccountProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, PayloadType>({
    mutationFn: payload => {
      const { userName, profileImage } = payload;

      const formData = new FormData();

      formData.append('userName', userName);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      return apis.user.editInfo(formData);
    },
    onSuccess: (_, variable) => {
      const { userName, preview } = variable;
      queryClient.setQueryData<UserDataResponse>(['userData'], prev =>
        prev ? { ...prev, userName, profileImage: preview } : undefined
      );
      alert('수정하였습니다');
      onSuccess?.();
    },
    onError: (error: ApiError) => {
      if (error.code === 'C010') {
        alert('프로필 이미지를 수정하는데 실패하였습니다');
        return;
      }
      alert('수정에 실패하였습니다');
      onError?.(error);
    },
  });
};
