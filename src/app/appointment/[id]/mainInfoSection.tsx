import { Calendar, PenLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DetailGatheringRespose } from '@/types/gathering';

type MainInfoSectionProps = {
  appointment: DetailGatheringRespose;
};

export default function MainInfoSection({ appointment }: MainInfoSectionProps) {
  return (
    <div className="space-y-4 rounded-2xl p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{appointment.title}</h2>
          <Badge variant="secondary" className="rounded-full">
            편집
          </Badge>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{appointment.startDate}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <PenLine className="mr-2 h-4 w-4" />
          <span>{appointment.memo}</span>
        </div>
      </div>
    </div>
  );
}
