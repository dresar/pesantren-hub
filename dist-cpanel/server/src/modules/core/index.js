"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const db_1 = require("../../db");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../db/schema");
const encryption_1 = require("../../utils/encryption");
const zod_validator_1 = require("@hono/zod-validator");
const auth_1 = require("../../middleware/auth");
const core_schema_1 = require("./core.schema");
const core = new hono_1.Hono();
core.get('/health/db', async (c) => {
    try {
        const res = await db_1.db.execute((0, drizzle_orm_1.sql) `SELECT 1 as ok`);
        // Check if the result is in the expected format for Postgres
        const isOk = res.rows ? res.rows[0]?.ok === 1 : res[0]?.ok === 1;
        return c.json({ ok: isOk });
    }
    catch (e) {
        console.error('Health Check Error:', e);
        return c.json({ ok: false, error: e?.message }, 500);
    }
});
core.get('/last-updates', async (c) => {
    try {
        const settings = await db_1.db.select({ updatedAt: schema_1.websiteSettings.updatedAt }).from(schema_1.websiteSettings).limit(1);
        const lastUpdate = settings.length > 0 ? settings[0].updatedAt : new Date().toISOString();
        return c.json({
            timestamp: lastUpdate,
            serverTime: new Date().toISOString()
        });
    }
    catch (e) {
        return c.json({ timestamp: new Date().toISOString() });
    }
});
core.get('/settings', async (c) => {
    try {
        const settings = await db_1.db.select().from(schema_1.websiteSettings).limit(1);
        if (settings.length === 0) {
            try {
                const [newSettings] = await db_1.db.insert(schema_1.websiteSettings).values({
                    namaPondok: 'Pondok Pesantren',
                    arabicName: 'Ø§Ù„Ù…Ø¹Ù‡Ø¯ Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠ',
                    alamat: 'Jl. Contoh No. 123',
                    noTelepon: '08123456789',
                    email: 'admin@pesantren.com',
                    website: 'https://pesantren.com',
                    facebook: 'https://facebook.com',
                    instagram: 'https://instagram.com',
                    twitter: 'https://twitter.com',
                    tiktok: 'https://tiktok.com',
                    heroTitle: 'Selamat Datang',
                    heroSubtitle: 'Membangun Generasi Rabbani',
                    heroTagline: 'Berilmu, Beramal, Bertaqwa',
                    heroCtaPrimaryText: 'Daftar Sekarang',
                    heroCtaPrimaryLink: '/register',
                    heroCtaSecondaryText: 'Tentang Kami',
                    heroCtaSecondaryLink: '/about',
                    announcementText: 'Pendaftaran Tahun Ajaran 2025/2026 Dibuka',
                    announcementLink: '/pendaftaran',
                    announcementActive: true,
                    lokasiPendaftaran: 'Kantor Sekretariat',
                    googleMapsLink: 'https://maps.google.com',
                    googleMapsEmbedCode: '',
                    deskripsi: 'Deskripsi singkat pondok pesantren.',
                    metaTitle: 'Pondok Pesantren',
                    metaDescription: 'Website Resmi Pondok Pesantren',
                    metaKeywords: 'pesantren, pondok, islam',
                    updatedAt: new Date().toISOString(),
                    headerMobileHeight: 60,
                    maintenanceMessage: 'Website sedang dalam perbaikan.',
                    maintenanceMode: false
                }).returning();
                return c.json(newSettings);
            }
            catch (err) {
                console.error('Failed to init settings:', err);
                throw err;
            }
        }
        return c.json(settings[0]);
    }
    catch (e) {
        console.error('Core /settings error:', e);
        return c.json({
            namaPondok: '',
            heroTitle: '',
            heroSubtitle: '',
            heroTagline: '',
            announcementText: '',
            announcementActive: false,
        });
    }
});
core.put('/settings', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.updateWebsiteSettingsSchema), async (c) => {
    const data = c.req.valid('json');
    const settings = await db_1.db.select().from(schema_1.websiteSettings).limit(1);
    if (settings.length === 0) {
        const [newSettings] = await db_1.db.insert(schema_1.websiteSettings).values(data).returning();
        return c.json(newSettings);
    }
    else {
        await db_1.db.update(schema_1.websiteSettings)
            .set({ ...data, updatedAt: new Date().toISOString() })
            .where((0, drizzle_orm_1.eq)(schema_1.websiteSettings.id, settings[0].id));
        const [updated] = await db_1.db.select().from(schema_1.websiteSettings).where((0, drizzle_orm_1.eq)(schema_1.websiteSettings.id, settings[0].id));
        return c.json(updated);
    }
});
core.get('/faq', async (c) => {
    const data = await db_1.db.select().from(schema_1.faq).orderBy((0, drizzle_orm_1.asc)(schema_1.faq.order));
    return c.json(data);
});
core.post('/faq', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.createFaqSchema), async (c) => {
    const data = c.req.valid('json');
    const [item] = await db_1.db.insert(schema_1.faq).values({
        ...data,
        createdAt: new Date().toISOString()
    }).returning();
    return c.json(item);
});
core.put('/faq/:id', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.updateFaqSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    await db_1.db.update(schema_1.faq).set(data).where((0, drizzle_orm_1.eq)(schema_1.faq.id, id));
    const [item] = await db_1.db.select().from(schema_1.faq).where((0, drizzle_orm_1.eq)(schema_1.faq.id, id));
    return c.json(item);
});
core.delete('/faq/:id', auth_1.adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    await db_1.db.delete(schema_1.faq).where((0, drizzle_orm_1.eq)(schema_1.faq.id, id));
    return c.json({ message: 'Deleted' });
});
core.get('/programs', async (c) => {
    try {
        const data = await db_1.db.select().from(schema_1.programs).orderBy((0, drizzle_orm_1.asc)(schema_1.programs.order));
        return c.json(data);
    }
    catch (e) {
        console.error('Core /programs error:', e);
        return c.json([]);
    }
});
core.post('/programs', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.createProgramSchema), async (c) => {
    const data = c.req.valid('json');
    // Generate slug from nama if not provided
    let slug = data.slug;
    if (!slug || slug.trim() === '') {
        slug = data.nama.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        if (!slug) {
            slug = `program-${Date.now()}`;
        }
    }
    // Ensure slug is unique
    const existing = await db_1.db.select().from(schema_1.programs).where((0, drizzle_orm_1.eq)(schema_1.programs.slug, slug));
    if (existing.length > 0) {
        slug = `${slug}-${Date.now()}`;
    }
    // @ts-ignore
    const [item] = await db_1.db.insert(schema_1.programs).values({
        ...data,
        slug,
        status: data.status || 'published',
        isFeatured: data.isFeatured ?? false,
        metaTitle: data.metaTitle || data.nama,
        metaDescription: data.metaDescription || data.deskripsi.substring(0, 150),
        order: data.order ?? 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }).returning();
    return c.json(item);
});
core.put('/programs/:id', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.updateProgramSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    const formattedData = {
        ...data,
        tanggalMulai: data.tanggalMulai ? new Date(data.tanggalMulai) : undefined,
        tanggalSelesai: data.tanggalSelesai ? new Date(data.tanggalSelesai) : undefined,
        updatedAt: new Date().toISOString()
    };
    await db_1.db.update(schema_1.programs).set(formattedData).where((0, drizzle_orm_1.eq)(schema_1.programs.id, id));
    const [item] = await db_1.db.select().from(schema_1.programs).where((0, drizzle_orm_1.eq)(schema_1.programs.id, id));
    return c.json(item);
});
core.delete('/programs/:id', auth_1.adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    await db_1.db.delete(schema_1.programs).where((0, drizzle_orm_1.eq)(schema_1.programs.id, id));
    return c.json({ message: 'Deleted' });
});
core.post('/contact', (0, zod_validator_1.zValidator)('json', core_schema_1.createKontakSchema), async (c) => {
    const data = c.req.valid('json');
    // @ts-ignore
    const [insertedContact] = await db_1.db.insert(schema_1.kontak).values({
        ...data,
        status: 'pending',
        balasan: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }).returning();
    return c.json(insertedContact);
});
core.get('/contact', auth_1.adminMiddleware, async (c) => {
    const data = await db_1.db.select().from(schema_1.kontak).orderBy((0, drizzle_orm_1.desc)(schema_1.kontak.createdAt));
    return c.json(data);
});
core.put('/contact/:id/reply', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.replyKontakSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    await db_1.db.update(schema_1.kontak).set({ ...data, updatedAt: new Date().toISOString() }).where((0, drizzle_orm_1.eq)(schema_1.kontak.id, id));
    const [item] = await db_1.db.select().from(schema_1.kontak).where((0, drizzle_orm_1.eq)(schema_1.kontak.id, id));
    return c.json(item);
});
core.get('/hero', async (c) => {
    try {
        const data = await db_1.db.select().from(schema_1.heroSection).orderBy((0, drizzle_orm_1.asc)(schema_1.heroSection.order));
        if (data.length === 0) {
            const [insertedHero] = await db_1.db.insert(schema_1.heroSection).values({
                title: 'Selamat Datang',
                subtitle: 'Membangun Generasi Rabbani',
                image: '',
                order: 1,
                isActive: true,
                createdAt: new Date().toISOString(),
            }).returning();
            return c.json([insertedHero]);
        }
        return c.json(data);
    }
    catch (e) {
        console.error('Core /hero error:', e);
        return c.json([]);
    }
});
core.post('/hero', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.createHeroSectionSchema), async (c) => {
    const data = c.req.valid('json');
    // @ts-ignore
    const [item] = await db_1.db.insert(schema_1.heroSection).values({
        ...data,
        createdAt: new Date().toISOString()
    }).returning();
    return c.json(item);
});
core.put('/hero/:id', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.updateHeroSectionSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    await db_1.db.update(schema_1.heroSection).set(data).where((0, drizzle_orm_1.eq)(schema_1.heroSection.id, id));
    const [item] = await db_1.db.select().from(schema_1.heroSection).where((0, drizzle_orm_1.eq)(schema_1.heroSection.id, id));
    return c.json(item);
});
core.get('/hero/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const item = await db_1.db.select().from(schema_1.heroSection).where((0, drizzle_orm_1.eq)(schema_1.heroSection.id, id));
    if (item.length === 0) {
        return c.json({ error: 'Not found' }, 404);
    }
    return c.json(item[0]);
});
core.delete('/hero/:id', auth_1.adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    await db_1.db.delete(schema_1.heroSection).where((0, drizzle_orm_1.eq)(schema_1.heroSection.id, id));
    return c.json({ message: 'Deleted' });
});
core.get('/whatsapp-templates', async (c) => {
    const data = await db_1.db.select().from(schema_1.whatsappTemplates).orderBy((0, drizzle_orm_1.asc)(schema_1.whatsappTemplates.order));
    return c.json(data);
});
core.post('/whatsapp-templates', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.createWhatsAppTemplateSchema), async (c) => {
    const data = c.req.valid('json');
    // @ts-ignore
    const [insertedTemplate] = await db_1.db.insert(schema_1.whatsappTemplates).values({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }).returning();
    return c.json(insertedTemplate);
});
core.put('/whatsapp-templates/:id', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.updateWhatsAppTemplateSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    await db_1.db.update(schema_1.whatsappTemplates).set({ ...data, updatedAt: new Date().toISOString() }).where((0, drizzle_orm_1.eq)(schema_1.whatsappTemplates.id, id));
    const [item] = await db_1.db.select().from(schema_1.whatsappTemplates).where((0, drizzle_orm_1.eq)(schema_1.whatsappTemplates.id, id));
    return c.json(item);
});
core.delete('/whatsapp-templates/:id', auth_1.adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    await db_1.db.delete(schema_1.whatsappTemplates).where((0, drizzle_orm_1.eq)(schema_1.whatsappTemplates.id, id));
    return c.json({ message: 'Deleted' });
});
core.get('/visi-misi', async (c) => {
    try {
        const result = await db_1.db.execute((0, drizzle_orm_1.sql) `SELECT id, visi, misi, updated_at as "updatedAt" FROM core_visimisi LIMIT 1`);
        const rows = result.rows;
        if (rows.length === 0) {
            await db_1.db.execute((0, drizzle_orm_1.sql) `INSERT INTO core_visimisi (visi, misi, updated_at) VALUES ('', '', NOW())`);
            const newResult = await db_1.db.execute((0, drizzle_orm_1.sql) `SELECT id, visi, misi, updated_at as "updatedAt" FROM core_visimisi LIMIT 1`);
            return c.json(newResult.rows[0]);
        }
        return c.json(rows[0]);
    }
    catch (e) {
        console.error('VisiMisi Fetch Error:', e);
        return c.json({ visi: '', misi: '', updatedAt: new Date() });
    }
});
core.put('/visi-misi', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.updateVisiMisiSchema), async (c) => {
    const data = c.req.valid('json');
    try {
        const result = await db_1.db.execute((0, drizzle_orm_1.sql) `SELECT id FROM core_visimisi LIMIT 1`);
        const rows = result.rows;
        if (rows.length === 0) {
            await db_1.db.execute((0, drizzle_orm_1.sql) `INSERT INTO core_visimisi (visi, misi, updated_at) VALUES (${data.visi}, ${data.misi}, NOW())`);
        }
        else {
            await db_1.db.execute((0, drizzle_orm_1.sql) `UPDATE core_visimisi SET visi = ${data.visi}, misi = ${data.misi}, updated_at = NOW() WHERE id = ${rows[0].id}`);
        }
        const updatedResult = await db_1.db.execute((0, drizzle_orm_1.sql) `SELECT id, visi, misi, updated_at as "updatedAt" FROM core_visimisi LIMIT 1`);
        return c.json(updatedResult.rows[0]);
    }
    catch (e) {
        console.error('VisiMisi Update Error:', e);
        return c.json({ error: 'Failed to update Visi Misi: ' + e.message }, 500);
    }
});
core.get('/tenaga-pengajar', async (c) => {
    const search = c.req.query('search');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '12');
    const isPublished = c.req.query('isPublished') === 'true';
    const offset = (page - 1) * limit;
    let whereClause = undefined;
    if (search) {
        whereClause = (0, drizzle_orm_1.ilike)(schema_1.tenagaPengajar.namaLengkap, `%${search}%`);
    }
    if (isPublished) {
        whereClause = whereClause ? (0, drizzle_orm_1.and)(whereClause, (0, drizzle_orm_1.eq)(schema_1.tenagaPengajar.isPublished, true)) : (0, drizzle_orm_1.eq)(schema_1.tenagaPengajar.isPublished, true);
    }
    const query = db_1.db.select().from(schema_1.tenagaPengajar);
    if (whereClause)
        query.where(whereClause);
    const totalResult = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.tenagaPengajar).where(whereClause || (0, drizzle_orm_1.sql) `true`);
    const total = Number(totalResult[0].count);
    const data = await query
        .orderBy((0, drizzle_orm_1.asc)(schema_1.tenagaPengajar.order))
        .limit(limit)
        .offset(offset);
    return c.json({
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    });
});
core.post('/tenaga-pengajar', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.createTenagaPengajarSchema), async (c) => {
    const data = c.req.valid('json');
    const [insertedTeacher] = await db_1.db.insert(schema_1.tenagaPengajar).values(data).returning();
    return c.json(insertedTeacher);
});
core.put('/tenaga-pengajar/:id', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.updateTenagaPengajarSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    // @ts-ignore
    await db_1.db.update(schema_1.tenagaPengajar).set({ ...data, updatedAt: new Date().toISOString() }).where((0, drizzle_orm_1.eq)(schema_1.tenagaPengajar.id, id));
    const [item] = await db_1.db.select().from(schema_1.tenagaPengajar).where((0, drizzle_orm_1.eq)(schema_1.tenagaPengajar.id, id));
    return c.json(item);
});
core.delete('/tenaga-pengajar/:id', auth_1.adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    await db_1.db.delete(schema_1.tenagaPengajar).where((0, drizzle_orm_1.eq)(schema_1.tenagaPengajar.id, id));
    return c.json({ message: 'Deleted' });
});
const createSimpleCrud = (path, table, createSchema, updateSchema, orderByField = null) => {
    core.get(`/${path}`, async (c) => {
        try {
            let query = db_1.db.select().from(table);
            if (orderByField) {
                query = query.orderBy((0, drizzle_orm_1.asc)(orderByField));
            }
            const data = await query;
            return c.json(data);
        }
        catch (e) {
            console.error(`Core /${path} error:`, e);
            return c.json([]);
        }
    });
    core.get(`/${path}/:id`, async (c) => {
        const id = parseInt(c.req.param('id'));
        try {
            const data = await db_1.db.select().from(table).where((0, drizzle_orm_1.eq)(table.id, id));
            if (data.length === 0) {
                return c.json({ error: 'Not found' }, 404);
            }
            return c.json(data[0]);
        }
        catch (e) {
            console.error(`Core /${path}/:id error:`, e);
            return c.json({ error: 'Internal Server Error' }, 500);
        }
    });
    core.post(`/${path}`, auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', createSchema), async (c) => {
        const data = c.req.valid('json');
        const insertData = { ...data };
        // Ensure numeric fields are numbers (specifically for order)
        if (insertData.order && typeof insertData.order === 'string') {
            insertData.order = parseInt(insertData.order, 10);
        }
        if ('createdAt' in table)
            insertData.createdAt = new Date().toISOString();
        // Generic order fallback for all simple cruds if table has order column
        if ((insertData.order === undefined || insertData.order === null) && 'order' in table) {
            insertData.order = 0;
        }
        // Auto-active for simple CRUDs if applicable
        if ('isActive' in table && insertData.isActive === undefined) {
            insertData.isActive = true;
        }
        if ('isPublished' in table && insertData.isPublished === undefined) {
            insertData.isPublished = true;
        }
        if (path === 'jadwal-harian') {
            if (!insertData.target) {
                insertData.target = 'semua';
            }
            if (!insertData.kategori) {
                insertData.kategori = 'kegiatan';
            }
        }
        // Handle specific logic for program-pendidikan
        if (path === 'program-pendidikan') {
            // Ensure order is set if not provided
            if (insertData.order === undefined || insertData.order === null) {
                insertData.order = 0;
            }
            // Ensure akreditasi has default if missing (though schema might optional it)
            if (!insertData.akreditasi) {
                insertData.akreditasi = 'Belum Terakreditasi';
            }
        }
        const [inserted] = (await db_1.db.insert(table).values(insertData).returning());
        return c.json(inserted);
    });
    core.put(`/${path}/:id`, auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', updateSchema), async (c) => {
        const id = parseInt(c.req.param('id'));
        const data = c.req.valid('json');
        const updateData = { ...data };
        if ('updatedAt' in table) {
            updateData.updatedAt = new Date().toISOString();
        }
        const updatedRes = await db_1.db.update(table).set(updateData).where((0, drizzle_orm_1.eq)(table.id, id)).returning();
        const updated = Array.isArray(updatedRes) ? updatedRes[0] : updatedRes.rows[0];
        return c.json(updated);
    });
    core.delete(`/${path}/:id`, auth_1.adminMiddleware, async (c) => {
        const id = parseInt(c.req.param('id'));
        await db_1.db.delete(table).where((0, drizzle_orm_1.eq)(table.id, id));
        return c.json({ message: 'Deleted' });
    });
};
// program-pendidikan: custom GET with images, keep CRUD from createSimpleCrud except GET
core.get('/program-pendidikan', async (c) => {
    try {
        const items = await db_1.db.select().from(schema_1.programPendidikan).orderBy((0, drizzle_orm_1.asc)(schema_1.programPendidikan.order));
        const images = await db_1.db.select().from(schema_1.programPendidikanImages).orderBy((0, drizzle_orm_1.asc)(schema_1.programPendidikanImages.order));
        const result = items.map(item => ({
            ...item,
            images: images.filter(img => img.programId === item.id).slice(0, 3),
        }));
        return c.json(result);
    }
    catch (e) {
        console.error('Core /program-pendidikan error:', e);
        return c.json([]);
    }
});
core.get('/program-pendidikan/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    try {
        const [item] = await db_1.db.select().from(schema_1.programPendidikan).where((0, drizzle_orm_1.eq)(schema_1.programPendidikan.id, id));
        if (!item)
            return c.json({ error: 'Not found' }, 404);
        const images = await db_1.db.select().from(schema_1.programPendidikanImages)
            .where((0, drizzle_orm_1.eq)(schema_1.programPendidikanImages.programId, id))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.programPendidikanImages.order));
        return c.json({ ...item, images: images.slice(0, 3) });
    }
    catch (e) {
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});
core.post('/program-pendidikan', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.createProgramPendidikanSchema), async (c) => {
    const data = c.req.valid('json');
    const insertData = { ...data, createdAt: new Date().toISOString() };
    if (!insertData.akreditasi)
        insertData.akreditasi = 'Belum Terakreditasi';
    if (insertData.order === undefined)
        insertData.order = 0;
    const [inserted] = await db_1.db.insert(schema_1.programPendidikan).values(insertData).returning();
    return c.json(inserted);
});
core.put('/program-pendidikan/:id', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.updateProgramPendidikanSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    const [updated] = await db_1.db.update(schema_1.programPendidikan).set(data).where((0, drizzle_orm_1.eq)(schema_1.programPendidikan.id, id)).returning();
    return c.json(updated);
});
core.delete('/program-pendidikan/:id', auth_1.adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    await db_1.db.delete(schema_1.programPendidikanImages).where((0, drizzle_orm_1.eq)(schema_1.programPendidikanImages.programId, id));
    await db_1.db.delete(schema_1.programPendidikan).where((0, drizzle_orm_1.eq)(schema_1.programPendidikan.id, id));
    return c.json({ message: 'Deleted' });
});
// programs (jenjang) GET also includes gambar field
createSimpleCrud('fasilitas', schema_1.fasilitas, core_schema_1.createFasilitasSchema, core_schema_1.updateFasilitasSchema, schema_1.fasilitas.order);
core.get('/sejarah-timeline', async (c) => {
    try {
        const timelineEvents = await db_1.db.select().from(schema_1.sejarahTimeline).orderBy((0, drizzle_orm_1.asc)(schema_1.sejarahTimeline.order));
        const images = await db_1.db.select().from(schema_1.sejarahTimelineImages).orderBy((0, drizzle_orm_1.asc)(schema_1.sejarahTimelineImages.order));
        const eventsWithImages = timelineEvents.map(event => {
            const eventImages = images.filter(img => img.timelineId === event.id);
            return {
                ...event,
                images: eventImages
            };
        });
        return c.json(eventsWithImages);
    }
    catch (e) {
        console.error('Core /sejarah-timeline error:', e);
        return c.json([]);
    }
});
core.post('/sejarah-timeline', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.createSejarahTimelineSchema), async (c) => {
    const data = c.req.valid('json');
    const { images, ...timelineData } = data;
    // @ts-ignore
    const [insertedTimeline] = await db_1.db.insert(schema_1.sejarahTimeline).values({
        ...timelineData,
        icon: timelineData.icon || 'circle',
        createdAt: new Date().toISOString()
    }).returning();
    const timelineId = insertedTimeline.id;
    if (images && images.length > 0) {
        // @ts-ignore
        await db_1.db.insert(schema_1.sejarahTimelineImages).values(images.map((img, index) => ({
            timelineId: timelineId,
            gambar: img,
            order: index,
            createdAt: new Date().toISOString()
        })));
    }
    const item = await db_1.db.query.sejarahTimeline.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.sejarahTimeline.id, timelineId),
        with: { images: true }
    });
    return c.json(item);
});
core.put('/sejarah-timeline/:id', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.updateSejarahTimelineSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    const { images, ...timelineData } = data;
    await db_1.db.update(schema_1.sejarahTimeline).set(timelineData).where((0, drizzle_orm_1.eq)(schema_1.sejarahTimeline.id, id));
    if (images !== undefined) {
        await db_1.db.delete(schema_1.sejarahTimelineImages).where((0, drizzle_orm_1.eq)(schema_1.sejarahTimelineImages.timelineId, id));
        if (images.length > 0) {
            // @ts-ignore
            await db_1.db.insert(schema_1.sejarahTimelineImages).values(images.map((img, index) => ({
                timelineId: id,
                gambar: img,
                order: index,
                createdAt: new Date().toISOString()
            })));
        }
    }
    const item = await db_1.db.query.sejarahTimeline.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.sejarahTimeline.id, id),
        with: { images: true }
    });
    return c.json(item);
});
core.delete('/sejarah-timeline/:id', auth_1.adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    await db_1.db.delete(schema_1.sejarahTimelineImages).where((0, drizzle_orm_1.eq)(schema_1.sejarahTimelineImages.timelineId, id));
    await db_1.db.delete(schema_1.sejarahTimeline).where((0, drizzle_orm_1.eq)(schema_1.sejarahTimeline.id, id));
    return c.json({ message: 'Deleted' });
});
// ===== EKSTRAKURIKULER: Custom CRUD with pagination and images =====
core.get('/ekstrakurikuler', async (c) => {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = (page - 1) * limit;
    try {
        const totalResult = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.ekstrakurikuler);
        const total = Number(totalResult[0].count);
        const items = await db_1.db.select().from(schema_1.ekstrakurikuler)
            .orderBy((0, drizzle_orm_1.asc)(schema_1.ekstrakurikuler.order))
            .limit(limit)
            .offset(offset);
        const images = await db_1.db.select().from(schema_1.ekstrakurikulerImages)
            .orderBy((0, drizzle_orm_1.asc)(schema_1.ekstrakurikulerImages.order));
        const result = items.map(item => ({
            ...item,
            images: images.filter(img => img.ekstrakurikulerId === item.id)
        }));
        return c.json({
            data: result,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
    catch (e) {
        console.error('Core /ekstrakurikuler error:', e);
        return c.json({ data: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } });
    }
});
core.get('/ekstrakurikuler/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    try {
        const [item] = await db_1.db.select().from(schema_1.ekstrakurikuler).where((0, drizzle_orm_1.eq)(schema_1.ekstrakurikuler.id, id));
        if (!item)
            return c.json({ error: 'Not found' }, 404);
        const images = await db_1.db.select().from(schema_1.ekstrakurikulerImages)
            .where((0, drizzle_orm_1.eq)(schema_1.ekstrakurikulerImages.ekstrakurikulerId, id))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.ekstrakurikulerImages.order));
        return c.json({ ...item, images });
    }
    catch (e) {
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});
core.post('/ekstrakurikuler', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.createEkstrakurikulerSchema), async (c) => {
    const data = c.req.valid('json');
    const { images, ...extraData } = data;
    // @ts-ignore
    const [inserted] = await db_1.db.insert(schema_1.ekstrakurikuler).values({
        ...extraData,
        createdAt: new Date().toISOString()
    }).returning();
    const extraId = inserted.id;
    if (images && images.length > 0) {
        await db_1.db.insert(schema_1.ekstrakurikulerImages).values(images.map((img, index) => ({
            ekstrakurikulerId: extraId,
            gambar: img,
            altText: extraData.nama,
            order: index,
            createdAt: new Date().toISOString()
        })));
    }
    const item = await db_1.db.query.ekstrakurikuler.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.ekstrakurikuler.id, extraId),
        with: { images: true }
    });
    return c.json(item);
});
core.put('/ekstrakurikuler/:id', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.updateEkstrakurikulerSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    const { images, ...extraData } = data;
    await db_1.db.update(schema_1.ekstrakurikuler).set(extraData).where((0, drizzle_orm_1.eq)(schema_1.ekstrakurikuler.id, id));
    if (images !== undefined) {
        await db_1.db.delete(schema_1.ekstrakurikulerImages).where((0, drizzle_orm_1.eq)(schema_1.ekstrakurikulerImages.ekstrakurikulerId, id));
        if (images.length > 0) {
            await db_1.db.insert(schema_1.ekstrakurikulerImages).values(images.map((img, index) => ({
                ekstrakurikulerId: id,
                gambar: img,
                altText: extraData.nama || '',
                order: index,
                createdAt: new Date().toISOString()
            })));
        }
    }
    const item = await db_1.db.query.ekstrakurikuler.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.ekstrakurikuler.id, id),
        with: { images: true }
    });
    return c.json(item);
});
core.delete('/ekstrakurikuler/:id', auth_1.adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    await db_1.db.delete(schema_1.ekstrakurikulerImages).where((0, drizzle_orm_1.eq)(schema_1.ekstrakurikulerImages.ekstrakurikulerId, id));
    await db_1.db.delete(schema_1.ekstrakurikuler).where((0, drizzle_orm_1.eq)(schema_1.ekstrakurikuler.id, id));
    return c.json({ message: 'Deleted' });
});
core.get('/dokumentasi', async (c) => {
    try {
        const items = await db_1.db.query.dokumentasi.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.dokumentasi.isPublished, true),
            with: { images: true },
            orderBy: [(0, drizzle_orm_1.desc)(schema_1.dokumentasi.createdAt)]
        });
        return c.json(items);
    }
    catch (e) {
        console.error('Core /dokumentasi error:', e);
        return c.json([]);
    }
});
core.get('/dokumentasi/:id', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));
        const item = await db_1.db.query.dokumentasi.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.dokumentasi.id, id), (0, drizzle_orm_1.eq)(schema_1.dokumentasi.isPublished, true)),
            with: { images: true }
        });
        if (!item)
            return c.json({ error: 'Not found or unpublished' }, 404);
        return c.json(item);
    }
    catch (e) {
        console.error('Core /dokumentasi/:id error:', e);
        return c.json({ error: 'Server error' }, 500);
    }
});
core.post('/dokumentasi', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.createDokumentasiSchema), async (c) => {
    const data = c.req.valid('json');
    const { images, ...docData } = data;
    // @ts-ignore
    const [inserted] = await db_1.db.insert(schema_1.dokumentasi).values({
        ...docData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }).returning();
    const docId = inserted.id;
    if (images && images.length > 0) {
        await db_1.db.insert(schema_1.dokumentasiImages).values(images.map((img, index) => ({
            dokumentasiId: docId,
            gambar: img,
            altText: docData.judul || '',
            order: index,
            createdAt: new Date().toISOString()
        })));
    }
    const item = await db_1.db.query.dokumentasi.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.dokumentasi.id, docId),
        with: { images: true }
    });
    return c.json(item);
});
core.put('/dokumentasi/:id', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.updateDokumentasiSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    const { images, ...docData } = data;
    // @ts-ignore
    await db_1.db.update(schema_1.dokumentasi).set({ ...docData, updatedAt: new Date().toISOString() }).where((0, drizzle_orm_1.eq)(schema_1.dokumentasi.id, id));
    if (images !== undefined) {
        await db_1.db.delete(schema_1.dokumentasiImages).where((0, drizzle_orm_1.eq)(schema_1.dokumentasiImages.dokumentasiId, id));
        if (images.length > 0) {
            // @ts-ignore
            await db_1.db.insert(schema_1.dokumentasiImages).values(images.map((img, index) => ({
                dokumentasiId: id,
                gambar: img,
                altText: docData.judul || '',
                order: index,
                createdAt: new Date().toISOString()
            })));
        }
    }
    const item = await db_1.db.query.dokumentasi.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.dokumentasi.id, id),
        with: { images: true }
    });
    return c.json(item);
});
core.delete('/dokumentasi/:id', auth_1.adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    await db_1.db.delete(schema_1.dokumentasiImages).where((0, drizzle_orm_1.eq)(schema_1.dokumentasiImages.dokumentasiId, id));
    await db_1.db.delete(schema_1.dokumentasi).where((0, drizzle_orm_1.eq)(schema_1.dokumentasi.id, id));
    return c.json({ message: 'Deleted' });
});
createSimpleCrud('jadwal-harian', schema_1.jadwalHarian, core_schema_1.createJadwalHarianSchema, core_schema_1.updateJadwalHarianSchema, schema_1.jadwalHarian.order);
createSimpleCrud('biaya-pendidikan', schema_1.biayaPendidikan, core_schema_1.createBiayaPendidikanSchema, core_schema_1.updateBiayaPendidikanSchema, schema_1.biayaPendidikan.order);
createSimpleCrud('contact-persons', schema_1.contactPersons, core_schema_1.createContactPersonSchema, core_schema_1.updateContactPersonSchema, schema_1.contactPersons.order);
createSimpleCrud('social-media', schema_1.socialMedia, core_schema_1.createSocialMediaSchema, core_schema_1.updateSocialMediaSchema, schema_1.socialMedia.order);
createSimpleCrud('seragam', schema_1.seragam, core_schema_1.createSeragamSchema, core_schema_1.updateSeragamSchema, schema_1.seragam.order);
core.get('/statistik', async (c) => {
    try {
        const data = await db_1.db.select().from(schema_1.statistik).orderBy((0, drizzle_orm_1.asc)(schema_1.statistik.order));
        return c.json(data);
    }
    catch (e) {
        console.error('Core /statistik error:', e);
        return c.json([]);
    }
});
createSimpleCrud('media', schema_1.media, core_schema_1.createMediaSchema, core_schema_1.updateMediaSchema, schema_1.media.order);
createSimpleCrud('bagian-jabatan', schema_1.bagianJabatan, core_schema_1.createBagianJabatanSchema, core_schema_1.updateBagianJabatanSchema, schema_1.bagianJabatan.order);
createSimpleCrud('informasi-tambahan', schema_1.informasiTambahan, core_schema_1.createInformasiTambahanSchema, core_schema_1.updateInformasiTambahanSchema, schema_1.informasiTambahan.order);
createSimpleCrud('registration-flow', schema_1.websiteRegistrationFlow, core_schema_1.createWebsiteRegistrationFlowSchema, core_schema_1.updateWebsiteRegistrationFlowSchema, schema_1.websiteRegistrationFlow.order);
const createSingletonCrud = (path, table, updateSchema, defaultValues = {}) => {
    core.get(`/${path}`, async (c) => {
        try {
            const data = await db_1.db.select().from(table).limit(1);
            if (data.length === 0) {
                try {
                    const insertData = { ...defaultValues, updatedAt: new Date().toISOString() };
                    const newItemRes = await db_1.db.insert(table).values(insertData).returning();
                    const [newItem] = Array.isArray(newItemRes) ? newItemRes : newItemRes.rows;
                    return c.json(newItem);
                }
                catch (e) {
                    console.error(`Error initializing ${path}:`, e);
                    return c.json({ ...defaultValues, updatedAt: new Date().toISOString() });
                }
            }
            return c.json(data[0]);
        }
        catch (e) {
            console.error(`Core /${path} error:`, e);
            return c.json({ ...defaultValues, updatedAt: new Date().toISOString() });
        }
    });
    core.put(`/${path}`, auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', updateSchema), async (c) => {
        const data = c.req.valid('json');
        const existing = await db_1.db.select().from(table).limit(1);
        if (existing.length === 0) {
            const newItemRes = await db_1.db.insert(table).values({ ...defaultValues, ...data, updatedAt: new Date().toISOString() }).returning();
            const [newItem] = Array.isArray(newItemRes) ? newItemRes : newItemRes.rows;
            return c.json(newItem);
        }
        else {
            await db_1.db.update(table)
                .set({ ...data, updatedAt: new Date().toISOString() })
                .where((0, drizzle_orm_1.eq)(table.id, existing[0].id));
            const [updated] = await db_1.db.select().from(table).where((0, drizzle_orm_1.eq)(table.id, existing[0].id));
            return c.json(updated);
        }
    });
};
createSingletonCrud('persyaratan', schema_1.persyaratan, core_schema_1.updatePersyaratanSchema, {
    persyaratanSantri: 'Belum diatur',
    persyaratanSantriwati: 'Belum diatur'
});
createSingletonCrud('alur-pendaftaran', schema_1.alurPendaftaran, core_schema_1.updateAlurPendaftaranSchema, {
    alurPendaftaran: 'Belum diatur',
    tahapanTes: 'Belum diatur'
});
// ===== FOUNDERS =====
core.get('/founders', async (c) => {
    const data = await db_1.db.select().from(schema_1.founders).where((0, drizzle_orm_1.eq)(schema_1.founders.isDeleted, false)).orderBy((0, drizzle_orm_1.asc)(schema_1.founders.id));
    const publicData = data.map(f => ({
        ...f,
        nik: undefined,
        email: f.email ? (0, encryption_1.decrypt)(f.email) : '',
    }));
    return c.json(publicData);
});
core.get('/founders/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const [item] = await db_1.db.select().from(schema_1.founders).where((0, drizzle_orm_1.eq)(schema_1.founders.id, id));
    if (!item || item.isDeleted)
        return c.json({ error: 'Not found' }, 404);
    return c.json({
        ...item,
        nik: undefined,
        email: item.email ? (0, encryption_1.decrypt)(item.email) : '',
    });
});
core.get('/admin/founders', auth_1.adminMiddleware, async (c) => {
    const data = await db_1.db.select().from(schema_1.founders).where((0, drizzle_orm_1.eq)(schema_1.founders.isDeleted, false));
    const fullData = data.map(f => ({
        ...f,
        nik: f.nik ? (0, encryption_1.decrypt)(f.nik) : '',
        email: f.email ? (0, encryption_1.decrypt)(f.email) : '',
    }));
    return c.json(fullData);
});
core.get('/admin/founders/:id', auth_1.adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    const [item] = await db_1.db.select().from(schema_1.founders).where((0, drizzle_orm_1.eq)(schema_1.founders.id, id));
    if (!item)
        return c.json({ error: 'Not found' }, 404);
    return c.json({
        ...item,
        nik: item.nik ? (0, encryption_1.decrypt)(item.nik) : '',
        email: item.email ? (0, encryption_1.decrypt)(item.email) : '',
    });
});
core.post('/admin/founders', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.createFounderSchema), async (c) => {
    const user = c.get('user');
    const data = c.req.valid('json');
    // Limits
    const existing = await db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.founders).where((0, drizzle_orm_1.eq)(schema_1.founders.isDeleted, false));
    if (Number(existing[0]?.count) >= 5) {
        return c.json({ error: 'Maksimal 5 entri pendiri' }, 400);
    }
    const allFounders = await db_1.db.select().from(schema_1.founders).where((0, drizzle_orm_1.eq)(schema_1.founders.isDeleted, false));
    for (const f of allFounders) {
        if ((0, encryption_1.decrypt)(f.nik) === data.nik)
            return c.json({ error: 'NIK sudah terdaftar' }, 400);
        if ((0, encryption_1.decrypt)(f.email) === data.email)
            return c.json({ error: 'Email sudah terdaftar' }, 400);
    }
    const [newItem] = await db_1.db.insert(schema_1.founders).values({
        ...data,
        nik: (0, encryption_1.encrypt)(data.nik),
        email: (0, encryption_1.encrypt)(data.email),
        createdBy: user?.id,
        updatedBy: user?.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false
    }).returning();
    return c.json({
        ...newItem,
        nik: (0, encryption_1.decrypt)(newItem.nik),
        email: (0, encryption_1.decrypt)(newItem.email)
    });
});
core.put('/admin/founders/:id', auth_1.adminMiddleware, (0, zod_validator_1.zValidator)('json', core_schema_1.updateFounderSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const user = c.get('user');
    const data = c.req.valid('json');
    const [existing] = await db_1.db.select().from(schema_1.founders).where((0, drizzle_orm_1.eq)(schema_1.founders.id, id));
    if (!existing)
        return c.json({ error: 'Not found' }, 404);
    if (data.nik || data.email) {
        const allFounders = await db_1.db.select().from(schema_1.founders).where((0, drizzle_orm_1.eq)(schema_1.founders.isDeleted, false));
        for (const f of allFounders) {
            if (f.id === id)
                continue;
            if (data.nik && (0, encryption_1.decrypt)(f.nik) === data.nik)
                return c.json({ error: 'NIK sudah terdaftar' }, 400);
            if (data.email && (0, encryption_1.decrypt)(f.email) === data.email)
                return c.json({ error: 'Email sudah terdaftar' }, 400);
        }
    }
    const updateData = { ...data, updatedAt: new Date().toISOString(), updatedBy: user?.id };
    if (data.nik)
        updateData.nik = (0, encryption_1.encrypt)(data.nik);
    if (data.email)
        updateData.email = (0, encryption_1.encrypt)(data.email);
    await db_1.db.update(schema_1.founders).set(updateData).where((0, drizzle_orm_1.eq)(schema_1.founders.id, id));
    const [updated] = await db_1.db.select().from(schema_1.founders).where((0, drizzle_orm_1.eq)(schema_1.founders.id, id));
    return c.json({
        ...updated,
        nik: (0, encryption_1.decrypt)(updated.nik),
        email: (0, encryption_1.decrypt)(updated.email)
    });
});
core.delete('/admin/founders/:id', auth_1.adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    const user = c.get('user');
    await db_1.db.update(schema_1.founders).set({
        isDeleted: true,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.id
    }).where((0, drizzle_orm_1.eq)(schema_1.founders.id, id));
    return c.json({ message: 'Deleted' });
});
// ===== STRUKTUR ORGANISASI =====
core.get('/struktur-organisasi', async (c) => {
    try {
        const data = await db_1.db.select().from(schema_1.strukturOrganisasi)
            .where((0, drizzle_orm_1.eq)(schema_1.strukturOrganisasi.isActive, true))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.strukturOrganisasi.level), (0, drizzle_orm_1.asc)(schema_1.strukturOrganisasi.order));
        return c.json(data);
    }
    catch (e) {
        console.error('Core /struktur-organisasi error:', e);
        return c.json([]);
    }
});
// Admin routes for Struktur Organisasi moved to admin module
// ===== FORM CONFIG (Public) =====
core.get('/form-config', async (c) => {
    try {
        const formName = c.req.query('form') || 'pendaftaran';
        const data = await db_1.db.select().from(schema_1.formConfig).where((0, drizzle_orm_1.eq)(schema_1.formConfig.formName, formName));
        // Convert to key-value object for easy frontend use
        const config = {};
        data.forEach(item => { config[item.fieldKey] = item.fieldValue; });
        return c.json(config);
    }
    catch (e) {
        return c.json({});
    }
});
exports.default = core;
