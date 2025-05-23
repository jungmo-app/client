'use client';

import { useCallback, useState } from 'react';
import { useParams } from 'next/navigation';
import Map from '@/components/map';
import { Button } from '@/components/ui';
import { useAddLocation } from '@/hooks/useMutate/useAddLocation';
import { useAppointment } from '@/hooks/useQuery/useAppointment';
import { getCurrentLocation } from '@/libs/map/getCurrentLocation';
import { Position } from '@/types/map';
import { ApiError } from '@/utils/error';

export default function Footer() {
  const params = useParams();
  const id = Number(params.id);

  const { data: appointment } = useAppointment(id);

  const handleError = (error: ApiError) => {
    if (error.code === 'GL003') {
      alert('이미 모임에 해당장소가 포함되어 있습니다.');
      return;
    }
    alert('장소 추가에 실패하였습니다');
  };

  const { mutate: addLocation, isPending } = useAddLocation(id, { onError: handleError });

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
    addLocation(value);
  };

  if (!appointment || appointment.authority !== 'WRITE') {
    return;
  }

  return (
    <div className="sticky bottom-0 border-t">
      <div className="z-10 bg-background">
        <div className="bg-background p-4">
          <Button
            className="w-full rounded-xl"
            size="lg"
            aria-label="장소 추가"
            disabled={isPending}
            onClick={handleClickButton}
          >
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
    </div>
  );
}
