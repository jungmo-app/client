import { z } from 'zod';

const hasNumber = /.*[0-9].*/;
const hasEnglish = /.*[a-zA-Z].*/;
const hasSpecialChar = /.*[@$!%*#?&].*/;

export const editProfileSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  profileImage: z.instanceof(File).optional(),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, '8자 이상 입력해주세요')
      .regex(hasNumber, '숫자를 포함해주세요')
      .regex(hasEnglish, '영문을 포함해주세요')
      .regex(hasSpecialChar, '특수문자를 포함해주세요'),
    newPassword: z
      .string()
      .min(8, '8자 이상 입력해주세요')
      .regex(hasNumber, '숫자를 포함해주세요')
      .regex(hasEnglish, '영문을 포함해주세요')
      .regex(hasSpecialChar, '특수문자를 포함해주세요'),
    confirmPassword: z
      .string()
      .min(8, '8자 이상 입력해주세요')
      .regex(hasNumber, '숫자를 포함해주세요')
      .regex(hasEnglish, '영문을 포함해주세요')
      .regex(hasSpecialChar, '특수문자를 포함해주세요'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: '새 비밀번호가 일치하지 않아요',
    path: ['confirmPassword'],
  })
  .refine(data => data.currentPassword !== data.newPassword, {
    message: '현재 비밀번호와 동일한 비밀번호로 변경할 수 없어요',
    path: ['newPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
