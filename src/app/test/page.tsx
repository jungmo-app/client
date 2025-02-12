'use client';

import { useState } from 'react';
import Map from '@/components/map';
import { Button } from '@/components/ui/button';
import { getCurrentLocation } from '@/libs/map/getCurrentLocation';
import { Position } from '@/types/map';

export default function Page() {
  const [currentLocation, setCurrentLocation] = useState<Position | null>(null);
  const handleClickButton = async () => {
    const location = await getCurrentLocation();
    setCurrentLocation(location ?? null);
  };
  return (
    <div className="mx-auto max-w-mobile">
      {currentLocation ? <Map currentLocation={currentLocation} /> : <Button onClick={handleClickButton}>지도</Button>}
    </div>
  );
}
