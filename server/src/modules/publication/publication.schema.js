import { z } from 'zod';
export const createArticleSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi"),
    slug: z.string().optional(),
    content: z.string().min(1, "Konten wajib diisi"),
    excerpt: z.string().optional(),
    featuredImage: z.string().optional(),
    categoryId: z.number().int().optional(),
    type: z.enum(['article', 'journal']).default('article'),
    status: z.enum(['draft', 'pending', 'approved', 'rejected']).default('draft'),
    volumeId: z.number().int().optional(),
    pdfFile: z.string().optional(),
    keywords: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    collaborationId: z.number().int().optional(),
});
export const updateArticleSchema = createArticleSchema.partial();
export const createCategorySchema = z.object({
    name: z.string().min(1, "Nama kategori wajib diisi"),
    slug: z.string().optional(),
    type: z.enum(['article', 'journal']).default('article'),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
});
export const updateCategorySchema = createCategorySchema.partial();
export const createVolumeSchema = z.object({
    name: z.string().min(1, "Nama volume wajib diisi"),
    year: z.number().int().min(2000),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
    isPublished: z.boolean().default(false),
});
export const updateVolumeSchema = createVolumeSchema.partial();
export const approvalSchema = z.object({
    status: z.enum(['approved', 'rejected']),
    rejectionReason: z.string().optional(),
});
export const publicationFilterSchema = z.object({
    search: z.string().optional(),
    status: z.enum(['draft', 'pending', 'approved', 'rejected']).optional(),
    type: z.enum(['article', 'journal']).optional(),
    categoryId: z.string().optional().transform((val) => val ? Number(val) : undefined),
    volumeId: z.string().optional().transform((val) => val ? Number(val) : undefined),
    authorId: z.string().optional().transform((val) => val ? Number(val) : undefined),
    page: z.string().optional().transform((val) => val ? Number(val) : 1),
    limit: z.string().optional().transform((val) => val ? Number(val) : 10),
    orderBy: z.string().optional(),
    orderDir: z.enum(['asc', 'desc']).optional(),
});
export const authorRegistrationSchema = z.object({
    bio: z.string().optional(),
    institution: z.string().min(1, "Institusi wajib diisi"),
    whatsapp: z.string().min(10, "Nomor WhatsApp tidak valid"),
    expertise: z.string().optional(),
});
export const createCollaborationSchema = z.object({
    title: z.string().min(1, "Judul kolaborasi wajib diisi"),
    description: z.string().optional(),
    status: z.enum(['active', 'completed', 'archived']).default('active'),
});
export const updateCollaborationSchema = createCollaborationSchema.partial();
export const addCollaborationMemberSchema = z.object({
    userId: z.number().int("ID User tidak valid"),
    role: z.enum(['editor', 'viewer']).default('viewer'),
});
export const inviteCollaborationSchema = z.object({
    identifier: z.string().optional(),
    userId: z.number().int().optional(),
    role: z.enum(['editor', 'viewer']).default('editor'),
}).refine(data => (data.identifier && data.identifier.length >= 2) || (data.userId != null), {
    message: 'Berikan identifier (email/username) atau userId',
});
export const respondInviteSchema = z.object({
    action: z.enum(['accept', 'decline']),
});
export const updateCollaborationMemberRoleSchema = z.object({
    role: z.enum(['owner', 'editor', 'viewer']),
});
export const newAuthorRegistrationSchema = z.object({
    // User Fields
    username: z.string().optional(), // Auto-generated if not provided
    email: z.string().email("Email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    firstName: z.string().min(1, "Nama depan wajib diisi"),
    lastName: z.string().optional(),
    phone: z.string().min(10, "Nomor HP tidak valid"),
    // Author Profile Fields
    bio: z.string().optional(),
    institution: z.string().optional(),
    whatsapp: z.string().optional(),
    expertise: z.string().optional(),
});
