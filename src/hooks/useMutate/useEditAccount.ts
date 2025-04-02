'use client';

import { useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apis } from '@/apis';
import { SessionContext } from '@/contexts/SessionProvider';

interface PayloadType {
  userName: string;
  profileImage?: File | null;
  preview: string;
}

export const useEditAccount = () => {
  const { changeUserData } = useContext(SessionContext);
  return useMutation({
    mutationFn: async (payload: PayloadType) => {
      const { userName, profileImage } = payload;

      const formData = new FormData();

      formData.append('userName', userName);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      await apis.user.editInfo(formData);
    },
    onSuccess: (_, variable) => {
      alert('수정하였습니다');
      const { userName, preview } = variable;
      changeUserData(prev => (prev ? { ...prev, userName, profileImage: preview } : null));
    },
    onError: () => {
      alert('수정에 실패하였습니다');
    },
  });
};
