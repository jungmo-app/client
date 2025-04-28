import { z } from 'zod';
import commonSchemas from './common';

export const editProfileSchema = z.object({
  userName: z.string().min(1, '이름을 입력해주세요'),
  profileImage: z.instanceof(File).optional(),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export const loginSchema = z.object({
  email: commonSchemas.email,
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export const signupSchema = z.object({
  name: commonSchemas.name,
  email: commonSchemas.email,
  password: commonSchemas.password,
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: commonSchemas.password,
    confirmPassword: commonSchemas.password,
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '새 비밀번호가 일치하지 않아요',
        path: ['confirmPassword'],
      });
    }

    if (data.oldPassword === data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '현재 비밀번호와 동일한 비밀번호로 변경할 수 없어요',
        path: ['newPassword'],
      });
    }
  });

export const resetPasswordSchema = z
  .object({
    newPassword: commonSchemas.password,
    confirmPassword: commonSchemas.password,
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: '새 비밀번호가 일치하지 않아요',
    path: ['confirmPassword'],
  });

export const setPasswordSchema = z.object({
  email: commonSchemas.email,
});
