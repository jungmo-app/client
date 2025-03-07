import { apiPaths } from '@/constants/apis';
import { clientPrivateFetch, privateServerFetch } from '@/libs/interceptor';
import { UserDataResponse, UserInfoResponse } from '@/types/user';

export const userApis = {
  search: async (userCode: string) => {
    try {
      const respone = await clientPrivateFetch<UserDataResponse[]>(`${apiPaths.user.search}?userCode=${userCode}`, {
        method: 'GET',
        cache: 'no-cache',
        next: { tags: ['info'] },
      });

      if (respone?.status === 200) {
        return respone.data;
      }
      throw new Error('api error');
    } catch {
      return null;
    }
  },
  getInfo: async () => {
    try {
      const response = await clientPrivateFetch<UserInfoResponse>(apiPaths.user.userInfo, {
        method: 'GET',
        cache: 'no-cache',
        next: { tags: ['userInfo'] },
      });
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error('api error');
    } catch {
      return null;
    }
  },
  deleteAccount: async () => {
    try {
      const response = await fetch('/api/deleteAccount', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('계정 삭제 실패');
      }
      return true;
    } catch {
      return false;
    }
  },
  editInfo: async (payload: FormData) => {
    try {
      const response = await clientPrivateFetch(apiPaths.user.editInfo, {
        method: 'PUT',
        body: payload,
      });
      if (response?.status === 200) {
        return true;
      }
      throw new Error('api error');
    } catch {
      return false;
    }
  },
};

export const serverUserApis = {
  getInfo: async () => {
    const response = await privateServerFetch<UserInfoResponse>(apiPaths.user.userInfo, {
      method: 'GET',
      cache: 'no-cache',
      next: { tags: ['userInfo'] },
    });
    return response === null || response === undefined ? response : response.data;
  },
};
