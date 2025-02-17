import { apiPaths } from '@/constants/apis';
import { extractAxiosData, privateAxios } from '@/libs/baseAxios';
import { CreateGatheringRequest } from '@/types/gathering';

interface CreateGatheringType {
  data: string;
}

export const gatheringApis = {
  create: async (payload: CreateGatheringRequest) => {
    const response = await extractAxiosData<CreateGatheringType>(privateAxios.post(apiPaths.gathering.create, payload));
    return response;
  },
};
