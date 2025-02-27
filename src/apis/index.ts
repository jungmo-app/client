import { authApis } from './auth';
import { gatheringApis } from './gathering';
import { placeApis, serverPlaceApis } from './place';
import { userApis } from './user';

export const apis = {
  auth: authApis,
  gathering: gatheringApis,
  place: placeApis,
  serverPlace: serverPlaceApis,
  user: userApis,
} as const;
