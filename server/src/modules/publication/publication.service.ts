import { db } from '../../db';
import { 
  publicationArticles, publicationCategories, publicationVolumes, users, publicationProfiles,
  publicationCollaborations, publicationCollaborationMembers, publicationCollaborationInvites, notifications, publicationArticleAudits
} from '../../db/schema';
import { eq, ne, and, desc, ilike, sql, or, count, inArray } from 'drizzle-orm';
import { 
  createArticleSchema, createCategorySchema, createVolumeSchema, authorRegistrationSchema,
  createCollaborationSchema, updateCollaborationSchema, addCollaborationMemberSchema, inviteCollaborationSchema, respondInviteSchema
} from './publication.schema';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

type CreateArticleInput = z.infer<typeof createArticleSchema>;
type CreateCategoryInput = z.infer<typeof createCategorySchema>;
type CreateVolumeInput = z.infer<typeof createVolumeSchema>;
type AuthorRegistrationInput = z.infer<typeof authorRegistrationSchema>;

export class PublicationService {
  // Registration
  static async registerAuthor(userId: number, data: AuthorRegistrationInput) {
    // Check if profile exists
    const existing = await db.query.publicationProfiles.findFirst({
      where: eq(publicationProfiles.userId, userId)
    });

    if (existing) {
      throw new Error('User already registered as author');
    }

    // Insert profile
    await db.insert(publicationProfiles).values({
      userId,
      bio: data.bio,
      institution: data.institution,
      whatsapp: data.whatsapp,
      expertise: data.expertise,
    });

    // Update user status
    return await db.update(users)
      .set({
        publicationRole: 'author',
        publicationStatus: 'pending',
        isPublicationRegistered: true,
        publicationVerified: false,
        updatedAt: new Date().toISOString()
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        publicationStatus: users.publicationStatus,
        isPublicationRegistered: users.isPublicationRegistered
      });
  }

  static async updateAuthorProfile(userId: number, data: any) {
    // Update Users Table
    const userUpdateData: any = {
      updatedAt: new Date().toISOString()
    };
    
    if (data.firstName) userUpdateData.firstName = data.firstName;
    if (data.lastName) userUpdateData.lastName = data.lastName;
    if (data.avatar) userUpdateData.avatar = data.avatar;

    if (Object.keys(userUpdateData).length > 1) { // updatedAt is always present
      await db.update(users)
        .set(userUpdateData)
        .where(eq(users.id, userId));
    }

    // Update Publication Profiles Table
    // Check if profile exists first
    const existing = await db.query.publicationProfiles.findFirst({
      where: eq(publicationProfiles.userId, userId)
    });

    if (existing) {
      await db.update(publicationProfiles)
        .set({
          bio: data.bio,
          institution: data.institution,
          whatsapp: data.whatsapp,
          expertise: data.expertise,
        })
        .where(eq(publicationProfiles.userId, userId));
    } else {
       // Create if not exists (fallback)
       await db.insert(publicationProfiles).values({
          userId,
          bio: data.bio,
          institution: data.institution,
          whatsapp: data.whatsapp,
          expertise: data.expertise,
       });
    }

    return { message: 'Profile updated successfully' };
  }

