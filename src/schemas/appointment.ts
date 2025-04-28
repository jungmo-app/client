import { z } from 'zod';

const userDataResponseSchema = z.object({
  userId: z.number(),
  userCode: z.string(),
  userName: z.string(),
  profileImage: z.string().nullable(),
});

const meetingLocationSchema = z.object({
  id: z.string().min(1),
  address: z.string(),
  name: z.string(),
});

export const mainInfoSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  startDate: z.string(),
  startTime: z.string(),
  description: z.string().nullable(),
  userList: z.array(userDataResponseSchema),
});

export const createAppointmentSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  startDate: z.string(),
  startTime: z.string(),
  meetingLocation: meetingLocationSchema,
  memo: z.string().nullable(),
  userIds: z.array(z.number()),
});
