'use client';

import { useState } from 'react';
import { Input } from '@/components/ui';
import { getCurrentLocation } from '@/libs/map/getCurrentLocation';
import { Position } from '@/types/map';
import Map from './map';

type LocationInputProps = {
  value: string;
  onChange: (value: { name: string; id: string; address: string }) => Promise<void> | void;
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

  const handleSelectLocation = async (value: google.maps.places.PlaceResult) => {
    if (!value.place_id || !value.formatted_address || !value.name) {
      return;
    }
    await onChange({ id: value.place_id, address: value.formatted_address, name: value.name });
  };

  return (
    <div className="relative">
      <Input
        readOnly
        placeholder="장소를 검색해주세요"
        value={value}
        className="cursor-pointer bg-background"
        onClick={handleButtonClick}
      />
      <Map
        isOpen={isModalOpen}
        currentLocation={currentLocation}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectLocation}
      />
    </div>
  );
}
