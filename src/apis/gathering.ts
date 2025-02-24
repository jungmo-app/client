import { apiPaths } from '@/constants/apis';
import { extractAxiosData, privateAxios } from '@/libs/baseAxios';
import type { ApiResponse } from '@/types/apis';
import type { CreateGatheringRequest, DetailGatheringRespose } from '@/types/gathering';

interface CreateGatheringType {
  data: string;
}

export const gatheringApis = {
  create: async (payload: CreateGatheringRequest) => {
    const response = await extractAxiosData<CreateGatheringType>(privateAxios.post(apiPaths.gathering.create, payload));
    return response;
  },
  getDetail: async (id: string) => {
    const { data } = await extractAxiosData<ApiResponse<DetailGatheringRespose>>(
      privateAxios.get(
        `${apiPaths.gathering.getDetail}/${id}` /* , {
        adapter: 'fetch',
        fetchOptions: { cache: 'force-cache' },
      } */
      )
    );
    return data;
  },
  edit: async (id: number, payload: CreateGatheringRequest) => {
    const response = await extractAxiosData<ApiResponse<DetailGatheringRespose>>(
      privateAxios.put(`${apiPaths.gathering.edit}/${id}`, payload)
    );
    console.log(response);
    if (response.status === 200) {
      return true;
    }
    return false;
  },
};
