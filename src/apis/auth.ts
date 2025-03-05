import { apiPaths } from '@/constants/apis';
import { baseAxios, extractAxiosData, privateAxios } from '@/libs/baseAxios';
import { ApiResponse } from '@/types/apis';
import { ChangePasswordRequest, LoginRequest, RegisterRequest } from '@/types/auth';

export const authApis = {
  login: async (payload: LoginRequest) => {
    const response = await extractAxiosData<ApiResponse>(baseAxios.post(apiPaths.auth.login, payload));

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
  changePassword: async (payload: ChangePasswordRequest) => {
    const response = await extractAxiosData<ApiResponse>(privateAxios.patch(apiPaths.auth.changePassword, payload));

    return response;
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
      throw new Error('refresh api error');
    }
  },
} as const;
