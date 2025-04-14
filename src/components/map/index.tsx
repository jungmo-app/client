'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLoadScript } from '@react-google-maps/api';
import { Header } from '@/components';
import { GOOGLE_MAP_FIELD } from '@/constants/place';
import { MarkerType, Position, SearchStatusType } from '@/types/map';
import GoogleMapLoader from './googleMapLoader';
import './map.css';
import SearchLocationBox from './searchLocationBox';

interface MapProps {
  isOpen: boolean;
  target?: (typeof GOOGLE_MAP_FIELD)[number][];
  onClose: () => void;
  currentLocation: Position | null;
  onSelect: (value: google.maps.places.PlaceResult) => Promise<void> | void;
  title?: string;
}

interface IFormInput {
  inputValue: string;
}

const GOOGLE_MAPS_LIBRARIES: ('places' | 'geometry')[] = ['places', 'geometry'];

export default function Map({ isOpen, currentLocation, title, target, onSelect, onClose }: MapProps) {
  const methods = useForm<IFormInput>();
  const mapRef = useRef<google.maps.Map | null>(null);

  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [searchStatus, setSearchStatus] = useState<SearchStatusType | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY as string,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const handleClose = useCallback(() => {
    setMarkers([]);
    methods.setValue('inputValue', '');
    onClose();
  }, [methods, onClose]);

  const handleSelect = useCallback(
    async (value: google.maps.places.PlaceResult) => {
      setMarkers([]);
      methods.setValue('inputValue', '');
      await onSelect(value);
    },
    [methods, onSelect]
  );

  const handleSearchPlace = async (value: IFormInput) => {
    if (!mapRef.current || !google.maps || !value.inputValue) {
      return;
    }

    const { Place } = (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary;

    const center = mapRef.current.getCenter();
    const bounds = mapRef.current.getBounds();

    if (!bounds || !center) {
      return;
    }

    try {
      const { places } = await Place.searchByText({
        textQuery: value.inputValue,
        fields: ['id', 'location', 'formattedAddress'],
        locationBias: bounds,
      });

      const newMarkers = places.map(place => ({
        name: place.displayName ?? '',
        position: {
          lat: place.location?.lat() ?? 0,
          lng: place.location?.lng() ?? 0,
        },
        placeId: place.id,
        address: place.formattedAddress ?? '',
      }));

      if (newMarkers.length > 0) {
        setMarkers(newMarkers);

        if (newMarkers.length === 1) {
          mapRef.current?.panTo(newMarkers[0].position);
        }

        setSearchStatus({ center, bounds });
      }
    } catch (error) {
      console.error('Place search error:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return;
    }
    document.body.style.overflow = 'auto';
  }, [isOpen]);

  if (loadError && isOpen) {
    return <div className="flex h-screen w-full items-center justify-center">Google Maps 로드 중 오류 발생</div>;
  }
  if (!isLoaded && isOpen) {
    return <div className="flex h-screen w-full items-center justify-center">지도 로드 중...</div>;
  }

  return (
    <>
      {isOpen && (
        <div className="fixed left-0 top-0 z-[100] h-screen w-screen bg-background">
          <div className="flex h-screen flex-col fixed-mobile-top">
            <FormProvider {...methods}>
              <Header title={title ?? '장소 추가하기'} style={{ position: 'relative' }} onClose={handleClose} />
              <SearchLocationBox onSubmit={methods.handleSubmit(handleSearchPlace)} />
              <GoogleMapLoader
                ref={mapRef}
                markers={markers}
                target={target}
                currentLocation={currentLocation}
                searchStatus={searchStatus}
                onResearch={methods.handleSubmit(handleSearchPlace)}
                onSelect={handleSelect}
                onClose={handleClose}
              />
            </FormProvider>
          </div>
        </div>
      )}
    </>
  );
}
