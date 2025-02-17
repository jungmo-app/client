'use client';

import { useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLoadScript } from '@react-google-maps/api';
import { getRadius } from '@/libs/map/calculateDistance';
import { MarkerType, Position, SearchStatusType } from '@/types/map';
import GoogleMapLoader from './googleMapLoader';
import Header from './header';
import SearchLocationBox from './searchLocationBox';

interface MapProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: Position | null;
  onSelect: (address: { id: string; address: string }) => void;
}

interface IFormInput {
  inputValue: string;
}

const GOOGLE_MAPS_LIBRARIES: ('places' | 'geometry')[] = ['places', 'geometry'];

export default function Map({ isOpen, onClose, currentLocation, onSelect }: MapProps) {
  const methods = useForm<IFormInput>();
  const mapRef = useRef<google.maps.Map | null>(null);

  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [searchStatus, setSearchStatus] = useState<SearchStatusType | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY as string,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const handleSearchPlace = (value: IFormInput) => {
    if (!mapRef.current || !google.maps || !value.inputValue) {
      return;
    }

    const service = new google.maps.places.PlacesService(mapRef.current);
    const center = mapRef.current.getCenter();
    const bounds = mapRef.current.getBounds();

    if (!center || !bounds) {
      return;
    }

    const radius = getRadius(center, bounds);

    const request = {
      query: value.inputValue,
      fields: ['name', 'geometry', 'place_id', 'adr_address'],
      location: center,
      radius: radius,
    };

    service.textSearch(request, (result, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const newMarkers = result?.map(result => ({
          name: result.name,
          position: { lat: result.geometry?.location?.lat() ?? 0, lng: result.geometry?.location?.lng() ?? 0 },
          placeId: result.place_id,
          address: result.adr_address,
        }));

        if (newMarkers) {
          setMarkers(newMarkers);
          if (newMarkers.length === 1) {
            mapRef.current?.panTo(newMarkers[0].position);
          }
          setSearchStatus({ center, bounds });
        }
      }
    });
  };

  if (loadError) {
    return <div className="flex h-screen w-full items-center justify-center">Google Maps 로드 중 오류 발생</div>;
  }
  if (!isLoaded) {
    return <div className="flex h-screen w-full items-center justify-center">지도 로드 중...</div>;
  }

  return (
    <>
      {isOpen && (
        <div className="z-[100] flex h-screen flex-col bg-white fixed-mobile-top">
          <FormProvider {...methods}>
            <Header onClose={onClose} />
            <SearchLocationBox onSubmit={methods.handleSubmit(handleSearchPlace)} />
            <GoogleMapLoader
              ref={mapRef}
              markers={markers}
              currentLocation={currentLocation}
              searchStatus={searchStatus}
              onResearch={methods.handleSubmit(handleSearchPlace)}
              onSelect={onSelect}
              onClose={onClose}
            />
          </FormProvider>
        </div>
      )}
    </>
  );
}
