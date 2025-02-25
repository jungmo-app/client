export interface Location {
  id: number;
  placeId: string;
}

export interface CreateGatheringRequest {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  meetingLocation: {
    placeId: string;
  };
  memo: string;
  userIds: number[];
}

export interface GatheringUsers {
  userId: number;
  userCode: string;
  userName: string;
  profileImagE: string;
}

export interface DetailGatheringRespose {
  authority: string;
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  memo: string;
  gatheringUsers: GatheringUsers[];
  meetingLocation: Location;
  locations: Location[];
}

export interface LocationDataType {
  name: string;
  address: string;
}

export interface VisitLocationDataType {
  id: number;
  place: google.maps.places.PlaceResult;
}
