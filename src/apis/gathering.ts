import { AxiosError } from 'axios';
import { apiPaths } from '@/constants/apis';
import { extractAxiosData, privateAxios } from '@/libs/baseAxios';
import type { ApiResponse } from '@/types/apis';
import type { CreateGatheringRequest, DetailGatheringRespose } from '@/types/gathering';

export const gatheringApis = {
  create: async (payload: CreateGatheringRequest) => {
    try {
      const response = await extractAxiosData<ApiResponse<string>>(
        privateAxios.post(apiPaths.gathering.create, payload)
      );
      return response;
    } catch {
      return false;
    }
  },

  edit: async (id: number, payload: CreateGatheringRequest) => {
    try {
      await extractAxiosData<ApiResponse>(privateAxios.put(`${apiPaths.gathering.edit}/${id}`, payload));
      return true;
    } catch {
      return false;
    }
  },

  delete: async (id: number) => {
    try {
      await extractAxiosData<ApiResponse>(privateAxios.delete(`${apiPaths.gathering.delete}/${id}`));
      return true;
    } catch {
      return false;
    }
  },

  getDetail: async (id: number) => {
    try {
      const { data } = await extractAxiosData<ApiResponse<DetailGatheringRespose>>(
        privateAxios.get(
          `${apiPaths.gathering.getDetail}/${id}` /* , {
          adapter: 'fetch',
          fetchOptions: { cache: 'force-cache' },
        } */
        )
      );
      return data;
    } catch (error) {
      const e = error as AxiosError;
      if (e.status === 404) {
        return null;
      }
      return undefined;
    }
  },

  deleteLocation: async (gatheringId: number, locationId: number) => {
    try {
      await extractAxiosData<ApiResponse>(
        privateAxios.delete(`${apiPaths.gathering.deleteLocation}/${gatheringId}/locations/${locationId}`)
      );
      return true;
    } catch {
      return false;
    }
  },

  addLocation: async (gatheringId: number, placeId: string) => {
    try {
      const response = await extractAxiosData<ApiResponse<number>>(
        privateAxios.post(`${apiPaths.gathering.addLocation}/${gatheringId}/locations`, {
          placeId,
        })
      );
      return response;
    } catch {
      return false;
    }
  },
};
