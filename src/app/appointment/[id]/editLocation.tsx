'use client';

import { useState } from 'react';
import Map from '@/components/map';
import { Badge } from '@/components/ui/badge';
import { getCurrentLocation } from '@/libs/map/getCurrentLocation';
import { PlaceDataType, Position } from '@/types/map';

interface EditLocationProps {
  onChange: (value: PlaceDataType) => void;
}

export default function EditLocation({ onChange }: EditLocationProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<Position | null>(null);

  const handleClickEditButton = async () => {
    const position = await getCurrentLocation();
    setCurrentLocation(position);
    setIsOpen(true);
  };

  const handleCloseMap = () => {
    setIsOpen(false);
  };

  const handleSelectLocation = (value: PlaceDataType) => {
    setIsOpen(false);
    onChange(value);
  };
  return (
    <>
      <button onClick={handleClickEditButton}>
        <Badge>편집</Badge>
      </button>
      <Map isOpen={isOpen} currentLocation={currentLocation} onClose={handleCloseMap} onSelect={handleSelectLocation} />
    </>
  );
}
