import { MapPin, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Place = {
  name: string;
  distance: string;
  address: string;
  bgColor: string;
  iconColor: string;
};

type PlacesToVisitProps = {
  places: Place[];
};

export default function PlacesToVisit({ places }: PlacesToVisitProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">방문할 장소</h3>

      <div className="space-y-6">
        {places.map((place, index) => (
          <div key={index} className="rounded-2xl bg-[#f8f8f8] p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${place.bgColor}`}
                >
                  <MapPin className={`h-5 w-5 ${place.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <div className="truncate font-medium">{place.name}</div>
                    <Badge variant="secondary">카페</Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="block truncate">
                      {place.distance} • {place.address}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="flex-shrink-0 self-start">
                <MoreVertical className="h-5 w-5" />
              </Button>
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
        ))}
      </div>
    </div>
  );
}
