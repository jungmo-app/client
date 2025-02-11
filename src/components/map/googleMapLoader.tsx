'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { LocateFixed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentLocation } from '@/libs/map/getCurrentLocation';
import { MarkerType } from '@/types/map';

interface GoogleMapLoaderProps {
  markers: MarkerType[];
}

const GoogleMapLoader = forwardRef<google.maps.Map | null, GoogleMapLoaderProps>(({ markers }, ref) => {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null); // 내부에서 사용할 ref
  const [location, setLocation] = useState({ lat: 37.498095, lng: 127.02761 });
  const [center] = useState({ lat: 37.498095, lng: 127.02761 });
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);

  useImperativeHandle(ref, () => mapInstance!, [mapInstance]);

  const handleClickUpdateCenterButton = async () => {
    const location = await getCurrentLocation();
    if (location && mapRef.current) {
      setLocation(location);
      mapRef.current.panTo(location); // 지도 위치 업데이트
      setIsButtonVisible(false);
    }
  };

  const handleIdleMap = () => {
    if (!mapRef.current) return;

    const mapCenter = mapRef.current.getCenter();
    if (
      mapCenter?.lat().toFixed(6) === location.lat.toFixed(6) &&
      mapCenter?.lng().toFixed(6) === location.lng.toFixed(6)
    ) {
      setIsButtonVisible(false);
      return;
    }
    setIsButtonVisible(true);
  };

  return (
    <div className="relative flex-grow">
      <GoogleMap
        center={center}
        zoom={14}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: false,
        }}
        onIdle={handleIdleMap}
        onLoad={map => {
          mapRef.current = map;
          setMapInstance(map);
        }}
      >
        {markers.map((marker: MarkerType) => (
          <MarkerF key={marker.placeId} position={marker.position} />
        ))}
      </GoogleMap>
      {isButtonVisible && (
        <Button
          className="absolute bottom-[10%] right-4 bg-white [&_svg]:size-5"
          variant="ghost"
          size="icon"
          style={{ borderRadius: '9999px' }}
          onClick={handleClickUpdateCenterButton}
        >
          <LocateFixed />
        </Button>
      )}
    </div>
  );
});

GoogleMapLoader.displayName = 'GoogleMapLoader';

export default GoogleMapLoader;
