import { atom } from 'jotai';
import { PlaceDataType } from '@/types/map';

interface CachePlace {
  data: PlaceDataType;
  expiresAt: number;
}

const EXPIRATION_TIME = 24 * 60 * 60 * 1000;

const loadCache = () => {
  const validData = new Map<string, CachePlace>();

  if (typeof window === 'undefined') {
    return validData;
  }
  const storedData = localStorage.getItem('placeCache');
  if (storedData) {
    const data = JSON.parse(storedData) as Record<string, CachePlace>;

    Object.entries(data).forEach(([key, value]) => {
      if (value.expiresAt > Date.now()) {
        validData.set(key, value);
      }
    });
  }

  return validData;
};

export const placeCacheAtom = atom(loadCache());

export const setCacheAtom = atom(null, (get, set, { placeId, data }: { placeId: string; data: PlaceDataType }) => {
  const cache = new Map(get(placeCacheAtom));
  const expiresAt = Date.now() + EXPIRATION_TIME;
  cache.set(placeId, { data, expiresAt });
  set(placeCacheAtom, cache);
  localStorage.setItem('placeCache', JSON.stringify(Object.fromEntries(cache)));
});

export const getCacheAtom = atom(get => {
  return (placeId: string) => {
    const cache = get(placeCacheAtom);
    const cachedItem = cache.get(placeId);
    if (cachedItem) {
      if (Date.now() < cachedItem.expiresAt) {
        return cachedItem.data;
      }
    }
    return null;
  };
});
