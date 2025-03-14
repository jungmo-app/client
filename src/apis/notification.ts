import { apiPaths } from '@/constants/apis';
import { customFetch } from '@/libs/interceptor';
import { NotificationType } from '@/types/notification';

export const notificationApis = {
  getNotification: async () => {
    const response = await customFetch<NotificationType>(apiPaths.notification.getNotification);
    return response;
  },
};
