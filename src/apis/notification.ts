import { apiPaths } from '@/constants/apis';
import { privateClientFetch, privateServerFetch } from '@/libs/interceptor';
import { NotificationType } from '@/types/notification';
import { ApiError } from '@/utils/error';

export const notificationApis = {
  getNotification: async () => {
    const response = await privateClientFetch<NotificationType[]>(apiPaths.notification.getNotification, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response || response.status !== 200) {
      throw new Error('api ERROR');
    }

    return response.data;
  },
  deleteNotification: async (notificationIds: number[]) => {
    const response = await privateClientFetch(apiPaths.notification.deleteNotification, {
      method: 'DELETE',
      body: JSON.stringify({ notificationIds }),
    });
    if (!response || response.status !== 200) {
      throw new Error('api error');
    }
    return response;
  },
  readNotification: async (notificationIds: number[]) => {
    const response = await privateClientFetch(apiPaths.notification.readNotification, {
      method: 'PATCH',
      body: JSON.stringify({ notificationIds }),
    });

    if (!response || response.status !== 200) {
      throw new Error('api error');
    }
    return response;
  },
};

export const serverNotificationApis = {
  getNotification: async () => {
    const response = await privateServerFetch<NotificationType[]>(apiPaths.notification.getNotification, {
      method: 'GET',
      cache: 'no-store',
    });
    if (response.status !== 200) {
      const { status, code, message } = response;
      throw new ApiError(status, code, message);
    }
    return response.data;
  },
};
