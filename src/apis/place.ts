import { QueryClient } from '@tanstack/react-query';
import { apiPaths } from '@/constants/apis';
import { GOOGLE_MAP_FIELD, placeTypeTranslations } from '@/constants/place';
import { customFetch } from '@/libs/interceptor';
import { ApiResponse } from '@/types/apis';
import { PlaceSearchDataType } from '@/types/map';
import { ApiError } from '@/utils/error';
import { snakeToSpace } from '@/utils/formatText';
import { apis } from '.';

export const placeApis = {
  getSearchResult: async (keyword: string, center: google.maps.LatLng, radius: number) => {
    const response = await fetch(
      `/api/places/search?keyword=${keyword}&lat=${center.lat()}&lng=${center.lng()}&radius=${radius}`,
      {
        method: 'GET',
        next: { revalidate: 3600 },
      }
    );

    const result = (await response.json()) as ApiResponse<PlaceSearchDataType[]>;

    if (!response.ok) {
      throw new ApiError(400, 'M002', result.message ?? '검색 결과 가져오기 실패');
    }

    const { data } = result;
    return data as PlaceSearchDataType[];
  },
  getDetail: async (placeId: string, fields: (typeof GOOGLE_MAP_FIELD)[number][], queryClient: QueryClient) => {
    if (!placeId) {
      return {} as google.maps.places.PlaceResult;
    }
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
    const response = await customFetch<string[]>(`${apiPaths.place.autoComplete}?input=${keyword}`, {
      next: { revalidate: 3600 },
    });
    if (response?.status === 200) {
      const data = Array.from(new Set(response.data.map(s => s.trim())));
      return data;
    }
    throw new Error('api error');
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
    if (!placeId) {
      return {} as google.maps.places.PlaceResult;
    }
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
