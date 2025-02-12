'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { LocateFixed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isEqualPositionToCenter, isInRange } from '@/libs/map/calculateDistance';
import { getCurrentLocation } from '@/libs/map/getCurrentLocation';
import { MarkerType, Position, SearchStatusType } from '@/types/map';
import LocationSettingModal from './locationSettingModal';

interface GoogleMapLoaderProps {
  markers: MarkerType[];
  searchStatus?: SearchStatusType | null;
  onResearch?: () => void;
  currentLocation: Position;
}

const GoogleMapLoader = forwardRef<google.maps.Map | undefined, GoogleMapLoaderProps>(
  ({ markers, searchStatus, currentLocation, onResearch }, ref) => {
    const mapRef = useRef<google.maps.Map | null>(null);
    const [location, setLocation] = useState<Position>(currentLocation);
    const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);
    const [isUpdateVisible, setIsUpdateButtonVisible] = useState<boolean>(false);
    const [clickedId, setClickedId] = useState<string | null>(null);

    const [isMapLoad, setIsMapLoad] = useState(false);

    useImperativeHandle(ref, () => {
      if (isMapLoad) {
        return mapRef.current as google.maps.Map;
      }
      return undefined;
    }, [isMapLoad]);

    const handleClickUpdateCenterButton = async () => {
      const position = await getCurrentLocation();
      if (!mapRef.current || !position) return;
      setLocation(position);
      mapRef.current.panTo(position);
    };

    const handleIdleMap = async () => {
      if (!mapRef.current) return;

      const mapCenter = mapRef.current.getCenter();
      const mapBounds = mapRef.current.getBounds();

      if (!mapCenter) return;

      if (isEqualPositionToCenter(mapCenter, new google.maps.LatLng(location))) {
        setIsButtonVisible(false);
      } else {
        setIsButtonVisible(true);
      }

      if (!searchStatus || markers.length === 0 || !mapBounds) return;

      if (isInRange(searchStatus.center, searchStatus.bounds, mapCenter)) {
        setIsUpdateButtonVisible(false);
      } else {
        setIsUpdateButtonVisible(true);
      }
    };

    const handleClickMarker = (id: string | undefined) => {
      if (!id) return;
      setClickedId(id);
    };

    const handleClosePlaceModal = () => {
      setClickedId(null);
    };

    return (
      <div className="relative flex-grow">
        <GoogleMap
          center={currentLocation}
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
            setIsMapLoad(true);
          }}
        >
          {markers.map((marker: MarkerType) => (
            <MarkerF
              key={marker.placeId}
              position={marker.position}
              onClick={() => handleClickMarker(marker.placeId)}
            />
          ))}
        </GoogleMap>
        {isButtonVisible && (
          <Button
            className="absolute bottom-[20%] right-4 bg-white [&_svg]:size-5"
            variant="ghost"
            size="icon"
            style={{ borderRadius: '9999px' }}
            onClick={handleClickUpdateCenterButton}
          >
            <LocateFixed />
          </Button>
        )}
        {isUpdateVisible && (
          <Button variant="ghost" className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white" onClick={onResearch}>
            현재 위치에서 검색
          </Button>
        )}
        <LocationSettingModal mapRef={ref} placeId={clickedId} onClose={handleClosePlaceModal} />
      </div>
    );
  }
);

GoogleMapLoader.displayName = 'GoogleMapLoader';

export default GoogleMapLoader;
