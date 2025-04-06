'use client';

import { useParams } from 'next/navigation';
import { useAppointment } from '@/hooks/useQuery/useAppointment';
import Footer from './footer';
import VisitPlace from './visitPlace';

export default function PlacesToVisit() {
  const params = useParams();
  const id = Number(params.id);

  const { data: appointment } = useAppointment(id);

  if (!appointment) {
    return;
  }

  const locations = appointment.locations.filter((item): item is google.maps.places.PlaceResult & { id: number } => {
    return 'place_id' in item;
  });
  const isEditable = appointment.authority === 'WRITE';

  return (
    <div className="flex flex-grow flex-col space-y-4">
      <h3 className="text-lg font-semibold">방문할 장소</h3>

      <div className="flex flex-grow flex-col space-y-6">
        {locations.length > 0 ? (
          locations.map(location => <VisitPlace key={location.id} place={location} />)
        ) : (
          <div className="flex min-h-32 w-full flex-grow items-center justify-center text-sm text-gray-400">
            방문할 장소가 없습니다
          </div>
        )}
      </div>
      {isEditable && <Footer />}
    </div>
  );
}
