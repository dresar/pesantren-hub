"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const auth_1 = require("../../middleware/auth");
const blog_schema_1 = require("./blog.schema");
const zod_1 = require("zod");
const blog = new hono_1.Hono();
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/-+/g, '-');
};
blog.get('/posts', (0, zod_validator_1.zValidator)('query', blog_schema_1.blogFilterSchema), async (c) => {
    try {
        const query = c.req.valid('query');
        const page = query.page || 1;
        const limit = query.limit || 10;
        const offset = (page - 1) * limit;
        let whereClause = undefined;
        if (query.search) {
            whereClause = (0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(schema_1.blogPosts.title, `%${query.search}%`), (0, drizzle_orm_1.like)(schema_1.blogPosts.content, `%${query.search}%`), (0, drizzle_orm_1.like)(schema_1.blogPosts.excerpt, `%${query.search}%`));
        }
        if (query.status) {
            const statusCondition = (0, drizzle_orm_1.eq)(schema_1.blogPosts.status, query.status);
            whereClause = whereClause ? (0, drizzle_orm_1.and)(whereClause, statusCondition) : statusCondition;
        }
        if (query.categoryId) {
            const catCondition = (0, drizzle_orm_1.eq)(schema_1.blogPosts.categoryId, query.categoryId);
            whereClause = whereClause ? (0, drizzle_orm_1.and)(whereClause, catCondition) : catCondition;
        }
        const postsListRaw = await db_1.db.select()
            .from(schema_1.blogPosts)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.blogPosts.authorId, schema_1.users.id))
            .leftJoin(schema_1.blogCategories, (0, drizzle_orm_1.eq)(schema_1.blogPosts.categoryId, schema_1.blogCategories.id))
            .where(whereClause)
            .limit(limit)
            .offset(offset)
            .orderBy(query.orderDir === 'asc' ? (0, drizzle_orm_1.asc)(schema_1.blogPosts.createdAt) : (0, drizzle_orm_1.desc)(schema_1.blogPosts.createdAt));
        const postsList = postsListRaw.map(row => ({
            ...row.blog_blogpost,
            author: row.users_user ? {
                id: row.users_user.id,
                username: row.users_user.username,
                firstName: row.users_user.firstName,
                lastName: row.users_user.lastName,
                avatar: row.users_user.avatar,
            } : null,
            category: row.blog_category,
            tags: []
        }));
        const total = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.blogPosts)
            .where(whereClause)
            .then(res => res[0].count);
        return c.json({
            data: postsList,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (e) {
        console.error('Blog /posts error:', e);
        return c.json({
            data: [],
            meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
        });
    }
});
blog.get('/posts/:slug', async (c) => {
    const slug = c.req.param('slug');
    let whereCondition;
    if (!isNaN(Number(slug))) {
        whereCondition = (0, drizzle_orm_1.eq)(schema_1.blogPosts.id, Number(slug));
    }
    else {
        whereCondition = (0, drizzle_orm_1.eq)(schema_1.blogPosts.slug, slug);
    }
    const resultRaw = await db_1.db.select()
        .from(schema_1.blogPosts)
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.blogPosts.authorId, schema_1.users.id))
        .leftJoin(schema_1.blogCategories, (0, drizzle_orm_1.eq)(schema_1.blogPosts.categoryId, schema_1.blogCategories.id))
        .where(whereCondition);
    if (resultRaw.length === 0) {
        return c.json({ error: 'Post not found' }, 404);
    }
    const row = resultRaw[0];
    const post = {
        ...row.blog_blogpost,
        author: row.users_user ? {
            id: row.users_user.id,
            username: row.users_user.username,
            firstName: row.users_user.firstName,
            lastName: row.users_user.lastName,
            avatar: row.users_user.avatar,
        } : null,
        category: row.blog_category,
        tags: []
    };
    const tagsResult = await db_1.db.select()
        .from(schema_1.blogPostTags)
        .innerJoin(schema_1.blogTags, (0, drizzle_orm_1.eq)(schema_1.blogPostTags.tagId, schema_1.blogTags.id))
        .where((0, drizzle_orm_1.eq)(schema_1.blogPostTags.blogpostId, post.id));
    post.tags = tagsResult.map(t => ({ tag: t.blog_tag }));
    return c.json(post);
});
blog.get('/categories', async (c) => {
    const allCategories = await db_1.db.select()
        .from(schema_1.blogCategories)
        .orderBy((0, drizzle_orm_1.asc)(schema_1.blogCategories.order), (0, drizzle_orm_1.asc)(schema_1.blogCategories.name));
    return c.json(allCategories);
});
blog.get('/tags', async (c) => {
    const allTags = await db_1.db.select()
        .from(schema_1.blogTags)
        .orderBy((0, drizzle_orm_1.asc)(schema_1.blogTags.name));
    return c.json(allTags);
});
blog.get('/testimonials', async (c) => {
    try {
        const testimonials = await db_1.db.select()
            .from(schema_1.blogTestimonials)
            .where((0, drizzle_orm_1.eq)(schema_1.blogTestimonials.isPublished, true))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.blogTestimonials.order));
        return c.json(testimonials);
    }
    catch (e) {
        console.error('Blog /testimonials error:', e);
        return c.json([]);
    }
});
blog.post('/posts', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', blog_schema_1.createPostSchema), async (c) => {
    const user = c.get('user');
    const data = c.req.valid('json');
    const generatedSlug = data.slug || slugify(data.title);
    const existing = await db_1.db.select().from(schema_1.blogPosts).where((0, drizzle_orm_1.eq)(schema_1.blogPosts.slug, generatedSlug)).limit(1);
    if (existing.length > 0) {
        return c.json({ error: 'Slug already exists' }, 400);
    }
    // @ts-ignore
    const [insertedPost] = await db_1.db.insert(schema_1.blogPosts).values({
        title: data.title,
        slug: generatedSlug,
        content: data.content,
        excerpt: data.excerpt,
        status: data.status,
        featuredImage: data.featuredImage,
        categoryId: data.categoryId,
        authorId: user.id,
        metaTitle: data.metaTitle || data.title,
        metaDescription: data.metaDescription || '',
        metaKeywords: '',
        viewsCount: 0,
        likesCount: 0,
        sharesCount: 0,
        isFeatured: data.isFeatured || false,
        publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : (data.status === 'published' ? new Date().toISOString() : null),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }).returning();
    if (!insertedPost)
        return c.json({ error: 'Failed to create post' }, 500);
    if (data.tags && data.tags.length > 0) {
        await db_1.db.insert(schema_1.blogPostTags).values(data.tags.map(tagId => ({
            blogpostId: insertedPost.id,
            tagId: tagId
        })));
    }
    return c.json(insertedPost, 201);
});
blog.put('/posts/:id', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', blog_schema_1.updatePostSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    await db_1.db.update(schema_1.blogPosts)
        .set({
        ...data,
        updatedAt: new Date().toISOString(),
        publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : undefined,
    })
        .where((0, drizzle_orm_1.eq)(schema_1.blogPosts.id, id));
    const updatedPost = await db_1.db.select().from(schema_1.blogPosts).where((0, drizzle_orm_1.eq)(schema_1.blogPosts.id, id));
    if (updatedPost.length === 0)
        return c.json({ error: 'Post not found' }, 404);
    if (data.tags) {
        await db_1.db.delete(schema_1.blogPostTags).where((0, drizzle_orm_1.eq)(schema_1.blogPostTags.blogpostId, id));
        if (data.tags.length > 0) {
            await db_1.db.insert(schema_1.blogPostTags).values(data.tags.map(tagId => ({
                blogpostId: id,
                tagId: tagId
            })));
        }
    }
    return c.json(updatedPost[0]);
});
blog.delete('/posts/:id', auth_1.adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    await db_1.db.delete(schema_1.blogPostTags).where((0, drizzle_orm_1.eq)(schema_1.blogPostTags.blogpostId, id));
    await db_1.db.delete(schema_1.blogPosts).where((0, drizzle_orm_1.eq)(schema_1.blogPosts.id, id));
    return c.json({ message: 'Post deleted successfully' });
});
blog.post('/categories', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', blog_schema_1.createCategorySchema), async (c) => {
    const data = c.req.valid('json');
    const generatedSlug = data.slug || slugify(data.name);
    const [newCategory] = await db_1.db.insert(schema_1.blogCategories).values({
        name: data.name,
        slug: generatedSlug,
        order: data.order,
        createdAt: new Date().toISOString(),
    }).returning();
    return c.json(newCategory, 201);
});
blog.post('/tags', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', blog_schema_1.createTagSchema), async (c) => {
    const data = c.req.valid('json');
    const generatedSlug = data.slug || slugify(data.name);
    const [newTag] = await db_1.db.insert(schema_1.blogTags).values({
        name: data.name,
        slug: generatedSlug,
        order: data.order,
        createdAt: new Date().toISOString(),
    }).returning();
    return c.json(newTag, 201);
});
// ===== PENGUMUMAN (ANNOUNCEMENTS) =====
const announcementSchema = zod_1.z.object({
    judul: zod_1.z.string().min(1),
    konten: zod_1.z.string().min(1),
    gambar: zod_1.z.string().optional().nullable(),
    status: zod_1.z.enum(['draft', 'published']).default('published'),
    isPenting: zod_1.z.boolean().default(false),
    metaTitle: zod_1.z.string().optional().default(''),
    metaDescription: zod_1.z.string().optional().default(''),
    publishedAt: zod_1.z.string().optional().nullable(),
    popupEnabled: zod_1.z.boolean().default(false),
    popupImage: zod_1.z.string().optional().nullable(),
    popupStartDate: zod_1.z.string().optional().nullable(),
    popupEndDate: zod_1.z.string().optional().nullable(),
});
const slugifyAnn = (text) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/-+/g, '-');
// Public: Get all published announcements
blog.get('/announcements', async (c) => {
    try {
        const popupOnly = c.req.query('popup') === 'true';
        let query = db_1.db.select().from(schema_1.blogAnnouncements).$dynamic();
        if (popupOnly) {
            const now = new Date().toISOString();
            query = db_1.db.select().from(schema_1.blogAnnouncements)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.blogAnnouncements.status, 'published'), (0, drizzle_orm_1.eq)(schema_1.blogAnnouncements.popupEnabled, true))).$dynamic();
        }
        else {
            query = db_1.db.select().from(schema_1.blogAnnouncements)
                .where((0, drizzle_orm_1.eq)(schema_1.blogAnnouncements.status, 'published')).$dynamic();
        }
        const data = await query.orderBy((0, drizzle_orm_1.desc)(schema_1.blogAnnouncements.publishedAt));
        return c.json(data);
    }
    catch (e) {
        console.error('Blog /announcements error:', e);
        return c.json([]);
    }
});
// Public: Get single announcement
blog.get('/announcements/:slug', async (c) => {
    const slug = c.req.param('slug');
    const [item] = await db_1.db.select().from(schema_1.blogAnnouncements).where((0, drizzle_orm_1.eq)(schema_1.blogAnnouncements.slug, slug));
    if (!item)
        return c.json({ error: 'Not found' }, 404);
    return c.json(item);
});
// Admin: Get all announcements
blog.get('/admin/announcements', auth_1.adminMiddleware, async (c) => {
    const data = await db_1.db.select().from(schema_1.blogAnnouncements).orderBy((0, drizzle_orm_1.desc)(schema_1.blogAnnouncements.createdAt));
    return c.json(data);
});
// Admin: Get single announcement by ID
blog.get('/admin/announcements/:id', auth_1.adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    const [item] = await db_1.db.select().from(schema_1.blogAnnouncements).where((0, drizzle_orm_1.eq)(schema_1.blogAnnouncements.id, id));
    if (!item)
        return c.json({ error: 'Not found' }, 404);
    return c.json(item);
});
// Admin: Create announcement
blog.post('/admin/announcements', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', announcementSchema), async (c) => {
    const data = c.req.valid('json');
    let slug = slugifyAnn(data.judul);
    const existing = await db_1.db.select({ id: schema_1.blogAnnouncements.id }).from(schema_1.blogAnnouncements).where((0, drizzle_orm_1.eq)(schema_1.blogAnnouncements.slug, slug));
    if (existing.length > 0)
        slug = `${slug}-${Date.now()}`;
    // @ts-ignore
    const [item] = await db_1.db.insert(schema_1.blogAnnouncements).values({
        ...data,
        slug,
        metaTitle: data.metaTitle || data.judul,
        metaDescription: data.metaDescription || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }).returning();
    return c.json(item, 201);
});
// Admin: Update announcement
blog.put('/admin/announcements/:id', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', announcementSchema.partial()), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    await db_1.db.update(schema_1.blogAnnouncements).set({ ...data, updatedAt: new Date().toISOString() }).where((0, drizzle_orm_1.eq)(schema_1.blogAnnouncements.id, id));
    const [updated] = await db_1.db.select().from(schema_1.blogAnnouncements).where((0, drizzle_orm_1.eq)(schema_1.blogAnnouncements.id, id));
    return c.json(updated);
});
// Admin: Delete announcement
blog.delete('/admin/announcements/:id', auth_1.adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    await db_1.db.delete(schema_1.blogAnnouncements).where((0, drizzle_orm_1.eq)(schema_1.blogAnnouncements.id, id));
    return c.json({ message: 'Deleted' });
});
exports.default = blog;
