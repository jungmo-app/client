'use client';

import { useCallback, useState } from 'react';
import { apis } from '@/apis';
import Map from '@/components/map';
import { Button } from '@/components/ui/button';
import { getCurrentLocation } from '@/libs/map/getCurrentLocation';
import { Position } from '@/types/map';

interface FooterProps {
  id: number;
  onAddLocation: (id: number, value: google.maps.places.PlaceResult) => void;
}

export default function Footer({ id, onAddLocation }: FooterProps) {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<Position | null>(null);

  const handleClickButton = async () => {
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
    } catch {
      setCurrentLocation(null);
    } finally {
      setIsOpenModal(true);
    }
  };

  const handleCloseMap = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const handleSelectLocation = async (value: google.maps.places.PlaceResult) => {
    if (!value.place_id) {
      return;
    }
    try {
      const { data } = await apis.gathering.addLocation(id, value.place_id);
      if (!data) {
        alert('장소 추가에 실패하였습니다');
        return;
      }
      onAddLocation(data, value);
    } catch {
      alert('장소 추가에 실패하였습니다');
    }
  };
  return (
    <>
      <div className="z-10 border-t bg-white fixed-mobile-bottom">
        <div className="p-4">
          <Button className="w-full rounded-xl" size="lg" onClick={handleClickButton}>
            장소 추가하기
          </Button>
        </div>
      </div>
      <Map
        isOpen={isOpenModal}
        currentLocation={currentLocation}
        target={['name', 'formatted_address', 'icon_background_color', 'geometry', 'photo', 'type', 'place_id']}
        onClose={handleCloseMap}
        onSelect={handleSelectLocation}
      />
    </>
  );
}
