import { ERROR_MESSAGE } from '@/constants/errorMessage';
import { ApiErrorResponse } from '@/types/apis';

export const getFetchErrorCode = (error: ApiErrorResponse | null) => {
  if (!error) return null;

  return error.response.data.code || 9999;
};

export const getFetchErrorMessage = (error: ApiErrorResponse | null) => {
  if (!error) return null;

  const code = error.response.data.code || 9999;

  return ERROR_MESSAGE[code] || ERROR_MESSAGE[9999];
};
