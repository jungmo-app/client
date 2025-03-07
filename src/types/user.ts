export interface UserDataResponse {
  userId: number;
  userCode: string;
  userName: string;
  profileImage: string | null;
}

export interface UserInfoResponse extends UserDataResponse {
  provider: 'kakao' | 'email';
}

export interface InfoRequest {
  userName: string;
  profileImage: File | null;
  delete?: boolean;
}
