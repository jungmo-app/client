import { apiPaths } from '@/constants/apis';
import { clientPrivateFetch, privateServerFetch } from '@/libs/interceptor';
import type { CreateGatheringRequest, DetailGatheringRespose, GatheringListResponse } from '@/types/gathering';

export const gatheringApis = {
  create: async (payload: CreateGatheringRequest) => {
    const response = await clientPrivateFetch<string>(apiPaths.gathering.create, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response;
  },

  getList: async (date: Date) => {
    const currentDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    try {
      const response = await clientPrivateFetch<GatheringListResponse[]>(
        `${apiPaths.gathering.getList}?currentDate=${currentDate}`
      );
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error('api error');
    } catch {
      return null;
    }
  },

  edit: async (id: number, payload: CreateGatheringRequest) => {
    try {
      const response = await clientPrivateFetch(`${apiPaths.gathering.edit}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (response?.status === 200) {
        return true;
      }
      throw new Error('api error');
    } catch {
      return false;
    }
  },

  delete: async (id: number) => {
    try {
      const response = await clientPrivateFetch(`${apiPaths.gathering.delete}/${id}`, {
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

  getDetail: async (id: number) => {
    try {
      const response = await clientPrivateFetch<DetailGatheringRespose>(`${apiPaths.gathering.getDetail}/${id}`);
      if (response?.status === 200) {
        return response.data;
      }
      if (response?.status === 404) {
        return null;
      }
      throw new Error('api error');
    } catch {
      return undefined;
    }
  },

  deleteLocation: async (gatheringId: number, locationId: number) => {
    try {
      const response = await clientPrivateFetch(
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
      const response = await clientPrivateFetch<number>(`${apiPaths.gathering.addLocation}/${gatheringId}/locations`, {
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
        cache: 'no-cache',
      }
    );
    return response === null || response === undefined ? response : response.data;
  },
  getDetail: async (id: number) => {
    const response = await privateServerFetch<DetailGatheringRespose>(`${apiPaths.gathering.getDetail}/${id}`, {
      method: 'GET',
      cache: 'no-cache',
    });
    return response === null || response === undefined ? response : response.data;
  },
};
