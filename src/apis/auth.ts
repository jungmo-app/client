import { apiPaths } from '@/constants/apis';
import { baseAxios, extractAxiosData } from '@/libs/baseAxios';
import { clientPrivateFetch } from '@/libs/interceptor';
import { ChangePasswordPayload } from '@/schemas/account';
import { ApiResponse } from '@/types/apis';
import { LoginRequest, RegisterRequest } from '@/types/auth';

export const authApis = {
  login: async (payload: LoginRequest) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPaths.auth.login.slice(1)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    return response;
  },
  logout: async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('로그아웃 실패');
      }
      return true;
    } catch {
      return false;
    }
  },
  register: async (payload: RegisterRequest) => {
    const response = await extractAxiosData<ApiResponse>(baseAxios.post(apiPaths.auth.register, payload));

    return response;
  },
  changePassword: async (payload: ChangePasswordPayload) => {
    try {
      const response = await clientPrivateFetch(apiPaths.auth.changePassword, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (response?.status === 200) {
        return true;
      }
      if (response?.status === 400) {
        return null;
      }
      throw new Error('api error');
    } catch {
      return false;
    }
  },
  refreshToken: async (accessToken: string, refreshToken: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPaths.auth.refreshToken.slice(1)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) {
        throw new Error('failed refresh token');
      }
      return response;
    } catch {
      return undefined;
    }
  },
  checkBlacklist: async (accessToken: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPaths.auth.checkBlacklist.slice(1)}?accessToken=${accessToken}`
      );
      if (!response.ok) {
        throw new Error('api error');
      }
      const { data } = await response.json();
      return data as boolean;
    } catch {
      return false;
    }
  },
} as const;
