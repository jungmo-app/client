import axios from 'axios';
import { apiPaths } from '@/constants/apis';
import { customFetch, privateClientFetch } from '@/libs/interceptor';
import { getCookieList } from '@/libs/serverAction';
import {
  ChangePasswordPayload,
  LoginRequest,
  ResetPasswordPayload,
  SetPasswordFormValues,
  SignupFormValues,
} from '@/types/auth';
import { UserInfoResponse } from '@/types/user';
import { ApiError } from '@/utils/error';

export const authApis = {
  login: async (payload: LoginRequest) => {
    const response = await customFetch<UserInfoResponse>(apiPaths.auth.login, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.data;
  },
  register: async (payload: SignupFormValues) => {
    const response = await customFetch<UserInfoResponse>(apiPaths.auth.register, {
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
    const { accessToken, refreshToken } = await getCookieList(['accessToken', 'refreshToken']);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPaths.auth.refreshToken.slice(1)}`,
        {},
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Cookie: `refreshToken=${refreshToken};`,
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
