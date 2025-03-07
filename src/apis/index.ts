import { authApis } from './auth';
import { gatheringApis, serverGatheringApis } from './gathering';
import { placeApis, serverPlaceApis } from './place';
import { serverUserApis, userApis } from './user';

export const apis = {
  auth: authApis,
  gathering: gatheringApis,
  serverGathering: serverGatheringApis,
  place: placeApis,
  serverPlace: serverPlaceApis,
  user: userApis,
  serverUser: serverUserApis,
} as const;
