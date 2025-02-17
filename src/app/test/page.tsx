'use client';

import { useState } from 'react';
import Map from '@/components/map';
import { Button } from '@/components/ui/button';
import { getCurrentLocation } from '@/libs/map/getCurrentLocation';
import { Position } from '@/types/map';

export default function Page() {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<Position | null>(null);
  const handleClickButton = async () => {
    try {
      const location = await getCurrentLocation();
      console.log(location);
      setCurrentLocation(location);
    } catch {
      setCurrentLocation(null);
    } finally {
      setIsClicked(true);
    }
  };
  return (
    <div className="mx-auto max-w-mobile">
      {isClicked ? <Map currentLocation={currentLocation} /> : <Button onClick={handleClickButton}>지도</Button>}
    </div>
  );
}
