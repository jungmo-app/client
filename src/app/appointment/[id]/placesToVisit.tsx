import { Location } from '@/types/gathering';
import VisitPlace from './visitPlace';

type PlacesToVisitProps = {
  point: number[] | null;
  places: Location[];
  isEditable: boolean;
};

export default function PlacesToVisit({ point, places, isEditable }: PlacesToVisitProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">방문할 장소</h3>

      <div className="space-y-6">
        {places.map(location => (
          <VisitPlace key={location.id} placeId={location.placeId} point={point} isEditable={isEditable} />
        ))}
      </div>
    </div>
  );
}
