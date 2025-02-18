import axios from 'axios';
import { apiPaths } from '@/constants/apis';
import { extractAxiosData, privateAxios } from '@/libs/baseAxios';
import { CreateGatheringRequest } from '@/types/gathering';
import { snakeToSpace } from '@/utils/formatText';

interface CreateGatheringType {
  data: string;
}

export const gatheringApis = {
  create: async (payload: CreateGatheringRequest) => {
    const response = await extractAxiosData<CreateGatheringType>(privateAxios.post(apiPaths.gathering.create, payload));
    return response;
  },
  translatePlaceType: async (payload: string) => {
    const spaceWord = snakeToSpace(payload);
    const url = 'https://libretranslate.de/translate';

    try {
      const response = await axios.post(url, {
        q: spaceWord,
        source: 'en',
        target: 'ko',
      });
      return response.data.translateText as string;
    } catch {
      return null;
    }
  },
};
