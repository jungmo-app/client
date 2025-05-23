import * as z from 'zod';
import {
  changePasswordSchema,
  loginSchema,
  resetPasswordSchema,
  setPasswordSchema,
  signupSchema,
} from '@/schemas/auth';

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

export interface RefreshTokenResponse {
  accessToken: string;
}

export type LoginRequest = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export type ChangePasswordPayload = Omit<ChangePasswordFormValues, 'confirmPassword'>;
export type ResetPasswordPayload = Omit<ResetPasswordFormValues, 'confirmPassword'> & {
  token: string;
};

export interface LoginResponse extends UserInfoResponse {
  accessToken: string;
}

export interface ChangePasswordRequest {}
