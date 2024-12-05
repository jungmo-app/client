import { z } from 'zod';
import commonSchemas from './common';

export const loginSchema = z.object({
  email: commonSchemas.email,
  password: commonSchemas.password,
});

export const registerSchema = z.object({
  email: commonSchemas.email,
  password: commonSchemas.password,
});

export const changePasswordSchema = z.object({
  currentPassword: commonSchemas.password,
  newPassword: commonSchemas.password,
});

export const deleteAccountSchema = z.object({
  password: commonSchemas.password,
});
