import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCurrentLocation } from '@/libs/map/getCurrentLocation';
import { Position } from '@/types/map';
import Map from './map';

type LocationInputProps = {
  value: string;
  onChange: (address: { id: string; address: string }) => void;
};

export default function LocationInput({ value, onChange }: LocationInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Position | null>(null);

  const handleButtonClick = async () => {
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
    } catch {
      setCurrentLocation(null);
    } finally {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="relative">
      <Input
        readOnly
        placeholder="장소를 검색해주세요"
        value={value}
        className="cursor-pointer bg-white"
        onClick={handleButtonClick}
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2"
        onClick={handleButtonClick}
      >
        <MapPin className="h-4 w-4" />
      </Button>

      <Map
        isOpen={isModalOpen}
        currentLocation={currentLocation}
        onClose={() => setIsModalOpen(false)}
        onSelect={onChange}
      />
    </div>
  );
}
