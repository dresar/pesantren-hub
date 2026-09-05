import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq, like, or, and, desc, asc, inArray, sql, getTableColumns } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '../../db';
import { santri, payments, users, loginHistory, notifications, websiteSettings, tenagaPengajar, fasilitas, blogCategories, blogTags, blogTestimonials, blogAnnouncements, blogPosts, systemSettings, founders, programPendidikan, sejarahTimeline, heroSection, whatsappTemplates, media, statistik, documentLogs, documentTemplates, publicationArticles, publicationProfiles, publicationCollaborations, publicationCollaborationMembers, publicationCollaborationInvites, publicationDiscussions, mediaFiles, mediaLogs, blogPostTags, formConfig, strukturOrganisasi } from '../../db/schema';
import { 
  bulkActionSchema, 
  searchFilterSchema, 
  updateSantriStatusSchema,
  createUserSchema,
  updateUserSchema
} from './admin.schema';
import { santriRegistrationSchema } from '../admissions/admissions.schema';
import adminGeneric from './generic';
const admin = new Hono();
admin.route('/generic', adminGeneric);

admin.post('/logs/document', async (c) => {
    try {
        const body = await c.req.json();
        // Try to get user from context if auth middleware sets it
        const user = c.get('user') as any; 
        
        await db.insert(documentLogs).values({
            userId: user?.id || null,
            action: body.action,
            details: body.details,
            ipAddress: c.req.header('x-forwarded-for') || 'unknown',
            createdAt: new Date().toISOString()
        });
        
        return c.json({ success: true });
    } catch (error: any) {
        return c.json({ error: error.message }, 500);
    }
});

// Helper for simple CRUD
const createCrudHandlers = (path: string, table: any) => {
    admin.get(path, async (c) => {
        try {
            const data = await db.select().from(table);
            return c.json({ data });
        } catch (error: any) {
            return c.json({ error: error.message }, 500);
        }
    });

    admin.post(path, async (c) => {
        try {
            const body = await c.req.json();
            // Basic defaults
            if (!body.createdAt && 'createdAt' in getTableColumns(table)) body.createdAt = new Date().toISOString();
            if (!body.updatedAt && 'updatedAt' in getTableColumns(table)) body.updatedAt = new Date().toISOString();
            if (body.order === undefined && 'order' in getTableColumns(table)) body.order = 0;
            
            await db.insert(table).values(body);
            return c.json({ message: 'Created' }, 201);
        } catch (error: any) {
            return c.json({ error: error.message }, 500);
        }
    });

    admin.put(`${path}/:id`, async (c) => {
        const id = Number((c.req.param('id') as string));
        try {
            const body = await c.req.json();
            const cleanBody: any = { ...body };
            delete cleanBody.id;
            delete cleanBody.createdAt;
            if ('updatedAt' in getTableColumns(table)) cleanBody.updatedAt = new Date().toISOString();

            await db.update(table).set(cleanBody).where(eq(table.id, id));
            return c.json({ message: 'Updated' });
        } catch (error: any) {
            return c.json({ error: error.message }, 500);
        }
    });

    admin.delete(`${path}/:id`, async (c) => {
        const id = Number((c.req.param('id') as string));
        try {
            await db.delete(table).where(eq(table.id, id));
            return c.json({ message: 'Deleted' });
        } catch (error: any) {
            return c.json({ error: error.message }, 500);
        }
    });
};

// Singleton handler for website-settings
admin.get('/website-settings', async (c) => {
    try {
        const data = await db.select().from(websiteSettings).limit(1);
        return c.json(data[0] || {});
    } catch (error: any) {
        return c.json({ error: error.message }, 500);
    }
});

admin.put('/website-settings', async (c) => {
    try {
        const body = await c.req.json();
        const existing = await db.select().from(websiteSettings).limit(1);
        if (existing.length === 0) {
            await db.insert(websiteSettings).values({ ...body, updatedAt: new Date().toISOString() });
        } else {
            await db.update(websiteSettings).set({ ...body, updatedAt: new Date().toISOString() }).where(eq(websiteSettings.id, existing[0].id));
        }
        return c.json({ message: 'Saved' });
    } catch (error: any) {
        return c.json({ error: error.message }, 500);
    }
});

