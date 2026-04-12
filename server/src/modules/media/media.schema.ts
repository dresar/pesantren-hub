import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { mediaAccounts, mediaFiles, mediaLogs } from '../../db/schema';

// --- Media Account Schemas ---

export const insertMediaAccountSchema = createInsertSchema(mediaAccounts, {
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateMediaAccountSchema = insertMediaAccountSchema.partial();

export const mediaAccountResponseSchema = createSelectSchema(mediaAccounts);


// --- Media File Schemas ---

export const insertMediaFileSchema = createInsertSchema(mediaFiles, {
  size: z.number().min(0),
}).omit({
  id: true,
  createdAt: true,
});

export const updateMediaFileSchema = insertMediaFileSchema.partial();

export const mediaFileResponseSchema = createSelectSchema(mediaFiles);


// --- API Request Schemas ---

export const uploadFileRequestSchema = z.object({
  category: z.string().default('general'),
  folder: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
});

export const listFilesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  category: z.string().optional(),
  folder: z.string().optional(),
  type: z.enum(['image', 'video', 'document', 'other']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'size', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  startDate: z.string().optional(), // ISO Date string
  endDate: z.string().optional(),   // ISO Date string
});

export const listAccountsQuerySchema = z.object({
  provider: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});
