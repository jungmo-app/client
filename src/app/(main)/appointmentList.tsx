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
  const { date } = useContext(DateContext);
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState(appointmentData);
  const isInitial = useRef<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      if (isInitial.current) {
        isInitial.current = false;
        return;
      }
      setIsLoading(true);
      const listData = await apis.gathering.getList(date);
      if (listData) {
        const list = await Promise.all(
          listData.map(async item => {
            const location = await apis.place.getDetail(item.meetingLocation, ['name']);
            return { ...item, meetingLocation: location?.name ?? '' };
          })
        );
        setAppointments(list);
        setIsLoading(false);
        return;
      }
      setAppointments([]);
      setIsLoading(false);
    };
    getData();
  }, [appointmentData, date]);

  return (
    <div className="flex flex-grow flex-col space-y-6 p-4">
      <h2 className="text-lg font-semibold">나의 일정 {!isLoading && appointments.length}</h2>
      {isLoading ? (
        <div className="flex flex-grow items-center justify-center">
          <LoadingIcon />
        </div>
      ) : (
        <>
          {appointments.map(appointment => (
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
              <Button variant="ghost" size="icon">
                <span className="sr-only">More options</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
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
