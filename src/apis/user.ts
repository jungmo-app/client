import { apiPaths } from '@/constants/apis';
import { privateClientFetch, privateServerFetch } from '@/libs/interceptor';
import { UserDataResponse, UserInfoResponse } from '@/types/user';
import { ApiError } from '@/utils/error';

export const userApis = {
  search: async (userCode: string) => {
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
  deleteAccount: async () => {
    try {
      const response = await fetch('/api/deleteAccount', {
        method: 'POST',
      });

      if (response.status !== 200) {
        throw new ApiError(response.status, 'DA001', '계정 삭제에 실패하였습니다.');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'F001');
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
