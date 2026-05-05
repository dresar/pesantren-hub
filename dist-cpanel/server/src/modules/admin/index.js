"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const drizzle_orm_1 = require("drizzle-orm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const admin_schema_1 = require("./admin.schema");
const admissions_schema_1 = require("../admissions/admissions.schema");
const generic_1 = __importDefault(require("./generic"));
const admin = new hono_1.Hono();
admin.route('/generic', generic_1.default);
admin.post('/logs/document', async (c) => {
    try {
        const body = await c.req.json();
        // Try to get user from context if auth middleware sets it
        const user = c.get('user');
        await db_1.db.insert(schema_1.documentLogs).values({
            userId: user?.id || null,
            action: body.action,
            details: body.details,
            ipAddress: c.req.header('x-forwarded-for') || 'unknown',
            createdAt: new Date().toISOString()
        });
        return c.json({ success: true });
    }
    catch (error) {
        return c.json({ error: error.message }, 500);
    }
});
// Helper for simple CRUD
const createCrudHandlers = (path, table) => {
    admin.get(path, async (c) => {
        try {
            const data = await db_1.db.select().from(table);
            return c.json({ data });
        }
        catch (error) {
            return c.json({ error: error.message }, 500);
        }
    });
    admin.post(path, async (c) => {
        try {
            const body = await c.req.json();
            // Basic defaults
            if (!body.createdAt && 'createdAt' in (0, drizzle_orm_1.getTableColumns)(table))
                body.createdAt = new Date().toISOString();
            if (!body.updatedAt && 'updatedAt' in (0, drizzle_orm_1.getTableColumns)(table))
                body.updatedAt = new Date().toISOString();
            if (body.order === undefined && 'order' in (0, drizzle_orm_1.getTableColumns)(table))
                body.order = 0;
            await db_1.db.insert(table).values(body);
            return c.json({ message: 'Created' }, 201);
        }
        catch (error) {
            return c.json({ error: error.message }, 500);
        }
    });
    admin.put(`${path}/:id`, async (c) => {
        const id = Number(c.req.param('id'));
        try {
            const body = await c.req.json();
            const cleanBody = { ...body };
            delete cleanBody.id;
            delete cleanBody.createdAt;
            if ('updatedAt' in (0, drizzle_orm_1.getTableColumns)(table))
                cleanBody.updatedAt = new Date().toISOString();
            await db_1.db.update(table).set(cleanBody).where((0, drizzle_orm_1.eq)(table.id, id));
            return c.json({ message: 'Updated' });
        }
        catch (error) {
            return c.json({ error: error.message }, 500);
        }
    });
    admin.delete(`${path}/:id`, async (c) => {
        const id = Number(c.req.param('id'));
        try {
            await db_1.db.delete(table).where((0, drizzle_orm_1.eq)(table.id, id));
            return c.json({ message: 'Deleted' });
        }
        catch (error) {
            return c.json({ error: error.message }, 500);
        }
    });
};
// Singleton handler for website-settings
admin.get('/website-settings', async (c) => {
    try {
        const data = await db_1.db.select().from(schema_1.websiteSettings).limit(1);
        return c.json(data[0] || {});
    }
    catch (error) {
        return c.json({ error: error.message }, 500);
    }
});
admin.put('/website-settings', async (c) => {
    try {
        const body = await c.req.json();
        const existing = await db_1.db.select().from(schema_1.websiteSettings).limit(1);
        if (existing.length === 0) {
            await db_1.db.insert(schema_1.websiteSettings).values({ ...body, updatedAt: new Date().toISOString() });
        }
        else {
            await db_1.db.update(schema_1.websiteSettings).set({ ...body, updatedAt: new Date().toISOString() }).where((0, drizzle_orm_1.eq)(schema_1.websiteSettings.id, existing[0].id));
        }
        return c.json({ message: 'Saved' });
    }
    catch (error) {
        return c.json({ error: error.message }, 500);
    }
});
admin.get('/form-config', async (c) => {
    try {
        const formName = c.req.query('form') || 'pendaftaran';
        const data = await db_1.db.select().from(schema_1.formConfig).where((0, drizzle_orm_1.eq)(schema_1.formConfig.formName, formName));
        return c.json(data);
    }
    catch (error) {
        return c.json({ error: error.message }, 500);
    }
});
admin.put('/form-config', async (c) => {
    try {
        const { formName, fields } = await c.req.json();
        for (const field of fields) {
            const existing = await db_1.db.select().from(schema_1.formConfig)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.formConfig.formName, formName), (0, drizzle_orm_1.eq)(schema_1.formConfig.fieldKey, field.fieldKey)));
            if (existing.length > 0) {
                await db_1.db.update(schema_1.formConfig).set({ fieldValue: field.fieldValue, fieldLabel: field.fieldLabel, updatedAt: new Date().toISOString() })
                    .where((0, drizzle_orm_1.eq)(schema_1.formConfig.id, existing[0].id));
            }
            else {
                await db_1.db.insert(schema_1.formConfig).values({ formName, fieldKey: field.fieldKey, fieldLabel: field.fieldLabel, fieldValue: field.fieldValue, updatedAt: new Date().toISOString() });
            }
        }
        return c.json({ message: 'Saved' });
    }
    catch (error) {
        return c.json({ error: error.message }, 500);
    }
});
createCrudHandlers('/document-templates', schema_1.documentTemplates);
createCrudHandlers('/teachers', schema_1.tenagaPengajar);
createCrudHandlers('/facilities', schema_1.fasilitas);
createCrudHandlers('/blog/categories', schema_1.blogCategories);
createCrudHandlers('/blog/tags', schema_1.blogTags);
// Route handlers for missing endpoints
createCrudHandlers('/website/founders', schema_1.founders);
createCrudHandlers('/education', schema_1.programPendidikan);
createCrudHandlers('/programs', schema_1.programPendidikan); // Alias for frontend expecting /admin/programs
createCrudHandlers('/history', schema_1.sejarahTimeline);
createCrudHandlers('/hero-sections', schema_1.heroSection);
createCrudHandlers('/whatsapp-templates', schema_1.whatsappTemplates);
createCrudHandlers('/testimonials', schema_1.blogTestimonials);
createCrudHandlers('/announcements', schema_1.blogAnnouncements);
createCrudHandlers('/blog/posts', schema_1.blogPosts);
createCrudHandlers('/gallery', schema_1.media); // Mapping /gallery to media table
createCrudHandlers('/statistics', schema_1.statistik);
createCrudHandlers('/struktur-organisasi', schema_1.strukturOrganisasi);
// Singleton handler for system-settings (mapped to /admin/settings for compatibility)
admin.get('/settings', async (c) => {
    try {
        const data = await db_1.db.select().from(schema_1.systemSettings).limit(1);
        return c.json(data[0] || {});
    }
    catch (error) {
        return c.json({ error: error.message }, 500);
    }
});
admin.put('/settings', async (c) => {
    try {
        const body = await c.req.json();
        const existing = await db_1.db.select().from(schema_1.systemSettings).limit(1);
        if (existing.length === 0) {
            await db_1.db.insert(schema_1.systemSettings).values({ ...body });
        }
        else {
            const { id, ...updateData } = body;
            await db_1.db.update(schema_1.systemSettings).set(updateData).where((0, drizzle_orm_1.eq)(schema_1.systemSettings.id, existing[0].id));
        }
        return c.json({ message: 'Saved' });
    }
    catch (error) {
        return c.json({ error: error.message }, 500);
    }
});
admin.get('/stats', async (c) => {
    try {
        const totalSantri = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.santri).then(res => res[0].count);
        const pendingPayments = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.payments).where((0, drizzle_orm_1.eq)(schema_1.payments.status, 'pending')).then(res => res[0].count);
        const verifiedPayments = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.payments).where((0, drizzle_orm_1.eq)(schema_1.payments.status, 'verified')).then(res => res[0].count);
        const acceptedSantri = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.santri).where((0, drizzle_orm_1.eq)(schema_1.santri.status, 'accepted')).then(res => res[0].count);
        const totalUsers = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.users).then(res => res[0].count);
        const maleCount = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.santri)
            .where((0, drizzle_orm_1.eq)(schema_1.santri.jenisKelamin, 'L'))
            .then(res => res[0].count);
        const femaleCount = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.santri)
            .where((0, drizzle_orm_1.eq)(schema_1.santri.jenisKelamin, 'P'))
            .then(res => res[0].count);
        const genderDistribution = [
            { name: 'Laki-laki', value: Number(maleCount), fill: '#0ea5e9' },
            { name: 'Perempuan', value: Number(femaleCount), fill: '#ec4899' },
        ];
        const allSantriDates = await db_1.db.select({ date: schema_1.santri.createdAt }).from(schema_1.santri);
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
        const recentSantri = await db_1.db.select()
            .from(schema_1.santri)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.santri.createdAt))
            .limit(5);
        const pendingVerificationsRaw = await db_1.db.select()
            .from(schema_1.payments)
            .leftJoin(schema_1.santri, (0, drizzle_orm_1.eq)(schema_1.payments.santriId, schema_1.santri.id))
            .where((0, drizzle_orm_1.eq)(schema_1.payments.status, 'pending'))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.payments.createdAt))
            .limit(5);
        const pendingVerifications = pendingVerificationsRaw.map(row => ({
            ...row.payments_payment,
            santri: row.admissions_santri
        }));
        const verifiedPaymentsSum = await db_1.db.select({ total: (0, drizzle_orm_1.sql) `sum(cast(jumlah_transfer as numeric))` })
            .from(schema_1.payments)
            .where((0, drizzle_orm_1.eq)(schema_1.payments.status, 'verified'))
            .then(res => res[0].total || 0);
        const pendingPaymentsSum = await db_1.db.select({ total: (0, drizzle_orm_1.sql) `sum(cast(jumlah_transfer as numeric))` })
            .from(schema_1.payments)
            .where((0, drizzle_orm_1.eq)(schema_1.payments.status, 'pending'))
            .then(res => res[0].total || 0);
        const allPaymentDates = await db_1.db.select({ amount: schema_1.payments.jumlahTransfer, date: schema_1.payments.createdAt, status: schema_1.payments.status }).from(schema_1.payments);
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
    }
    catch (error) {
        console.error('Stats Error:', error);
        return c.json({ error: error.message }, 500);
    }
});
admin.get('/users', (0, zod_validator_1.zValidator)('query', admin_schema_1.searchFilterSchema), async (c) => {
    const query = c.req.valid('query');
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;
    let whereClause = undefined;
    if (query.search) {
        whereClause = (0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(schema_1.users.username, `%${query.search}%`), (0, drizzle_orm_1.like)(schema_1.users.email, `%${query.search}%`), (0, drizzle_orm_1.like)(schema_1.users.firstName, `%${query.search}%`), (0, drizzle_orm_1.like)(schema_1.users.lastName, `%${query.search}%`));
    }
    const usersList = await db_1.db.select({
        id: schema_1.users.id,
        username: schema_1.users.username,
        email: schema_1.users.email,
        firstName: schema_1.users.firstName,
        lastName: schema_1.users.lastName,
        role: schema_1.users.role,
        isActive: schema_1.users.isActive,
        isStaff: schema_1.users.isStaff,
        isSuperuser: schema_1.users.isSuperuser,
        lastLogin: schema_1.users.lastLogin,
        dateJoined: schema_1.users.dateJoined,
        createdAt: schema_1.users.createdAt,
        updatedAt: schema_1.users.updatedAt,
    })
        .from(schema_1.users)
        .where(whereClause)
        .limit(limit)
        .offset(offset)
        .orderBy((0, drizzle_orm_1.desc)(schema_1.users.createdAt));
    const total = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
        .from(schema_1.users)
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
    const id = parseInt(c.req.param('id'));
    const userResult = await db_1.db.select({
        id: schema_1.users.id,
        username: schema_1.users.username,
        email: schema_1.users.email,
        firstName: schema_1.users.firstName,
        lastName: schema_1.users.lastName,
        role: schema_1.users.role,
        isActive: schema_1.users.isActive,
        createdAt: schema_1.users.createdAt,
        phone: schema_1.users.phone,
        publicationRole: schema_1.users.publicationRole,
        publicationStatus: schema_1.users.publicationStatus,
    })
        .from(schema_1.users)
        .where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
    const user = userResult[0];
    if (!user)
        return c.json({ error: 'User not found' }, 404);
    const history = await db_1.db.select()
        .from(schema_1.loginHistory)
        .where((0, drizzle_orm_1.eq)(schema_1.loginHistory.userId, id))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.loginHistory.createdAt))
        .limit(20);
    let publicationStats = null;
    if (user.role === 'author' || user.publicationRole === 'author') {
        const [articles] = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.publicationArticles)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationArticles.authorId, id), (0, drizzle_orm_1.eq)(schema_1.publicationArticles.type, 'article')));
        const [journals] = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.publicationArticles)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationArticles.authorId, id), (0, drizzle_orm_1.eq)(schema_1.publicationArticles.type, 'journal')));
        const [approved] = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.publicationArticles)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationArticles.authorId, id), (0, drizzle_orm_1.eq)(schema_1.publicationArticles.status, 'approved')));
        const [pending] = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.publicationArticles)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.publicationArticles.authorId, id), (0, drizzle_orm_1.eq)(schema_1.publicationArticles.status, 'pending')));
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
admin.post('/users', (0, zod_validator_1.zValidator)('json', admin_schema_1.createUserSchema), async (c) => {
    const data = c.req.valid('json');
    const existing = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.users.username, data.username), (0, drizzle_orm_1.eq)(schema_1.users.email, data.email))).limit(1);
    if (existing.length > 0)
        return c.json({ error: 'Username or email already exists' }, 400);
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
    const isAuthor = data.role === 'author';
    const [newUser] = await db_1.db.insert(schema_1.users).values({
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
        id: schema_1.users.id,
        username: schema_1.users.username,
        email: schema_1.users.email,
        role: schema_1.users.role
    });
    return c.json({ message: 'User created', data: newUser }, 201);
});
admin.put('/users/:id', (0, zod_validator_1.zValidator)('json', admin_schema_1.updateUserSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
    };
    if (data.password) {
        updateData.password = await bcryptjs_1.default.hash(data.password, 10);
    }
    await db_1.db.update(schema_1.users)
        .set(updateData)
        .where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
    const updatedUser = await db_1.db.select({
        id: schema_1.users.id,
        username: schema_1.users.username,
        email: schema_1.users.email,
        role: schema_1.users.role
    }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
    if (updatedUser.length === 0)
        return c.json({ error: 'User not found' }, 404);
    return c.json({ message: 'User updated', data: updatedUser[0] });
});
admin.delete('/users/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    try {
        await db_1.db.transaction(async (tx) => {
            // Hapus riwayat login & notifikasi
            await tx.delete(schema_1.loginHistory).where((0, drizzle_orm_1.eq)(schema_1.loginHistory.userId, id));
            await tx.delete(schema_1.notifications).where((0, drizzle_orm_1.eq)(schema_1.notifications.userId, id));
            // Hapus data publikasi yang benar-benar dimiliki user
            await tx.delete(schema_1.publicationDiscussions).where((0, drizzle_orm_1.eq)(schema_1.publicationDiscussions.userId, id));
            await tx.delete(schema_1.publicationCollaborationInvites).where((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationInvites.inviteeId, id));
            await tx.delete(schema_1.publicationCollaborationInvites).where((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationInvites.inviterId, id));
            await tx.delete(schema_1.publicationCollaborationMembers).where((0, drizzle_orm_1.eq)(schema_1.publicationCollaborationMembers.userId, id));
            await tx.delete(schema_1.publicationCollaborations).where((0, drizzle_orm_1.eq)(schema_1.publicationCollaborations.ownerId, id));
            await tx.delete(schema_1.publicationArticles).where((0, drizzle_orm_1.eq)(schema_1.publicationArticles.authorId, id));
            await tx.delete(schema_1.publicationProfiles).where((0, drizzle_orm_1.eq)(schema_1.publicationProfiles.userId, id));
            // Putuskan relasi yang sifatnya "riwayat" saja
            await tx.update(schema_1.publicationArticles)
                .set({ approvedById: null })
                .where((0, drizzle_orm_1.eq)(schema_1.publicationArticles.approvedById, id));
            await tx.update(schema_1.payments)
                .set({ verifiedById: null, verifiedAt: null })
                .where((0, drizzle_orm_1.eq)(schema_1.payments.verifiedById, id));
            // Hapus semua posting blog milik user (beserta tag-tag-nya)
            const postsToDelete = await tx
                .select({ id: schema_1.blogPosts.id })
                .from(schema_1.blogPosts)
                .where((0, drizzle_orm_1.eq)(schema_1.blogPosts.authorId, id));
            if (postsToDelete.length > 0) {
                const postIds = postsToDelete.map((p) => p.id);
                await tx.delete(schema_1.blogPostTags).where((0, drizzle_orm_1.inArray)(schema_1.blogPostTags.blogpostId, postIds));
                await tx.delete(schema_1.blogPosts).where((0, drizzle_orm_1.inArray)(schema_1.blogPosts.id, postIds));
            }
            // Hapus log & media yang diupload user
            await tx.delete(schema_1.documentLogs).where((0, drizzle_orm_1.eq)(schema_1.documentLogs.userId, id));
            await tx.delete(schema_1.mediaLogs).where((0, drizzle_orm_1.eq)(schema_1.mediaLogs.userId, id));
            await tx.delete(schema_1.mediaFiles).where((0, drizzle_orm_1.eq)(schema_1.mediaFiles.userId, id));
            // Putuskan relasi pada tabel founders (jangan hapus datanya)
            await tx.update(schema_1.founders).set({ createdBy: null }).where((0, drizzle_orm_1.eq)(schema_1.founders.createdBy, id));
            await tx.update(schema_1.founders).set({ updatedBy: null }).where((0, drizzle_orm_1.eq)(schema_1.founders.updatedBy, id));
            // Terakhir: hapus user
            await tx.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        });
        return c.json({ message: 'User and related data deleted' });
    }
    catch (error) {
        console.error('Error deleting user with cascading data:', error);
        return c.json({ error: 'Cannot delete user. Might be referenced by other records.' }, 400);
    }
});
admin.get('/santri', (0, zod_validator_1.zValidator)('query', admin_schema_1.searchFilterSchema), async (c) => {
    const query = c.req.valid('query');
    const page = query.page || 1;
    // Enforce sane max — keeps serverless functions fast
    const limit = query.limit ? Math.min(query.limit, 100) : 12;
    const offset = (page - 1) * limit;
    // Read extra query params not in the schema
    const jenisKelamin = c.req.query('jenisKelamin');
    let whereClause = undefined;
    if (query.search) {
        whereClause = (0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(schema_1.santri.namaLengkap, `%${query.search}%`), (0, drizzle_orm_1.like)(schema_1.santri.nisn, `%${query.search}%`), (0, drizzle_orm_1.like)(schema_1.santri.noHp, `%${query.search}%`), (0, drizzle_orm_1.like)(schema_1.santri.email, `%${query.search}%`));
    }
    if (query.status) {
        const statusCondition = (0, drizzle_orm_1.eq)(schema_1.santri.status, query.status);
        whereClause = whereClause ? (0, drizzle_orm_1.and)(whereClause, statusCondition) : statusCondition;
    }
    if (jenisKelamin && (jenisKelamin === 'L' || jenisKelamin === 'P')) {
        const genderCondition = (0, drizzle_orm_1.eq)(schema_1.santri.jenisKelamin, jenisKelamin);
        whereClause = whereClause ? (0, drizzle_orm_1.and)(whereClause, genderCondition) : genderCondition;
    }
    const santriListRaw = await db_1.db.select()
        .from(schema_1.santri)
        .leftJoin(schema_1.payments, (0, drizzle_orm_1.eq)(schema_1.santri.id, schema_1.payments.santriId))
        .where(whereClause)
        .limit(limit)
        .offset(offset)
        .orderBy(query.sortOrder === 'asc' ? (0, drizzle_orm_1.asc)(schema_1.santri.createdAt) : (0, drizzle_orm_1.desc)(schema_1.santri.createdAt));
    const santriList = santriListRaw.map(row => ({
        ...row.admissions_santri,
        payment: row.payments_payment
    }));
    const total = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
        .from(schema_1.santri)
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
    const id = parseInt(c.req.param('id'));
    const result = await db_1.db.select()
        .from(schema_1.santri)
        .leftJoin(schema_1.payments, (0, drizzle_orm_1.eq)(schema_1.santri.id, schema_1.payments.santriId))
        .where((0, drizzle_orm_1.eq)(schema_1.santri.id, id));
    if (result.length === 0) {
        return c.json({ error: 'Santri not found' }, 404);
    }
    const santriDetail = {
        ...result[0].admissions_santri,
        payment: result[0].payments_payment
    };
    return c.json(santriDetail);
});
admin.post('/santri', (0, zod_validator_1.zValidator)('json', admissions_schema_1.santriRegistrationSchema), async (c) => {
    const data = c.req.valid('json');
    const [newSantri] = await db_1.db.insert(schema_1.santri).values({
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
    }).returning();
    return c.json(newSantri, 201);
});
admin.put('/santri/:id', (0, zod_validator_1.zValidator)('json', admissions_schema_1.santriRegistrationSchema.partial()), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    const updateData = { ...data };
    if (data.tanggalLahir) {
        updateData.tanggalLahir = new Date(data.tanggalLahir).toISOString().split('T')[0];
    }
    await db_1.db.update(schema_1.santri)
        .set({ ...updateData, updatedAt: new Date().toISOString() })
        .where((0, drizzle_orm_1.eq)(schema_1.santri.id, id));
    const updatedSantri = await db_1.db.select().from(schema_1.santri).where((0, drizzle_orm_1.eq)(schema_1.santri.id, id));
    if (updatedSantri.length === 0) {
        return c.json({ error: 'Santri not found' }, 404);
    }
    return c.json(updatedSantri[0]);
});
admin.delete('/santri/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const existing = await db_1.db.select().from(schema_1.santri).where((0, drizzle_orm_1.eq)(schema_1.santri.id, id));
    if (existing.length === 0)
        return c.json({ error: 'Santri not found' }, 404);
    await db_1.db.delete(schema_1.payments).where((0, drizzle_orm_1.eq)(schema_1.payments.santriId, id));
    await db_1.db.delete(schema_1.santri).where((0, drizzle_orm_1.eq)(schema_1.santri.id, id));
    return c.json({ message: 'Santri deleted successfully' });
});
admin.post('/santri/bulk-action', (0, zod_validator_1.zValidator)('json', admin_schema_1.bulkActionSchema), async (c) => {
    const { action, ids } = c.req.valid('json');
    if (ids.length === 0) {
        return c.json({ message: 'No IDs provided' }, 400);
    }
    if (action === 'delete') {
        await db_1.db.delete(schema_1.payments).where((0, drizzle_orm_1.inArray)(schema_1.payments.santriId, ids));
        await db_1.db.delete(schema_1.santri).where((0, drizzle_orm_1.inArray)(schema_1.santri.id, ids));
        return c.json({ message: `Deleted santri` });
    }
    else if (action === 'accept') {
        await db_1.db.update(schema_1.santri)
            .set({ status: 'accepted', updatedAt: new Date().toISOString() })
            .where((0, drizzle_orm_1.inArray)(schema_1.santri.id, ids));
        for (const sid of ids) {
            const s = await db_1.db.query.santri.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.santri.id, sid) });
            if (!s)
                continue;
            let targetUser = await db_1.db.query.users.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.users.email, s.email) });
            if (!targetUser && s.noHp) {
                targetUser = await db_1.db.query.users.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.users.phone, s.noHp) });
            }
            if (targetUser) {
                await db_1.db.insert(schema_1.notifications).values({
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
    }
    else if (action === 'reject') {
        const reason = c.req.valid('json').reason || 'Mohon maaf, pendaftaran Anda belum diterima. Silakan periksa kembali dokumen dan persyaratan.';
        await db_1.db.update(schema_1.santri)
            .set({
            status: 'rejected',
            updatedAt: new Date().toISOString(),
            catatan: reason
        })
            .where((0, drizzle_orm_1.inArray)(schema_1.santri.id, ids));
        for (const sid of ids) {
            const s = await db_1.db.query.santri.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.santri.id, sid) });
            if (!s)
                continue;
            let targetUser = await db_1.db.query.users.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.users.email, s.email) });
            if (!targetUser && s.noHp) {
                targetUser = await db_1.db.query.users.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.users.phone, s.noHp) });
            }
            if (targetUser) {
                await db_1.db.insert(schema_1.notifications).values({
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
        const items = Array.isArray(body) ? body : body.items;
        if (!items || !Array.isArray(items)) {
            return c.json({ error: 'Invalid data format. Expected array of items.' }, 400);
        }
        const results = {
            success: 0,
            failed: 0,
            errors: []
        };
        for (const item of items) {
            try {
                if (!item.namaLengkap || !item.nisn) {
                    throw new Error(`Missing required fields for ${item.namaLengkap || 'Unknown'}`);
                }
                const existing = await db_1.db.select().from(schema_1.santri).where((0, drizzle_orm_1.eq)(schema_1.santri.nisn, item.nisn)).limit(1);
                if (existing.length > 0) {
                    throw new Error(`NISN ${item.nisn} already exists`);
                }
                await db_1.db.insert(schema_1.santri).values({
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
            }
            catch (err) {
                results.failed++;
                results.errors.push(err.message);
            }
        }
        return c.json({
            message: `Import complete. Success: ${results.success}, Failed: ${results.failed}`,
            details: results
        });
    }
    catch (error) {
        console.error('Import error:', error);
        return c.json({ error: 'Internal server error during import' }, 500);
    }
});
admin.get('/payments', (0, zod_validator_1.zValidator)('query', admin_schema_1.searchFilterSchema), async (c) => {
    const query = c.req.valid('query');
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;
    let whereClause = undefined;
    if (query.status) {
        if (query.status !== 'accepted') {
            whereClause = (0, drizzle_orm_1.eq)(schema_1.payments.status, query.status);
        }
    }
    const paymentListRaw = await db_1.db.select()
        .from(schema_1.payments)
        .leftJoin(schema_1.santri, (0, drizzle_orm_1.eq)(schema_1.payments.santriId, schema_1.santri.id))
        .where(whereClause)
        .limit(limit)
        .offset(offset)
        .orderBy((0, drizzle_orm_1.desc)(schema_1.payments.createdAt));
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
    const total = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
        .from(schema_1.payments)
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
    const id = parseInt(c.req.param('id'));
    const result = await db_1.db.select()
        .from(schema_1.payments)
        .leftJoin(schema_1.santri, (0, drizzle_orm_1.eq)(schema_1.payments.santriId, schema_1.santri.id))
        .where((0, drizzle_orm_1.eq)(schema_1.payments.id, id))
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
exports.default = admin;
