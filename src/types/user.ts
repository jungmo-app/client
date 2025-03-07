export interface UserDataResponse {
  userId: number;
  userCode: string;
  userName: string;
  profileImage: string | null;
}

export interface UserInfoResponse extends UserDataResponse {
  provider: string;
}

export interface InfoRequest {
  userName: string;
  profileImage: File | null;
  delete?: boolean;
}
