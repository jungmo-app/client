import axios from 'axios';
import { snakeToSpace } from '@/utils/formatText';

export const placeApis = {
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
