import * as z from 'zod';
import {
  changePasswordSchema,
  loginSchema,
  resetPasswordSchema,
  setPasswordSchema,
  signupSchema,
} from '@/schemas/auth';

export type LoginRequest = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export type ChangePasswordPayload = Omit<ChangePasswordFormValues, 'confirmPassword'>;
export type ResetPasswordPayload = Omit<ResetPasswordFormValues, 'confirmPassword'> & {
  token: string;
};

export interface ChangePasswordRequest {}
