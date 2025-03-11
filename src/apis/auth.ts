import { apiPaths } from '@/constants/apis';
import { privateClientFetch } from '@/libs/interceptor';
import {
  ChangePasswordPayload,
  LoginRequest,
  ResetPasswordPayload,
  SetPasswordFormValues,
  SignupFormValues,
} from '@/types/auth';

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
  register: async (payload: SignupFormValues) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPaths.auth.register.slice(1)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPaths.auth.setPassword.slice(1)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const res = await response.json();
      return res;
    } catch {
      return undefined;
    }
  },
  resetPassword: async (payload: ResetPasswordPayload) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPaths.auth.setPassword.slice(1)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const res = await response.json();
      return res;
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
