import { authApis } from './auth';
import { gatheringApis } from './gathering';
import { placeApis, serverPlaceApis } from './place';

export const apis = {
  auth: authApis,
  gathering: gatheringApis,
  place: placeApis,
  serverPlace: serverPlaceApis,
} as const;
