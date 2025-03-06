import { apis } from '@/apis';
import { ApiResponse } from '@/types/apis';
import { getCookie } from './auth/session';

export const privateServerFetchFunc = async (url: string, init?: RequestInit) => {
  const accessToken = await getCookie('accessToken');
  const refreshToken = await getCookie('refreshToken');
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url.slice(1)}`, {
    credentials: 'include',
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
  });
  if (response.status === 401 && accessToken && refreshToken) {
    return undefined;
  }
  return response;
};

const privateClientFetch = async (url: string, init?: RequestInit) => {
  const accessToken = await getCookie('accessToken');
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url.slice(1)}`, {
      credentials: 'include',
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...init?.headers,
      },
    });
    if (response.status === 401) {
      const refreshToken = await getCookie('refreshToken');
      if (accessToken && refreshToken) {
        try {
          const res = await apis.auth.refreshToken(accessToken, refreshToken);
          if (!res) {
            throw new Error('token refresh error');
          }

          const newToken = await getCookie('accessToken');

          const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url.slice(1)}`, {
            credentials: 'include',
            ...init,
            headers: {
              Authorization: `Bearer ${newToken}`,
              ...init?.headers,
            },
          });
          return retryResponse;
        } catch {
          return undefined;
        }
      }
    }
    return response;
  } catch {
    return null;
  }
};

/*
 * undefined: 권한 없음(서버)/토큰 재발급 실패(클라이언트)
 * null: api 자체 error
 */
export const privateServerFetch = async <T>(url: string, init?: RequestInit) => {
  try {
    const response = await privateServerFetchFunc(url, init);
    if (response) {
      if (!response.ok) {
        throw new Error('api error');
      }
      const res: ApiResponse<T> = await response.json();
      return res;
    }
    return undefined;
  } catch (error) {
    return null;
  }
};

export const clientPrivateFetch = async <T>(url: string, init?: RequestInit) => {
  try {
    const response = await privateClientFetch(url, init);
    if (response) {
      if (!response.ok) {
        throw new Error('api error');
      }
      const res: ApiResponse<T> = await response.json();
      return res;
    }
    return undefined;
  } catch {
    return null;
  }
};

export const customFetch = async <T>(url: string, init?: RequestInit) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url.slice(1)}`, {
      credentials: 'include',
      ...init,
    });
    if (!response.ok) {
      throw new Error('api error');
    }
    const res: ApiResponse<T> = await response.json();
    return res;
  } catch {
    return null;
  }
};
