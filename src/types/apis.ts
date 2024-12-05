import Error from 'next/error';
import type { ERROR_MESSAGE } from '@/constants/errorMessage';

export interface ApiResponse<T = undefined> {
  data?: T;
  /** 메시지 (example: SUCCESS) */
  message: string;
  /** HTTP 상태코드 (example: 200) */
  code: number;
  /** HTTP 상태 (example: OK) */
  status: string;
}

export interface ApiErrorResponse extends Error {
  response: {
    data: {
      /** 에러코드 (example: 2003) */
      code: keyof typeof ERROR_MESSAGE;
      /** 에러메시지 (example: 비밀번호가 일치하지 않아요.) */
      message: string;
      /** 에러경로 (example: /api/member/password) */
      path: string;
      /** 에러발생시간 (example: 2024-12-03T08:18:38.467078734) */
      timestamp: string;
    };
  };
}
