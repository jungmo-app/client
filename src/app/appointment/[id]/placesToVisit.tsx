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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">방문할 장소</h3>

      <div className="space-y-6">
        {locations.map(location => (
          <VisitPlace
            key={location.place_id}
            place={location}
            point={point}
            isEditable={isEditable}
            deleteLoation={handleDeleteLocation}
          />
        ))}
      </div>
    </div>
  );
}
