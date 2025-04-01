import { apiPaths } from '@/constants/apis';
import { privateClientFetch, privateServerFetch } from '@/libs/interceptor';
import { apis } from '.';
import type {
  CreateGatheringRequest,
  DetailGatheringRespose,
  DetailGatheringType,
  GatheringListResponse,
} from '@/types/gathering';

export const gatheringApis = {
  create: async (payload: CreateGatheringRequest) => {
    const response = await privateClientFetch<string>(apiPaths.gathering.create, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response;
  },

  getList: async (date: Date) => {
    const currentDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    try {
      const response = await privateClientFetch<GatheringListResponse[]>(
        `${apiPaths.gathering.getList}?currentDate=${currentDate}`,
        {
          method: 'GET',
          cache: 'no-cache',
          next: { tags: [`gatheringList-${date}`] },
        }
      );
      if (response?.status === 200) {
        const appointmentList = await Promise.all(
          response.data.map(async item => {
            const place = await apis.place.getDetail(item.meetingLocation, ['name']);
            return { ...item, meetingLocation: place?.name ?? '' };
          })
        );
        return appointmentList;
      }
      throw new Error('api error');
    } catch {
      return null;
    }
  },

  edit: async (id: number, payload: CreateGatheringRequest) => {
    const response = await privateClientFetch(`${apiPaths.gathering.edit}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    if (response?.status !== 200) {
      throw new Error('api error');
    }
  },

  delete: async (id: number) => {
    try {
      const response = await privateClientFetch(`${apiPaths.gathering.delete}/${id}`, {
        method: 'DELETE',
      });
      if (response?.status === 200) {
        return true;
      }
      throw new Error('api error');
    } catch {
      return false;
    }
  },

  getDetail: async (id: number): Promise<DetailGatheringType | null> => {
    try {
      const response = await privateClientFetch<DetailGatheringRespose>(`${apiPaths.gathering.getDetail}/${id}`, {
        method: 'GET',
        cache: 'no-cache',
        next: { tags: [`gathering-${id}`] },
      });
      if (response?.status === 200) {
        const res = await apis.place.getDetail(String(id), ['name', 'formatted_address']);

        return {
          ...response.data,
          meetingLocation: {
            placeId: response.data.meetingLocation.placeId,
            placeName: res?.name,
            placeAddress: res?.formatted_address,
          },
        };
      }
      throw new Error('api error');
    } catch {
      return null;
    }
  },

  deleteLocation: async (gatheringId: number, locationId: number) => {
    try {
      const response = await privateClientFetch(
        `${apiPaths.gathering.deleteLocation}/${gatheringId}/locations/${locationId}`,
        {
          method: 'DELETE',
        }
      );
      if (response?.status === 200) {
        return true;
      }
      throw new Error('api error');
    } catch {
      return false;
    }
  },

  addLocation: async (gatheringId: number, placeId: string) => {
    try {
      const response = await privateClientFetch<number>(`${apiPaths.gathering.addLocation}/${gatheringId}/locations`, {
        method: 'POST',
        body: JSON.stringify({ placeId }),
      });
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error('api error');
    } catch {
      return false;
    }
  },
};

export const serverGatheringApis = {
  getList: async (date: Date) => {
    const currentDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    const response = await privateServerFetch<GatheringListResponse[]>(
      `${apiPaths.gathering.getList}?currentDate=${currentDate}`,
      {
        method: 'GET',
        cache: 'no-store',
        next: { tags: [`gatheringList-${currentDate}`] },
      }
    );
    return response?.data;
  },
  getDetail: async (id: number): Promise<DetailGatheringType | null> => {
    const response = await privateServerFetch<DetailGatheringRespose>(`${apiPaths.gathering.getDetail}/${id}`, {
      method: 'GET',
      cache: 'force-cache',
      next: { tags: [`gathering-${id}`] },
    });

    if (response?.status === 200) {
      const res = await apis.serverPlace.getDetail(response.data.meetingLocation.placeId, [
        'name',
        'formatted_address',
      ]);
      return {
        ...response.data,
        meetingLocation: {
          placeId: response.data.meetingLocation.placeId,
          placeName: res?.name,
          placeAddress: res?.formatted_address,
        },
      };
    }
    return null;
  },
};
