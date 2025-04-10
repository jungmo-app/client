'use client';

import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DateInput, DescriptionInput, PlaceInput, TitleInput } from '@/app/appointment/create';
import { AttendeeInput, Header } from '@/components';
import { Button } from '@/components/ui';
import { useCreateAppointment } from '@/hooks/useMutate/useCreateAppointment';
import { UserDataResponse } from '@/types/user';
import { formattedDate } from '@/utils/date';

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

export default function CreateAppointment() {
  const [attendees, setAttendees] = useState<UserDataResponse[]>([]);

  const { mutate: CreateAppointment, isPending } = useCreateAppointment();

  const methods = useForm<AppointmentFormData>({
    defaultValues: {
      title: '',
      startDate: formattedDate(new Date()),
      startTime: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`,
      meetingLocation: { id: '', address: '', name: '' },
      memo: '',
      userIds: [],
    },
    mode: 'onChange',
  });

  const handleSubmitAppointment = async (data: AppointmentFormData) => {
    CreateAppointment({ ...data, userIds: attendees.map(user => user.userId) });
  };

  return (
    <FormProvider {...methods}>
      <div className="relative min-h-screen bg-background">
        <Header title="일정 추가" routeUrl="/" />
        <div className="space-y-4 p-4">
          <TitleInput />
          <DateInput />
          <PlaceInput />
          <DescriptionInput />
          <AttendeeInput selectedAttendees={attendees} onAttendeesChange={setAttendees} />

          <div className="sticky bottom-0 z-10 border-t bg-background">
            <div className="p-4">
              <Button
                className="w-full rounded-xl"
                size="lg"
                disabled={!methods.formState.isValid || isPending}
                aria-label="일정 추가"
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
