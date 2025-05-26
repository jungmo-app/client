'use client';

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import LoadingIcon from '@/components/common/loadingIcon';
import { Button } from '@/components/ui';
import { useAppointmentList } from '@/hooks/useQuery/useAppointmentList';
import AppointmentCard from './appointmentCard';

export default function AppointmentList() {
  const queryClient = useQueryClient();
  const { data: appointments, isPending } = useAppointmentList();
  const [cardLoad, setCardLoad] = useState<Set<number>>(() => {
    const set = new Set<number>();
    appointments?.forEach(appointment => {
      const location = queryClient.getQueryData<google.maps.places.PlaceResult>([
        'location',
        appointment.meetingLocation,
        'name',
      ]);

      if (location?.name) {
        set.add(appointment.id);
      }
    });
    return set;
  });

  const handleCardReady = useCallback((id: number) => {
    setCardLoad(prev => new Set(prev).add(id));
  }, []);

  const isLoaded = appointments?.every(appointment => cardLoad.has(appointment.id)) ?? true;

  return (
    <div className="flex flex-grow flex-col space-y-6 overflow-auto p-4">
      <h2 className="text-lg font-semibold">나의 일정 {!isPending && appointments?.length}</h2>
      {isPending ? (
        <div className="flex flex-grow items-center justify-center">
          <LoadingIcon />
        </div>
      ) : (
        <>
          {appointments?.map(appointment => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              isAllLoaded={isLoaded}
              onLoad={() => handleCardReady(appointment.id)}
            />
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
