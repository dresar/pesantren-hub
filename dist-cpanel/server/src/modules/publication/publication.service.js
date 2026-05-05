"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicationService = void 0;
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class PublicationService {
    // Registration
    static async registerAuthor(userId, data) {
        // Check if profile exists
        const existing = await db_1.db.query.publicationProfiles.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.publicationProfiles.userId, userId)
        });
        if (existing) {
            throw new Error('User already registered as author');
        }
        // Insert profile
        await db_1.db.insert(schema_1.publicationProfiles).values({
            userId,
            bio: data.bio,
            institution: data.institution,
            whatsapp: data.whatsapp,
            expertise: data.expertise,
        });
        // Update user status
        return await db_1.db.update(schema_1.users)
            .set({
            publicationRole: 'author',
            publicationStatus: 'pending',
            isPublicationRegistered: true,
            publicationVerified: false,
            updatedAt: new Date().toISOString()
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))
            .returning({
            id: schema_1.users.id,
            publicationStatus: schema_1.users.publicationStatus,
            isPublicationRegistered: schema_1.users.isPublicationRegistered
        });
    }
    static async updateAuthorProfile(userId, data) {
        // Update Users Table
        const userUpdateData = {
            updatedAt: new Date().toISOString()
        };
        if (data.firstName)
            userUpdateData.firstName = data.firstName;
        if (data.lastName)
            userUpdateData.lastName = data.lastName;
        if (data.avatar)
            userUpdateData.avatar = data.avatar;
        if (Object.keys(userUpdateData).length > 1) { // updatedAt is always present
            await db_1.db.update(schema_1.users)
                .set(userUpdateData)
                .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
        }
        // Update Publication Profiles Table
        // Check if profile exists first
        const existing = await db_1.db.query.publicationProfiles.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.publicationProfiles.userId, userId)
        });
        if (existing) {
            await db_1.db.update(schema_1.publicationProfiles)
                .set({
                bio: data.bio,
                institution: data.institution,
                whatsapp: data.whatsapp,
                expertise: data.expertise,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.publicationProfiles.userId, userId));
        }
        else {
            // Create if not exists (fallback)
            await db_1.db.insert(schema_1.publicationProfiles).values({
                userId,
                bio: data.bio,
                institution: data.institution,
                whatsapp: data.whatsapp,
                expertise: data.expertise,
            });
        }
        return { message: 'Profile updated successfully' };
    }
    static async registerNewAuthor(data) {
        try {
            console.log('Registering new author:', { ...data, password: '***' });
            // 1. Generate Username if not provided
            if (!data.username) {
                // Auto-generate username from firstName + random number
                const baseUsername = data.firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
                const randomSuffix = Math.floor(1000 + Math.random() * 9000);
                data.username = `${baseUsername}${randomSuffix}`;
            }
            // 2. Check if user exists (case-insensitive for username and email)
            const existingUser = await db_1.db.query.users.findFirst({
                where: (0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema_1.users.username, data.username), (0, drizzle_orm_1.ilike)(schema_1.users.email, data.email))
            });
            if (existingUser) {
                // If username collision (very rare with random suffix), try one more time
                if (existingUser.username.toLowerCase() === data.username.toLowerCase()) {
                    const randomSuffix2 = Math.floor(10000 + Math.random() * 90000);
                    data.username = `${data.username}${randomSuffix2}`;
                }
                else {
                    console.warn('Email already exists:', data.email);
                    throw new Error('Email sudah digunakan');
                }
            }
            // 3. Create User
            console.log('Hashing password...');
            const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
            const now = new Date().toISOString();
            console.log('Inserting user...');
            const [newUser] = await db_1.db.insert(schema_1.users).values({
                username: data.username.toLowerCase(), // Normalize username
                email: data.email.toLowerCase(), // Normalize email
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName || '',
                phone: data.phone,
                role: 'author', // Directly assign author role
                isActive: true,
                isStaff: false,
                isSuperuser: false,
                dateJoined: now,
                createdAt: now,
                updatedAt: now,
                // Publication specific
                publicationRole: 'author',
                publicationStatus: 'pending',
                isPublicationRegistered: true,
                publicationVerified: false,
            }).returning();
            if (!newUser) {
                throw new Error('Gagal membuat user baru (DB Insert failed)');
            }
            // 3. Create Publication Profile
            console.log('Inserting profile for user:', newUser.id);
            await db_1.db.insert(schema_1.publicationProfiles).values({
                userId: newUser.id,
                bio: data.bio || null,
                institution: data.institution || null,
                whatsapp: data.whatsapp || null,
                expertise: data.expertise || null,
            });
            console.log('Registration successful:', newUser.username);
            return newUser;
        }
        catch (error) {
            console.error("Register New Author Error:", error);
            throw new Error(error.message || "Gagal mendaftar author baru");
        }
    }
    // Articles & Journals
    static async createArticle(data, authorId) {
        // Generate slug if not provided
        if (!data.slug) {
            data.slug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        // Check slug uniqueness
        const existing = await db_1.db.select().from(schema_1.publicationArticles).where((0, drizzle_orm_1.eq)(schema_1.publicationArticles.slug, data.slug));
        if (existing.length > 0) {
            data.slug = `${data.slug}-${Date.now()}`;
        }
        // Verify collaboration membership if provided
        if (data.collaborationId) {
            const isMember = await db_1.db.query.publicationCollaborationMembers.findFirst({
                where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.collaborationId, data.collaborationId), (0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.userId, authorId))
            });
            if (!isMember) {
                throw new Error('You must be a member of the collaboration to link an article to it.');
            }
        }
        // Explicitly cast optional fields to ensure they match schema types (null/undefined handling)
        const insertData = {
            ...data,
            slug: data.slug,
            authorId,
            volumeId: data.volumeId || null,
            categoryId: data.categoryId || null,
            featuredImage: data.featuredImage || null,
            excerpt: data.excerpt || '', // excerpt is notNull in schema, ensure string
            keywords: data.keywords || null,
            metaTitle: data.metaTitle || null,
            metaDescription: data.metaDescription || null,
            pdfFile: data.pdfFile || null,
            approvedById: null,
            approvedAt: null,
            rejectionReason: null,
            collaborationId: data.collaborationId || null,
        };
        // @ts-ignore
        const created = await db_1.db.insert(schema_1.publicationArticles).values(insertData).returning();
        // @ts-ignore
        await PublicationService.recordArticleAudit(created[0].id, authorId, { action: 'create', fields: insertData });
        return created;
    }
    static async updateArticle(id, userId, data) {
        // 1. Get article
        const article = await db_1.db.query.publicationArticles.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.publicationArticles.id, id),
        });
        if (!article)
            throw new Error('Article not found');
        // 2. Check ownership
        let isAuthorized = article.authorId === userId;
        // 3. Check collaboration permission if not owner
        if (!isAuthorized && article.collaborationId) {
            const membership = await db_1.db.query.publicationCollaborationMembers.findFirst({
                where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.collaborationId, article.collaborationId), (0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.userId, userId))
            });
            // Allow owner and editor to edit
            if (membership && (membership.role === 'owner' || membership.role === 'editor')) {
                isAuthorized = true;
            }
        }
        if (!isAuthorized) {
            throw new Error('Unauthorized to update this article');
        }
        // 4. If updating collaborationId, check membership of new collaboration
        if (data.collaborationId && data.collaborationId !== article.collaborationId) {
            const isMember = await db_1.db.query.publicationCollaborationMembers.findFirst({
                where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.collaborationId, data.collaborationId), (0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.userId, userId))
            });
            if (!isMember) {
                throw new Error('You must be a member of the new collaboration');
            }
        }
        const updated = await db_1.db.update(schema_1.publicationArticles)
            .set({ ...data, updatedAt: new Date().toISOString() })
            .where((0, drizzle_orm_1.eq)(schema_1.publicationArticles.id, id))
            .returning();
        await PublicationService.recordArticleAudit(id, userId, { action: 'update', fields: data });
        // Note: Realtime broadcast dihapus (WebSocket dihilangkan dari serverless)
        return updated;
    }
    static async approveArticle(id, approverId) {
        return await db_1.db.update(schema_1.publicationArticles)
            .set({
            status: 'approved',
            approvedById: approverId,
            approvedAt: new Date().toISOString(),
            rejectionReason: null,
            updatedAt: new Date().toISOString()
        })
            .where((0, drizzle_orm_1.eq)(schema_1.publicationArticles.id, id))
            .returning();
    }
    static async rejectArticle(id, reason) {
        return await db_1.db.update(schema_1.publicationArticles)
            .set({
            status: 'rejected',
            rejectionReason: reason,
            updatedAt: new Date().toISOString()
        })
            .where((0, drizzle_orm_1.eq)(schema_1.publicationArticles.id, id))
            .returning();
    }
    static async getArticles(filters) {
        const conditions = [];
        if (filters.search) {
            conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema_1.publicationArticles.title, `%${filters.search}%`), (0, drizzle_orm_1.ilike)(schema_1.publicationArticles.content, `%${filters.search}%`)));
        }
        if (filters.status) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.publicationArticles.status, filters.status));
        }
        if (filters.type) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.publicationArticles.type, filters.type));
        }
        if (filters.categoryId) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.publicationArticles.categoryId, filters.categoryId));
        }
        if (filters.volumeId) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.publicationArticles.volumeId, filters.volumeId));
        }
        if (filters.authorId) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.publicationArticles.authorId, filters.authorId));
        }
        const page = Number(filters.page) || 1;
        const limit = Math.min(Number(filters.limit) || 10, 100);
        const offset = (page - 1) * limit;
        const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
        // Select article columns explicitly so we don't require collaboration_id (may not exist in DB yet)
        const rows = await db_1.db.select({
            article: {
                id: schema_1.publicationArticles.id,
                title: schema_1.publicationArticles.title,
                slug: schema_1.publicationArticles.slug,
                content: schema_1.publicationArticles.content,
                excerpt: schema_1.publicationArticles.excerpt,
                featuredImage: schema_1.publicationArticles.featuredImage,
                authorId: schema_1.publicationArticles.authorId,
                categoryId: schema_1.publicationArticles.categoryId,
                type: schema_1.publicationArticles.type,
                status: schema_1.publicationArticles.status,
                approvedById: schema_1.publicationArticles.approvedById,
                approvedAt: schema_1.publicationArticles.approvedAt,
                rejectionReason: schema_1.publicationArticles.rejectionReason,
                viewsCount: schema_1.publicationArticles.viewsCount,
                volumeId: schema_1.publicationArticles.volumeId,
                pdfFile: schema_1.publicationArticles.pdfFile,
                keywords: schema_1.publicationArticles.keywords,
                metaTitle: schema_1.publicationArticles.metaTitle,
                metaDescription: schema_1.publicationArticles.metaDescription,
                createdAt: schema_1.publicationArticles.createdAt,
                updatedAt: schema_1.publicationArticles.updatedAt,
            },
            author: {
                id: schema_1.users.id,
                firstName: schema_1.users.firstName,
                lastName: schema_1.users.lastName,
                avatar: schema_1.users.avatar,
                username: schema_1.users.username,
            },
            category: schema_1.publicationCategories,
            volume: schema_1.publicationVolumes,
        })
            .from(schema_1.publicationArticles)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.publicationArticles.authorId, schema_1.users.id))
            .leftJoin(schema_1.publicationCategories, (0, drizzle_orm_1.eq)(schema_1.publicationArticles.categoryId, schema_1.publicationCategories.id))
            .leftJoin(schema_1.publicationVolumes, (0, drizzle_orm_1.eq)(schema_1.publicationArticles.volumeId, schema_1.publicationVolumes.id))
            .where(whereClause)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.publicationArticles.createdAt))
            .limit(limit)
            .offset(offset);
        const totalResult = await db_1.db.select({ count: (0, drizzle_orm_1.count)() })
            .from(schema_1.publicationArticles)
            .where(whereClause);
        const total = Number(totalResult[0]?.count ?? 0);
        const data = rows.map((row) => ({
            ...row.article,
            author: row.author?.id != null ? row.author : null,
            category: row.category?.id != null ? row.category : null,
            volume: row.volume?.id != null ? row.volume : null,
        }));
        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        };
    }
    static async getArticleBySlug(slug) {
        const article = await db_1.db.query.publicationArticles.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.publicationArticles.slug, slug),
            with: {
                author: {
                    columns: { id: true, firstName: true, lastName: true, avatar: true, username: true }
                },
                category: true,
                volume: true,
            },
        });
        if (article) {
            // Increment views asynchronously
            await db_1.db.update(schema_1.publicationArticles)
                .set({ viewsCount: article.viewsCount + 1 })
                .where((0, drizzle_orm_1.eq)(schema_1.publicationArticles.id, article.id));
        }
        return article;
    }
    static async getArticleById(id) {
        return await db_1.db.query.publicationArticles.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.publicationArticles.id, id),
            with: {
                author: {
                    columns: { id: true, firstName: true, lastName: true, avatar: true, username: true }
                },
                category: true,
                volume: true,
            },
        });
    }
    static async deleteArticle(id) {
        return await db_1.db.delete(schema_1.publicationArticles).where((0, drizzle_orm_1.eq)(schema_1.publicationArticles.id, id)).returning();
    }
    // Categories
    static async createCategory(data) {
        if (!data.slug) {
            data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        // @ts-ignore
        return await db_1.db.insert(schema_1.publicationCategories).values({ ...data, slug: data.slug }).returning();
    }
    static async getCategories(type) {
        const conditions = [(0, drizzle_orm_1.eq)(schema_1.publicationCategories.isActive, true)];
        if (type) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.publicationCategories.type, type));
        }
        return await db_1.db.select().from(schema_1.publicationCategories)
            .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.publicationCategories.name));
    }
    static async getAdminCategories() {
        return await db_1.db.select().from(schema_1.publicationCategories)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.publicationCategories.name));
    }
    static async updateCategory(id, data) {
        const payload = { updatedAt: new Date().toISOString() };
        if (data.name !== undefined)
            payload.name = data.name;
        if (data.slug !== undefined)
            payload.slug = data.slug;
        if (data.type !== undefined)
            payload.type = data.type;
        if (data.description !== undefined)
            payload.description = data.description;
        if (data.isActive !== undefined)
            payload.isActive = data.isActive;
        if (!payload.slug && payload.name) {
            payload.slug = payload.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        }
        return await db_1.db.update(schema_1.publicationCategories)
            .set(payload)
            .where((0, drizzle_orm_1.eq)(schema_1.publicationCategories.id, id))
            .returning();
    }
    static async deleteCategory(id) {
        return await db_1.db.delete(schema_1.publicationCategories).where((0, drizzle_orm_1.eq)(schema_1.publicationCategories.id, id)).returning();
    }
    // Volumes
    static async createVolume(data) {
        return await db_1.db.insert(schema_1.publicationVolumes).values(data).returning();
    }
    static async getVolumes() {
        return await db_1.db.query.publicationVolumes.findMany({
            orderBy: (0, drizzle_orm_1.desc)(schema_1.publicationVolumes.year),
        });
    }
    static async updateVolume(id, data) {
        return await db_1.db.update(schema_1.publicationVolumes)
            .set({ ...data, updatedAt: new Date().toISOString() })
            .where((0, drizzle_orm_1.eq)(schema_1.publicationVolumes.id, id))
            .returning();
    }
    static async deleteVolume(id) {
        return await db_1.db.delete(schema_1.publicationVolumes).where((0, drizzle_orm_1.eq)(schema_1.publicationVolumes.id, id)).returning();
    }
    // Author Verification
    static async verifyAuthor(userId, status, reason) {
        const isApproved = status === 'approved';
        const isPending = status === 'pending';
        return await db_1.db.update(schema_1.users)
            .set({
            isVerified: isApproved, // Legacy support
            verificationStatus: status, // Legacy support
            publicationVerified: isApproved,
            publicationStatus: status,
            rejectedReason: status === 'rejected' ? reason : null,
            updatedAt: new Date().toISOString()
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))
            .returning({
            id: schema_1.users.id,
            username: schema_1.users.username,
            isVerified: schema_1.users.isVerified,
            verificationStatus: schema_1.users.verificationStatus,
            publicationStatus: schema_1.users.publicationStatus,
            publicationVerified: schema_1.users.publicationVerified
        });
    }
    static async getAdminAuthors() {
        return await db_1.db.query.users.findMany({
            where: (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.users.publicationRole, 'author'), (0, drizzle_orm_1.eq)(schema_1.users.isPublicationRegistered, true)),
            orderBy: [
                // Prioritize pending, then approved, then rejected
                (0, drizzle_orm_1.sql) `CASE 
            WHEN ${schema_1.users.publicationStatus} = 'pending' THEN 1 
            WHEN ${schema_1.users.publicationStatus} = 'approved' THEN 2 
            ELSE 3 
          END`,
                (0, drizzle_orm_1.desc)(schema_1.users.createdAt)
            ],
            columns: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
                dateJoined: true,
                verificationStatus: true,
                publicationStatus: true,
            },
            with: {
                publicationProfile: true
            }
        });
    }
    static async getDashboardStats() {
        const [totalArticles, totalJournals, pendingReview, activeAuthors, totalCategories, totalVolumes, pendingAuthorsCount, draftCount, approvedCount, rejectedCount,] = await Promise.all([
            db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.publicationArticles).where((0, drizzle_orm_1.eq)(schema_1.publicationArticles.type, 'article')),
            db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.publicationArticles).where((0, drizzle_orm_1.eq)(schema_1.publicationArticles.type, 'journal')),
            db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.publicationArticles).where((0, drizzle_orm_1.eq)(schema_1.publicationArticles.status, 'pending')),
            db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.publicationVerified, true)),
            db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.publicationCategories),
            db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.publicationVolumes),
            db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.users).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.users.publicationStatus, 'pending'), (0, drizzle_orm_1.eq)(schema_1.users.isPublicationRegistered, true))),
            db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.publicationArticles).where((0, drizzle_orm_1.eq)(schema_1.publicationArticles.status, 'draft')),
            db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.publicationArticles).where((0, drizzle_orm_1.eq)(schema_1.publicationArticles.status, 'approved')),
            db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.publicationArticles).where((0, drizzle_orm_1.eq)(schema_1.publicationArticles.status, 'rejected')),
        ]);
        const recentArticles = await db_1.db.select({
            id: schema_1.publicationArticles.id,
            title: schema_1.publicationArticles.title,
            slug: schema_1.publicationArticles.slug,
            type: schema_1.publicationArticles.type,
            status: schema_1.publicationArticles.status,
            createdAt: schema_1.publicationArticles.createdAt,
            authorId: schema_1.publicationArticles.authorId,
        })
            .from(schema_1.publicationArticles)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.publicationArticles.createdAt))
            .limit(10);
        const authorIds = [...new Set(recentArticles.map((a) => a.authorId).filter(Boolean))];
        const authorsList = authorIds.length
            ? await db_1.db.select({
                id: schema_1.users.id,
                firstName: schema_1.users.firstName,
                lastName: schema_1.users.lastName,
                username: schema_1.users.username,
            })
                .from(schema_1.users)
                .where((0, drizzle_orm_1.inArray)(schema_1.users.id, authorIds))
            : [];
        const authorMap = Object.fromEntries(authorsList.map((u) => [u.id, u]));
        const pendingAuthorsList = await db_1.db.select({
            id: schema_1.users.id,
            firstName: schema_1.users.firstName,
            lastName: schema_1.users.lastName,
            username: schema_1.users.username,
            publicationStatus: schema_1.users.publicationStatus,
            createdAt: schema_1.users.createdAt,
        })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.users.publicationStatus, 'pending'), (0, drizzle_orm_1.eq)(schema_1.users.isPublicationRegistered, true)))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.users.createdAt))
            .limit(5);
        return {
            totalArticles: Number(totalArticles[0].count),
            totalJournals: Number(totalJournals[0].count),
            pendingReview: Number(pendingReview[0].count),
            activeAuthors: Number(activeAuthors[0].count),
            totalCategories: Number(totalCategories[0].count),
            totalVolumes: Number(totalVolumes[0].count),
            pendingAuthors: Number(pendingAuthorsCount[0].count),
            articlesByStatus: {
                draft: Number(draftCount[0].count),
                pending: Number(pendingReview[0].count),
                approved: Number(approvedCount[0].count),
                rejected: Number(rejectedCount[0].count),
            },
            recentArticles: recentArticles.map((a) => ({
                ...a,
                author: authorMap[a.authorId] || null,
            })),
            pendingAuthorsList,
        };
    }
    static async getAuthorStats(authorId) {
        const totalArticles = await db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.publicationArticles)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationArticles.type, 'article'), (0, drizzle_orm_1.eq)(schema_1.publicationArticles.authorId, authorId)));
        const totalJournals = await db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.publicationArticles)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationArticles.type, 'journal'), (0, drizzle_orm_1.eq)(schema_1.publicationArticles.authorId, authorId)));
        const pendingReview = await db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.publicationArticles)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationArticles.status, 'pending'), (0, drizzle_orm_1.eq)(schema_1.publicationArticles.authorId, authorId)));
        const approved = await db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.publicationArticles)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationArticles.status, 'approved'), (0, drizzle_orm_1.eq)(schema_1.publicationArticles.authorId, authorId)));
        return {
            totalArticles: Number(totalArticles[0].count),
            totalJournals: Number(totalJournals[0].count),
            pendingReview: Number(pendingReview[0].count),
            approved: Number(approved[0].count),
        };
    }
    // Collaborations
    static async createCollaboration(userId, data) {
        // 1. Create Collaboration
        const [collaboration] = await db_1.db.insert(schema_1.publicationCollaborations).values({
            title: data.title,
            description: data.description,
            status: data.status,
            ownerId: userId,
        }).returning();
        // 2. Add Owner as Member
        await db_1.db.insert(schema_1.publicationCollaborationMembers).values({
            collaborationId: collaboration.id,
            userId: userId,
            role: 'owner',
        });
        return collaboration;
    }
    static async getCollaborations(userId) {
        // Get collaborations where user is a member
        const memberships = await db_1.db.query.publicationCollaborationMembers.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.userId, userId),
            with: {
                collaboration: {
                    with: {
                        owner: {
                            columns: { id: true, firstName: true, lastName: true, avatar: true, username: true }
                        }
                    }
                }
            },
            orderBy: (0, drizzle_orm_1.desc)(schema_1.publicationCollaborationMembers.joinedAt)
        });
        return memberships.map(m => ({
            ...m.collaboration,
            myRole: m.role
        }));
    }
    static async getCollaborationById(id, userId) {
        const membership = await db_1.db.query.publicationCollaborationMembers.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.collaborationId, id), (0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.userId, userId))
        });
        if (!membership) {
            throw new Error('You are not a member of this collaboration');
        }
        const collaboration = await db_1.db.query.publicationCollaborations.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.publicationCollaborations.id, id),
            with: {
                owner: {
                    columns: { id: true, firstName: true, lastName: true, avatar: true, username: true }
                },
                members: {
                    with: {
                        user: {
                            columns: { id: true, firstName: true, lastName: true, avatar: true, username: true }
                        }
                    }
                }
            }
        });
        if (!collaboration) {
            throw new Error('Collaboration not found');
        }
        const articles = await db_1.db.select({
            id: schema_1.publicationArticles.id,
            title: schema_1.publicationArticles.title,
            slug: schema_1.publicationArticles.slug,
            status: schema_1.publicationArticles.status,
            createdAt: schema_1.publicationArticles.createdAt,
            type: schema_1.publicationArticles.type,
        })
            .from(schema_1.publicationArticles)
            .where((0, drizzle_orm_1.eq)(schema_1.publicationArticles.collaborationId, id));
        return {
            ...collaboration,
            articles,
            myRole: membership.role
        };
    }
    static async updateCollaboration(id, userId, data) {
        const membership = await db_1.db.query.publicationCollaborationMembers.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.collaborationId, id), (0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.userId, userId))
        });
        if (!membership || membership.role !== 'owner') {
            throw new Error('Hanya pemilik proyek yang dapat mengedit');
        }
        const [updated] = await db_1.db.update(schema_1.publicationCollaborations)
            .set({
            ...(data.title != null && { title: data.title }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.status != null && { status: data.status }),
            updatedAt: new Date().toISOString(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.publicationCollaborations.id, id))
            .returning();
        return updated;
    }
    static async deleteCollaboration(id, userId) {
        const membership = await db_1.db.query.publicationCollaborationMembers.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.collaborationId, id), (0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.userId, userId))
        });
        if (!membership || membership.role !== 'owner') {
            throw new Error('Hanya pemilik proyek yang dapat menghapus');
        }
        await db_1.db.update(schema_1.publicationArticles)
            .set({ collaborationId: null, updatedAt: new Date().toISOString() })
            .where((0, drizzle_orm_1.eq)(schema_1.publicationArticles.collaborationId, id));
        await db_1.db.delete(schema_1.publicationCollaborationInvites).where((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationInvites.collaborationId, id));
        await db_1.db.delete(schema_1.publicationCollaborationMembers).where((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.collaborationId, id));
        await db_1.db.delete(schema_1.publicationCollaborations).where((0, drizzle_orm_1.eq)(schema_1.publicationCollaborations.id, id));
        return { deleted: true };
    }
    static async addCollaborationMember(collaborationId, requesterId, data) {
        // Check permissions (only owner or editor can add members)
        const requesterMembership = await db_1.db.query.publicationCollaborationMembers.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.collaborationId, collaborationId), (0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.userId, requesterId))
        });
        if (!requesterMembership || (requesterMembership.role !== 'owner' && requesterMembership.role !== 'editor')) {
            throw new Error('Unauthorized to add members');
        }
        // Check if user is already a member
        const existingMember = await db_1.db.query.publicationCollaborationMembers.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.collaborationId, collaborationId), (0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.userId, data.userId))
        });
        if (existingMember) {
            throw new Error('User is already a member');
        }
        return await db_1.db.insert(schema_1.publicationCollaborationMembers).values({
            collaborationId,
            userId: data.userId,
            role: data.role,
        }).returning();
    }
    static async searchUsersForInvite(query, limit = 10, excludeUserId) {
        const term = `%${query.toLowerCase()}%`;
        const conditions = [
            (0, drizzle_orm_1.eq)(schema_1.users.isActive, true),
            (0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema_1.users.username, term), (0, drizzle_orm_1.ilike)(schema_1.users.email, term), (0, drizzle_orm_1.ilike)(schema_1.users.firstName, term), (0, drizzle_orm_1.ilike)(schema_1.users.lastName, term)),
        ];
        if (excludeUserId != null) {
            conditions.push((0, drizzle_orm_1.ne)(schema_1.users.id, excludeUserId));
        }
        const rows = await db_1.db.select({
            id: schema_1.users.id,
            username: schema_1.users.username,
            firstName: schema_1.users.firstName,
            lastName: schema_1.users.lastName,
            email: schema_1.users.email,
        })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.and)(...conditions))
            .limit(limit);
        return rows;
    }
    static async inviteCollaborator(collaborationId, requesterId, data) {
        const [requesterRow] = await db_1.db.select().from(schema_1.publicationCollaborationMembers)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.collaborationId, collaborationId), (0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.userId, requesterId)))
            .limit(1);
        if (!requesterRow || requesterRow.role !== 'owner') {
            throw new Error('Hanya pemilik kolaborasi yang dapat mengundang anggota');
        }
        let targetUserId;
        if (data.userId != null) {
            targetUserId = data.userId;
        }
        else if (data.identifier && data.identifier.trim().length >= 2) {
            const identifier = data.identifier.trim().toLowerCase();
            const [u] = await db_1.db.select({ id: schema_1.users.id }).from(schema_1.users)
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.sql) `lower(${schema_1.users.username}) = ${identifier}`, (0, drizzle_orm_1.sql) `lower(${schema_1.users.email}) = ${identifier}`))
                .limit(1);
            if (!u)
                throw new Error('User tidak ditemukan');
            targetUserId = u.id;
        }
        else {
            throw new Error('Berikan identifier atau userId');
        }
        if (targetUserId === requesterId) {
            throw new Error('Anda tidak dapat mengundang diri sendiri');
        }
        const [existingRow] = await db_1.db.select().from(schema_1.publicationCollaborationMembers)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.collaborationId, collaborationId), (0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.userId, targetUserId)))
            .limit(1);
        if (existingRow) {
            throw new Error('User sudah menjadi anggota kolaborasi');
        }
        const [invite] = await db_1.db.insert(schema_1.publicationCollaborationInvites).values({
            collaborationId,
            inviterId: requesterId,
            inviteeId: targetUserId,
            role: data.role,
        }).returning();
        const actionUrl = `/publication/author/collaborations/${collaborationId}/invites/${invite.id}/respond`;
        await db_1.db.insert(schema_1.notifications).values({
            userId: targetUserId,
            title: 'Undangan Kolaborasi',
            message: `Anda diundang untuk bergabung dalam kolaborasi. Peran: ${data.role}`,
            type: 'collaboration_invite',
            actionUrl,
            createdAt: new Date().toISOString(),
            isRead: false,
        });
        // Note: Realtime broadcast dihapus (WebSocket dihilangkan dari serverless)
        // Notifikasi tetap terkirim via tabel notifications di DB
        return invite;
    }
    static async respondInvite(collaborationId, inviteId, userId, data) {
        const invite = await db_1.db.query.publicationCollaborationInvites.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationInvites.id, inviteId), (0, drizzle_orm_1.eq)(schema_1.publicationCollaborationInvites.collaborationId, collaborationId))
        });
        if (!invite)
            throw new Error('Undangan tidak ditemukan');
        if (invite.inviteeId !== userId)
            throw new Error('Unauthorized to respond to this invite');
        if (invite.status !== 'pending')
            throw new Error('Undangan sudah diproses');
        const now = new Date().toISOString();
        if (data.action === 'accept') {
            await db_1.db.transaction(async (tx) => {
                await tx.update(schema_1.publicationCollaborationInvites)
                    .set({ status: 'accepted', respondedAt: now })
                    .where((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationInvites.id, inviteId));
                await tx.insert(schema_1.publicationCollaborationMembers)
                    .values({ collaborationId, userId, role: invite.role });
                await tx.insert(schema_1.notifications).values({
                    userId: invite.inviterId,
                    title: 'Undangan Diterima',
                    message: 'Undangan kolaborasi telah diterima',
                    type: 'collaboration_invite',
                    actionUrl: `/publication/author/collaborations/${collaborationId}`,
                    createdAt: now,
                    isRead: false,
                });
            });
            // Note: Realtime broadcast dihapus — user dapat notifikasi via polling
            return { status: 'accepted' };
        }
        else {
            await db_1.db.update(schema_1.publicationCollaborationInvites)
                .set({ status: 'declined', respondedAt: now })
                .where((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationInvites.id, inviteId));
            await db_1.db.insert(schema_1.notifications).values({
                userId: invite.inviterId,
                title: 'Undangan Ditolak',
                message: 'Undangan kolaborasi ditolak',
                type: 'collaboration_invite',
                actionUrl: `/publication/author/collaborations/${collaborationId}`,
                createdAt: now,
                isRead: false,
            });
            // Note: Realtime broadcast dihapus — user dapat notifikasi via polling
            return { status: 'declined' };
        }
    }
    static async recordArticleAudit(articleId, userId, changeSummary) {
        const summary = typeof changeSummary === 'string' ? changeSummary : JSON.stringify(changeSummary);
        await db_1.db.insert(schema_1.publicationArticleAudits).values({
            articleId,
            userId,
            changeSummary: summary,
            createdAt: new Date().toISOString(),
        });
    }
    static async removeCollaborationMember(collaborationId, requesterId, memberId) {
        // Check permissions
        const requesterMembership = await db_1.db.query.publicationCollaborationMembers.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.collaborationId, collaborationId), (0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.userId, requesterId))
        });
        if (!requesterMembership) {
            throw new Error('Unauthorized');
        }
        const targetMembership = await db_1.db.query.publicationCollaborationMembers.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.collaborationId, collaborationId), (0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.userId, memberId))
        });
        if (!targetMembership) {
            throw new Error('Member not found');
        }
        const isSelf = requesterId === memberId;
        const isOwner = requesterMembership.role === 'owner';
        const isEditor = requesterMembership.role === 'editor';
        // Logic for removal permission
        let canRemove = false;
        if (isSelf) {
            // Can leave unless owner (must delete or transfer first)
            if (targetMembership.role !== 'owner') {
                canRemove = true;
            }
        }
        else {
            // Owner can remove anyone
            if (isOwner) {
                canRemove = true;
            }
            // Editor can remove viewers only
            else if (isEditor && targetMembership.role === 'viewer') {
                canRemove = true;
            }
        }
        if (!canRemove) {
            throw new Error('Unauthorized to remove this member');
        }
        return await db_1.db.delete(schema_1.publicationCollaborationMembers)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.collaborationId, collaborationId), (0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.userId, memberId)))
            .returning();
    }
}
exports.PublicationService = PublicationService;
