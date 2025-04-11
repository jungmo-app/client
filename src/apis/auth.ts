import axios from 'axios';
import { apiPaths } from '@/constants/apis';
import { customFetch, privateClientFetch } from '@/libs/interceptor';
import { getCookie } from '@/libs/serverAction';
import { ApiResponse } from '@/types/apis';
import {
  ChangePasswordPayload,
  LoginRequest,
  ResetPasswordPayload,
  SetPasswordFormValues,
  SignupFormValues,
} from '@/types/auth';
import { ApiError } from '@/utils/error';

export const authApis = {
  login: async (payload: LoginRequest) => {
    const response = await customFetch(apiPaths.auth.login, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.data;
  },
  logout: async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      const res: ApiResponse = await response.json();

      if (response.status !== 200) {
        const { status, code, message } = res;
        throw new ApiError(status, code, message);
      }

      return res.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'F001');
    }
  },
  register: async (payload: SignupFormValues) => {
    const response = await customFetch(apiPaths.auth.register, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response.data;
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

    return response.data;
  },
  setPassword: async (payload: SetPasswordFormValues) => {
    const response = await customFetch(apiPaths.auth.setPassword, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response.data;
  },
  resetPassword: async (payload: ResetPasswordPayload) => {
    const response = await customFetch(apiPaths.auth.resetPassword, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return response.data;
  },
  refreshToken: async () => {
    console.log('refreshToken');
    const accessToken = await getCookie('accessToken');
    const refreshToken = await getCookie('refreshToken');

    const cookieHeader = [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`].join('; ');

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPaths.auth.refreshToken.slice(1)}`,
        {},
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Cookie: cookieHeader,
          },
          withCredentials: true,
        }
      );

      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const {
          status,
          data: { code, message },
        } = error.response;
        throw new ApiError(status, code, message);
      }
      throw new ApiError(500, 'F002');
    }
  },
} as const;
