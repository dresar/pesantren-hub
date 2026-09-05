import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq, like, or, and, desc, asc, inArray, sql } from 'drizzle-orm';
import { db } from '../../db';
import { blogPosts as posts, blogCategories as categories, blogTags as tags, blogPostTags as postTags, users, blogTestimonials, blogAnnouncements } from '../../db/schema';
import { authMiddleware, adminMiddleware, AuthUser } from '../../middleware/auth';
import { createPostSchema, updatePostSchema, blogFilterSchema, createCategorySchema, createTagSchema } from './blog.schema';
import { z } from 'zod';
const blog = new Hono();
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     
    .replace(/[^\w-]+/g, '') 
    .replace(/-+/g, '-');  
};
blog.get('/posts', zValidator('query', blogFilterSchema), async (c) => {
  try {
    const query = c.req.valid('query');
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    let whereClause = undefined;
    if (query.search) {
      whereClause = or(
        like(posts.title, `%${query.search}%`),
        like(posts.content, `%${query.search}%`),
        like(posts.excerpt, `%${query.search}%`)
      );
    }
    if (query.status) {
      const statusCondition = eq(posts.status, query.status);
      whereClause = whereClause ? and(whereClause, statusCondition) : statusCondition;
    }
    if (query.categoryId) {
      const catCondition = eq(posts.categoryId, query.categoryId);
      whereClause = whereClause ? and(whereClause, catCondition) : catCondition;
    }
    const postsListRaw = await db.select()
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(query.orderDir === 'asc' ? asc(posts.createdAt) : desc(posts.createdAt));
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
    const total = await db.select({ count: sql<number>`count(*)` })
      .from(posts)
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
  } catch (e) {
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
    whereCondition = eq(posts.id, Number(slug));
  } else {
    whereCondition = eq(posts.slug, slug);
  }
  const resultRaw = await db.select()
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .leftJoin(categories, eq(posts.categoryId, categories.id))
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
    tags: [] as any[]
  };
  const tagsResult = await db.select()
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.blogpostId, post.id));
  post.tags = tagsResult.map(t => ({ tag: t.blog_tag })); 
  return c.json(post);
});
blog.get('/categories', async (c) => {
  const allCategories = await db.select()
    .from(categories)
    .orderBy(asc(categories.order), asc(categories.name));
  return c.json(allCategories);
});
blog.get('/tags', async (c) => {
  const allTags = await db.select()
    .from(tags)
    .orderBy(asc(tags.name));
  return c.json(allTags);
});
blog.get('/testimonials', async (c) => {
  try {
    const testimonials = await db.select()
      .from(blogTestimonials)
      .where(eq(blogTestimonials.isPublished, true))
      .orderBy(asc(blogTestimonials.order));
    return c.json(testimonials);
  } catch (e) {
    console.error('Blog /testimonials error:', e);
    return c.json([]);
  }
});
blog.post('/posts', adminMiddleware, zValidator('json', createPostSchema), async (c) => {
  const user = c.get('user') as AuthUser;
  const data = c.req.valid('json');
  const generatedSlug = data.slug || slugify(data.title);
  const existing = await db.select().from(posts).where(eq(posts.slug, generatedSlug)).limit(1);
  if (existing.length > 0) {
    return c.json({ error: 'Slug already exists' }, 400);
  }
  // @ts-ignore
  const [insertedPost] = await db.insert(posts).values({
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
  } as any).returning();
  
  if (!insertedPost) return c.json({ error: 'Failed to create post' }, 500);

  if (data.tags && data.tags.length > 0) {
    await db.insert(postTags).values(
      data.tags.map(tagId => ({
        blogpostId: insertedPost.id, 
        tagId: tagId
      }))
    );
  }
  return c.json(insertedPost, 201);
});
blog.put('/posts/:id', adminMiddleware, zValidator('json', updatePostSchema), async (c) => {
  const id = parseInt((c.req.param('id') as string));
  const data = c.req.valid('json');
  await db.update(posts)
    .set({
      ...data,
      updatedAt: new Date().toISOString(),
      publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : undefined,
    } as any)
    .where(eq(posts.id, id));
  const updatedPost = await db.select().from(posts).where(eq(posts.id, id));
  if (updatedPost.length === 0) return c.json({ error: 'Post not found' }, 404);
  if (data.tags) {
    await db.delete(postTags).where(eq(postTags.blogpostId, id));
    if (data.tags.length > 0) {
      await db.insert(postTags).values(
        data.tags.map(tagId => ({
          blogpostId: id,
          tagId: tagId
        }))
      );
    }
  }
  return c.json(updatedPost[0]);
});
blog.delete('/posts/:id', adminMiddleware, async (c) => {
  const id = parseInt((c.req.param('id') as string));
  await db.delete(postTags).where(eq(postTags.blogpostId, id));
  await db.delete(posts).where(eq(posts.id, id));
  return c.json({ message: 'Post deleted successfully' });
});
blog.post('/categories', adminMiddleware, zValidator('json', createCategorySchema), async (c) => {
  const data = c.req.valid('json');
  const generatedSlug = data.slug || slugify(data.name);
  const [newCategory] = await db.insert(categories).values({
    name: data.name,
    slug: generatedSlug,
    order: data.order,
    createdAt: new Date().toISOString(),
  } as any).returning();
  return c.json(newCategory, 201);
});
blog.post('/tags', adminMiddleware, zValidator('json', createTagSchema), async (c) => {
  const data = c.req.valid('json');
  const generatedSlug = data.slug || slugify(data.name);
  const [newTag] = await db.insert(tags).values({
    name: data.name,
    slug: generatedSlug,
    order: data.order,
    createdAt: new Date().toISOString(),
  } as any).returning();
  return c.json(newTag, 201);
});

