import { Calendar, PenLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type MainInfoSectionProps = {
  title: string;
  datetime: string;
  description: string;
};

export default function MainInfoSection({ title, datetime, description }: MainInfoSectionProps) {
  return (
    <div className="space-y-4 rounded-2xl p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{title}</h2>
          <Badge variant="secondary" className="rounded-full">
            편집
          </Badge>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{datetime}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <PenLine className="mr-2 h-4 w-4" />
          <span>{description}</span>
        </div>
      </div>
    </div>
  );
}
