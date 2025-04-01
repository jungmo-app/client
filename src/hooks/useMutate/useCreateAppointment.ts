'use client';

import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { SessionContext } from '@/contexts/SessionProvider';
import { GatheringListResponse } from '@/types/gathering';

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

  const { userData } = useContext(SessionContext);

  return useMutation({
    mutationFn: (payload: AppointmentFormData) =>
      apis.gathering.create({
        ...payload,
        endDate: payload.startDate,
        meetingLocation: { placeId: payload.meetingLocation.id },
      }),

    onSuccess: (id, variable) => {
      const date = new Date(variable.startDate);

      const newAppointment: GatheringListResponse = {
        id: Number(id),
        profileImage: userData?.profileImage ?? null,
        title: variable.title,
        startDate: variable.startDate,
        endDate: variable.startDate,
        startTime: variable.startTime,
        meetingLocation: variable.meetingLocation.name,
      };

      queryClient.setQueryData<GatheringListResponse[]>(
        ['appointments', date.getFullYear(), date.getMonth() + 1, date.getDate()],
        prev => {
          if (!prev) {
            return [newAppointment];
          }
          return [...prev, newAppointment];
        }
      );

      router.push('/');
    },

    onError: () => {
      alert('약속 등록에 실패하였습니다!');
    },
  });
};
