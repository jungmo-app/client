'use client';

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { apis } from '@/apis';
import Map from '@/components/map';
import { Button } from '@/components/ui';
import { getCurrentLocation } from '@/libs/map/getCurrentLocation';
import { DetailGatheringType } from '@/types/gathering';
import { Position } from '@/types/map';

export default function Footer() {
  const params = useParams();
  const id = Number(params.id);
  const queryClient = useQueryClient();

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
      const response = await apis.gathering.addLocation(id, value.place_id);
      if (response) {
        queryClient.setQueryData<DetailGatheringType>(['appointment', id], prev =>
          prev ? { ...prev, locations: [...prev.locations, { ...value, id: response }] } : undefined
        );
      }
    } catch {
      alert('장소를 추가할 수 없습니다');
    }
  };
  return (
    <>
      <div className="z-10 border-t bg-background fixed-mobile-bottom">
        <div className="bg-background p-4">
          <Button className="w-full rounded-xl" size="lg" aria-label="장소 추가" onClick={handleClickButton}>
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
