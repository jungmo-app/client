import { z } from 'zod';

const userDataResponseSchema = z.object({
  userId: z.number(),
  userCode: z.string(),
  userName: z.string(),
  profileImage: z.string().nullable(),
});

export const mainInfoSchema = z.object({
  title: z.string().min(1, { message: '제목은 필수입니다' }),
  startDate: z.string(),
  startTime: z.string(),
  description: z.string().nullable(),
  userList: z.array(userDataResponseSchema),
});
