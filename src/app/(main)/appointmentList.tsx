'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useShallow } from 'zustand/react/shallow';
import { apis } from '@/apis';
import LoadingIcon from '@/components/common/loadingIcon';
import { Button } from '@/components/ui';
import { useDateStore } from '@/store/appointmentStore';
import { GatheringListResponse } from '@/types/gathering';
import { isSameDay } from '@/utils/date';

interface AppointmentListProps {
  appointmentData: GatheringListResponse[];
}

const IMAGE = 'https://picsum.photos/id/517/200/200';

export default function AppointmentList({ appointmentData }: AppointmentListProps) {
  const [isPending, setIsPending] = useState(false);
  const [appointments, setAppointments] = useState<GatheringListResponse[]>(appointmentData);

  const { date } = useDateStore(
    useShallow(state => ({
      date: state.date,
    }))
  );

  const isInitial = useRef<boolean>(isSameDay(date, new Date()));

  const { refetch } = useQuery({
    queryKey: ['appointments', date.getFullYear(), date.getMonth() + 1, date.getDate()],
    initialData: appointmentData,
    queryFn: () => apis.gathering.getList(date),
    enabled: false,
  });

  useEffect(() => {
    const fetching = async () => {
      if (isInitial.current) {
        isInitial.current = false;
        return;
      }

      setIsPending(true);
      const { data } = await refetch();
      if (data) {
        setAppointments(data);
      }
      setIsPending(false);
    };

    fetching();
  }, [date, refetch]);

  return (
    <div className="flex flex-grow flex-col space-y-6 p-4">
      <h2 className="text-lg font-semibold">나의 일정 {!isPending && appointments?.length}</h2>
      {isPending ? (
        <div className="flex flex-grow items-center justify-center">
          <LoadingIcon />
        </div>
      ) : (
        <>
          {appointments?.map(appointment => (
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
                <h3 className="truncate font-medium">{appointment.title}</h3>
                <p className="truncate text-sm text-muted-foreground">{`${appointment.startDate} ${appointment.startTime}`}</p>
                <p className="truncate text-sm text-muted-foreground">{appointment.meetingLocation}</p>
              </div>
            </Link>
          ))}
          <div className="mx-2">
            <Button asChild variant="outline" className="h-auto w-full justify-start gap-2 py-4" aria-label="일정 추가">
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
