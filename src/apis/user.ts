import axios from 'axios';
import { apiPaths } from '@/constants/apis';
import { baseAxios } from '@/libs/baseAxios';
import { privateClientFetch, privateServerFetch } from '@/libs/interceptor';
import { getCookieList } from '@/libs/serverAction';
import { UserDataResponse, UserInfoResponse } from '@/types/user';
import { ApiError } from '@/utils/error';

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
  deleteAccount: async () => {
    const { accessToken, refreshToken } = await getCookieList(['accessToken', 'refreshToken']);
    try {
      await baseAxios.delete(apiPaths.user.deleteAccount, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: `refreshToken=${refreshToken}`,
        },
        withCredentials: true,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status } = error.response;
        const { code, message } = error.response.data;
        throw new ApiError(status, code, message);
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