admin.get('/form-config', async (c) => {
    try {
        const formName = c.req.query('form') || 'pendaftaran';
        const data = await db.select().from(formConfig).where(eq(formConfig.formName, formName));
        return c.json(data);
    } catch (error: any) {
        return c.json({ error: error.message }, 500);
    }
});

admin.put('/form-config', async (c) => {
    try {
        const { formName, fields } = await c.req.json() as { formName: string; fields: Array<{ fieldKey: string; fieldLabel: string; fieldValue: string }> };
        for (const field of fields) {
            const existing = await db.select().from(formConfig)
                .where(and(eq(formConfig.formName, formName), eq(formConfig.fieldKey, field.fieldKey)));
            if (existing.length > 0) {
                await db.update(formConfig).set({ fieldValue: field.fieldValue, fieldLabel: field.fieldLabel, updatedAt: new Date().toISOString() })
                    .where(eq(formConfig.id, existing[0].id));
            } else {
                await db.insert(formConfig).values({ formName, fieldKey: field.fieldKey, fieldLabel: field.fieldLabel, fieldValue: field.fieldValue, updatedAt: new Date().toISOString() } as any);
            }
        }
        return c.json({ message: 'Saved' });
    } catch (error: any) {
        return c.json({ error: error.message }, 500);
    }
});

createCrudHandlers('/document-templates', documentTemplates);
createCrudHandlers('/teachers', tenagaPengajar);
createCrudHandlers('/facilities', fasilitas);
createCrudHandlers('/blog/categories', blogCategories);
createCrudHandlers('/blog/tags', blogTags);

// Route handlers for missing endpoints
createCrudHandlers('/website/founders', founders);
createCrudHandlers('/education', programPendidikan);
createCrudHandlers('/programs', programPendidikan); // Alias for frontend expecting /admin/programs
createCrudHandlers('/history', sejarahTimeline);
createCrudHandlers('/hero-sections', heroSection);
createCrudHandlers('/whatsapp-templates', whatsappTemplates);
createCrudHandlers('/testimonials', blogTestimonials);
createCrudHandlers('/announcements', blogAnnouncements);
createCrudHandlers('/blog/posts', blogPosts);

createCrudHandlers('/gallery', media); // Mapping /gallery to media table
createCrudHandlers('/statistics', statistik);
createCrudHandlers('/struktur-organisasi', strukturOrganisasi);

// Singleton handler for system-settings (mapped to /admin/settings for compatibility)
admin.get('/settings', async (c) => {
    try {
        const data = await db.select().from(systemSettings).limit(1);
        return c.json(data[0] || {});
    } catch (error: any) {
        return c.json({ error: error.message }, 500);
    }
});

admin.put('/settings', async (c) => {
    try {
        const body = await c.req.json();
        const existing = await db.select().from(systemSettings).limit(1);
        
        if (existing.length === 0) {
            await db.insert(systemSettings).values({ ...body });
        } else {
            const { id, ...updateData } = body;
            await db.update(systemSettings).set(updateData).where(eq(systemSettings.id, existing[0].id));
        }
        return c.json({ message: 'Saved' });
    } catch (error: any) {
        return c.json({ error: error.message }, 500);
    }
});

