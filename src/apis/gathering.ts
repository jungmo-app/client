import { QueryClient } from '@tanstack/react-query';
import { apiPaths } from '@/constants/apis';
import { GOOGLE_MAP_FIELD } from '@/constants/place';
import { privateClientFetch, privateServerFetch } from '@/libs/interceptor';
import { ApiError } from '@/utils/error';
import { apis } from '.';
import type {
  CreateGatheringRequest,
  DetailGatheringRespose,
  DetailGatheringType,
  GatheringListResponse,
} from '@/types/gathering';

const locationQuery = [
  'name',
  'formatted_address',
  'icon_background_color',
  'geometry',
  'photo',
  'type',
  'place_id',
] as (typeof GOOGLE_MAP_FIELD)[number][];

export const gatheringApis = {
  create: async (payload: CreateGatheringRequest) => {
    const response = await privateClientFetch<string>(apiPaths.gathering.create, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  getList: async (date: Date) => {
    const currentDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const response = await privateClientFetch<GatheringListResponse[]>(
      `${apiPaths.gathering.getList}?currentDate=${currentDate}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    );

    return response.data;
  },

  edit: async (id: number, payload: CreateGatheringRequest) => {
    const response = await privateClientFetch(`${apiPaths.gathering.edit}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  delete: async (id: number) => {
    const response = await privateClientFetch(`${apiPaths.gathering.delete}/${id}`, {
      method: 'DELETE',
    });

    return response.data;
  },

  getDetail: async (id: number, queryClient: QueryClient): Promise<DetailGatheringType> => {
    const response = await privateClientFetch<DetailGatheringRespose>(`${apiPaths.gathering.getDetail}/${id}`, {
      method: 'GET',
      cache: 'no-store',
      next: { tags: [`gathering-${id}`] },
    });

    try {
      const meetingLocation = await queryClient.fetchQuery({
        queryKey: ['location', response.data.meetingLocation.placeId, 'name', 'formatted_address', 'geometry'],
        queryFn: () =>
          apis.place.getDetail(
            response.data.meetingLocation.placeId,
            ['name', 'formatted_address', 'geometry'],
            queryClient
          ),
      });

      const locations = await Promise.all(
        response.data.locations.map(place =>
          queryClient.fetchQuery({
            queryKey: ['location', place.placeId, ...locationQuery],
            queryFn: async () => {
              const data = await apis.place.getDetail(place.placeId, locationQuery, queryClient);
              return { ...data, id: place.id };
            },
          })
        )
      );
      return {
        ...response.data,
        meetingLocation: {
          placeId: response.data.meetingLocation.placeId,
          placeName: meetingLocation?.name,
          placeAddress: meetingLocation?.formatted_address,
          point: meetingLocation?.geometry,
        },
        locations,
      };
    } catch {
      throw new ApiError(400, 'M001');
    }
  },

  deleteLocation: async (gatheringId: number, locationId: number) => {
    const response = await privateClientFetch(
      `${apiPaths.gathering.deleteLocation}/${gatheringId}/locations/${locationId}`,
      {
        method: 'DELETE',
      }
    );

    return response.data;
  },

  addLocation: async (gatheringId: number, placeId: string) => {
    const response = await privateClientFetch<number>(`${apiPaths.gathering.addLocation}/${gatheringId}/locations`, {
      method: 'POST',
      body: JSON.stringify({ placeId }),
    });

    return response.data;
  },
};

export const serverGatheringApis = {
  getList: async (date: Date, queryClient: QueryClient) => {
    const currentDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const response = await privateServerFetch<GatheringListResponse[]>(
      `${apiPaths.gathering.getList}?currentDate=${currentDate}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    );

    try {
      const appointmentList = await Promise.all(
        response.data.map(async item => {
          const place = await queryClient.fetchQuery({
            queryKey: ['location', item.meetingLocation, 'name'],
            queryFn: () => apis.serverPlace.getDetail(item.meetingLocation, ['name'], queryClient),
          });
          return { ...item, meetingLocation: place?.name ?? '' };
        })
      );

      return appointmentList as GatheringListResponse[];
    } catch {
      throw new ApiError(400, 'M001', '위치 데이터를 가져올 수 없습니다');
    }
  },
  getDetail: async (id: number, queryClient: QueryClient) => {
    const response = await privateServerFetch<DetailGatheringRespose>(`${apiPaths.gathering.getDetail}/${id}`, {
      method: 'GET',
      cache: 'no-store',
      next: { tags: [`gathering-${id}`] },
    });

    try {
      const meetingLocation = await queryClient.fetchQuery({
        queryKey: ['location', response.data.meetingLocation.placeId, 'name', 'formatted_address', 'geometry'],
        queryFn: () =>
          apis.serverPlace.getDetail(
            response.data.meetingLocation.placeId,
            ['name', 'formatted_address', 'geometry'],
            queryClient
          ),
      });

      const locations = await Promise.all(
        response.data.locations.map(place =>
          queryClient.fetchQuery({
            queryKey: ['location', place.placeId, ...locationQuery],
            queryFn: async () => {
              const data = await apis.serverPlace.getDetail(place.placeId, locationQuery, queryClient);
              return { ...data, id: place.id };
            },
          })
        )
      );

      return {
        ...response.data,
        meetingLocation: {
          placeId: response.data.meetingLocation.placeId,
          placeName: meetingLocation?.name,
          placeAddress: meetingLocation?.formatted_address,
          point: meetingLocation?.geometry,
        },
        locations,
      } as DetailGatheringType;
    } catch {
      throw new ApiError(400, 'M001', '위치 데이터를 가져올 수 없습니다');
    }
  },
};
