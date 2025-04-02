'use client';

import { MapPin } from 'lucide-react';
import { useEditAppointment } from '@/hooks/useMutate/useEditAppointment';
import { useAppointment } from '@/hooks/useQuery/useAppointment';
import { DetailGatheringType } from '@/types/gathering';
import { PlaceDataType } from '@/types/map';
import EditLocation from './editLocation';

type MainLocationProps = {
  appointment: DetailGatheringType;
  isEditable?: boolean;
};

export default function MainLocation({ appointment, isEditable }: MainLocationProps) {
  const appointmentDate = new Date(appointment.startDate);

  const { data: appointmentData } = useAppointment(appointment);

  const { mutate: editAppointment, isPending } = useEditAppointment(appointment.id, appointmentDate);

  const handleChangeLocation = async (value: PlaceDataType) => {
    const payload = {
      title: appointmentData?.title ?? '',
      startDate: appointmentData?.startDate ?? '',
      endDate: appointmentData?.endDate ?? '',
      startTime: appointmentData?.startTime ?? '',
      meetingLocation: {
        placeId: value.placeId,
        placeName: value.name,
      },
      memo: appointmentData?.memo ?? '',
      userIds: appointmentData?.gatheringUsers.map(user => user.userId) ?? [],
    };

    editAppointment(payload);
  };

  return (
    <div className="rounded-2xl pb-5">
      <div className="flex items-center gap-2 rounded-2xl bg-[#f8f8f8] p-4 dark:bg-[#0f0f0f]">
        <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-1 items-center gap-2 overflow-hidden">
            <h3 className="flex-1 truncate font-medium">
              {appointmentData?.meetingLocation.placeName ?? '위치를 불러올 수 없습니다'}
            </h3>
            {isEditable && <EditLocation isPending={isPending} onChange={handleChangeLocation} />}
          </div>
          <p className="mt-1 truncate text-sm text-gray-500">{appointmentData?.meetingLocation.placeAddress}</p>
        </div>
      </div>

      {/*       <div className="mt-4 flex gap-2 px-4">
        {tags.map(tag => (
          <Link
            key={tag}
            href={`/search?query=${tag}`}
            className={cn(badgeVariants({ variant: 'secondary' }), '!bg-blue-50 !text-blue-500')}
          >
            + {tag}
          </Link>
        ))}
      </div> */}
    </div>
  );
}
