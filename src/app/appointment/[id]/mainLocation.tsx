'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { gatheringApis } from '@/apis/gathering';
import { revalidatePage } from '@/libs/serverAction';
import { DetailGatheringRespose, LocationDataType } from '@/types/gathering';
import { PlaceDataType } from '@/types/map';
import EditLocation from './editLocation';

type MainLocationProps = {
  appointment: DetailGatheringRespose;
  location: google.maps.places.PlaceResult | null;
  isEditable?: boolean;
};

export default function MainLocation({ appointment, location, isEditable }: MainLocationProps) {
  const router = useRouter();
  const [locationData, setLocationData] = useState<LocationDataType | null>(
    location
      ? {
          name: location?.name ?? '',
          address: location?.formatted_address ?? '',
        }
      : null
  );

  const handleChangeLocation = async (value: PlaceDataType) => {
    const payload = {
      title: appointment.title,
      startDate: appointment.startDate,
      endDate: appointment.endDate,
      startTime: appointment.startTime,
      meetingLocation: {
        placeId: value.placeId,
      },
      memo: appointment.memo,
      userIds: appointment.gatheringUsers.map(user => user.userId),
    };

    const response = await gatheringApis.edit(appointment.id, payload);
    if (!response) {
      alert('수정에 실패하였습니다');
      router.refresh();
      return;
    }
    setLocationData({ name: value.name, address: value.address });
    revalidatePage('/appointment');
  };

  return (
    <div className="rounded-2xl pb-5">
      <div className="flex items-center gap-2 rounded-2xl bg-[#f8f8f8] p-4">
        <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-1 items-center gap-2 overflow-hidden">
            <h3 className="flex-1 truncate font-medium">{locationData?.name ?? '위치를 불러올 수 없습니다'}</h3>
            {isEditable && <EditLocation onChange={handleChangeLocation} />}
          </div>
          <p className="mt-1 truncate text-sm text-gray-500">{locationData?.address}</p>
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
