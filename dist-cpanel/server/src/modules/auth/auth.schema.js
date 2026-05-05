"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().optional(),
    phone: zod_1.z.string().min(10),
});
exports.loginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, 'Username/email wajib diisi').transform((s) => s.trim()),
    password: zod_1.z.string().min(1, 'Password wajib diisi'),
});
