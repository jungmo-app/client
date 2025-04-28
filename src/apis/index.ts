import { authApis } from './auth';
import { axiosApis } from './axios';
import { gatheringApis, serverGatheringApis } from './gathering';
import { notificationApis, serverNotificationApis } from './notification';
import { placeApis, serverPlaceApis } from './place';
import { serverUserApis, userApis } from './user';

export const apis = {
  auth: authApis,
  axios: axiosApis,
  gathering: gatheringApis,
  serverGathering: serverGatheringApis,
  place: placeApis,
  serverPlace: serverPlaceApis,
  user: userApis,
  serverUser: serverUserApis,
  notification: notificationApis,
  serverNotification: serverNotificationApis,
} as const;
