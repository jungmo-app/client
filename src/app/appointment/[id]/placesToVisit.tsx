'use client';

import { useState } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { VisitLocationDataType } from '@/types/gathering';
import Footer from './footer';
import VisitPlace from './visitPlace';

type PlacesToVisitProps = {
  appointmentId: number;
  point: number[] | null;
  visitPlaces: VisitLocationDataType[];
  isEditable: boolean;
};

export default function PlacesToVisit({ appointmentId, point, visitPlaces, isEditable }: PlacesToVisitProps) {
  const router = useRouter();
  const [locations, setLocations] = useState<VisitLocationDataType[]>(visitPlaces);

  const handleDeleteLocation = async (placeId: number) => {
    try {
      await apis.gathering.deleteLocation(appointmentId, placeId);
      setLocations(prev => prev.filter(place => place.id !== placeId));
    } catch (error) {
      const e = error as AxiosError;
      console.log(e.status);
      alert('삭제할 수 없습니다.');
      router.refresh();
    }
  };

  const handleAddLocation = (id: number, value: google.maps.places.PlaceResult) => {
    setLocations(prev => [...prev, { id, place: value }]);
  };

  return (
    <div className="flex flex-grow flex-col space-y-4">
      <h3 className="text-lg font-semibold">방문할 장소</h3>

      <div className="flex flex-grow flex-col space-y-6">
        {locations.length > 0 ? (
          locations.map(location => (
            <VisitPlace
              key={location.id}
              visitPlace={location}
              point={point}
              isEditable={isEditable}
              onDeleteLoation={handleDeleteLocation}
            />
          ))
        ) : (
          <div className="flex min-h-32 w-full flex-grow items-center justify-center text-sm text-gray-400">
            방문할 장소가 없습니다
          </div>
        )}
      </div>
      {isEditable && <Footer id={appointmentId} onAddLocation={handleAddLocation} />}
    </div>
  );
}
