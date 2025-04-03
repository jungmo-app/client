'use client';

import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import LoadingIcon from '@/components/common/loadingIcon';
import { Button } from '@/components/ui';
import { useAppointmentList } from '@/hooks/useQuery/useAppointmentList';

export default function AppointmentList() {
  const { data: appointments, isPending } = useAppointmentList();

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
                  src={appointment.profileImage ?? '/sample.jpg'}
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
