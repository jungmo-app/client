import { apiPaths } from '@/constants/apis';
import { customFetch, privateClientFetch } from '@/libs/interceptor';
import {
  ChangePasswordPayload,
  LoginRequest,
  ResetPasswordPayload,
  SetPasswordFormValues,
  SignupFormValues,
} from '@/types/auth';

export const authApis = {
  login: async (payload: LoginRequest) => {
    const response = await customFetch(apiPaths.auth.login, {
      method: 'POST',
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
  register: async (payload: SignupFormValues) => {
    const response = await customFetch(apiPaths.auth.register, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  },
  changePassword: async (payload: ChangePasswordPayload) => {
    try {
      const response = await privateClientFetch(apiPaths.auth.changePassword, {
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
      throw new Error('api error');
    } catch {
      return false;
    }
  },
  setPassword: async (payload: SetPasswordFormValues) => {
    try {
      const response = await customFetch(apiPaths.auth.setPassword, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return response;
    } catch {
      return undefined;
    }
  },
  resetPassword: async (payload: ResetPasswordPayload) => {
    try {
      const response = await customFetch(apiPaths.auth.resetPassword, {
        method: 'PATCH',
        cache: 'no-cache',
        headers: {
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      return response;
    } catch {
      return undefined;
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
      const response = await customFetch<boolean>(`${apiPaths.auth.checkBlacklist}?accessToken=${accessToken}`);
      if (response?.status === 200) {
        const { data } = response;
        return data;
      }
      throw new Error('api error');
    } catch {
      return false;
    }
  },
} as const;
