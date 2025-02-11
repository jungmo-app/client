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
