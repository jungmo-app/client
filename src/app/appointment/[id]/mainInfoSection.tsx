'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { Calendar, LucideFileTerminal, PenLine, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { gatheringApis } from '@/apis/gathering';
import { DatePickerSheet, TimePickerSheet } from '@/components';
import AttendeeSelectModal from '@/components/modals/attendeeSelectModal';
import { Avatar, AvatarImage, Badge, Input, Textarea } from '@/components/ui';
import { revalidateData, revalidatePage } from '@/libs/serverAction';
import { DetailGatheringRespose, GatheringListResponse } from '@/types/gathering';
import { UserDataResponse } from '@/types/user';

type MainInfoSectionProps = {
  appointment: DetailGatheringRespose;
  isEditable?: boolean;
};

export default function MainInfoSection({ appointment, isEditable }: MainInfoSectionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const appointmentDate = new Date(appointment.startDate);

  const [data, setData] = useState({
    title: appointment.title,
    startDate: appointment.startDate,
    startTime: appointment.startTime,
    description: appointment.memo,
    userList: appointment.gatheringUsers,
  });

  const { control, getValues, reset, setValue } = useForm({
    defaultValues: {
      title: appointment.title,
      startDate: appointment.startDate,
      startTime: appointment.startTime,
      description: appointment.memo,
      userList: appointment.gatheringUsers,
    },
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isOpenSelectModal, setIsOpenSelectModal] = useState(false);
  const visibleParticipants = getValues('userList').slice(0, 3);
  const remainingCount = getValues('userList').length - 3;

  const handleClickEditButton = () => {
    setIsEditMode(true);
  };

  const handleClickCancleButton = () => {
    setIsEditMode(false);
    reset(data);
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

  const handleClickSaveButton = async () => {
    const payload = {
      title: getValues('title'),
      startDate: getValues('startDate'),
      endDate: appointment.endDate,
      startTime: getValues('startTime'),
      meetingLocation: {
        placeId: appointment.meetingLocation.placeId,
      },
      memo: getValues('description'),
      userIds: getValues('userList').map(user => user.userId),
    };

    try {
      await gatheringApis.edit(appointment.id, payload);
      setData(getValues());
      setIsEditMode(false);
      queryClient.setQueryData<GatheringListResponse[]>(
        ['appointments', appointmentDate.getFullYear(), appointmentDate.getMonth() + 1, appointmentDate.getDate()],
        prev => {
          if (!prev) {
            return [];
          }
          return prev.map(item =>
            item.id === appointment.id
              ? {
                  ...item,
                  title: getValues('title'),
                  startDate: getValues('startDate'),
                  startTime: getValues('startTime'),
                }
              : item
          );
        }
      );
      revalidateData(`gathering-${appointment.id}`);
      revalidatePage(`/appointment/${appointment.id}`);

      /* revalidate appointment/id data, path */
    } catch (error) {
      alert('수정에 실패하였습니다');
      router.refresh();
      /* revalidate로 변경? => fetch 사용 */
    }
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
                render={({ field }) => <Input className="h-7 rounded-sm px-3 text-base font-semibold" {...field} />}
              />
            ) : (
              <h2 className="truncate font-semibold">{data.title}</h2>
            )}
          </div>

          {isEditable && (
            <div className="flex flex-shrink-0 items-center gap-2">
              {isEditMode ? (
                <>
                  <button
                    className="flex h-[22px] w-[44px] items-center justify-center"
                    aria-label="저장"
                    type="button"
                  >
                    <Badge
                      variant="destructive"
                      className="rounded-full bg-green-500 text-white hover:bg-green-600"
                      onClick={handleClickSaveButton}
                    >
                      저장
                    </Badge>
                  </button>
                  <button
                    className="flex h-[22px] w-[44px] items-center justify-center"
                    aria-label="취소"
                    type="button"
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
                <button aria-label="편집" type="button" onClick={handleClickEditButton}>
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
            <span>{`${data.startDate} ${data.startTime}`}</span>
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
              <div className="flex-shrink whitespace-pre-line break-all">{data.description}</div>
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
              className="flex size-[34px] items-center justify-center rounded-full border-2 border-background bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"
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
