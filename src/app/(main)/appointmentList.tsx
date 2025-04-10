'use client';

import { useCallback, useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import LoadingIcon from '@/components/common/loadingIcon';
import { Button } from '@/components/ui';
import { useAppointmentList } from '@/hooks/useQuery/useAppointmentList';
import AppointmentCard from './appointmentCard';

export default function AppointmentList() {
  const { data: appointments, isPending } = useAppointmentList();
  const [cardLoad, setCardLoad] = useState<boolean[]>([]);

  useEffect(() => {
    if (appointments) {
      setCardLoad(new Array(appointments.length).fill(false));
    }
  }, [appointments]);

  const handleCardReady = useCallback((index: number) => {
    setCardLoad(prev => prev.map((isLoaded, i) => (i === index ? true : isLoaded)));
  }, []);

  const isLoaded = cardLoad.every(Boolean);

  return (
    <div className="flex flex-grow flex-col space-y-6 p-4">
      <h2 className="text-lg font-semibold">나의 일정 {!isPending && appointments?.length}</h2>
      {isPending ? (
        <div className="flex flex-grow items-center justify-center">
          <LoadingIcon />
        </div>
      ) : (
        <>
          {appointments?.map((appointment, i) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              isAllLoaded={!isLoaded}
              onLoad={() => handleCardReady(i)}
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
