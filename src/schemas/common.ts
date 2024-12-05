import { z } from 'zod';
import { REGEX } from '@/constants/regex';

const EMAIL_SCHEMA = z.string().email({ message: '이메일 형식이 올바르지 않아요' });

const PASSWORD_SCHEMA = z
  .string()
  .min(8, { message: '비밀번호는 최소 8자 이상이어야 해요' })
  .regex(REGEX.password.uppercase, {
    message: '패스워드는 최소 1개이상 대문자를 포함해야해요',
  })
  .regex(REGEX.password.lowercase, {
    message: '패스워드는 최소 1개이상 소문자를 포함해야해요',
  })
  .regex(REGEX.password.number, {
    message: '패스워드는 최소 1개이상 숫자를 포함해야해요',
  })
  .regex(REGEX.password.special, {
    message: '패스워드는 최소 1개이상 특수문자를 포함해야해요',
  });

const commonSchemas = {
  email: EMAIL_SCHEMA,
  password: PASSWORD_SCHEMA,
};

export default commonSchemas;
