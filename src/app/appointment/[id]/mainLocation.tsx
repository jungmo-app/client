'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { gatheringApis } from '@/apis/gathering';
import { badgeVariants } from '@/components/ui/badge';
import { DetailGatheringRespose, LocationDataType } from '@/types/gathering';
import { PlaceDataType } from '@/types/map';
import { cn } from '@/utils/styles';
import EditLocation from './editLocation';

type MainLocationProps = {
  appointment: DetailGatheringRespose;
  location: google.maps.places.PlaceResult | null;
  tags: string[];
  isEditable?: boolean;
};

export default function MainLocation({ appointment, location, tags, isEditable }: MainLocationProps) {
  const [locationData, setLocationData] = useState<LocationDataType | null>({
    name: location?.name ?? '',
    address: location?.formatted_address ?? '',
  });

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
    console.log(payload);
    const result = await gatheringApis.edit(appointment.id, payload);
    if (result) {
      setLocationData({ name: value.name, address: value.address });
      return;
    }
    alert('수정에 실패하였습니다');
  };

  return (
    <div className="rounded-2xl pb-5">
      <div className="rounded-2xl bg-[#f8f8f8] p-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="flex-1 font-medium">{locationData ? locationData.name : '위치를 불러올 수 없습니다'}</h3>
          {isEditable && <EditLocation onChange={handleChangeLocation} />}
        </div>
        <p className="mt-1 text-sm text-gray-500">{locationData?.address}</p>
      </div>

      <div className="mt-4 flex gap-2 px-4">
        {tags.map(tag => (
          <Link
            key={tag}
            href={`/search?query=${tag}`}
            className={cn(badgeVariants({ variant: 'secondary' }), '!bg-blue-50 !text-blue-500')}
          >
            + {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
