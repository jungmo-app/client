import { apiPaths } from '@/constants/apis';
import { privateAxios } from '@/libs/baseAxios';
import { customFetch, privateClientFetch } from '@/libs/interceptor';
import {
  ChangePasswordPayload,
  LoginRequest,
  ResetPasswordPayload,
  SetPasswordFormValues,
  SignupFormValues,
} from '@/types/auth';
import { throwError } from '@/utils/apis';

export const authApis = {
  login: async (payload: LoginRequest) => {
    const response = await customFetch(apiPaths.auth.login, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    console.log(response);

    return throwError(response);
  },
  logout: async () => {
    const response = await fetch('/api/logout', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('로그아웃 실패');
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
    const response = await privateClientFetch(apiPaths.auth.changePassword, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    if (response?.status !== 200) {
      throw new Error('api error');
    }
  },
  setPassword: async (payload: SetPasswordFormValues) => {
    const response = await customFetch(apiPaths.auth.setPassword, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return throwError(response);
  },
  resetPassword: async (payload: ResetPasswordPayload) => {
    const response = await customFetch(apiPaths.auth.resetPassword, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return throwError(response);
  },
  refreshToken: async (refreshToken: string) => {
    try {
      const response = await privateAxios.post(
        apiPaths.auth.refreshToken,
        {},
        {
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
        }
      );

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
  deleteCookie: async () => {
    const refer = window.location.pathname;
    const response = await fetch(`/api/cookie?refer=${refer}`, {
      method: 'POST',
    });

    if (response.redirected) {
      window.location.href = response.url;
    }
  },
} as const;
