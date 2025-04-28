'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, LucideFileTerminal, PenLine, Settings } from 'lucide-react';
import { useParams } from 'next/navigation';
import { z } from 'zod';
import { DatePickerSheet, TimePickerSheet } from '@/components';
import AttendeeSelectModal from '@/components/modals/attendeeSelectModal';
import { Avatar, AvatarImage, Badge, Input, Textarea } from '@/components/ui';
import { useEditAppointment } from '@/hooks/useMutate/useEditAppointment';
import { useAppointment } from '@/hooks/useQuery/useAppointment';
import { mainInfoSchema } from '@/schemas/appointment';
import { UserDataResponse } from '@/types/user';
import { ApiError } from '@/utils/error';

export default function MainInfoSection() {
  const params = useParams();
  const id = Number(params.id);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isOpenSelectModal, setIsOpenSelectModal] = useState(false);

  const { data: appointment } = useAppointment(id);

  const { control, getValues, reset, setValue, handleSubmit, formState } = useForm({
    resolver: zodResolver(mainInfoSchema),
    defaultValues: {
      title: appointment?.title ?? '',
      startDate: appointment?.startDate ?? '',
      startTime: appointment?.startTime ?? '',
      description: appointment?.memo ?? '',
      userList: appointment?.gatheringUsers ?? [],
    },
    mode: 'onChange',
  });

  const handleSuccess = () => {
    setIsEditMode(false);
  };

  const handleError = (error: ApiError) => {
    if (error.code === 'GL003') {
      alert('자기 자신을 초대할 수 없습니다');
      return;
    }

    if (error.code === 'G005') {
      alert('초대한 참가자가 존재하지 않습니다');
      return;
    }

    alert('모임 수정에 실패하였습니다');
  };

  const { mutate: editAppointment, isPending } = useEditAppointment(id, {
    onSuccess: handleSuccess,
    onError: handleError,
  });

  if (!appointment) {
    return;
  }

  const isEditable = appointment.authority === 'WRITE';

  const visibleParticipants = getValues('userList').slice(0, 3);
  const remainingCount = getValues('userList').length - 3;

  const handleClickEditButton = () => {
    setIsEditMode(true);
  };

  const handleClickCancleButton = () => {
    setIsEditMode(false);
    if (appointment) {
      reset();
    }
  };

  const handleChangeAttendee = (attendees: UserDataResponse[]) => {
    setValue('userList', attendees);
  };

  const handleSelectDate = (value: Date) => {
    const year = value.getFullYear();
    const month = (value.getMonth() + 1).toString().padStart(2, '0');
    const day = value.getDate().toString().padStart(2, '0');

    setValue('startDate', `${year}-${month}-${day}`);
  };

  const handleSelectTime = (time: Record<'hours' | 'minutes', number>) => {
    setValue('startTime', `${time.hours}:${time.minutes}`);
  };

  const handleClickSettingAttendeeButton = () => {
    if (!isEditMode) {
      return;
    }
    setIsOpenSelectModal(true);
  };

  const handleClickSaveButton = async (formData: z.infer<typeof mainInfoSchema>) => {
    if (!appointment) {
      return;
    }

    const { title, startDate, startTime, description: memo, userList } = formData;

    const payload = {
      title,
      startDate,
      endDate: startDate,
      startTime,
      meetingLocation: appointment.meetingLocation,
      memo,
      userIds: userList.map(user => user.userId),
    };

    editAppointment(payload);
  };

  return (
    <div className="space-y-4 rounded-2xl p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center overflow-hidden">
            <LucideFileTerminal className="mr-2 h-4 w-4 flex-shrink-0" color="#6B7280" />
            {isEditMode ? (
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    autoComplete="on"
                    className="h-7 rounded-sm px-3 text-base font-semibold placeholder:font-normal"
                    {...field}
                    placeholder="일정 제목을 입력해주세요"
                  />
                )}
              />
            ) : (
              <h2 className="truncate font-semibold">{appointment.title}</h2>
            )}
          </div>

          {isEditable && (
            <div className="flex flex-shrink-0 items-center gap-2">
              {isEditMode ? (
                <>
                  <button
                    className="flex h-[22px] w-[44px] select-none items-center justify-center"
                    aria-label="저장"
                    type="button"
                    disabled={isPending}
                  >
                    <Badge
                      variant="destructive"
                      className={`rounded-full ${formState.isValid ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 hover:bg-gray-300'} `}
                      onClick={handleSubmit(handleClickSaveButton)}
                    >
                      저장
                    </Badge>
                  </button>
                  <button
                    className="flex h-[22px] w-[44px] select-none items-center justify-center"
                    aria-label="취소"
                    type="button"
                    disabled={isPending}
                  >
                    <Badge
                      variant="destructive"
                      className="rounded-full bg-red-500 text-white hover:bg-red-600"
                      onClick={handleClickCancleButton}
                    >
                      취소
                    </Badge>
                  </button>
                </>
              ) : (
                <button aria-label="편집" type="button" className="select-none" onClick={handleClickEditButton}>
                  <Badge variant="secondary" className="rounded-full">
                    편집
                  </Badge>
                </button>
              )}
            </div>
          )}
        </div>
        <div className={`flex items-center text-sm text-gray-500 ${isEditMode && 'cursor-pointer'}`}>
          <Calendar className="mr-2 h-4 w-4" />
          {isEditMode ? (
            <div className="flex items-center gap-1">
              <DatePickerSheet
                value={new Date(getValues('startDate'))}
                classNames="py-[2px] h-auto"
                onSelect={handleSelectDate}
              />
              <TimePickerSheet
                value={getValues('startTime')}
                classNames="py-[2px] h-auto"
                onSelect={handleSelectTime}
              />
            </div>
          ) : (
            <span>{`${appointment.startDate} ${appointment.startTime}`}</span>
          )}
        </div>
        <div className="flex text-sm text-gray-500">
          <PenLine className="mr-2 mt-1 h-4 w-4" />
          <div className="flex-grow">
            {isEditMode ? (
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    placeholder="일정에 대한 설명을 입력해주세요"
                    className="bg-background text-sm"
                    {...field}
                  />
                )}
              />
            ) : (
              <div className="flex-shrink whitespace-pre-line break-all">{appointment.memo}</div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between" style={{ marginTop: '12px' }}>
          <div className="flex">
            {visibleParticipants.map(participant => (
              <div key={participant.userId} className="group relative">
                <Avatar className="relative h-8 w-8">
                  <AvatarImage src={participant.profileImage} alt={participant.userName} />
                </Avatar>
                <Badge
                  variant="outline"
                  className="invisible absolute left-1/2 top-0 z-[99999] -translate-x-1/2 -translate-y-7 text-nowrap bg-background group-hover:visible"
                >
                  {participant.userName}
                </Badge>
              </div>
            ))}
            {remainingCount > 0 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-gray-100 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-100">
                +{remainingCount}
              </div>
            )}
          </div>
          {isEditMode && (
            <button
              className="flex size-[34px] select-none items-center justify-center rounded-full border-2 border-background bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"
              onClick={handleClickSettingAttendeeButton}
            >
              <Settings className="size-5 stroke-white" />
            </button>
          )}

          <AttendeeSelectModal
            isOpen={isOpenSelectModal}
            value={getValues('userList')}
            onClose={() => setIsOpenSelectModal(false)}
            onSelect={handleChangeAttendee}
          />
        </div>
      </div>
    </div>
  );
}
