"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newAuthorRegistrationSchema = exports.updateCollaborationMemberRoleSchema = exports.respondInviteSchema = exports.inviteCollaborationSchema = exports.addCollaborationMemberSchema = exports.updateCollaborationSchema = exports.createCollaborationSchema = exports.authorRegistrationSchema = exports.publicationFilterSchema = exports.approvalSchema = exports.updateVolumeSchema = exports.createVolumeSchema = exports.updateCategorySchema = exports.createCategorySchema = exports.updateArticleSchema = exports.createArticleSchema = void 0;
const zod_1 = require("zod");
exports.createArticleSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Judul wajib diisi"),
    slug: zod_1.z.string().optional(),
    content: zod_1.z.string().min(1, "Konten wajib diisi"),
    excerpt: zod_1.z.string().optional(),
    featuredImage: zod_1.z.string().optional(),
    categoryId: zod_1.z.number().int().optional(),
    type: zod_1.z.enum(['article', 'journal']).default('article'),
    status: zod_1.z.enum(['draft', 'pending', 'approved', 'rejected']).default('draft'),
    volumeId: zod_1.z.number().int().optional(),
    pdfFile: zod_1.z.string().optional(),
    keywords: zod_1.z.string().optional(),
    metaTitle: zod_1.z.string().optional(),
    metaDescription: zod_1.z.string().optional(),
    collaborationId: zod_1.z.number().int().optional(),
});
exports.updateArticleSchema = exports.createArticleSchema.partial();
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Nama kategori wajib diisi"),
    slug: zod_1.z.string().optional(),
    type: zod_1.z.enum(['article', 'journal']).default('article'),
    description: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().default(true),
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
exports.createVolumeSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Nama volume wajib diisi"),
    year: zod_1.z.number().int().min(2000),
    description: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().default(true),
    isPublished: zod_1.z.boolean().default(false),
});
exports.updateVolumeSchema = exports.createVolumeSchema.partial();
exports.approvalSchema = zod_1.z.object({
    status: zod_1.z.enum(['approved', 'rejected']),
    rejectionReason: zod_1.z.string().optional(),
});
exports.publicationFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(['draft', 'pending', 'approved', 'rejected']).optional(),
    type: zod_1.z.enum(['article', 'journal']).optional(),
    categoryId: zod_1.z.string().optional().transform((val) => val ? Number(val) : undefined),
    volumeId: zod_1.z.string().optional().transform((val) => val ? Number(val) : undefined),
    authorId: zod_1.z.string().optional().transform((val) => val ? Number(val) : undefined),
    page: zod_1.z.string().optional().transform((val) => val ? Number(val) : 1),
    limit: zod_1.z.string().optional().transform((val) => val ? Number(val) : 10),
    orderBy: zod_1.z.string().optional(),
    orderDir: zod_1.z.enum(['asc', 'desc']).optional(),
});
exports.authorRegistrationSchema = zod_1.z.object({
    bio: zod_1.z.string().optional(),
    institution: zod_1.z.string().min(1, "Institusi wajib diisi"),
    whatsapp: zod_1.z.string().min(10, "Nomor WhatsApp tidak valid"),
    expertise: zod_1.z.string().optional(),
});
exports.createCollaborationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Judul kolaborasi wajib diisi"),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(['active', 'completed', 'archived']).default('active'),
});
exports.updateCollaborationSchema = exports.createCollaborationSchema.partial();
exports.addCollaborationMemberSchema = zod_1.z.object({
    userId: zod_1.z.number().int("ID User tidak valid"),
    role: zod_1.z.enum(['editor', 'viewer']).default('viewer'),
});
exports.inviteCollaborationSchema = zod_1.z.object({
    identifier: zod_1.z.string().optional(),
    userId: zod_1.z.number().int().optional(),
    role: zod_1.z.enum(['editor', 'viewer']).default('editor'),
}).refine(data => (data.identifier && data.identifier.length >= 2) || (data.userId != null), {
    message: 'Berikan identifier (email/username) atau userId',
});
exports.respondInviteSchema = zod_1.z.object({
    action: zod_1.z.enum(['accept', 'decline']),
});
exports.updateCollaborationMemberRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(['owner', 'editor', 'viewer']),
});
exports.newAuthorRegistrationSchema = zod_1.z.object({
    // User Fields
    username: zod_1.z.string().optional(), // Auto-generated if not provided
    email: zod_1.z.string().email("Email tidak valid"),
    password: zod_1.z.string().min(8, "Password minimal 8 karakter"),
    firstName: zod_1.z.string().min(1, "Nama depan wajib diisi"),
    lastName: zod_1.z.string().optional(),
    phone: zod_1.z.string().min(10, "Nomor HP tidak valid"),
    // Author Profile Fields
    bio: zod_1.z.string().optional(),
    institution: zod_1.z.string().optional(),
    whatsapp: zod_1.z.string().optional(),
    expertise: zod_1.z.string().optional(),
});
