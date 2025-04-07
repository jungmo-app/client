import { QueryClient } from '@tanstack/react-query';
import { apiPaths } from '@/constants/apis';
import { GOOGLE_MAP_FIELD, placeTypeTranslations } from '@/constants/place';
import { customFetch } from '@/libs/interceptor';
import { ApiResponse } from '@/types/apis';
import { snakeToSpace } from '@/utils/formatText';
import { apis } from '.';

export const placeApis = {
  getDetail: async (placeId: string, fields: (typeof GOOGLE_MAP_FIELD)[number][], queryClient: QueryClient) => {
    const fieldString = fields.join(',');
    const response = await fetch(`/api/places?placeId=${placeId}&fields=${fieldString}`, {
      method: 'GET',
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error('api error');
    }
    const { data } = (await response.json()) as ApiResponse<google.maps.places.PlaceResult>;

    if (data.types) {
      const types = await Promise.all(
        data.types.map(type => {
          if (placeTypeTranslations[type]) {
            return placeTypeTranslations[type];
          }
          return queryClient.fetchQuery({ queryKey: [type], queryFn: () => apis.place.translatePlaceType(type) });
        })
      );
      return { ...data, types };
    }
    return data;
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
  },
};

export const serverPlaceApis = {
  getDetail: async (
    placeId: string,
    fields: (typeof GOOGLE_MAP_FIELD)[number][],
    queryClient: QueryClient
  ): Promise<google.maps.places.PlaceResult | null> => {
    const fieldString = fields.join(',');
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&fields=${fieldString}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&language=ko`,
      {
        method: 'GET',
        next: { revalidate: 3600 },
      }
    );
    if (!response.ok) {
      throw new Error('api error');
    }
    const data = (await response.json()).result as google.maps.places.PlaceResult;

    if (data.types) {
      const types = await Promise.all(
        data.types.map(type => {
          if (placeTypeTranslations[type]) {
            return placeTypeTranslations[type];
          }
          return queryClient.fetchQuery({ queryKey: [type], queryFn: () => apis.place.translatePlaceType(type) });
        })
      );
      return { ...data, types };
    }
    return data;
  },
};
