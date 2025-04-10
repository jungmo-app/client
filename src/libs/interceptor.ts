import { apis } from '@/apis';
import { ApiResponse } from '@/types/apis';
import { ApiError } from '@/utils/error';
import { getCookie } from './serverAction';

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
export const privateServerFetch = async <T>(url: string, init?: RequestInit) => {
  try {
    const accessToken = await getCookie('accessToken');
    const response = await fetchApi(url, init, accessToken);

    const res: ApiResponse<T> = await response.json();

    if (res.status !== 200) {
      const { status, code, message } = res;
      throw new ApiError(status, code, message);
    }
    return res;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'F001');
  }
};

export const privateClientFetch = async <T>(url: string, init?: RequestInit) => {
  try {
    const accessToken = await getCookie('accessToken');
    const response = await fetchApi(url, init, accessToken);

    if (response.status === 401) {
      const res = await apis.auth.refreshToken();
      if (!res) {
        throw new ApiError(401, 'T999', '토큰 재발급 실패');
      }

      const newToken = await getCookie('accessToken');
      const retrypResponse = await fetchApi(url, init, newToken);
      const restryRes = (await retrypResponse.json()) as ApiResponse<T>;

      if (retrypResponse.status !== 200) {
        const { status, code, message } = restryRes;
        throw new ApiError(status, code, message);
      }
      return restryRes;
    }

    const res = (await response.json()) as ApiResponse<T>;
    if (res.status !== 200) {
      const { status, code, message } = res;
      throw new ApiError(status, code, message);
    }
    return res;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ApiError(error.status, error.code, error.message);
    }
    throw new ApiError(500, 'F001');
  }
};

export const customFetch = async <T>(url: string, init?: RequestInit) => {
  try {
    const response = await fetchApi(url, init);
    const res: ApiResponse<T> = await response.json();
    if (res.status !== 200) {
      const { status, code, message } = res;
      throw new ApiError(status, code, message);
    }
    return res;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'F001');
  }
};
