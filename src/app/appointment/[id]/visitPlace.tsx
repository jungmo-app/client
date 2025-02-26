'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { MapPin, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { apis } from '@/apis';
import LocationSettingModal from '@/components/map/locationSettingModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent } from '@/components/ui/popover';
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
  const [tag, setTag] = useState<string[] | null>(
    visitPlace.place.types ? visitPlace.place.types.map(item => placeTypeTranslations[item] ?? '') : null
  );
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenSetting, setIsOpenSetting] = useState<boolean>(false);

  const distance =
    point && visitPlace.place?.geometry?.location
      ? getDistance(
          point[0],
          point[1],
          visitPlace.place.geometry.location.lat as unknown as number,
          visitPlace.place.geometry.location.lng as unknown as number
        )
      : null;

  const detailData = {
    placeId: visitPlace.place.place_id ?? '',
    images:
      visitPlace.place.photos?.map(photo => {
        const typedPhoto = photo as Photos;
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${typedPhoto.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}`;
      }) ?? [],
    address: visitPlace.place.formatted_address ?? '',
    name: visitPlace.place.name ?? '',
    tags: tag ?? [],
  };

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

  const handleDeleteLocation = async () => {
    setIsOpenSetting(false);
    await onDeleteLoation(visitPlace.id);
  };

  useEffect(() => {
    const getTag = async () => {
      if (!visitPlace.place.types) {
        return;
      }

      const tagData = await Promise.all(
        visitPlace.place.types.map(
          async item => placeTypeTranslations[item] ?? (await apis.place.translatePlaceType(item))
        )
      );
      setTag(tagData);
    };
    getTag();
  }, [visitPlace]);

  return (
    <>
      <div className="cursor-pointer rounded-2xl bg-[#f8f8f8] p-4" onClick={handleClickWrapper}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${visitPlace.place?.icon_background_color}`}
            >
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <div className="truncate font-medium">{visitPlace.place?.name ?? ''}</div>
                {tag && <Badge variant="secondary">{tag[0]}</Badge>}
              </div>
              <div className="text-sm text-gray-500">
                <span className="block truncate">
                  {distance && `${distance[0]} ${distance[1]} • `} {visitPlace.place?.formatted_address ?? ''}
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
          {visitPlace.place.photos?.slice(0, 3).map(photo => {
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
        placeId={visitPlace.place.place_id ?? null}
        locationData={detailData}
        onClose={handleClosePlaceModal}
      />
    </>
  );
}
