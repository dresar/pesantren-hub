import { z } from 'zod';
export const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  phone: z.string().min(10),
});
export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});