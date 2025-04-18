'use client';

import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { LocateFixed } from 'lucide-react';
import LocationSettingModal from '@/components/modals/locationSettingModal';
import { Button } from '@/components/ui';
import { GOOGLE_MAP_FIELD } from '@/constants/place';
import { isEqualPositionToCenter, isInRange } from '@/libs/map/calculateDistance';
import { getCurrentLocation } from '@/libs/map/getCurrentLocation';
import { PlaceSearchDataType, Position, SearchStatusType } from '@/types/map';

interface GoogleMapLoaderProps {
  markers: PlaceSearchDataType[];
  target?: (typeof GOOGLE_MAP_FIELD)[number][];
  searchStatus?: SearchStatusType | null;
  onResearch?: () => void;
  currentLocation: Position | null;
  onSelect: (value: google.maps.places.PlaceResult) => Promise<void> | void;
  onClose?: () => void;
}

const DEFAULT_POSITION = { lat: 37.498095, lng: 127.02761 };

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2c2c2c' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8a8a8a' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3d3d3d' }],
  },
];

const GoogleMapLoader = forwardRef<google.maps.Map | undefined, GoogleMapLoaderProps>(
  ({ markers, target, searchStatus, currentLocation, onResearch, onSelect, onClose }, ref) => {
    const isDarkMode = window?.matchMedia && window?.matchMedia('(prefers-color-scheme: dark)').matches;
    const mapRef = useRef<google.maps.Map | null>(null);
    const [location, setLocation] = useState<Position>(currentLocation ?? DEFAULT_POSITION);
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
      if (!mapRef.current) {
        return;
      }

      try {
        const position = await getCurrentLocation();
        if (position) {
          setLocation(position);
          mapRef.current.panTo(position);
        }
      } catch {
        alert('위치를 불러올 수 없습니다');
      }
    };

    const handleIdleMap = async () => {
      if (!mapRef.current) return;

      const mapCenter = mapRef.current.getCenter();
      const mapBounds = mapRef.current.getBounds();

      if (!mapCenter || !location) return;

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

    const handleClosePlaceModal = useCallback(
      (entireClose?: boolean) => {
        setClickedId(null);
        if (entireClose && onClose) {
          onClose();
        }
      },
      [onClose]
    );

    const handleClickUpdateButton = () => {
      if (!onResearch) {
        return;
      }
      setIsUpdateButtonVisible(false);
      onResearch();
    };

    return (
      <div className="relative flex-grow bg-background">
        <GoogleMap
          center={currentLocation ?? DEFAULT_POSITION}
          zoom={14}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            styles: isDarkMode ? darkMapStyle : [],
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: false,
            scrollwheel: true,
          }}
          onIdle={handleIdleMap}
          onLoad={map => {
            mapRef.current = map;
            setIsMapLoad(true);
          }}
        >
          {markers.map((marker: PlaceSearchDataType) => (
            <MarkerF
              key={marker.place_id}
              position={marker.location}
              onClick={() => handleClickMarker(marker.place_id)}
            />
          ))}
        </GoogleMap>
        {isButtonVisible && (
          <Button
            className="absolute bottom-[20%] right-4 bg-background [&_svg]:size-5"
            variant="ghost"
            size="icon"
            style={{ borderRadius: '9999px' }}
            aria-label="현재 위치로 이동"
            onClick={handleClickUpdateCenterButton}
          >
            <LocateFixed />
          </Button>
        )}
        {isUpdateVisible && (
          <Button
            variant="ghost"
            className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-background"
            aria-label="현재 위치에서 검색"
            onClick={handleClickUpdateButton}
          >
            현재 위치에서 검색
          </Button>
        )}
        <LocationSettingModal
          isOpen={Boolean(clickedId)}
          target={target}
          placeId={clickedId}
          onClose={handleClosePlaceModal}
          onSelect={onSelect}
        />
      </div>
    );
  }
);

GoogleMapLoader.displayName = 'GoogleMapLoader';

export default GoogleMapLoader;
