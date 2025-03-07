'use client';

import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { DateInput, DescriptionInput, PlaceInput, TitleInput } from '@/app/appointment/create';
import { AttendeeInput, Header } from '@/components';
import { Button } from '@/components/ui';
import { formattedDate } from '@/libs/date';
import { UserDataResponse } from '@/types/user';

type AppointmentFormData = {
  title: string;
  startDate: string;
  startTime: string;
  meetingLocation: {
    id: string;
    address: string;
  };
  memo: string;
  userIds: number[];
};

export default function CreateAppointment() {
  const router = useRouter();
  const [attendees, setAttendees] = useState<UserDataResponse[]>([]);

  const methods = useForm<AppointmentFormData>({
    defaultValues: {
      title: '',
      startDate: formattedDate(new Date()),
      startTime: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`,
      meetingLocation: { id: '', address: '' },
      memo: '',
      userIds: [],
    },
    mode: 'onChange',
  });

  const handleSubmitAppointment = async (data: AppointmentFormData) => {
    try {
      const response = await apis.gathering.create({
        ...data,
        endDate: data.startDate,
        meetingLocation: { placeId: data.meetingLocation.id },
        userIds: attendees.map(user => user.userId),
      });
      if (response?.status === 200) {
        router.push('/');
        return;
      }
      throw new Error('api error');
    } catch {
      alert('약속 등록에 실패하였습니다.');
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="relative min-h-screen bg-white">
        <Header title="일정 추가" />
        <div className="space-y-4 p-4">
          <TitleInput />
          <DateInput />
          <PlaceInput />
          <DescriptionInput />
          <AttendeeInput selectedAttendees={attendees} onAttendeesChange={setAttendees} />

          <div className="sticky bottom-0 z-10 border-t bg-white">
            <div className="p-4">
              <Button
                className="w-full rounded-xl"
                size="lg"
                disabled={!methods.formState.isValid}
                onClick={methods.handleSubmit(handleSubmitAppointment)}
              >
                일정 추가
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
