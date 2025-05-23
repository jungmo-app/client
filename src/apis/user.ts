import { apiPaths } from '@/constants/apis';
import { privateClientFetch, privateServerFetch } from '@/libs/interceptor';
import { UserDataResponse, UserInfoResponse } from '@/types/auth';

export const userApis = {
  search: async (userCode: string) => {
    if (!userCode) {
      return [];
    }

    const response = await privateClientFetch<UserDataResponse[]>(`${apiPaths.user.search}?userCode=${userCode}`, {
      method: 'GET',
      cache: 'no-store',
      next: { tags: ['info'] },
    });

    return response.data;
  },
  getInfo: async () => {
    const response = await privateClientFetch<UserInfoResponse>(apiPaths.user.userInfo, {
      method: 'GET',
      cache: 'no-store',
      next: { tags: ['userInfo'] },
    });

    return response.data;
  },
  editInfo: async (payload: FormData) => {
    const response = await privateClientFetch(apiPaths.user.editInfo, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: payload,
    });

    return response.data;
  },
};

export const serverUserApis = {
  getInfo: async () => {
    const response = await privateServerFetch<UserInfoResponse>(apiPaths.user.userInfo, {
      method: 'GET',
      cache: 'no-store',
      next: { tags: ['userInfo'] },
    });

    return response.data;
  },
};
