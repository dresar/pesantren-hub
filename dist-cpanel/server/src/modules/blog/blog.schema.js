"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogFilterSchema = exports.createTagSchema = exports.createCategorySchema = exports.updatePostSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    slug: zod_1.z.string().optional(),
    content: zod_1.z.string().min(1),
    excerpt: zod_1.z.string().optional(),
    status: zod_1.z.enum(['draft', 'published', 'archived']).default('draft'),
    featuredImage: zod_1.z.string().optional(),
    categoryId: zod_1.z.number().int().optional(),
    tags: zod_1.z.array(zod_1.z.number().int()).optional(),
    metaTitle: zod_1.z.string().optional(),
    metaDescription: zod_1.z.string().optional(),
    isFeatured: zod_1.z.boolean().default(false),
    publishedAt: zod_1.z.string().optional(),
});
exports.updatePostSchema = exports.createPostSchema.partial();
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    slug: zod_1.z.string().optional(),
    order: zod_1.z.number().int().default(0),
});
exports.createTagSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    slug: zod_1.z.string().optional(),
    order: zod_1.z.number().int().default(0),
});
exports.blogFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(['draft', 'published', 'archived']).optional(),
    categoryId: zod_1.z.string().optional().transform(Number),
    tagId: zod_1.z.string().optional().transform(Number),
    page: zod_1.z.string().optional().transform(Number),
    limit: zod_1.z.string().optional().transform(Number),
    orderBy: zod_1.z.string().optional(),
    orderDir: zod_1.z.enum(['asc', 'desc']).optional(),
});
