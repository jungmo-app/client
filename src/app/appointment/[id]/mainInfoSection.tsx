'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Calendar, LucideFileTerminal, PenLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { gatheringApis } from '@/apis/gathering';
import { DatePickerSheet, TimePickerSheet } from '@/components';
import { Badge, Textarea } from '@/components/ui';
import { DetailGatheringRespose } from '@/types/gathering';

type MainInfoSectionProps = {
  appointment: DetailGatheringRespose;
  isEditable?: boolean;
};

export default function MainInfoSection({ appointment, isEditable }: MainInfoSectionProps) {
  const router = useRouter();
  const [data, setData] = useState({
    title: appointment.title,
    startDate: appointment.startDate,
    startTime: appointment.startTime,
    description: appointment.memo,
    userList: [],
  });
  const { control, getValues, reset, setValue } = useForm({
    defaultValues: {
      title: appointment.title,
      startDate: appointment.startDate,
      startTime: appointment.startTime,
      description: appointment.memo,
      userList: [],
    },
  });
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const handleClickEditButton = () => {
    setIsEditMode(true);
  };

  const handleClickCancleButton = () => {
    setIsEditMode(false);
    reset(data);
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
      userIds: appointment.gatheringUsers.map(user => user.userId),
    };

    try {
      await gatheringApis.edit(appointment.id, payload);
      setData(getValues());
      setIsEditMode(false);
    } catch {
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
                render={({ field }) => (
                  <input
                    className="rounded-sm border border-input px-3 text-base font-semibold text-[#6b7280]"
                    {...field}
                  />
                )}
              />
            ) : (
              <h2 className="truncate font-semibold">{data.title}</h2>
            )}
          </div>

          {isEditable && (
            <div className="flex flex-shrink-0 items-center gap-2">
              {isEditMode ? (
                <>
                  <button className="flex h-[22px] w-[44px] items-center justify-center">
                    <Badge
                      variant="destructive"
                      className="rounded-full bg-green-500 text-white hover:bg-green-600"
                      onClick={handleClickSaveButton}
                    >
                      저장
                    </Badge>
                  </button>
                  <button className="flex h-[22px] w-[44px] items-center justify-center">
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
                <button onClick={handleClickEditButton}>
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
                  <Textarea placeholder="일정에 대한 설명을 입력해주세요" className="bg-white text-sm" {...field} />
                )}
              />
            ) : (
              <div className="flex-shrink whitespace-pre-line break-all">{data.description}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
