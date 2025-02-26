'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Calendar, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { gatheringApis } from '@/apis/gathering';
import AttendeeInput from '@/components/AttendeeInput';
import { DatePickerSheet } from '@/components/date-picker-sheet';
import Header from '@/components/Header';
import LocationInput from '@/components/LocationInput';
import { TimePickerSheet } from '@/components/time-picker-sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formattedDate } from '@/libs/date';
import { PARTICIPANTS } from '@/mocks/appointment';

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
  const [attendees, setAttendees] = useState<typeof PARTICIPANTS>([]);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<AppointmentFormData>({
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
      await gatheringApis.create({
        ...data,
        endDate: data.startDate,
        meetingLocation: { placeId: data.meetingLocation.id },
      });
      router.push('/');
    } catch {
      alert('약속 등록에 실패하였습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="일정 추가" style={{ position: 'relative' }} />
      <div className="space-y-4 p-4">
        <Card className="space-y-4 rounded-2xl bg-[#F7F7F7] p-4">
          <div className="space-y-4">
            <Label>제목</Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => <Input placeholder="일정 제목을 입력해주세요" className="bg-white" {...field} />}
            />
          </div>
        </Card>

        <Card className="space-y-4 rounded-2xl bg-[#F7F7F7] p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Label>날짜 및 시간</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DatePickerSheet
                value={new Date(getValues('startDate'))}
                onSelect={date => setValue('startDate', formattedDate(date))}
              />
              <TimePickerSheet
                value={getValues('startTime')}
                onSelect={time =>
                  setValue(
                    'startTime',
                    `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`
                  )
                }
              />
            </div>
          </div>
        </Card>
        <Card className="space-y-4 rounded-2xl bg-[#F7F7F7] p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <Label>장소</Label>
            </div>
            <Controller
              name="meetingLocation"
              control={control}
              rules={{
                validate: {
                  id: value => (value.id ? true : '장소 정보를 입력해주세요'),
                },
              }}
              render={({ field }) => (
                <LocationInput
                  value={field.value.address}
                  onChange={location => field.onChange({ id: location.id, address: location.address })}
                />
              )}
            />
            {errors.meetingLocation && <span className="text-red-500">{errors.meetingLocation.id?.message}</span>}
          </div>
        </Card>

        <Card className="space-y-4 rounded-2xl bg-[#F7F7F7] p-4">
          <div className="space-y-4">
            <Label>설명</Label>
            <Controller
              name="memo"
              control={control}
              render={({ field }) => (
                <Textarea placeholder="일정에 대한 설명을 입력해주세요" className="bg-white" {...field} />
              )}
            />
          </div>
        </Card>
        <AttendeeInput selectedAttendees={attendees} onAttendeesChange={setAttendees} />

        <div className="z-10 border-t bg-white fixed-mobile-bottom">
          <div className="p-4">
            <Button
              className="w-full rounded-xl"
              size="lg"
              disabled={!isValid}
              onClick={handleSubmit(handleSubmitAppointment)}
            >
              일정 추가
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
