import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: '이메일 형식이 잘못되었습니다.' }).min(1, '이메일을 입력해주세요'),
  password: z.string(),
});

export const signUpSchema = z.object({
  email: z.string().email({ message: '이메일 형식이 잘못되었습니다.' }).min(1, '이메일을 입력해주세요'),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
      '비밀번호는 대문자, 소문자, 특수문자로 8자 이상이어야 합니다'
    ),
});

export type LoginRequest = z.infer<typeof loginSchema>;

export interface RegisterRequest {}

export interface ChangePasswordRequest {}
