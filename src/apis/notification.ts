import { apiPaths } from '@/constants/apis';
import { privateClientFetch, privateServerFetch } from '@/libs/interceptor';
import { NotificationType } from '@/types/notification';

export const notificationApis = {
  getNotification: async () => {
    const response = await privateClientFetch<NotificationType[]>(apiPaths.notification.getNotification, {
      method: 'GET',
      cache: 'no-store',
    });
    return response;
  },
  deleteNotification: async (notificationIds: number[]) => {
    const response = await privateClientFetch(apiPaths.notification.deleteNotification, {
      method: 'DELETE',
      body: JSON.stringify({ notificationIds }),
    });
    return response;
  },
  readNotification: async (notificationIds: number[]) => {
    const response = await privateClientFetch(apiPaths.notification.readNotification, {
      method: 'PATCH',
      body: JSON.stringify({ notificationIds }),
    });
    return response;
  },
};

export const serverNotificationApis = {
  getNotification: async () => {
    const response = await privateServerFetch<NotificationType[]>(apiPaths.notification.getNotification, {
      method: 'GET',
      cache: 'no-store',
    });
    return response;
  },
};
