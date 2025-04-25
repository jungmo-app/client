'use client';

import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateInput, DescriptionInput, PlaceInput, TitleInput } from '@/app/appointment/create';
import { AttendeeInput, Header } from '@/components';
import { Button } from '@/components/ui';
import { useCreateAppointment } from '@/hooks/useMutate/useCreateAppointment';
import { createAppointmentSchema } from '@/schemas/appointment';
import { useDateStore } from '@/store/appointmentStore';
import { AppointmentFormDataType } from '@/types/gathering';
import { UserDataResponse } from '@/types/user';
import { formattedDate } from '@/utils/date';

export default function CreateAppointment() {
  const [attendees, setAttendees] = useState<UserDataResponse[]>([]);
  const date = useDateStore(prev => prev.date);

  const { mutate: CreateAppointment, isPending, isSuccess } = useCreateAppointment();

  const methods = useForm<AppointmentFormDataType>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      title: '',
      startDate: formattedDate(date),
      startTime: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`,
      meetingLocation: { id: '', address: '', name: '' },
      memo: '',
      userIds: [],
    },
    mode: 'onChange',
  });

  const handleSubmitAppointment = async (data: AppointmentFormDataType) => {
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
                disabled={!methods.formState.isValid || isPending || isSuccess}
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
