'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { MapPin, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { apis } from '@/apis';
import LocationSettingModal from '@/components/modals/locationSettingModal';
import { Badge, Button, Popover, PopoverContent } from '@/components/ui';
import { placeTypeTranslations } from '@/constants/place';
import { useDeleteLocation } from '@/hooks/useMutate/useDeleteLocation';
import { useAppointment } from '@/hooks/useQuery/useAppointment';
import { Photos } from '@/types/map';
import { getDistance } from '@/utils/getDistance';

interface VisitPlaceProps {
  place: google.maps.places.PlaceResult & { id: number };
}

export default function VisitPlace({ place }: VisitPlaceProps) {
  const params = useParams();
  const id = Number(params.id);

  const popOverRef = useRef<HTMLDivElement>(null);

  const [tag, setTag] = useState<string>(placeTypeTranslations[place.types ? place.types[0] : 'none'] ?? '');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenSetting, setIsOpenSetting] = useState<boolean>(false);

  const { data: appointment } = useAppointment(id);
  const { mutate: deleteLocation, isPending: isPendingDeleteLocation } = useDeleteLocation(id);

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
    if (!place.id) {
      return;
    }
    setIsOpenSetting(false);
    deleteLocation(place.id);
  };

  useEffect(() => {
    const getTag = async () => {
      if (!place?.types || placeTypeTranslations[place.types[0]]) {
        return;
      }

      const tagData = (await apis.place.translatePlaceType(place.types[0])) ?? '';
      setTag(tagData);
    };
    getTag();
  }, [place]);

  if (!appointment) {
    return;
  }

  const distance = getDistance(
    appointment.meetingLocation.point?.location?.lat as unknown as number,
    appointment.meetingLocation.point?.location?.lng as unknown as number,
    place.geometry?.location?.lat as unknown as number,
    place.geometry?.location?.lng as unknown as number
  );

  const isEditable = appointment.authority === 'WRITE';

  return (
    <>
      <div className="cursor-pointer rounded-2xl bg-[#f8f8f8] p-4" onClick={handleClickWrapper}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${place.icon_background_color}`}
            >
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <div className="truncate font-medium">{place.name ?? ''}</div>
                {tag && <Badge variant="secondary">{tag}</Badge>}
              </div>
              <div className="text-sm text-gray-500">
                <span className="block truncate">
                  {distance && `${distance[0]} ${distance[1]} • `} {place.formatted_address ?? ''}
                </span>
              </div>
            </div>
          </div>
          {isEditable && (
            <div ref={popOverRef}>
              <Popover open={isOpenSetting} onOpenChange={handleOpenPopover}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex-shrink-0 self-start" aria-label="더보기">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="flex -translate-x-8 items-center justify-center p-0 text-sm"
                  style={{ width: '88px', height: '48px' }}
                >
                  <Button
                    variant="ghost"
                    aria-label="삭제"
                    disabled={isPendingDeleteLocation}
                    onClick={handleDeleteLocation}
                  >
                    삭제하기
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {place.photos?.slice(0, 3).map(photo => {
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
        placeId={place.place_id ?? null}
        locationData={place}
        onClose={handleClosePlaceModal}
      />
    </>
  );
}
