import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { cn } from '@/utils/styles';

type MainLocationProps = {
  location: {
    name: string;
    address: string;
  };
  tags: string[];
};

const MainLocation = ({ location, tags }: MainLocationProps) => {
  return (
    <div className="rounded-2xl pb-5">
      <div className="rounded-2xl bg-[#f8f8f8] p-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="flex-1 font-medium">{location.name}</h3>
          <Badge>편집</Badge>
        </div>
        <p className="mt-1 text-sm text-gray-500">{location.address}</p>
      </div>

      <div className="mt-4 flex gap-2 px-4">
        {tags.map(tag => (
          <Link
            key={tag}
            href={`/search?query=${tag}`}
            className={cn(badgeVariants({ variant: 'secondary' }), '!bg-blue-50 !text-blue-500')}
          >
            + {tag}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MainLocation;
