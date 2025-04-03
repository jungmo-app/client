import { apiPaths } from '@/constants/apis';
import { GOOGLE_MAP_FIELD } from '@/constants/place';
import { customFetch } from '@/libs/interceptor';
import { ApiResponse } from '@/types/apis';
import { snakeToSpace } from '@/utils/formatText';

export const placeApis = {
  getDetail: async (placeId: string, fields: (typeof GOOGLE_MAP_FIELD)[number][]) => {
    const fieldString = fields.join(',');
    try {
      const response = await fetch(`/api/places?placeId=${placeId}&fields=${fieldString}`, {
        method: 'GET',
        cache: 'force-cache',
        next: { revalidate: 3600 },
      });
      if (!response.ok) {
        throw new Error('api error');
      }
      const { data } = (await response.json()) as ApiResponse<google.maps.places.PlaceResult>;
      return data;
    } catch {
      return null;
    }
  },
  getSearchKeyword: async (keyword: string) => {
    try {
      const response = await customFetch<string[]>(`${apiPaths.place.autoComplete}?input=${keyword}`, {
        next: { revalidate: 3600 },
      });
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error('api error');
    } catch {
      return null;
    }
  },

  translatePlaceType: async (payload: string) => {
    const spaceWord = snakeToSpace(payload);
    const url = 'https://libretranslate.de/translate';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: spaceWord,
          source: 'en',
          target: 'ko',
        }),
      });
      if (!response.ok) {
        throw new Error('api error');
      }
      const {
        data: { translateText },
      } = await response.json();
      return translateText as string;
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
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&fields=${fieldString}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&language=ko`,
        {
          method: 'GET',
          cache: 'force-cache',
          next: { revalidate: 3600 },
        }
      );
      if (!response.ok) {
        throw new Error('api error');
      }
      const { result } = await response.json();
      return result as google.maps.places.PlaceResult;
    } catch {
      return null;
    }
  },
};
