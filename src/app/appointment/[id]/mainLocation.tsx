'use client';

import { MapPin } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEditAppointment } from '@/hooks/useMutate/useEditAppointment';
import { useAppointment } from '@/hooks/useQuery/useAppointment';
import { ChangePlaceType } from '@/types/map';
import EditLocation from './editLocation';

export default function MainLocation() {
  const params = useParams();
  const id = Number(params.id);

  const { data: appointment } = useAppointment(id);

  const { mutate: editAppointment, isPending } = useEditAppointment(id, new Date(appointment?.startDate ?? ''));

  if (!appointment) {
    return;
  }

  const isEditable = appointment.authority === 'WRITE';

  const handleChangeLocation = async (value: ChangePlaceType) => {
    const { title, startDate, endDate, startTime, memo, gatheringUsers } = appointment;
    const payload = {
      title,
      startDate,
      endDate,
      startTime,
      memo,
      meetingLocation: {
        placeId: value.placeId,
        placeName: value.name,
        placeAddress: value.address,
        point: value.point,
      },
      userIds: gatheringUsers.map(user => user.userId) ?? [],
    };

    editAppointment(payload);
  };

  return (
    <div className="rounded-2xl pb-5">
      <div className="flex items-center gap-2 rounded-2xl bg-[#f8f8f8] p-4 dark:bg-gray-800">
        <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-1 items-center gap-2 overflow-hidden">
            <h3 className="flex-1 truncate font-medium">
              {appointment.meetingLocation.placeName ?? '위치를 불러올 수 없습니다'}
            </h3>
            {isEditable && <EditLocation isPending={isPending} onChange={handleChangeLocation} />}
          </div>
          <p className="mt-1 truncate text-sm text-gray-500">{appointment.meetingLocation.placeAddress}</p>
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
