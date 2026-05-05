"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAccountsQuerySchema = exports.listFilesQuerySchema = exports.uploadFileRequestSchema = exports.mediaFileResponseSchema = exports.updateMediaFileSchema = exports.insertMediaFileSchema = exports.mediaAccountResponseSchema = exports.updateMediaAccountSchema = exports.insertMediaAccountSchema = void 0;
const zod_1 = require("zod");
const drizzle_zod_1 = require("drizzle-zod");
const schema_1 = require("../../db/schema");
// --- Media Account Schemas ---
exports.insertMediaAccountSchema = (0, drizzle_zod_1.createInsertSchema)(schema_1.mediaAccounts, {
    isActive: zod_1.z.boolean().default(true),
    isDefault: zod_1.z.boolean().default(false),
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.updateMediaAccountSchema = exports.insertMediaAccountSchema.partial();
exports.mediaAccountResponseSchema = (0, drizzle_zod_1.createSelectSchema)(schema_1.mediaAccounts);
// --- Media File Schemas ---
exports.insertMediaFileSchema = (0, drizzle_zod_1.createInsertSchema)(schema_1.mediaFiles, {
    size: zod_1.z.number().min(0),
}).omit({
    id: true,
    createdAt: true,
});
exports.updateMediaFileSchema = exports.insertMediaFileSchema.partial();
exports.mediaFileResponseSchema = (0, drizzle_zod_1.createSelectSchema)(schema_1.mediaFiles);
// --- API Request Schemas ---
exports.uploadFileRequestSchema = zod_1.z.object({
    category: zod_1.z.string().default('general'),
    folder: zod_1.z.string().optional(),
    tags: zod_1.z.string().optional(), // Comma-separated tags
});
exports.listFilesQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
    category: zod_1.z.string().optional(),
    folder: zod_1.z.string().optional(),
    type: zod_1.z.enum(['image', 'video', 'document', 'other']).optional(),
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(['createdAt', 'size', 'name']).default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
    startDate: zod_1.z.string().optional(), // ISO Date string
    endDate: zod_1.z.string().optional(), // ISO Date string
});
exports.listAccountsQuerySchema = zod_1.z.object({
    provider: zod_1.z.string().optional(),
    isActive: zod_1.z.coerce.boolean().optional(),
});
