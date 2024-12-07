import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

// 임시 장소 데이터 (실제로는 API 연동 필요)
const PLACES = [
  { id: 1, name: '스타벅스 강남점', address: '서울 강남구 테헤란로 123' },
  { id: 2, name: '투썸플레이스 역삼점', address: '서울 강남구 역삼로 456' },
  { id: 3, name: '이디야커피 삼성점', address: '서울 강남구 삼성로 789' },
];

type Location = {
  id: number;
  name: string;
  address: string;
};

type LocationSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: Location) => void;
};

export default function LocationSearchModal({ isOpen, onClose, onSelect }: LocationSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaces = PLACES.filter(
    place =>
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlaceSelect = (place: Location) => {
    onSelect(place);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>장소 검색</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex h-[calc(100vh-8rem)] flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="장소명으로 검색"
              className="pl-8"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {filteredPlaces.map(place => (
                <button
                  key={place.id}
                  className="flex w-full items-center gap-2 px-2 py-2"
                  onClick={() => handlePlaceSelect(place)}
                >
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <div className="text-left">
                    <div className="font-medium">{place.name}</div>
                    <div className="text-sm text-muted-foreground">{place.address}</div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
