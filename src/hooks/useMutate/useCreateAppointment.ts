'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { addAppointment } from '@/utils/updateAppointment';

type AppointmentFormData = {
  title: string;
  startDate: string;
  startTime: string;
  meetingLocation: {
    id: string;
    address: string;
    name: string;
  };
  memo: string;
  userIds: number[];
};

export const useCreateAppointment = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AppointmentFormData) =>
      apis.gathering.create({
        ...payload,
        endDate: payload.startDate,
        meetingLocation: { placeId: payload.meetingLocation.id },
      }),

    onSuccess: (_, variable) => {
      const date = new Date(variable.startDate);
      addAppointment(queryClient, date);
      router.push('/');
    },

    onError: () => {
      alert('약속 등록에 실패하였습니다!');
    },
  });
};
