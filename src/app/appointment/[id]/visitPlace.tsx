import { MapPin, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { apis } from '@/apis';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { placeTypeTranslations } from '@/constants/place';
import { getDistance } from '@/utils/getDistance';

interface VisitPlaceProps {
  point: number[] | null;
  placeId: string;
  isEditable: boolean;
}

export default async function VisitPlace({ point, placeId, isEditable }: VisitPlaceProps) {
  const placeData = await apis.serverPlace.getDetail(placeId, [
    'name',
    'formatted_address',
    'geometry',
    'photo',
    'icon_background_color',
    'type',
  ]);

  const distance =
    point && placeData?.geometry?.location
      ? getDistance(
          point[0],
          point[1],
          placeData.geometry.location.lat as unknown as number,
          placeData.geometry.location.lng as unknown as number
        )
      : null;
  const tag = await Promise.all(
    placeData?.types
      ? (placeTypeTranslations[placeData.types[0]] ?? (await apis.place.translatePlaceType(placeData.types[0])))
      : '카페'
  );

  return (
    <>
      <div className="rounded-2xl bg-[#f8f8f8] p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${placeData?.icon_background_color}`}
            >
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <div className="truncate font-medium">{placeData?.name ?? ''}</div>
                <Badge variant="secondary">{tag}</Badge>
              </div>
              <div className="text-sm text-gray-500">
                <span className="block truncate">
                  {distance && `${distance[0]} ${distance[1]} • `} {placeData?.formatted_address ?? ''}
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
          {[1, 2, 3].map(i => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                fill
                src="https://picsum.photos/id/517/200/200"
                alt={`Location image ${i}`}
                className="bg-gray-200 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
