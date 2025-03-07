'use client';

import { useState } from 'react';
import { apis } from '@/apis';
import { Map } from '@/components';
import { Badge } from '@/components/ui';
import { placeTypeTranslations } from '@/constants/place';
import { getCurrentLocation } from '@/libs/map/getCurrentLocation';
import { Photos, PlaceDataType, Position } from '@/types/map';

interface EditLocationProps {
  onChange: (value: PlaceDataType) => Promise<void>;
}

export default function EditLocation({ onChange }: EditLocationProps) {
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
        ? value.types.map(async item => placeTypeTranslations[item] ?? (await apis.place.translatePlaceType(item)))
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
    });
  };
  return (
    <>
      <button onClick={handleClickEditButton}>
        <Badge>편집</Badge>
      </button>
      <Map
        isOpen={isOpen}
        currentLocation={currentLocation}
        target={['place_id', 'photo', 'formatted_address', 'name', 'type']}
        title="장소 변경하기"
        onClose={handleCloseMap}
        onSelect={handleSelectLocation}
      />
    </>
  );
}
