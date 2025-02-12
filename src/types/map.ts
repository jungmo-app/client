export interface Position {
  lat: number;
  lng: number;
}

export interface MarkerType {
  name: string | undefined;
  address: string | undefined;
  position: Position;
  placeId: string | undefined;
}

export interface PlaceDataType {
  name: string;
  address: string;
  images: string[];
}

export interface SearchStatusType {
  center: google.maps.LatLng;
  bounds: google.maps.LatLngBounds;
}