  static async registerNewAuthor(data: any) {
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
        const existingUser = await db.query.users.findFirst({
            where: or(
                ilike(users.username, data.username), 
                ilike(users.email, data.email)
            )
        });
        
        if (existingUser) {
            // If username collision (very rare with random suffix), try one more time
            if (existingUser.username.toLowerCase() === data.username.toLowerCase()) {
                const randomSuffix2 = Math.floor(10000 + Math.random() * 90000);
                data.username = `${data.username}${randomSuffix2}`;
            } else {
                console.warn('Email already exists:', data.email);
                throw new Error('Email sudah digunakan');
            }
        }

        // 3. Create User
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const now = new Date().toISOString();
        
        console.log('Inserting user...');
        const [newUser] = await db.insert(users).values({
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
        await db.insert(publicationProfiles).values({
            userId: newUser.id,
            bio: data.bio || null,
            institution: data.institution || null,
            whatsapp: data.whatsapp || null,
            expertise: data.expertise || null,
        });
        
        console.log('Registration successful:', newUser.username);
        return newUser;
     } catch (error: any) {
         console.error("Register New Author Error:", error);
         throw new Error(error.message || "Gagal mendaftar author baru");
     }
  }

  // Articles & Journals
  static async createArticle(data: CreateArticleInput, authorId: number) {
    // Generate slug if not provided
    if (!data.slug) {
      data.slug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    
    // Check slug uniqueness
    const existing = await db.select().from(publicationArticles).where(eq(publicationArticles.slug, data.slug));
    if (existing.length > 0) {
      data.slug = `${data.slug}-${Date.now()}`;
    }

    // Verify collaboration membership if provided
    if (data.collaborationId) {
      const isMember = await db.query.publicationCollaborationMembers.findFirst({
        where: and(
          eq(publicationCollaborationMembers.collaborationId, data.collaborationId),
          eq(publicationCollaborationMembers.userId, authorId)
        )
      });
      
      if (!isMember) {
        throw new Error('You must be a member of the collaboration to link an article to it.');
      }
    }

    // Explicitly cast optional fields to ensure they match schema types (null/undefined handling)
    const insertData = {
      ...data,
      slug: data.slug!,
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
    const created = await db.insert(publicationArticles).values(insertData as any).returning();
    // @ts-ignore
    await PublicationService.recordArticleAudit(created[0].id, authorId, { action: 'create', fields: insertData });
    return created;
  }

  static async updateArticle(id: number, userId: number, data: Partial<CreateArticleInput>) {
    // 1. Get article
    const article = await db.query.publicationArticles.findFirst({
        where: eq(publicationArticles.id, id),
    });
    
    if (!article) throw new Error('Article not found');

    // 2. Check ownership
    let isAuthorized = article.authorId === userId;

    // 3. Check collaboration permission if not owner
    if (!isAuthorized && article.collaborationId) {
        const membership = await db.query.publicationCollaborationMembers.findFirst({
            where: and(
                eq(publicationCollaborationMembers.collaborationId, article.collaborationId),
                eq(publicationCollaborationMembers.userId, userId)
            )
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
       const isMember = await db.query.publicationCollaborationMembers.findFirst({
         where: and(
           eq(publicationCollaborationMembers.collaborationId, data.collaborationId),
           eq(publicationCollaborationMembers.userId, userId)
         )
       });
       if (!isMember) {
         throw new Error('You must be a member of the new collaboration');
       }
    }

    const updated = await db.update(publicationArticles)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(publicationArticles.id, id))
      .returning();
    await PublicationService.recordArticleAudit(id, userId, { action: 'update', fields: data });
    // Note: Realtime broadcast dihapus (WebSocket dihilangkan dari serverless)
    return updated;
  }

  static async approveArticle(id: number, approverId: number) {
    return await db.update(publicationArticles)
      .set({
        status: 'approved',
        approvedById: approverId,
        approvedAt: new Date().toISOString(),
        rejectionReason: null,
        updatedAt: new Date().toISOString()
      })
      .where(eq(publicationArticles.id, id))
      .returning();
  }

  static async rejectArticle(id: number, reason: string) {
    return await db.update(publicationArticles)
      .set({
        status: 'rejected',
        rejectionReason: reason,
        updatedAt: new Date().toISOString()
      })
      .where(eq(publicationArticles.id, id))
      .returning();
  }

  static async getArticles(filters: any) {
    const conditions = [];

    if (filters.search) {
      conditions.push(
        or(
          ilike(publicationArticles.title, `%${filters.search}%`),
          ilike(publicationArticles.content, `%${filters.search}%`)
        )
      );
    }

    if (filters.status) {
      conditions.push(eq(publicationArticles.status, filters.status));
    }

    if (filters.type) {
      conditions.push(eq(publicationArticles.type, filters.type));
    }

    if (filters.categoryId) {
      conditions.push(eq(publicationArticles.categoryId, filters.categoryId));
    }

    if (filters.volumeId) {
      conditions.push(eq(publicationArticles.volumeId, filters.volumeId));
    }

    if (filters.authorId) {
      conditions.push(eq(publicationArticles.authorId, filters.authorId));
    }

    const page = Number(filters.page) || 1;
    const limit = Math.min(Number(filters.limit) || 10, 100);
    const offset = (page - 1) * limit;

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Select article columns explicitly so we don't require collaboration_id (may not exist in DB yet)
    const rows = await db.select({
      article: {
        id: publicationArticles.id,
        title: publicationArticles.title,
        slug: publicationArticles.slug,
        content: publicationArticles.content,
        excerpt: publicationArticles.excerpt,
        featuredImage: publicationArticles.featuredImage,
        authorId: publicationArticles.authorId,
        categoryId: publicationArticles.categoryId,
        type: publicationArticles.type,
        status: publicationArticles.status,
        approvedById: publicationArticles.approvedById,
        approvedAt: publicationArticles.approvedAt,
        rejectionReason: publicationArticles.rejectionReason,
        viewsCount: publicationArticles.viewsCount,
        volumeId: publicationArticles.volumeId,
        pdfFile: publicationArticles.pdfFile,
        keywords: publicationArticles.keywords,
        metaTitle: publicationArticles.metaTitle,
        metaDescription: publicationArticles.metaDescription,
        createdAt: publicationArticles.createdAt,
        updatedAt: publicationArticles.updatedAt,
      },
      author: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        avatar: users.avatar,
        username: users.username,
      },
      category: publicationCategories,
      volume: publicationVolumes,
    })
      .from(publicationArticles)
      .leftJoin(users, eq(publicationArticles.authorId, users.id))
      .leftJoin(publicationCategories, eq(publicationArticles.categoryId, publicationCategories.id))
      .leftJoin(publicationVolumes, eq(publicationArticles.volumeId, publicationVolumes.id))
      .where(whereClause)
      .orderBy(desc(publicationArticles.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await db.select({ count: count() })
      .from(publicationArticles)
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

  static async getArticleBySlug(slug: string) {
    const article = await db.query.publicationArticles.findFirst({
      where: eq(publicationArticles.slug, slug),
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
      await db.update(publicationArticles)
        .set({ viewsCount: article.viewsCount + 1 })
        .where(eq(publicationArticles.id, article.id));
    }

    return article;
  }

  static async getArticleById(id: number) {
    return await db.query.publicationArticles.findFirst({
      where: eq(publicationArticles.id, id),
      with: {
        author: {
          columns: { id: true, firstName: true, lastName: true, avatar: true, username: true }
        },
        category: true,
        volume: true,
      },
    });
  }

  static async deleteArticle(id: number) {
    return await db.delete(publicationArticles).where(eq(publicationArticles.id, id)).returning();
  }

  // Categories
  static async createCategory(data: CreateCategoryInput) {
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    // @ts-ignore
    return await db.insert(publicationCategories).values({ ...data, slug: data.slug! } as any).returning();
  }

  static async getCategories(type?: 'article' | 'journal') {
    const conditions = [eq(publicationCategories.isActive, true)];
    if (type) {
      conditions.push(eq(publicationCategories.type, type));
    }
    return await db.select().from(publicationCategories)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(publicationCategories.name));
  }

  static async getAdminCategories() {
    return await db.select().from(publicationCategories)
      .orderBy(desc(publicationCategories.name));
  }

  static async updateCategory(id: number, data: Partial<CreateCategoryInput>) {
    const payload: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (data.name !== undefined) payload.name = data.name;
    if (data.slug !== undefined) payload.slug = data.slug;
    if (data.type !== undefined) payload.type = data.type;
    if (data.description !== undefined) payload.description = data.description;
    if (data.isActive !== undefined) payload.isActive = data.isActive;
    if (!payload.slug && payload.name) {
      payload.slug = (payload.name as string).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    return await db.update(publicationCategories)
      .set(payload as any)
      .where(eq(publicationCategories.id, id))
      .returning();
  }

  static async deleteCategory(id: number) {
    return await db.delete(publicationCategories).where(eq(publicationCategories.id, id)).returning();
  }

  // Volumes
  static async createVolume(data: CreateVolumeInput) {
    return await db.insert(publicationVolumes).values(data as any).returning();
  }

  static async getVolumes() {
    return await db.query.publicationVolumes.findMany({
      orderBy: desc(publicationVolumes.year),
    });
  }

  static async updateVolume(id: number, data: Partial<CreateVolumeInput>) {
    return await db.update(publicationVolumes)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(publicationVolumes.id, id))
      .returning();
  }

  static async deleteVolume(id: number) {
    return await db.delete(publicationVolumes).where(eq(publicationVolumes.id, id)).returning();
  }

  // Author Verification
  static async verifyAuthor(userId: number, status: 'approved' | 'rejected' | 'pending', reason?: string) {
    const isApproved = status === 'approved';
    const isPending = status === 'pending';
    
    return await db.update(users)
      .set({
        isVerified: isApproved, // Legacy support
        verificationStatus: status, // Legacy support
        publicationVerified: isApproved,
        publicationStatus: status,
        rejectedReason: status === 'rejected' ? reason : null,
        updatedAt: new Date().toISOString()
      })
      .where(eq(users.id, userId))
      .returning({ 
        id: users.id, 
        username: users.username, 
        isVerified: users.isVerified, 
        verificationStatus: users.verificationStatus,
        publicationStatus: users.publicationStatus,
        publicationVerified: users.publicationVerified
      });
  }

  static async getAdminAuthors() {
    return await db.query.users.findMany({
      where: or(
          eq(users.publicationRole, 'author'),
          eq(users.isPublicationRegistered, true)
      ),
      orderBy: [
          // Prioritize pending, then approved, then rejected
          sql`CASE 
            WHEN ${users.publicationStatus} = 'pending' THEN 1 
            WHEN ${users.publicationStatus} = 'approved' THEN 2 
            ELSE 3 
          END`,
          desc(users.createdAt)
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
      const [
        totalArticles,
        totalJournals,
        pendingReview,
        activeAuthors,
        totalCategories,
        totalVolumes,
        pendingAuthorsCount,
        draftCount,
        approvedCount,
        rejectedCount,
      ] = await Promise.all([
        db.select({ count: count() }).from(publicationArticles).where(eq(publicationArticles.type, 'article')),
        db.select({ count: count() }).from(publicationArticles).where(eq(publicationArticles.type, 'journal')),
        db.select({ count: count() }).from(publicationArticles).where(eq(publicationArticles.status, 'pending')),
        db.select({ count: count() }).from(users).where(eq(users.publicationVerified, true)),
        db.select({ count: count() }).from(publicationCategories),
        db.select({ count: count() }).from(publicationVolumes),
        db.select({ count: count() }).from(users).where(and(eq(users.publicationStatus, 'pending'), eq(users.isPublicationRegistered, true))),
        db.select({ count: count() }).from(publicationArticles).where(eq(publicationArticles.status, 'draft')),
        db.select({ count: count() }).from(publicationArticles).where(eq(publicationArticles.status, 'approved')),
        db.select({ count: count() }).from(publicationArticles).where(eq(publicationArticles.status, 'rejected')),
      ]);

      const recentArticles = await db.select({
        id: publicationArticles.id,
        title: publicationArticles.title,
        slug: publicationArticles.slug,
        type: publicationArticles.type,
        status: publicationArticles.status,
        createdAt: publicationArticles.createdAt,
        authorId: publicationArticles.authorId,
      })
        .from(publicationArticles)
        .orderBy(desc(publicationArticles.createdAt))
        .limit(10);

      const authorIds = [...new Set(recentArticles.map((a) => a.authorId).filter(Boolean))] as number[];
      const authorsList = authorIds.length
        ? await db.select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            username: users.username,
          })
            .from(users)
            .where(inArray(users.id, authorIds))
        : [];
      const authorMap = Object.fromEntries(authorsList.map((u) => [u.id, u]));

      const pendingAuthorsList = await db.select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        username: users.username,
        publicationStatus: users.publicationStatus,
        createdAt: users.createdAt,
      })
        .from(users)
        .where(and(eq(users.publicationStatus, 'pending'), eq(users.isPublicationRegistered, true)))
        .orderBy(desc(users.createdAt))
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

  static async getAuthorStats(authorId: number) {
      const totalArticles = await db.select({ count: count() }).from(publicationArticles)
        .where(and(eq(publicationArticles.type, 'article'), eq(publicationArticles.authorId, authorId)));
      const totalJournals = await db.select({ count: count() }).from(publicationArticles)
        .where(and(eq(publicationArticles.type, 'journal'), eq(publicationArticles.authorId, authorId)));
      const pendingReview = await db.select({ count: count() }).from(publicationArticles)
        .where(and(eq(publicationArticles.status, 'pending'), eq(publicationArticles.authorId, authorId)));
      const approved = await db.select({ count: count() }).from(publicationArticles)
        .where(and(eq(publicationArticles.status, 'approved'), eq(publicationArticles.authorId, authorId)));
      
      return {
          totalArticles: Number(totalArticles[0].count),
          totalJournals: Number(totalJournals[0].count),
          pendingReview: Number(pendingReview[0].count),
          approved: Number(approved[0].count),
      };
  }

  // Collaborations
  static async createCollaboration(userId: number, data: z.infer<typeof createCollaborationSchema>) {
    // 1. Create Collaboration
    const [collaboration] = await db.insert(publicationCollaborations).values({
      title: data.title,
      description: data.description,
      status: data.status,
      ownerId: userId,
    }).returning();

    // 2. Add Owner as Member
    await db.insert(publicationCollaborationMembers).values({
      collaborationId: collaboration.id,
      userId: userId,
      role: 'owner',
    });

    return collaboration;
  }

  static async getCollaborations(userId: number) {
    // Get collaborations where user is a member
    const memberships = await db.query.publicationCollaborationMembers.findMany({
      where: eq(publicationCollaborationMembers.userId, userId),
      with: {
        collaboration: {
          with: {
            owner: {
              columns: { id: true, firstName: true, lastName: true, avatar: true, username: true }
            }
          }
        }
      },
      orderBy: desc(publicationCollaborationMembers.joinedAt)
    });

    return memberships.map(m => ({
      ...m.collaboration,
      myRole: m.role
    }));
  }

  static async getCollaborationById(id: number, userId: number) {
    const membership = await db.query.publicationCollaborationMembers.findFirst({
      where: and(
        eq(publicationCollaborationMembers.collaborationId, id),
        eq(publicationCollaborationMembers.userId, userId)
      )
    });

    if (!membership) {
      throw new Error('You are not a member of this collaboration');
    }

    const collaboration = await db.query.publicationCollaborations.findFirst({
      where: eq(publicationCollaborations.id, id),
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

    const articles = await db.select({
      id: publicationArticles.id,
      title: publicationArticles.title,
      slug: publicationArticles.slug,
      status: publicationArticles.status,
      createdAt: publicationArticles.createdAt,
      type: publicationArticles.type,
    })
      .from(publicationArticles)
      .where(eq(publicationArticles.collaborationId, id));

    return {
      ...collaboration,
      articles,
      myRole: membership.role
    };
  }

  static async updateCollaboration(id: number, userId: number, data: z.infer<typeof updateCollaborationSchema>) {
    const membership = await db.query.publicationCollaborationMembers.findFirst({
      where: and(
        eq(publicationCollaborationMembers.collaborationId, id),
        eq(publicationCollaborationMembers.userId, userId)
      )
    });
    if (!membership || membership.role !== 'owner') {
      throw new Error('Hanya pemilik proyek yang dapat mengedit');
    }
    const [updated] = await db.update(publicationCollaborations)
      .set({
        ...(data.title != null && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status != null && { status: data.status }),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(publicationCollaborations.id, id))
      .returning();
    return updated;
  }

  static async deleteCollaboration(id: number, userId: number) {
    const membership = await db.query.publicationCollaborationMembers.findFirst({
      where: and(
        eq(publicationCollaborationMembers.collaborationId, id),
        eq(publicationCollaborationMembers.userId, userId)
      )
    });
    if (!membership || membership.role !== 'owner') {
      throw new Error('Hanya pemilik proyek yang dapat menghapus');
    }
    await db.update(publicationArticles)
      .set({ collaborationId: null, updatedAt: new Date().toISOString() })
      .where(eq(publicationArticles.collaborationId, id));
    await db.delete(publicationCollaborationInvites).where(eq(publicationCollaborationInvites.collaborationId, id));
    await db.delete(publicationCollaborationMembers).where(eq(publicationCollaborationMembers.collaborationId, id));
    await db.delete(publicationCollaborations).where(eq(publicationCollaborations.id, id));
    return { deleted: true };
  }

  static async addCollaborationMember(collaborationId: number, requesterId: number, data: z.infer<typeof addCollaborationMemberSchema>) {
    // Check permissions (only owner or editor can add members)
    const requesterMembership = await db.query.publicationCollaborationMembers.findFirst({
      where: and(
        eq(publicationCollaborationMembers.collaborationId, collaborationId),
        eq(publicationCollaborationMembers.userId, requesterId)
      )
    });

    if (!requesterMembership || (requesterMembership.role !== 'owner' && requesterMembership.role !== 'editor')) {
      throw new Error('Unauthorized to add members');
    }

    // Check if user is already a member
    const existingMember = await db.query.publicationCollaborationMembers.findFirst({
      where: and(
        eq(publicationCollaborationMembers.collaborationId, collaborationId),
        eq(publicationCollaborationMembers.userId, data.userId)
      )
    });

    if (existingMember) {
      throw new Error('User is already a member');
    }

    return await db.insert(publicationCollaborationMembers).values({
      collaborationId,
      userId: data.userId,
      role: data.role,
    }).returning();
  }

  static async searchUsersForInvite(query: string, limit = 10, excludeUserId?: number) {
    const term = `%${query.toLowerCase()}%`;
    const conditions = [
      eq(users.isActive, true),
      or(
        ilike(users.username, term),
        ilike(users.email, term),
        ilike(users.firstName, term),
        ilike(users.lastName, term)
      ),
    ];
    if (excludeUserId != null) {
      conditions.push(ne(users.id, excludeUserId));
    }
    const rows = await db.select({
      id: users.id,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
    })
      .from(users)
      .where(and(...conditions))
      .limit(limit);
    return rows;
  }

  static async inviteCollaborator(collaborationId: number, requesterId: number, data: z.infer<typeof inviteCollaborationSchema>) {
    const [requesterRow] = await db.select().from(publicationCollaborationMembers)
      .where(and(
        eq(publicationCollaborationMembers.collaborationId, collaborationId),
        eq(publicationCollaborationMembers.userId, requesterId)
      ))
      .limit(1);
    if (!requesterRow || requesterRow.role !== 'owner') {
      throw new Error('Hanya pemilik kolaborasi yang dapat mengundang anggota');
    }
    let targetUserId: number;
    if (data.userId != null) {
      targetUserId = data.userId;
    } else if (data.identifier && data.identifier.trim().length >= 2) {
      const identifier = data.identifier.trim().toLowerCase();
      const [u] = await db.select({ id: users.id }).from(users)
        .where(or(
          sql`lower(${users.username}) = ${identifier}`,
          sql`lower(${users.email}) = ${identifier}`
        ))
        .limit(1);
      if (!u) throw new Error('User tidak ditemukan');
      targetUserId = u.id;
    } else {
      throw new Error('Berikan identifier atau userId');
    }
    if (targetUserId === requesterId) {
      throw new Error('Anda tidak dapat mengundang diri sendiri');
    }
    const [existingRow] = await db.select().from(publicationCollaborationMembers)
      .where(and(
        eq(publicationCollaborationMembers.collaborationId, collaborationId),
        eq(publicationCollaborationMembers.userId, targetUserId)
      ))
      .limit(1);
    if (existingRow) {
      throw new Error('User sudah menjadi anggota kolaborasi');
    }
    const [invite] = await db.insert(publicationCollaborationInvites).values({
      collaborationId,
      inviterId: requesterId,
      inviteeId: targetUserId,
      role: data.role,
    }).returning();
    const actionUrl = `/publication/author/collaborations/${collaborationId}/invites/${invite.id}/respond`;
    await db.insert(notifications).values({
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

  static async respondInvite(collaborationId: number, inviteId: number, userId: number, data: z.infer<typeof respondInviteSchema>) {
    const invite = await db.query.publicationCollaborationInvites.findFirst({
      where: and(
        eq(publicationCollaborationInvites.id, inviteId),
        eq(publicationCollaborationInvites.collaborationId, collaborationId)
      )
    });
    if (!invite) throw new Error('Undangan tidak ditemukan');
    if (invite.inviteeId !== userId) throw new Error('Unauthorized to respond to this invite');
    if (invite.status !== 'pending') throw new Error('Undangan sudah diproses');
    const now = new Date().toISOString();
    if (data.action === 'accept') {
      await db.transaction(async (tx) => {
        await tx.update(publicationCollaborationInvites)
          .set({ status: 'accepted', respondedAt: now })
          .where(eq(publicationCollaborationInvites.id, inviteId));
        await tx.insert(publicationCollaborationMembers)
          .values({ collaborationId, userId, role: invite.role });
        await tx.insert(notifications).values({
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
    } else {
      await db.update(publicationCollaborationInvites)
        .set({ status: 'declined', respondedAt: now })
        .where(eq(publicationCollaborationInvites.id, inviteId));
      await db.insert(notifications).values({
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

  static async recordArticleAudit(articleId: number, userId: number, changeSummary: any) {
    const summary = typeof changeSummary === 'string' ? changeSummary : JSON.stringify(changeSummary);
    await db.insert(publicationArticleAudits).values({
      articleId,
      userId,
      changeSummary: summary,
      createdAt: new Date().toISOString(),
    });
  }

  static async removeCollaborationMember(collaborationId: number, requesterId: number, memberId: number) {
    // Check permissions
    const requesterMembership = await db.query.publicationCollaborationMembers.findFirst({
      where: and(
        eq(publicationCollaborationMembers.collaborationId, collaborationId),
        eq(publicationCollaborationMembers.userId, requesterId)
      )
    });

    if (!requesterMembership) {
      throw new Error('Unauthorized');
    }

    const targetMembership = await db.query.publicationCollaborationMembers.findFirst({
      where: and(
        eq(publicationCollaborationMembers.collaborationId, collaborationId),
        eq(publicationCollaborationMembers.userId, memberId)
      )
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
    } else {
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

    return await db.delete(publicationCollaborationMembers)
      .where(and(
        eq(publicationCollaborationMembers.collaborationId, collaborationId),
        eq(publicationCollaborationMembers.userId, memberId)
      ))
      .returning();
  }

  // Discussions removed context here since table was removed
}
