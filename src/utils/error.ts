const defaultErrorMesdsage: Record<string, string> = {
  F001: '내부 서버 오류입니다.',
  M001: '위치 데이터를 가져올 수 없습니다.',
};

export class ApiError extends Error {
  public status: number;
  public code: string;

  constructor(status: number, code: string, message?: string) {
    const defaultMessage = defaultErrorMesdsage[code] ?? '알 수 없는 오류가 발생했습니다.';
    super(message ?? defaultMessage);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}
