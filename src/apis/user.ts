import { apiPaths } from '@/constants/apis';
import { privateClientFetch, privateServerFetch } from '@/libs/interceptor';
import { UserDataResponse, UserInfoResponse } from '@/types/user';
import { throwError } from '@/utils/apis';

export const userApis = {
  search: async (userCode: string) => {
    const response = await privateClientFetch<UserDataResponse[]>(`${apiPaths.user.search}?userCode=${userCode}`, {
      method: 'GET',
      cache: 'no-store',
      next: { tags: ['info'] },
    });

    if (!response || response.status !== 200) {
      throw new Error('api error');
    }
    return response.data;
  },
  getInfo: async () => {
    const response = await privateClientFetch<UserInfoResponse>(apiPaths.user.userInfo, {
      method: 'GET',
      cache: 'no-store',
      next: { tags: ['userInfo'] },
    });
    console.log(response);
    return throwError(response);
  },
  deleteAccount: async () => {
    const response = await fetch('/api/deleteAccount', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('계정 삭제 실패');
    }
  },
  editInfo: async (payload: FormData) => {
    const response = await privateClientFetch(apiPaths.user.editInfo, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: payload,
    });
    if (response?.status === 200) {
      return true;
    }
    throw new Error('api error');
  },
};

export const serverUserApis = {
  getInfo: async () => {
    const response = await privateServerFetch<UserInfoResponse>(apiPaths.user.userInfo, {
      method: 'GET',
      cache: 'no-store',
      next: { tags: ['userInfo'] },
    });
    if (!response || response.status !== 200) {
      throw new Error('api error');
    }
    return response.data;
  },
};
