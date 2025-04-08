'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { Map } from '@/components';
import { Badge } from '@/components/ui';
import { placeTypeTranslations } from '@/constants/place';
import { getCurrentLocation } from '@/libs/map/getCurrentLocation';
import { ChangePlaceType, Photos, Position } from '@/types/map';

interface EditLocationProps {
  onChange: (value: ChangePlaceType) => Promise<void>;
  isPending?: boolean;
}

export default function EditLocation({ onChange, isPending }: EditLocationProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<Position | null>(null);

  const handleClickEditButton = async () => {
    const position = await getCurrentLocation();
    setCurrentLocation(position);
    setIsOpen(true);
  };

  const handleCloseMap = () => {
    setIsOpen(false);
  };

  const handleSelectLocation = async (value: google.maps.places.PlaceResult) => {
    setIsOpen(false);
    const tags = await Promise.all(
      value.types
        ? value.types.map(
            async item =>
              placeTypeTranslations[item] ??
              (await queryClient.fetchQuery({
                queryKey: ['translatePlaceType', item],
                queryFn: () => apis.place.translatePlaceType(item),
                staleTime: 1000 * 60 * 60,
              }))
          )
        : []
    );
    onChange({
      placeId: value.place_id ?? '',
      images: value.photos
        ? value.photos.map(photo => {
            const typedPhoto = photo as Photos;
            return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${typedPhoto.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}`;
          })
        : [],
      address: value.formatted_address ?? '',
      name: value.name ?? '',
      tags: tags,
      point: value.geometry,
    });
  };
  return (
    <>
      <button
        type="button"
        aria-label="편집"
        disabled={isPending}
        className="select-none"
        onClick={handleClickEditButton}
      >
        <Badge>편집</Badge>
      </button>
      <Map
        isOpen={isOpen}
        currentLocation={currentLocation}
        title="장소 변경하기"
        target={['name', 'formatted_address', 'icon_background_color', 'geometry', 'photo', 'type', 'place_id']}
        onClose={handleCloseMap}
        onSelect={handleSelectLocation}
      />
    </>
  );
}
