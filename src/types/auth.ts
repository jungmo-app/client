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

export const signupSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().min(1, '이메일을 입력해주세요'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/[A-Z]/, { message: '비밀번호에는 최소 하나의 대문자가 포함되어야 합니다.' })
    .regex(/[a-z]/, { message: '비밀번호에는 최소 하나의 소문자가 포함되어야 합니다.' })
    .regex(/[\W_]/, { message: '비밀번호에는 최소 하나의 특수문자가 포함되어야 합니다.' }),
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;

export interface ChangePasswordRequest {}
