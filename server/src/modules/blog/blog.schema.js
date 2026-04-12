import { z } from 'zod';
export const createPostSchema = z.object({
    title: z.string().min(1),
    slug: z.string().optional(),
    content: z.string().min(1),
    excerpt: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    featuredImage: z.string().optional(),
    categoryId: z.number().int().optional(),
    tags: z.array(z.number().int()).optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    isFeatured: z.boolean().default(false),
    publishedAt: z.string().optional(),
});
export const updatePostSchema = createPostSchema.partial();
export const createCategorySchema = z.object({
    name: z.string().min(1),
    slug: z.string().optional(),
    order: z.number().int().default(0),
});
export const createTagSchema = z.object({
    name: z.string().min(1),
    slug: z.string().optional(),
    order: z.number().int().default(0),
});
export const blogFilterSchema = z.object({
    search: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    categoryId: z.string().optional().transform(Number),
    tagId: z.string().optional().transform(Number),
    page: z.string().optional().transform(Number),
    limit: z.string().optional().transform(Number),
    orderBy: z.string().optional(),
    orderDir: z.enum(['asc', 'desc']).optional(),
});
