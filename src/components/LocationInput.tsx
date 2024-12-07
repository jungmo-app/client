import { useState } from 'react';
import { MapPin } from 'lucide-react';
import LocationSearchModal from '@/components/modals/LocationSearchModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Location = {
  id: number;
  name: string;
  address: string;
};

type LocationInputProps = {
  value: string;
  onChange: (location: { name: string; address: string }) => void;
};

export default function LocationInput({ value, onChange }: LocationInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLocationSelect = (location: Location) => {
    onChange({
      name: location.name,
      address: location.address,
    });
  };

  return (
    <div className="relative">
      <Input
        readOnly
        placeholder="장소를 검색해주세요"
        value={value}
        className="cursor-pointer bg-white"
        onClick={() => setIsModalOpen(true)}
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2"
        onClick={() => setIsModalOpen(true)}
      >
        <MapPin className="h-4 w-4" />
      </Button>

      <LocationSearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleLocationSelect} />
    </div>
  );
}
