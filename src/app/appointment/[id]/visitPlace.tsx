'use client';

import { useEffect, useState } from 'react';
import { MapPin, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { apis } from '@/apis';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { placeTypeTranslations } from '@/constants/place';
import { Photos } from '@/types/map';
import { getDistance } from '@/utils/getDistance';

interface VisitPlaceProps {
  point: number[] | null;
  place: google.maps.places.PlaceResult;
  isEditable: boolean;
  deleteLoation: (placeId: string) => void;
}

export default function VisitPlace({ place, point, isEditable }: VisitPlaceProps) {
  const [tag, setTag] = useState(
    place.types && placeTypeTranslations[place.types[0]] ? placeTypeTranslations[place.types[0]] : ''
  );
  const distance =
    point && place?.geometry?.location
      ? getDistance(
          point[0],
          point[1],
          place.geometry.location.lat as unknown as number,
          place.geometry.location.lng as unknown as number
        )
      : null;

  useEffect(() => {
    const getTag = async () => {
      if (!place.types || (place.types && placeTypeTranslations[place.types[0]])) {
        return;
      }
      const tagName = await apis.place.translatePlaceType(place.types[0]);
      if (tagName) {
        setTag(tagName);
      }
    };
    getTag();
  }, [place]);

  return (
    <>
      <div className="rounded-2xl bg-[#f8f8f8] p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${place?.icon_background_color}`}
            >
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <div className="truncate font-medium">{place?.name ?? ''}</div>
                <Badge variant="secondary">{tag}</Badge>
              </div>
              <div className="text-sm text-gray-500">
                <span className="block truncate">
                  {distance && `${distance[0]} ${distance[1]} • `} {place?.formatted_address ?? ''}
                </span>
              </div>
            </div>
          </div>
          {isEditable && (
            <Button variant="ghost" size="icon" className="flex-shrink-0 self-start">
              <MoreVertical className="h-5 w-5" />
            </Button>
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
    </>
  );
}
