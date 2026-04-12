import { z } from 'zod';
export const bulkActionSchema = z.object({
  action: z.enum(['delete', 'accept', 'reject']),
  ids: z.array(z.number()),
  reason: z.string().optional(),
});
export const searchFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['pending', 'verified', 'accepted', 'rejected']).optional(),
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
export const updateSantriStatusSchema = z.object({
  status: z.enum(['pending', 'verified', 'accepted', 'rejected']),
});
export const createUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['superadmin', 'bendahara', 'petugaspendaftaran', 'user', 'author']),
  isActive: z.boolean().default(true),
});
export const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.enum(['superadmin', 'bendahara', 'petugaspendaftaran', 'user', 'author']).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(6).optional(), // Admin bisa reset sandi tanpa verifikasi (min 6 untuk format rds+angka)
});