// ===== PENGUMUMAN (ANNOUNCEMENTS) =====
const announcementSchema = z.object({
  judul: z.string().min(1),
  konten: z.string().min(1),
  gambar: z.string().optional().nullable(),
  status: z.enum(['draft', 'published']).default('published'),
  isPenting: z.boolean().default(false),
  metaTitle: z.string().optional().default(''),
  metaDescription: z.string().optional().default(''),
  publishedAt: z.string().optional().nullable(),
  popupEnabled: z.boolean().default(false),
  popupImage: z.string().optional().nullable(),
  popupStartDate: z.string().optional().nullable(),
  popupEndDate: z.string().optional().nullable(),
});

const slugifyAnn = (text: string) =>
  text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/-+/g, '-');

// Public: Get all published announcements
blog.get('/announcements', async (c) => {
  try {
    const popupOnly = c.req.query('popup') === 'true';
    let query = db.select().from(blogAnnouncements).$dynamic();
    if (popupOnly) {
      const now = new Date().toISOString();
      query = db.select().from(blogAnnouncements)
        .where(and(
          eq(blogAnnouncements.status, 'published'),
          eq(blogAnnouncements.popupEnabled, true),
        )).$dynamic();
    } else {
      query = db.select().from(blogAnnouncements)
        .where(eq(blogAnnouncements.status, 'published')).$dynamic();
    }
    const data = await query.orderBy(desc(blogAnnouncements.publishedAt));
    return c.json(data);
  } catch (e) {
    console.error('Blog /announcements error:', e);
    return c.json([]);
  }
});

// Public: Get single announcement
blog.get('/announcements/:slug', async (c) => {
  const slug = c.req.param('slug');
  const [item] = await db.select().from(blogAnnouncements).where(eq(blogAnnouncements.slug, slug));
  if (!item) return c.json({ error: 'Not found' }, 404);
  return c.json(item);
});

// Admin: Get all announcements
blog.get('/admin/announcements', adminMiddleware, async (c) => {
  const data = await db.select().from(blogAnnouncements).orderBy(desc(blogAnnouncements.createdAt));
  return c.json(data);
});

// Admin: Get single announcement by ID
blog.get('/admin/announcements/:id', adminMiddleware, async (c) => {
  const id = parseInt((c.req.param('id') as string));
  const [item] = await db.select().from(blogAnnouncements).where(eq(blogAnnouncements.id, id));
  if (!item) return c.json({ error: 'Not found' }, 404);
  return c.json(item);
});

// Admin: Create announcement
blog.post('/admin/announcements', adminMiddleware, zValidator('json', announcementSchema), async (c) => {
  const data = c.req.valid('json');
  let slug = slugifyAnn(data.judul);
  const existing = await db.select({ id: blogAnnouncements.id }).from(blogAnnouncements).where(eq(blogAnnouncements.slug, slug));
  if (existing.length > 0) slug = `${slug}-${Date.now()}`;
  // @ts-ignore
  const [item] = await db.insert(blogAnnouncements).values({
    ...data,
    slug,
    metaTitle: data.metaTitle || data.judul,
    metaDescription: data.metaDescription || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as any).returning();
  return c.json(item, 201);
});

// Admin: Update announcement
blog.put('/admin/announcements/:id', adminMiddleware, zValidator('json', announcementSchema.partial()), async (c) => {
  const id = parseInt((c.req.param('id') as string));
  const data = c.req.valid('json');
  await db.update(blogAnnouncements).set({ ...data, updatedAt: new Date().toISOString() }).where(eq(blogAnnouncements.id, id));
  const [updated] = await db.select().from(blogAnnouncements).where(eq(blogAnnouncements.id, id));
  return c.json(updated);
});

// Admin: Delete announcement
blog.delete('/admin/announcements/:id', adminMiddleware, async (c) => {
  const id = parseInt((c.req.param('id') as string));
  await db.delete(blogAnnouncements).where(eq(blogAnnouncements.id, id));
  return c.json({ message: 'Deleted' });
});

export default blog;