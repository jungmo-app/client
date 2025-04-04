import { ERROR_MESSAGE } from '@/constants/errorMessage';
import { ApiErrorResponse, ApiResponse } from '@/types/apis';

export const getFetchErrorCode = (error: ApiErrorResponse | null) => {
  if (!error) return null;

  return error.response.data.code || 9999;
};

export const getFetchErrorMessage = (error: ApiErrorResponse | null) => {
  if (!error) return null;

  const code = error.response.data.code || 9999;

  return ERROR_MESSAGE[code] || ERROR_MESSAGE[9999];
};

export const throwError = <T>(response: null | ApiResponse<T>) => {
  if (!response || response.status !== 200) {
    if (!response) {
      throw {
        status: 500,
        code: 'X001',
        message: 'API 요청 오류',
      };
    }
    const { status, code, message } = response;
    throw {
      status: status,
      code: code,
      message: message,
    };
  }
  return response.data;
};
