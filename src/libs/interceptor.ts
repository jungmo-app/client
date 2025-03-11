import { apis } from '@/apis';
import { ApiResponse } from '@/types/apis';
import { getCookie, redirectPath } from './serverAction';

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
      return { Authorization: token, ...header };
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
export const privateServerFetch = async <T>(url: string, refer: string, init?: RequestInit) => {
  const accessToken = await getCookie('accessToken');
  try {
    const response = await fetchApi(url, init, accessToken);
    if (!response.ok) {
      if (response.status === 401) {
        redirectPath(`/login?refer=${refer}&date=${Date.now()}`);
      }
      throw new Error('api error');
    }
    const res: ApiResponse<T> = await response.json();
    return res;
  } catch (error) {
    const e = error as Error;
    if (e.message.includes('NEXT_REDIRECT')) {
      throw error;
    }
    return null;
  }
};

export const privateClientFetch = async <T>(url: string, init?: RequestInit) => {
  const accessToken = await getCookie('accessToken');

  try {
    const response = await fetchApi(url, init, accessToken);

    if (response.status === 401) {
      const refreshToken = await getCookie('refreshToken');

      if (accessToken && refreshToken) {
        try {
          const res = await apis.auth.refreshToken(accessToken, refreshToken);
          if (!res || !res.ok) throw new Error('Token refresh failed');

          const newToken = await getCookie('accessToken');
          const retrypResponse = await fetchApi(url, init, newToken);
          const restryRes = (await retrypResponse.json()) as ApiResponse<T>;
          return restryRes;
        } catch {
          // Refresh 실패 시 기존 response 반환
        }
      }
    }
    const res = (await response.json()) as ApiResponse<T>;
    return res;
  } catch {
    return null;
  }
};

export const customFetch = async <T>(url: string, init?: RequestInit) => {
  try {
    const response = await fetchApi(url, init);
    const res: ApiResponse<T> = await response.json();
    return res;
  } catch {
    return null;
  }
};
