'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Skeleton from '@/components/common/Skeleton';
import { useLocation } from '@/hooks/useQuery/useLocation';
import { GatheringListResponse } from '@/types/gathering';

interface AppointmentCardProps {
  appointment: GatheringListResponse;
  onLoad: () => void;
  isAllLoaded: boolean;
}

export default function AppointmentCard({ appointment, onLoad, isAllLoaded }: AppointmentCardProps) {
  const { id, meetingLocation: locationId } = appointment;
  const isInitialRender = useRef(true);

  const { data: locationData } = useLocation(locationId, ['name']);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const delayTime = 500;

  useEffect(() => {
    if (isImageLoaded && locationData && isInitialRender.current) {
      onLoad();
      isInitialRender.current = false;
    }
  }, [isImageLoaded, locationData, onLoad]);

  return (
    <Link href={`/appointment/${id}`} className="flex items-center gap-4 p-2">
      <Skeleton loading={!isAllLoaded} delayTime={delayTime}>
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
          <Image
            fill
            sizes="64px"
            src={appointment.profileImage ?? '/sample.jpg'}
            alt={appointment.title}
            className="object-cover"
            priority={true}
            onLoad={() => setIsImageLoaded(true)}
          />
        </div>
      </Skeleton>

      <div className="flex-1 overflow-hidden">
        <h3 className="truncate font-medium">
          <Skeleton loading={!isAllLoaded} delayTime={delayTime}>
            {appointment.title}
          </Skeleton>
        </h3>
        <p className="truncate text-sm text-muted-foreground">
          <Skeleton
            loading={!isAllLoaded}
            delayTime={delayTime}
          >{`${appointment.startDate} ${appointment.startTime}`}</Skeleton>
        </p>

        <p className="block w-full truncate text-sm text-muted-foreground">
          <Skeleton
            loading={!isAllLoaded}
            delayTime={delayTime}
            width="100%"
            height="20px"
            style={{ display: 'block' }}
          >
            {locationData?.name ?? '장소를 불러올 수 없습니다'}
          </Skeleton>
        </p>
      </div>
    </Link>
  );
}
