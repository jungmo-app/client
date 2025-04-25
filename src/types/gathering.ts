import { z } from 'zod';
import { createAppointmentSchema } from '@/schemas/appointment';
import { UserDataResponse } from './user';

export interface Location {
  id: number;
  placeId: string;
}

export type AppointmentFormDataType = z.infer<typeof createAppointmentSchema>;

export interface CreateGatheringRequest {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  meetingLocation: {
    placeId: string;
  };
  memo: string | null;
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

export interface DetailGatheringType extends Omit<DetailGatheringRespose, 'meetingLocation' | 'locations'> {
  meetingLocation: {
    placeId: string;
    placeName: string | undefined;
    placeAddress: string | undefined;
    point: google.maps.places.PlaceGeometry | undefined;
  };
  locations: ((google.maps.places.PlaceResult & { id: number }) | { id: number })[];
}

export interface LocationDataType {
  name: string;
  address: string;
}

export interface VisitLocationDataType {
  id: number;
  place: google.maps.places.PlaceResult;
}
