'use client';

import { useParams } from 'next/navigation';
import { useAppointment } from '@/hooks/useQuery/useAppointment';
import MainInfoSection from './mainInfoSection';
import MainLocation from './mainLocation';
import PlacesToVisit from './placesToVisit';

export default function AppointmentDetail() {
  const params = useParams();
  const id = Number(params.id);

  const { data: appointment } = useAppointment(id);

  if (!appointment) {
    return <div className="flex h-screen items-center justify-center">해당 약속을 불러올 수 없습니다.</div>;
  }

  const isEditable = appointment.authority === 'WRITE';

  return (
    <main className={`relative flex w-full flex-grow px-4 pb-${isEditable ? '20' : '14'}`}>
      <div className="flex w-full flex-col space-y-6 py-4">
        <MainInfoSection />
        <MainLocation />
        <PlacesToVisit />
      </div>
    </main>
  );
}
