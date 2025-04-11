import axios from 'axios';
import { apis } from '@/apis';
import { ApiResponse } from '@/types/apis';
import { ApiError } from '@/utils/error';
import { getCookie } from './serverAction';

interface PrivateFetchOptions {
  isClient?: boolean;
  requireAuth?: boolean;
}

const setHeaders = (init?: RequestInit, token?: string) => {
  const headers =
    init?.headers instanceof Headers
      ? (Object.fromEntries(init.headers.entries()) as Record<string, string>)
      : typeof init?.headers === 'object' && !Array.isArray(init.headers)
        ? ({ ...init.headers } as Record<string, string>)
        : {};

  if (headers['Content-Type'] === 'multipart/form-data') {
    const { 'Content-Type': _, ...header } = headers; // 'Content-Type' 제거
    if (token) {
      return { Authorization: `Bearer ${token}`, ...header };
    }
    return header;
  }
  if (token) {
    return { authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...headers };
  }
  return { 'Content-Type': 'application/json', ...headers };
};

const fetchApi = async (url: string, init?: RequestInit, token?: string) => {
  const header = setHeaders(init, token);

  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url.slice(1)}`, {
    credentials: 'include',
    ...init,
    headers: header,
  });
};

const parseResponse = async <T>(response: Response) => {
  const res: ApiResponse<T> = await response.json();

  if (response.status !== 200) {
    throw new ApiError(res.status, res.code, res.message);
  }
  return res;
};

const privateFetch = async <T>(url: string, init?: RequestInit, options: PrivateFetchOptions = {}) => {
  const { isClient = false, requireAuth = true } = options;
  try {
    const accessToken = requireAuth ? await getCookie('accessToken') : undefined;
    const response = await fetchApi(url, init, accessToken);

    if (response.status === 401 && isClient && requireAuth) {
      try {
        await apis.auth.refreshToken();
        const newToken = await getCookie('accessToken');
        const retryResponse = await fetchApi(url, init, newToken);
        const res = await parseResponse<T>(retryResponse);
        return res;
      } catch (error) {
        alert('세션이 만료되었습니다');
        window.location.replace('/login');

        if (error instanceof ApiError) {
          throw error;
        }

        if (axios.isAxiosError(error) && error.response) {
          const {
            status,
            data: { code, message },
          } = error.response;
          throw new ApiError(status, code, message);
        }

        throw new ApiError(500, 'F001');
      }
    }
    const res = await parseResponse<T>(response);
    return res;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'F001');
  }
};

export const privateServerFetch = <T>(url: string, init?: RequestInit) => {
  return privateFetch<T>(url, init);
};

export const privateClientFetch = <T>(url: string, init?: RequestInit) => {
  return privateFetch<T>(url, init, { isClient: true });
};

export const customFetch = async <T>(url: string, init?: RequestInit) => {
  return privateFetch<T>(url, init, { requireAuth: false });
};
