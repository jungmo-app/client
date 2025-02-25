import axios from 'axios';
import { GOOGLE_MAP_FIELD } from '@/constants/place';
import { snakeToSpace } from '@/utils/formatText';

export const placeApis = {
  getDetail: async (placeId: string, fields: (typeof GOOGLE_MAP_FIELD)[number][]) => {
    const fieldString = fields.join(',');
    const response = await axios.post<google.maps.places.PlaceResult>(`/api/places`, {
      placeId,
      fields: fieldString,
    });
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

export const serverPlaceApis = {
  getDetail: async (
    placeId: string,
    fields: (typeof GOOGLE_MAP_FIELD)[number][]
  ): Promise<google.maps.places.PlaceResult | null> => {
    try {
      const fieldString = fields.join(',');
      const {
        data: { result },
      } = await axios.get<{ result: google.maps.places.PlaceResult }>(
        `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&fields=${fieldString}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&language=ko`
      );
      return result;
    } catch {
      return null;
    }
  },
};
