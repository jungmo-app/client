'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { MapPin, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { apis } from '@/apis';
import LocationSettingModal from '@/components/modals/locationSettingModal';
import { Badge, Button, Popover, PopoverContent } from '@/components/ui';
import { placeTypeTranslations } from '@/constants/place';
import { VisitLocationDataType } from '@/types/gathering';
import { Photos } from '@/types/map';
import { getDistance } from '@/utils/getDistance';

interface VisitPlaceProps {
  point: number[] | null;
  visitPlace: VisitLocationDataType;
  isEditable: boolean;
  onDeleteLoation: (placeId: number) => Promise<void>;
}

export default function VisitPlace({ visitPlace, point, onDeleteLoation, isEditable }: VisitPlaceProps) {
  const popOverRef = useRef<HTMLDivElement>(null);
  const locationData = visitPlace.place;
  const [tag, setTag] = useState<string>(
    placeTypeTranslations[locationData.types ? locationData.types[0] : 'none'] ?? ''
  );
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenSetting, setIsOpenSetting] = useState<boolean>(false);

  const distance =
    point && locationData?.geometry?.location
      ? getDistance(
          point[0],
          point[1],
          locationData.geometry.location.lat as unknown as number,
          locationData.geometry.location.lng as unknown as number
        )
      : null;

  const handleClickWrapper = (e: React.MouseEvent) => {
    if (popOverRef.current?.contains(e.target as Node)) {
      return;
    }
    setIsOpenModal(true);
  };

  const handleClosePlaceModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const handleOpenPopover = (value: boolean) => {
    setIsOpenSetting(value);
  };

  const handleDeleteLocation = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpenSetting(false);
    await onDeleteLoation(visitPlace.id);
  };

  useEffect(() => {
    const getTag = async () => {
      if (!locationData.types || placeTypeTranslations[locationData.types[0]]) {
        return;
      }

      const tagData = (await apis.place.translatePlaceType(locationData.types[0])) ?? '';
      setTag(tagData);
    };
    getTag();
  }, [locationData]);

  return (
    <>
      <div className="cursor-pointer rounded-2xl bg-[#f8f8f8] p-4" onClick={handleClickWrapper}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${locationData?.icon_background_color}`}
            >
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <div className="truncate font-medium">{locationData?.name ?? ''}</div>
                {tag && <Badge variant="secondary">{tag}</Badge>}
              </div>
              <div className="text-sm text-gray-500">
                <span className="block truncate">
                  {distance && `${distance[0]} ${distance[1]} • `} {locationData?.formatted_address ?? ''}
                </span>
              </div>
            </div>
          </div>
          {isEditable && (
            <div ref={popOverRef}>
              <Popover open={isOpenSetting} onOpenChange={handleOpenPopover}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex-shrink-0 self-start">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="flex -translate-x-8 items-center justify-center p-0 text-sm"
                  style={{ width: '88px', height: '48px' }}
                >
                  <Button variant="ghost" onClick={handleDeleteLocation}>
                    삭제하기
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {locationData.photos?.slice(0, 3).map(photo => {
            const typedPhoto = photo as Photos;

            return (
              <div key={typedPhoto.photo_reference} className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  priority
                  fill
                  src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${typedPhoto.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}`}
                  alt={`Location image ${typedPhoto.photo_reference}`}
                  sizes="140px 140px"
                  className="bg-gray-200 object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>
      <LocationSettingModal
        isOpen={isOpenModal}
        placeId={locationData.place_id ?? null}
        locationData={locationData}
        onClose={handleClosePlaceModal}
      />
    </>
  );
}
