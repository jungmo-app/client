import { authApis } from './auth';
import { gatheringApis } from './gathering';
import { placeApis } from './place';

export const apis = {
  auth: authApis,
  gathering: gatheringApis,
  place: placeApis,
} as const;
