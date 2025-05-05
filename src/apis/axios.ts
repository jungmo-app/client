export const runtime = 'nodejs';

import axios from 'axios';
import { apiPaths } from '@/constants/apis';
import { baseAxios } from '@/libs/baseAxios';
import { getCookieList } from '@/libs/serverAction';
import { ApiError } from '@/utils/error';

export const axiosApis = {
  logout: async () => {
    const { accessToken, refreshToken } = await getCookieList(['accessToken', 'refreshToken']);

    try {
      await baseAxios.post(
        apiPaths.auth.logout,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Cookie: `refreshToken=${refreshToken};`,
          },
        }
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status } = error.response;
        const { code, message } = error.response.data;
        throw new ApiError(status, code, message);
      }
      throw new ApiError(500, 'LS001', '서버 오류');
    }
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
};
