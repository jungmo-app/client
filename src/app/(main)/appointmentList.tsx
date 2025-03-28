'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { apis } from '@/apis';
import LoadingIcon from '@/components/common/loadingIcon';
import { Button } from '@/components/ui';
import { DateContext } from '@/contexts/DateProvider';
import { GatheringListResponse } from '@/types/gathering';

interface AppointmentListProps {
  appointmentData: GatheringListResponse[];
}

const IMAGE = 'https://picsum.photos/id/517/200/200';

export default function AppointmentList({ appointmentData }: AppointmentListProps) {
  const { date, appointments, updateAppointment } = useContext(DateContext);
  const [isLoading, setIsLoading] = useState(false);
  const isInitial = useRef<boolean>(true);

  const currentAppointment = appointments ?? appointmentData;

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const listData = await apis.gathering.getList(date);
      if (listData) {
        const list = await Promise.all(
          listData.map(async item => {
            const location = await apis.place.getDetail(item.meetingLocation, ['name']);
            return { ...item, meetingLocation: location?.name ?? '' };
          })
        );
        updateAppointment(list);
        setIsLoading(false);
        return;
      }
      updateAppointment([]);
      setIsLoading(false);
    };

    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    getData();
  }, [date, updateAppointment]);

  return (
    <div className="flex flex-grow flex-col space-y-6 p-4">
      <h2 className="text-lg font-semibold">나의 일정 {!isLoading && currentAppointment.length}</h2>
      {isLoading ? (
        <div className="flex flex-grow items-center justify-center">
          <LoadingIcon />
        </div>
      ) : (
        <>
          {currentAppointment.map(appointment => (
            <Link key={appointment.id} href={`/appointment/${appointment.id}`} className="flex items-center gap-4 p-2">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  fill
                  src={appointment.profileImage ?? IMAGE}
                  alt={appointment.title}
                  className="object-cover"
                  priority={true}
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="truncate font-medium">{appointment.title}</h4>
                <p className="truncate text-sm text-muted-foreground">{`${appointment.startDate} ${appointment.startTime}`}</p>
                <p className="truncate text-sm text-muted-foreground">{appointment.meetingLocation}</p>
              </div>
            </Link>
          ))}
          <div className="mx-2">
            <Button asChild variant="outline" className="h-auto w-full justify-start gap-2 py-4">
              <Link href="/appointment/create">
                <PlusCircle className="h-5 w-5 text-blue-500" />
                <span className="text-muted-foreground">새로운 일정을 추가해보세요</span>
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