admin.get('/stats', async (c) => {
  try {
    const totalSantri = await db.select({ count: sql<number>`count(*)` }).from(santri).then(res => res[0].count);
    const pendingPayments = await db.select({ count: sql<number>`count(*)` }).from(payments).where(eq(payments.status, 'pending')).then(res => res[0].count);
    const verifiedPayments = await db.select({ count: sql<number>`count(*)` }).from(payments).where(eq(payments.status, 'verified')).then(res => res[0].count);
    const acceptedSantri = await db.select({ count: sql<number>`count(*)` }).from(santri).where(eq(santri.status, 'accepted')).then(res => res[0].count);
    const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users).then(res => res[0].count);
    const maleCount = await db.select({ count: sql<number>`count(*)` })
      .from(santri)
      .where(eq(santri.jenisKelamin, 'L'))
      .then(res => res[0].count);
    const femaleCount = await db.select({ count: sql<number>`count(*)` })
      .from(santri)
      .where(eq(santri.jenisKelamin, 'P'))
      .then(res => res[0].count);
    const genderDistribution = [
      { name: 'Laki-laki', value: Number(maleCount), fill: '#0ea5e9' },
      { name: 'Perempuan', value: Number(femaleCount), fill: '#ec4899' },
    ];
    const allSantriDates = await db.select({ date: santri.createdAt }).from(santri);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const stats = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(currentMonth - i);
      const monthIdx = d.getMonth();
      const year = d.getFullYear();
      const monthName = months[monthIdx];
      const count = allSantriDates.filter(s => {
        const sd = new Date(s.date);
        return sd.getMonth() === monthIdx && sd.getFullYear() === year;
      }).length;
      stats.push({ name: monthName, total: count });
    }
    const recentSantri = await db.select()
      .from(santri)
      .orderBy(desc(santri.createdAt))
      .limit(5);
    const pendingVerificationsRaw = await db.select()
      .from(payments)
      .leftJoin(santri, eq(payments.santriId, santri.id))
      .where(eq(payments.status, 'pending'))
      .orderBy(desc(payments.createdAt))
      .limit(5);
    const pendingVerifications = pendingVerificationsRaw.map(row => ({
      ...row.payments_payment,
      santri: row.admissions_santri
    }));
    const verifiedPaymentsSum = await db.select({ total: sql<number>`sum(cast(jumlah_transfer as numeric))` })
      .from(payments)
      .where(eq(payments.status, 'verified'))
      .then(res => res[0].total || 0);

    const pendingPaymentsSum = await db.select({ total: sql<number>`sum(cast(jumlah_transfer as numeric))` })
      .from(payments)
      .where(eq(payments.status, 'pending'))
      .then(res => res[0].total || 0);

    const allPaymentDates = await db.select({ amount: payments.jumlahTransfer, date: payments.createdAt, status: payments.status }).from(payments);
    
    const financialStats = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(currentMonth - i);
      const monthIdx = d.getMonth();
      const year = d.getFullYear();
      const monthName = months[monthIdx];
      
      const monthlyTotal = allPaymentDates.filter(p => {
        const pd = new Date(p.date);
        return pd.getMonth() === monthIdx && pd.getFullYear() === year && p.status === 'verified';
      }).reduce((acc, curr) => acc + Number(curr.amount), 0);
      
      financialStats.push({ name: monthName, total: monthlyTotal });
    }

    return c.json({
      totalSantri,
      pendingPayments,
      verifiedPayments,
      acceptedSantri,
      totalUsers,
      recentSantri,
      pendingVerifications,
      genderDistribution,
      registrationStats: stats,
      totalRevenue: verifiedPaymentsSum,
      pendingRevenue: pendingPaymentsSum,
      financialStats: financialStats,
    });
  } catch (error: any) {
    console.error('Stats Error:', error);
    return c.json({ error: error.message }, 500);
  }
});
admin.get('/users', zValidator('query', searchFilterSchema), async (c) => {
  const query = c.req.valid('query');
  const page = query.page || 1;
  const limit = query.limit || 20;
  const offset = (page - 1) * limit;
  let whereClause = undefined;
  if (query.search) {
    whereClause = or(
      like(users.username, `%${query.search}%`),
      like(users.email, `%${query.search}%`),
      like(users.firstName, `%${query.search}%`),
      like(users.lastName, `%${query.search}%`)
    );
  }
  const usersList = await db.select({
    id: users.id,
    username: users.username,
    email: users.email,
    firstName: users.firstName,
    lastName: users.lastName,
    role: users.role,
    isActive: users.isActive,
    isStaff: users.isStaff,
    isSuperuser: users.isSuperuser,
    lastLogin: users.lastLogin,
    dateJoined: users.dateJoined,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  })
  .from(users)
  .where(whereClause)
  .limit(limit)
  .offset(offset)
  .orderBy(desc(users.createdAt));
  const total = await db.select({ count: sql<number>`count(*)` })
    .from(users)
    .where(whereClause)
    .then(res => res[0].count);
  return c.json({
    data: usersList,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
admin.get('/users/:id', async (c) => {
  const id = parseInt((c.req.param('id') as string));
  const userResult = await db.select({
    id: users.id,
    username: users.username,
    email: users.email,
    firstName: users.firstName,
    lastName: users.lastName,
    role: users.role,
    isActive: users.isActive,
    createdAt: users.createdAt,
    phone: users.phone,
    publicationRole: users.publicationRole,
    publicationStatus: users.publicationStatus,
  })
  .from(users)
  .where(eq(users.id, id));
  const user = userResult[0];
  if (!user) return c.json({ error: 'User not found' }, 404);
  const history = await db.select()
    .from(loginHistory)
    .where(eq(loginHistory.userId, id))
    .orderBy(desc(loginHistory.createdAt))
    .limit(20);
  let publicationStats: { totalArticles: number; totalJournals: number; approved: number; pending: number } | null = null;
  if (user.role === 'author' || user.publicationRole === 'author') {
    const [articles] = await db.select({ count: sql<number>`count(*)` }).from(publicationArticles)
      .where(and(eq(publicationArticles.authorId, id), eq(publicationArticles.type, 'article')));
    const [journals] = await db.select({ count: sql<number>`count(*)` }).from(publicationArticles)
      .where(and(eq(publicationArticles.authorId, id), eq(publicationArticles.type, 'journal')));
    const [approved] = await db.select({ count: sql<number>`count(*)` }).from(publicationArticles)
      .where(and(eq(publicationArticles.authorId, id), eq(publicationArticles.status, 'approved')));
    const [pending] = await db.select({ count: sql<number>`count(*)` }).from(publicationArticles)
      .where(and(eq(publicationArticles.authorId, id), eq(publicationArticles.status, 'pending')));
    publicationStats = {
      totalArticles: Number(articles?.count ?? 0),
      totalJournals: Number(journals?.count ?? 0),
      approved: Number(approved?.count ?? 0),
      pending: Number(pending?.count ?? 0),
    };
  }
  return c.json({
    data: {
      ...user,
      loginHistory: history,
      publicationStats,
    },
  });
});
admin.post('/users', zValidator('json', createUserSchema), async (c) => {
  const data = c.req.valid('json');
  const existing = await db.select().from(users).where(or(eq(users.username, data.username), eq(users.email, data.email))).limit(1);
  if (existing.length > 0) return c.json({ error: 'Username or email already exists' }, 400);
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const isAuthor = data.role === 'author';
  const [newUser] = await db.insert(users).values({
    username: data.username,
    email: data.email,
    password: hashedPassword,
    firstName: data.firstName,
    lastName: data.lastName ?? '',
    phone: data.phone ?? '',
    role: data.role,
    isActive: data.isActive,
    isStaff: ['superadmin', 'admin', 'staff'].includes(data.role),
    isSuperuser: data.role === 'superadmin',
    dateJoined: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...(isAuthor && {
      publicationRole: 'author',
      publicationStatus: 'approved',
      isPublicationRegistered: true,
      publicationVerified: true,
      isVerified: true,
      verificationStatus: 'approved',
    }),
  }).returning({
    id: users.id,
    username: users.username,
    email: users.email,
    role: users.role
  });
  return c.json({ message: 'User created', data: newUser }, 201);
});
admin.put('/users/:id', zValidator('json', updateUserSchema), async (c) => {
  const id = parseInt((c.req.param('id') as string));
  const data = c.req.valid('json');
  const updateData: any = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }
  await db.update(users)
    .set(updateData)
    .where(eq(users.id, id));
  const updatedUser = await db.select({
    id: users.id,
    username: users.username,
    email: users.email,
    role: users.role
  }).from(users).where(eq(users.id, id));
  if (updatedUser.length === 0) return c.json({ error: 'User not found' }, 404);
  return c.json({ message: 'User updated', data: updatedUser[0] });
});
admin.delete('/users/:id', async (c) => {
  const id = parseInt((c.req.param('id') as string));
  try {
    await db.transaction(async (tx) => {
      // Hapus riwayat login & notifikasi
      await tx.delete(loginHistory).where(eq(loginHistory.userId, id));
      await tx.delete(notifications).where(eq(notifications.userId, id));

      // Hapus data publikasi yang benar-benar dimiliki user
      await tx.delete(publicationDiscussions).where(eq(publicationDiscussions.userId, id));
      await tx.delete(publicationCollaborationInvites).where(eq(publicationCollaborationInvites.inviteeId, id));
      await tx.delete(publicationCollaborationInvites).where(eq(publicationCollaborationInvites.inviterId, id));
      await tx.delete(publicationCollaborationMembers).where(eq(publicationCollaborationMembers.userId, id));
      await tx.delete(publicationCollaborations).where(eq(publicationCollaborations.ownerId, id));
      await tx.delete(publicationArticles).where(eq(publicationArticles.authorId, id));
      await tx.delete(publicationProfiles).where(eq(publicationProfiles.userId, id));

      // Putuskan relasi yang sifatnya "riwayat" saja
      await tx.update(publicationArticles)
        .set({ approvedById: null })
        .where(eq(publicationArticles.approvedById, id));
      await tx.update(payments)
        .set({ verifiedById: null, verifiedAt: null })
        .where(eq(payments.verifiedById, id));
      // Hapus semua posting blog milik user (beserta tag-tag-nya)
      const postsToDelete = await tx
        .select({ id: blogPosts.id })
        .from(blogPosts)
        .where(eq(blogPosts.authorId, id));
      if (postsToDelete.length > 0) {
        const postIds = postsToDelete.map((p) => p.id);
        await tx.delete(blogPostTags).where(inArray(blogPostTags.blogpostId, postIds));
        await tx.delete(blogPosts).where(inArray(blogPosts.id, postIds));
      }

      // Hapus log & media yang diupload user
      await tx.delete(documentLogs).where(eq(documentLogs.userId, id));
      await tx.delete(mediaLogs).where(eq(mediaLogs.userId, id));
      await tx.delete(mediaFiles).where(eq(mediaFiles.userId, id));

      // Putuskan relasi pada tabel founders (jangan hapus datanya)
      await tx.update(founders).set({ createdBy: null }).where(eq(founders.createdBy, id));
      await tx.update(founders).set({ updatedBy: null }).where(eq(founders.updatedBy, id));

      // Terakhir: hapus user
      await tx.delete(users).where(eq(users.id, id));
    });

    return c.json({ message: 'User and related data deleted' });
  } catch (error) {
    console.error('Error deleting user with cascading data:', error);
    return c.json({ error: 'Cannot delete user. Might be referenced by other records.' }, 400);
  }
});
admin.get('/santri', zValidator('query', searchFilterSchema), async (c) => {
  const query = c.req.valid('query');
  const page = query.page || 1;
  // Enforce sane max — keeps serverless functions fast
  const limit = query.limit ? Math.min(query.limit, 100) : 12;
  const offset = (page - 1) * limit;

  // Read extra query params not in the schema
  const jenisKelamin = c.req.query('jenisKelamin');

  let whereClause = undefined;
  if (query.search) {
    whereClause = or(
      like(santri.namaLengkap, `%${query.search}%`),
      like(santri.nisn, `%${query.search}%`),
      like(santri.noHp, `%${query.search}%`),
      like(santri.email, `%${query.search}%`)
    );
  }
  if (query.status) {
    const statusCondition = eq(santri.status, query.status);
    whereClause = whereClause ? and(whereClause, statusCondition) : statusCondition;
  }
  if (jenisKelamin && (jenisKelamin === 'L' || jenisKelamin === 'P')) {
    const genderCondition = eq(santri.jenisKelamin, jenisKelamin);
    whereClause = whereClause ? and(whereClause, genderCondition) : genderCondition;
  }

  const santriListRaw = await db.select()
    .from(santri)
    .leftJoin(payments, eq(santri.id, payments.santriId))
    .where(whereClause)
    .limit(limit)
    .offset(offset)
    .orderBy(query.sortOrder === 'asc' ? asc(santri.createdAt) : desc(santri.createdAt));
  const santriList = santriListRaw.map(row => ({
    ...row.admissions_santri,
    payment: row.payments_payment
  }));
  const total = await db.select({ count: sql<number>`count(*)` })
    .from(santri)
    .where(whereClause)
    .then(res => res[0].count);
  return c.json({
    data: santriList,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

admin.get('/santri/:id', async (c) => {
  const id = parseInt((c.req.param('id') as string));
  const result = await db.select()
    .from(santri)
    .leftJoin(payments, eq(santri.id, payments.santriId))
    .where(eq(santri.id, id));
  if (result.length === 0) {
    return c.json({ error: 'Santri not found' }, 404);
  }
  const santriDetail = {
    ...result[0].admissions_santri,
    payment: result[0].payments_payment
  };
  return c.json(santriDetail);
});
admin.post('/santri', zValidator('json', santriRegistrationSchema), async (c) => {
  const data = c.req.valid('json');
  const [newSantri] = await db.insert(santri).values(({
    ...data,
    email: data.email || "-",
    noHp: data.noHp || "-",
    nisn: data.nisn || "-",
    asalSekolah: data.asalSekolah || "-",
    status: 'pending',
    tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    agamaAyah: data.agamaAyah || 'Islam',
    agamaIbu: data.agamaIbu || 'Islam',
    kewarganegaraanAyah: data.kewarganegaraanAyah || 'WNI',
    kewarganegaraanIbu: data.kewarganegaraanIbu || 'WNI',
    tempatLahirAyah: data.tempatLahirAyah || '-',
    tempatLahirIbu: data.tempatLahirIbu || '-',
    kelasDiterima: '1', 
    catatan: '-',
    fotoSantriApproved: false,
    fotoKtpApproved: false,
    fotoAktaApproved: false,
    fotoIjazahApproved: false,
    fotoKkApproved: false,
    suratSehatApproved: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as any)).returning();
  return c.json(newSantri, 201);
});
admin.put('/santri/:id', zValidator('json', santriRegistrationSchema.partial()), async (c) => {
  const id = parseInt((c.req.param('id') as string));
  const data = c.req.valid('json');
  const updateData: any = { ...data };
  if (data.tanggalLahir) {
    updateData.tanggalLahir = new Date(data.tanggalLahir).toISOString().split('T')[0];
  }
  await db.update(santri)
    .set({ ...updateData, updatedAt: new Date().toISOString() })
    .where(eq(santri.id, id));
  const updatedSantri = await db.select().from(santri).where(eq(santri.id, id));
  if (updatedSantri.length === 0) {
    return c.json({ error: 'Santri not found' }, 404);
  }
  return c.json(updatedSantri[0]);
});
admin.delete('/santri/:id', async (c) => {
  const id = parseInt((c.req.param('id') as string));
  const existing = await db.select().from(santri).where(eq(santri.id, id));
  if (existing.length === 0) return c.json({ error: 'Santri not found' }, 404);
  await db.delete(payments).where(eq(payments.santriId, id));
  await db.delete(santri).where(eq(santri.id, id));
  return c.json({ message: 'Santri deleted successfully' });
});
admin.post('/santri/bulk-action', zValidator('json', bulkActionSchema), async (c) => {
  const { action, ids } = c.req.valid('json');
  if (ids.length === 0) {
    return c.json({ message: 'No IDs provided' }, 400);
  }
  if (action === 'delete') {
    await db.delete(payments).where(inArray(payments.santriId, ids));
    await db.delete(santri).where(inArray(santri.id, ids));
    return c.json({ message: `Deleted santri` });
  } else if (action === 'accept') {
    await db.update(santri)
      .set({ status: 'accepted', updatedAt: new Date().toISOString() })
      .where(inArray(santri.id, ids));
    for (const sid of ids) {
      const s = await db.query.santri.findFirst({ where: eq(santri.id, sid) });
      if (!s) continue;
      let targetUser = await db.query.users.findFirst({ where: eq(users.email, s.email) });
      if (!targetUser && s.noHp) {
        targetUser = await db.query.users.findFirst({ where: eq(users.phone, s.noHp) });
      }
      if (targetUser) {
        await db.insert(notifications).values({
          userId: targetUser.id,
          title: 'Pendaftaran Diterima',
          message: 'Selamat! Pendaftaran Anda telah diterima. Silakan cek jadwal berikutnya.',
          type: 'success',
          isRead: false,
          actionUrl: '/app/status',
          createdAt: new Date().toISOString(),
        });
      }
    }
    return c.json({ message: `Accepted santri` });
  } else if (action === 'reject') {
    const reason = c.req.valid('json').reason || 'Mohon maaf, pendaftaran Anda belum diterima. Silakan periksa kembali dokumen dan persyaratan.';
    await db.update(santri)
      .set({ 
        status: 'rejected', 
        updatedAt: new Date().toISOString(),
        catatan: reason
      })
      .where(inArray(santri.id, ids));
    for (const sid of ids) {
      const s = await db.query.santri.findFirst({ where: eq(santri.id, sid) });
      if (!s) continue;
      let targetUser = await db.query.users.findFirst({ where: eq(users.email, s.email) });
      if (!targetUser && s.noHp) {
        targetUser = await db.query.users.findFirst({ where: eq(users.phone, s.noHp) });
      }
      if (targetUser) {
        await db.insert(notifications).values({
          userId: targetUser.id,
          title: 'Pendaftaran Ditolak',
          message: reason,
          type: 'warning',
          isRead: false,
          actionUrl: '/app/status',
          createdAt: new Date().toISOString(),
        });
      }
    }
    return c.json({ message: `Rejected santri` });
  }
  return c.json({ error: 'Invalid action' }, 400);
});
admin.post('/santri/import', async (c) => {
  try {
    const body = await c.req.json();
    const items = Array.isArray(body) ? body : (body as any).items;
    if (!items || !Array.isArray(items)) {
      return c.json({ error: 'Invalid data format. Expected array of items.' }, 400);
    }
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };
    for (const item of items) {
      try {
        if (!item.namaLengkap || !item.nisn) {
          throw new Error(`Missing required fields for ${item.namaLengkap || 'Unknown'}`);
        }
        const existing = await db.select().from(santri).where(eq(santri.nisn, item.nisn)).limit(1);
        if (existing.length > 0) {
          throw new Error(`NISN ${item.nisn} already exists`);
        }
        await db.insert(santri).values({
          namaLengkap: item.namaLengkap,
          nisn: item.nisn,
          tempatLahir: item.tempatLahir || '-',
          tanggalLahir: item.tanggalLahir ? new Date(item.tanggalLahir).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          jenisKelamin: item.jenisKelamin || 'L',
          agama: item.agama || 'Islam',
          golonganDarah: item.golonganDarah || '-',
          namaAyah: item.namaAyah || '-',
          nikAyah: item.nikAyah || '-',
          namaIbu: item.namaIbu || '-',
          nikIbu: item.nikIbu || '-',
          pekerjaanAyah: item.pekerjaanAyah || '-',
          pekerjaanIbu: item.pekerjaanIbu || '-',
          noHpAyah: item.noHpAyah || '-',
          noHpIbu: item.noHpIbu || '-',
          alamatOrangTua: item.alamatOrangTua || '-',
          alamat: item.alamat || '-',
          noHp: item.noHp || '-',
          email: item.email || '-',
          asalSekolah: item.asalSekolah || '-',
          kelasTerakhir: item.kelasTerakhir || '-',
          tahunLulus: item.tahunLulus || '-',
          noIjazah: item.noIjazah || '-',
          status: 'pending',
          catatan: 'Imported',
          fotoSantriApproved: false,
          fotoKtpApproved: false,
          fotoAktaApproved: false,
          fotoIjazahApproved: false,
          suratSehatApproved: false,
          agamaAyah: 'Islam',
          agamaIbu: 'Islam',
          kewarganegaraan: 'WNI',
          kewarganegaraanAyah: 'WNI',
          kewarganegaraanIbu: 'WNI',
          bahasaSehariHari: 'Indonesia',
          desa: '-',
          kabupaten: '-',
          kecamatan: '-',
          kelasDiterima: '1',
          kodePos: '-',
          namaPanggilan: item.namaLengkap?.split(' ')[0] || '-',
          npsnSekolah: '-',
          pendidikanAyah: '-',
          pendidikanIbu: '-',
          provinsi: '-',
          riwayatPenyakit: '-',
          statusAyah: 'Hidup',
          statusIbu: 'Hidup',
          tempatLahirAyah: '-',
          tempatLahirIbu: '-',
          tinggalDengan: 'Orang Tua',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        results.success++;
      } catch (err) {
        results.failed++;
        results.errors.push((err as any).message);
      }
    }
    return c.json({ 
      message: `Import complete. Success: ${results.success}, Failed: ${results.failed}`,
      details: results
    });
  } catch (error) {
    console.error('Import error:', error);
    return c.json({ error: 'Internal server error during import' }, 500);
  }
});
admin.get('/payments', zValidator('query', searchFilterSchema), async (c) => {
  const query = c.req.valid('query');
  const page = query.page || 1;
  const limit = query.limit || 20;
  const offset = (page - 1) * limit;
  let whereClause = undefined;
  if (query.status) {
    if (query.status !== 'accepted') {
       whereClause = eq(payments.status, query.status as "pending" | "verified" | "rejected");
    }
  }
  const paymentListRaw = await db.select()
    .from(payments)
    .leftJoin(santri, eq(payments.santriId, santri.id))
    .where(whereClause)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(payments.createdAt));
  const paymentList = paymentListRaw.map(row => {
    const p = row.payments_payment;
    const s = row.admissions_santri;
    return {
      id: p.id,
      bank_pengirim: p.bankPengirim,
      no_rekening_pengirim: p.noRekeningPengirim,
      nama_pemilik_rekening: p.namaPemilikRekening,
      rekening_tujuan: p.rekeningTujuan,
      jumlah_transfer: p.jumlahTransfer,
      bukti_transfer: p.buktiTransfer,
      status: p.status,
      catatan: p.catatan,
      created_at: p.createdAt,
      updated_at: p.updatedAt,
      verified_at: p.verifiedAt,
      santri_id: p.santriId,
      verified_by_id: p.verifiedById,
      santri: s,
    };
  });
  const total = await db.select({ count: sql<number>`count(*)` })
    .from(payments)
    .where(whereClause)
    .then(res => res[0].count);
  return c.json({
    data: paymentList,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
admin.get('/payments/:id', async (c) => {
  const id = parseInt((c.req.param('id') as string));
  const result = await db.select()
    .from(payments)
    .leftJoin(santri, eq(payments.santriId, santri.id))
    .where(eq(payments.id, id))
    .limit(1);
  if (result.length === 0) {
    return c.json({ error: 'Not found' }, 404);
  }
  const row = result[0];
  const p = row.payments_payment;
  const s = row.admissions_santri;
  const item = {
    id: p.id,
    bank_pengirim: p.bankPengirim,
    no_rekening_pengirim: p.noRekeningPengirim,
    nama_pemilik_rekening: p.namaPemilikRekening,
    rekening_tujuan: p.rekeningTujuan,
    jumlah_transfer: p.jumlahTransfer,
    bukti_transfer: p.buktiTransfer,
    status: p.status,
    catatan: p.catatan,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
    verified_at: p.verifiedAt,
    santri_id: p.santriId,
    verified_by_id: p.verifiedById,
    santri: s,
  };
  return c.json({ data: item });
});
export default admin;