import { UserDataResponse } from './user';

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

export interface GatheringListResponse {
  id: number;
  profileImage: null | string;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  meetingLocation: string;
}

export interface DetailGatheringRespose {
  authority: string;
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  memo: string;
  gatheringUsers: UserDataResponse[];
  meetingLocation: Location;
  locations: Location[];
}

export interface DetailGatheringType extends Omit<DetailGatheringRespose, 'meetingLocation'> {
  meetingLocation: {
    placeId: string;
    placeName: string | undefined;
    placeAddress: string | undefined;
  };
}

export interface LocationDataType {
  name: string;
  address: string;
}

export interface VisitLocationDataType {
  id: number;
  place: google.maps.places.PlaceResult;
}
