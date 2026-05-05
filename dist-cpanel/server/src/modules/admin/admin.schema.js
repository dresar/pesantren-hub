"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = exports.updateSantriStatusSchema = exports.searchFilterSchema = exports.bulkActionSchema = void 0;
const zod_1 = require("zod");
exports.bulkActionSchema = zod_1.z.object({
    action: zod_1.z.enum(['delete', 'accept', 'reject']),
    ids: zod_1.z.array(zod_1.z.number()),
    reason: zod_1.z.string().optional(),
});
exports.searchFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(['pending', 'verified', 'accepted', 'rejected']).optional(),
    page: zod_1.z.string().optional().transform(Number),
    limit: zod_1.z.string().optional().transform(Number),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
});
exports.updateSantriStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'verified', 'accepted', 'rejected']),
});
exports.createUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    role: zod_1.z.enum(['superadmin', 'admin', 'bendahara', 'petugaspendaftaran', 'user', 'author', 'santri']),
    isActive: zod_1.z.boolean().default(true),
});
exports.updateUserSchema = zod_1.z.object({
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().optional(),
    role: zod_1.z.enum(['superadmin', 'admin', 'bendahara', 'petugaspendaftaran', 'user', 'author', 'santri']).optional(),
    isActive: zod_1.z.boolean().optional(),
    password: zod_1.z.string().min(6).optional(), // Admin bisa reset sandi tanpa verifikasi (min 6 untuk format rds+angka)
});
