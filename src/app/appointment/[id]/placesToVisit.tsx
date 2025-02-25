'use client';

import { useState } from 'react';
import VisitPlace from './visitPlace';

type PlacesToVisitProps = {
  point: number[] | null;
  places: google.maps.places.PlaceResult[];
  isEditable: boolean;
};

export default function PlacesToVisit({ point, places, isEditable }: PlacesToVisitProps) {
  const [locations, setLocations] = useState<google.maps.places.PlaceResult[]>(places);

  const handleDeleteLocation = (placeId: string) => {
    /* api 요청 */

    setLocations(prev => prev.filter(place => place.place_id !== placeId));
  };

  return (
    <div className="flex flex-grow flex-col space-y-4">
      <h3 className="text-lg font-semibold">방문할 장소</h3>

      <div className="flex flex-grow flex-col space-y-6">
        {locations.length > 0 ? (
          locations.map(location => (
            <VisitPlace
              key={location.place_id}
              place={location}
              point={point}
              isEditable={isEditable}
              deleteLoation={handleDeleteLocation}
            />
          ))
        ) : (
          <div className="flex min-h-32 w-full flex-grow items-center justify-center text-sm text-gray-400">
            방문할 장소가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
