import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters long')
      .max(30, 'Username cannot exceed 30 characters'),
    email: z
      .string()
      .email('Invalid email address formatting'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Invalid email address formatting'),
    password: z
      .string()
      .min(1, 'Password field cannot be empty'),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z
      .string()
      .min(1, 'Refresh token payload structural string is required'),
  }),
});