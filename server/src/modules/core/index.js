import { Hono } from 'hono';
import { db } from '../../db';
import { eq, asc, desc, sql } from 'drizzle-orm';
import { websiteSettings, faq, programs, whatsappTemplates, kontak, heroSection, sejarahTimeline, sejarahTimelineImages, programPendidikan, fasilitas, ekstrakurikuler, dokumentasi, dokumentasiImages, jadwalHarian, persyaratan, alurPendaftaran, biayaPendidikan, contactPersons, socialMedia, seragam, kmi, statistik, media, bagianJabatan, tenagaPengajar, informasiTambahan, websiteRegistrationFlow, founders } from '../../db/schema';
import { encrypt, decrypt } from '../../utils/encryption';
import { zValidator } from '@hono/zod-validator';
import { adminMiddleware } from '../../middleware/auth';
import { updateWebsiteSettingsSchema, createFaqSchema, updateFaqSchema, createProgramSchema, updateProgramSchema, createWhatsAppTemplateSchema, updateWhatsAppTemplateSchema, createKontakSchema, replyKontakSchema, createHeroSectionSchema, updateHeroSectionSchema, createSejarahTimelineSchema, updateSejarahTimelineSchema, updateVisiMisiSchema, createProgramPendidikanSchema, updateProgramPendidikanSchema, createFasilitasSchema, updateFasilitasSchema, createEkstrakurikulerSchema, updateEkstrakurikulerSchema, createDokumentasiSchema, updateDokumentasiSchema, createJadwalHarianSchema, updateJadwalHarianSchema, updatePersyaratanSchema, updateAlurPendaftaranSchema, createBiayaPendidikanSchema, updateBiayaPendidikanSchema, createContactPersonSchema, updateContactPersonSchema, createSocialMediaSchema, updateSocialMediaSchema, createSeragamSchema, updateSeragamSchema, updateKmiSchema, createStatistikSchema, updateStatistikSchema, createMediaSchema, updateMediaSchema, createBagianJabatanSchema, updateBagianJabatanSchema, createTenagaPengajarSchema, updateTenagaPengajarSchema, createInformasiTambahanSchema, updateInformasiTambahanSchema, createWebsiteRegistrationFlowSchema, updateWebsiteRegistrationFlowSchema, createFounderSchema, updateFounderSchema } from './core.schema';
const core = new Hono();
core.get('/health/db', async (c) => {
    try {
        const res = await db.execute(sql `SELECT 1 as ok`);
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
        const settings = await db.select({ updatedAt: websiteSettings.updatedAt }).from(websiteSettings).limit(1);
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
        const settings = await db.select().from(websiteSettings).limit(1);
        if (settings.length === 0) {
            try {
                const [newSettings] = await db.insert(websiteSettings).values({
                    namaPondok: 'Pondok Pesantren',
                    arabicName: 'المعهد الإسلامي',
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
                    updatedAt: new Date(),
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
core.put('/settings', adminMiddleware, zValidator('json', updateWebsiteSettingsSchema), async (c) => {
    const data = c.req.valid('json');
    const settings = await db.select().from(websiteSettings).limit(1);
    if (settings.length === 0) {
        const [newSettings] = await db.insert(websiteSettings).values(data).returning();
        return c.json(newSettings);
    }
    else {
        await db.update(websiteSettings)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(websiteSettings.id, settings[0].id));
        const [updated] = await db.select().from(websiteSettings).where(eq(websiteSettings.id, settings[0].id));
        return c.json(updated);
    }
});
core.get('/faq', async (c) => {
    const data = await db.select().from(faq).orderBy(asc(faq.order));
    return c.json(data);
});
core.post('/faq', adminMiddleware, zValidator('json', createFaqSchema), async (c) => {
    const data = c.req.valid('json');
    const [item] = await db.insert(faq).values({
        ...data,
        createdAt: new Date()
    }).returning();
    return c.json(item);
});
core.put('/faq/:id', adminMiddleware, zValidator('json', updateFaqSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    await db.update(faq).set(data).where(eq(faq.id, id));
    const [item] = await db.select().from(faq).where(eq(faq.id, id));
    return c.json(item);
});
core.delete('/faq/:id', adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    await db.delete(faq).where(eq(faq.id, id));
    return c.json({ message: 'Deleted' });
});
core.get('/programs', async (c) => {
    try {
        const data = await db.select().from(programs).orderBy(asc(programs.order));
        return c.json(data);
    }
    catch (e) {
        console.error('Core /programs error:', e);
        return c.json([]);
    }
});
core.post('/programs', adminMiddleware, zValidator('json', createProgramSchema), async (c) => {
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
    const existing = await db.select().from(programs).where(eq(programs.slug, slug));
    if (existing.length > 0) {
        slug = `${slug}-${Date.now()}`;
    }
    const [item] = await db.insert(programs).values({
        ...data,
        slug,
        status: data.status || 'published',
        isFeatured: data.isFeatured ?? false,
        metaTitle: data.metaTitle || data.nama,
        metaDescription: data.metaDescription || data.deskripsi.substring(0, 150),
        order: data.order ?? 0,
        createdAt: new Date(),
        updatedAt: new Date()
    }).returning();
    return c.json(item);
});
core.put('/programs/:id', adminMiddleware, zValidator('json', updateProgramSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    const formattedData = {
        ...data,
        tanggalMulai: data.tanggalMulai ? new Date(data.tanggalMulai) : undefined,
        tanggalSelesai: data.tanggalSelesai ? new Date(data.tanggalSelesai) : undefined,
        updatedAt: new Date()
    };
    await db.update(programs).set(formattedData).where(eq(programs.id, id));
    const [item] = await db.select().from(programs).where(eq(programs.id, id));
    return c.json(item);
});
core.delete('/programs/:id', adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    await db.delete(programs).where(eq(programs.id, id));
    return c.json({ message: 'Deleted' });
});
core.post('/contact', zValidator('json', createKontakSchema), async (c) => {
    const data = c.req.valid('json');
    const [insertedContact] = await db.insert(kontak).values({
        ...data,
        status: 'pending',
        balasan: '',
        createdAt: new Date(),
        updatedAt: new Date()
    }).returning();
    return c.json(insertedContact);
});
core.get('/contact', adminMiddleware, async (c) => {
    const data = await db.select().from(kontak).orderBy(desc(kontak.createdAt));
    return c.json(data);
});
core.put('/contact/:id/reply', adminMiddleware, zValidator('json', replyKontakSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    await db.update(kontak).set({ ...data, updatedAt: new Date() }).where(eq(kontak.id, id));
    const [item] = await db.select().from(kontak).where(eq(kontak.id, id));
    return c.json(item);
});
core.get('/hero', async (c) => {
    try {
        const data = await db.select().from(heroSection).orderBy(asc(heroSection.order));
        if (data.length === 0) {
            const [insertedHero] = await db.insert(heroSection).values({
                title: 'Selamat Datang',
                subtitle: 'Membangun Generasi Rabbani',
                image: '',
                order: 1,
                isActive: true,
                createdAt: new Date(),
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
core.post('/hero', adminMiddleware, zValidator('json', createHeroSectionSchema), async (c) => {
    const data = c.req.valid('json');
    const [item] = await db.insert(heroSection).values({
        ...data,
        createdAt: new Date()
    }).returning();
    return c.json(item);
});
core.put('/hero/:id', adminMiddleware, zValidator('json', updateHeroSectionSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    await db.update(heroSection).set(data).where(eq(heroSection.id, id));
    const [item] = await db.select().from(heroSection).where(eq(heroSection.id, id));
    return c.json(item);
});
core.get('/hero/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const item = await db.select().from(heroSection).where(eq(heroSection.id, id));
    if (item.length === 0) {
        return c.json({ error: 'Not found' }, 404);
    }
    return c.json(item[0]);
});
core.delete('/hero/:id', adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    await db.delete(heroSection).where(eq(heroSection.id, id));
    return c.json({ message: 'Deleted' });
});
core.get('/whatsapp-templates', async (c) => {
    const data = await db.select().from(whatsappTemplates).orderBy(asc(whatsappTemplates.order));
    return c.json(data);
});
core.post('/whatsapp-templates', adminMiddleware, zValidator('json', createWhatsAppTemplateSchema), async (c) => {
    const data = c.req.valid('json');
    const [insertedTemplate] = await db.insert(whatsappTemplates).values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
    }).returning();
    return c.json(insertedTemplate);
});
core.put('/whatsapp-templates/:id', adminMiddleware, zValidator('json', updateWhatsAppTemplateSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    await db.update(whatsappTemplates).set({ ...data, updatedAt: new Date() }).where(eq(whatsappTemplates.id, id));
    const [item] = await db.select().from(whatsappTemplates).where(eq(whatsappTemplates.id, id));
    return c.json(item);
});
core.delete('/whatsapp-templates/:id', adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    await db.delete(whatsappTemplates).where(eq(whatsappTemplates.id, id));
    return c.json({ message: 'Deleted' });
});
core.get('/visi-misi', async (c) => {
    try {
        const result = await db.execute(sql `SELECT id, visi, misi, updated_at as "updatedAt" FROM core_visimisi LIMIT 1`);
        const rows = result.rows;
        if (rows.length === 0) {
            await db.execute(sql `INSERT INTO core_visimisi (visi, misi, updated_at) VALUES ('', '', NOW())`);
            const newResult = await db.execute(sql `SELECT id, visi, misi, updated_at as "updatedAt" FROM core_visimisi LIMIT 1`);
            return c.json(newResult.rows[0]);
        }
        return c.json(rows[0]);
    }
    catch (e) {
        console.error('VisiMisi Fetch Error:', e);
        return c.json({ visi: '', misi: '', updatedAt: new Date() });
    }
});
core.put('/visi-misi', adminMiddleware, zValidator('json', updateVisiMisiSchema), async (c) => {
    const data = c.req.valid('json');
    try {
        const result = await db.execute(sql `SELECT id FROM core_visimisi LIMIT 1`);
        const rows = result.rows;
        if (rows.length === 0) {
            await db.execute(sql `INSERT INTO core_visimisi (visi, misi, updated_at) VALUES (${data.visi}, ${data.misi}, NOW())`);
        }
        else {
            await db.execute(sql `UPDATE core_visimisi SET visi = ${data.visi}, misi = ${data.misi}, updated_at = NOW() WHERE id = ${rows[0].id}`);
        }
        const updatedResult = await db.execute(sql `SELECT id, visi, misi, updated_at as "updatedAt" FROM core_visimisi LIMIT 1`);
        return c.json(updatedResult.rows[0]);
    }
    catch (e) {
        console.error('VisiMisi Update Error:', e);
        return c.json({ error: 'Failed to update Visi Misi: ' + e.message }, 500);
    }
});
core.get('/tenaga-pengajar', async (c) => {
    const data = await db.select().from(tenagaPengajar).orderBy(asc(tenagaPengajar.order));
    return c.json(data);
});
core.post('/tenaga-pengajar', adminMiddleware, zValidator('json', createTenagaPengajarSchema), async (c) => {
    const data = c.req.valid('json');
    const [insertedTeacher] = await db.insert(tenagaPengajar).values(data).returning();
    return c.json(insertedTeacher);
});
core.put('/tenaga-pengajar/:id', adminMiddleware, zValidator('json', updateTenagaPengajarSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    await db.update(tenagaPengajar).set({ ...data, updatedAt: new Date() }).where(eq(tenagaPengajar.id, id));
    const [item] = await db.select().from(tenagaPengajar).where(eq(tenagaPengajar.id, id));
    return c.json(item);
});
core.delete('/tenaga-pengajar/:id', adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    await db.delete(tenagaPengajar).where(eq(tenagaPengajar.id, id));
    return c.json({ message: 'Deleted' });
});
const createSimpleCrud = (path, table, createSchema, updateSchema, orderByField = null) => {
    core.get(`/${path}`, async (c) => {
        try {
            let query = db.select().from(table);
            if (orderByField) {
                query = query.orderBy(asc(orderByField));
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
            const data = await db.select().from(table).where(eq(table.id, id));
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
    core.post(`/${path}`, adminMiddleware, zValidator('json', createSchema), async (c) => {
        const data = c.req.valid('json');
        const insertData = { ...data };
        // Ensure numeric fields are numbers (specifically for order)
        if (insertData.order && typeof insertData.order === 'string') {
            insertData.order = parseInt(insertData.order, 10);
        }
        if ('createdAt' in table)
            insertData.createdAt = new Date();
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
        const [inserted] = await db.insert(table).values(insertData).returning();
        return c.json(inserted);
    });
    core.put(`/${path}/:id`, adminMiddleware, zValidator('json', updateSchema), async (c) => {
        const id = parseInt(c.req.param('id'));
        const data = c.req.valid('json');
        const updateData = { ...data };
        if ('updatedAt' in table) {
            updateData.updatedAt = new Date();
        }
        const [updated] = await db.update(table).set(updateData).where(eq(table.id, id)).returning();
        return c.json(updated);
    });
    core.delete(`/${path}/:id`, adminMiddleware, async (c) => {
        const id = parseInt(c.req.param('id'));
        await db.delete(table).where(eq(table.id, id));
        return c.json({ message: 'Deleted' });
    });
};
createSimpleCrud('program-pendidikan', programPendidikan, createProgramPendidikanSchema, updateProgramPendidikanSchema, programPendidikan.order);
createSimpleCrud('fasilitas', fasilitas, createFasilitasSchema, updateFasilitasSchema, fasilitas.order);
core.get('/sejarah-timeline', async (c) => {
    try {
        const timelineEvents = await db.select().from(sejarahTimeline).orderBy(asc(sejarahTimeline.order));
        const images = await db.select().from(sejarahTimelineImages).orderBy(asc(sejarahTimelineImages.order));
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
core.post('/sejarah-timeline', adminMiddleware, zValidator('json', createSejarahTimelineSchema), async (c) => {
    const data = c.req.valid('json');
    const { images, ...timelineData } = data;
    const [insertedTimeline] = await db.insert(sejarahTimeline).values({
        ...timelineData,
        icon: timelineData.icon || 'circle',
        createdAt: new Date()
    }).returning();
    const timelineId = insertedTimeline.id;
    if (images && images.length > 0) {
        await db.insert(sejarahTimelineImages).values(images.map((img, index) => ({
            timelineId: timelineId,
            gambar: img,
            order: index,
            createdAt: new Date()
        })));
    }
    const item = await db.query.sejarahTimeline.findFirst({
        where: eq(sejarahTimeline.id, timelineId),
        with: { images: true }
    });
    return c.json(item);
});
core.put('/sejarah-timeline/:id', adminMiddleware, zValidator('json', updateSejarahTimelineSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    const { images, ...timelineData } = data;
    await db.update(sejarahTimeline).set(timelineData).where(eq(sejarahTimeline.id, id));
    if (images !== undefined) {
        await db.delete(sejarahTimelineImages).where(eq(sejarahTimelineImages.timelineId, id));
        if (images.length > 0) {
            await db.insert(sejarahTimelineImages).values(images.map((img, index) => ({
                timelineId: id,
                gambar: img,
                order: index,
                createdAt: new Date()
            })));
        }
    }
    const item = await db.query.sejarahTimeline.findFirst({
        where: eq(sejarahTimeline.id, id),
        with: { images: true }
    });
    return c.json(item);
});
core.delete('/sejarah-timeline/:id', adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    await db.delete(sejarahTimelineImages).where(eq(sejarahTimelineImages.timelineId, id));
    await db.delete(sejarahTimeline).where(eq(sejarahTimeline.id, id));
    return c.json({ message: 'Deleted' });
});
createSimpleCrud('ekstrakurikuler', ekstrakurikuler, createEkstrakurikulerSchema, updateEkstrakurikulerSchema, ekstrakurikuler.order);
core.get('/dokumentasi', async (c) => {
    try {
        const docs = await db.select().from(dokumentasi).orderBy(desc(dokumentasi.createdAt));
        const images = await db.select().from(dokumentasiImages).orderBy(asc(dokumentasiImages.order));
        const docsWithImages = docs.map(doc => {
            const docImages = images.filter(img => img.dokumentasiId === doc.id);
            return {
                ...doc,
                images: docImages
            };
        });
        return c.json(docsWithImages);
    }
    catch (e) {
        console.error('Core /dokumentasi error:', e);
        return c.json([]);
    }
});
core.post('/dokumentasi', adminMiddleware, zValidator('json', createDokumentasiSchema), async (c) => {
    const data = c.req.valid('json');
    const { images, ...docData } = data;
    const [inserted] = await db.insert(dokumentasi).values({
        ...docData,
        createdAt: new Date(),
        updatedAt: new Date()
    }).returning();
    const docId = inserted.id;
    if (images && images.length > 0) {
        await db.insert(dokumentasiImages).values(images.map((img, index) => ({
            dokumentasiId: docId,
            gambar: img,
            altText: docData.judul,
            order: index,
            createdAt: new Date()
        })));
    }
    const item = await db.query.dokumentasi.findFirst({
        where: eq(dokumentasi.id, docId),
        with: { images: true }
    });
    return c.json(item);
});
core.put('/dokumentasi/:id', adminMiddleware, zValidator('json', updateDokumentasiSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    const { images, ...docData } = data;
    await db.update(dokumentasi).set({ ...docData, updatedAt: new Date() }).where(eq(dokumentasi.id, id));
    if (images !== undefined) {
        await db.delete(dokumentasiImages).where(eq(dokumentasiImages.dokumentasiId, id));
        if (images.length > 0) {
            await db.insert(dokumentasiImages).values(images.map((img, index) => ({
                dokumentasiId: id,
                gambar: img,
                altText: docData.judul,
                order: index,
                createdAt: new Date()
            })));
        }
    }
    const item = await db.query.dokumentasi.findFirst({
        where: eq(dokumentasi.id, id),
        with: { images: true }
    });
    return c.json(item);
});
core.delete('/dokumentasi/:id', adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    await db.delete(dokumentasiImages).where(eq(dokumentasiImages.dokumentasiId, id));
    await db.delete(dokumentasi).where(eq(dokumentasi.id, id));
    return c.json({ message: 'Deleted' });
});
createSimpleCrud('jadwal-harian', jadwalHarian, createJadwalHarianSchema, updateJadwalHarianSchema, jadwalHarian.order);
createSimpleCrud('biaya-pendidikan', biayaPendidikan, createBiayaPendidikanSchema, updateBiayaPendidikanSchema, biayaPendidikan.order);
createSimpleCrud('contact-persons', contactPersons, createContactPersonSchema, updateContactPersonSchema, contactPersons.order);
createSimpleCrud('social-media', socialMedia, createSocialMediaSchema, updateSocialMediaSchema, socialMedia.order);
createSimpleCrud('seragam', seragam, createSeragamSchema, updateSeragamSchema, seragam.order);
createSimpleCrud('statistik', statistik, createStatistikSchema, updateStatistikSchema, statistik.order);
createSimpleCrud('media', media, createMediaSchema, updateMediaSchema, media.order);
createSimpleCrud('bagian-jabatan', bagianJabatan, createBagianJabatanSchema, updateBagianJabatanSchema, bagianJabatan.order);
createSimpleCrud('informasi-tambahan', informasiTambahan, createInformasiTambahanSchema, updateInformasiTambahanSchema, informasiTambahan.order);
createSimpleCrud('registration-flow', websiteRegistrationFlow, createWebsiteRegistrationFlowSchema, updateWebsiteRegistrationFlowSchema, websiteRegistrationFlow.order);
const createSingletonCrud = (path, table, updateSchema, defaultValues = {}) => {
    core.get(`/${path}`, async (c) => {
        try {
            const data = await db.select().from(table).limit(1);
            if (data.length === 0) {
                try {
                    const insertData = { ...defaultValues, updatedAt: new Date() };
                    const [newItem] = await db.insert(table).values(insertData).returning();
                    return c.json(newItem);
                }
                catch (e) {
                    console.error(`Error initializing ${path}:`, e);
                    return c.json({ ...defaultValues, updatedAt: new Date() });
                }
            }
            return c.json(data[0]);
        }
        catch (e) {
            console.error(`Core /${path} error:`, e);
            return c.json({ ...defaultValues, updatedAt: new Date() });
        }
    });
    core.put(`/${path}`, adminMiddleware, zValidator('json', updateSchema), async (c) => {
        const data = c.req.valid('json');
        const existing = await db.select().from(table).limit(1);
        if (existing.length === 0) {
            const [newItem] = await db.insert(table).values({ ...defaultValues, ...data, updatedAt: new Date() }).returning();
            return c.json(newItem);
        }
        else {
            await db.update(table)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(table.id, existing[0].id));
            const [updated] = await db.select().from(table).where(eq(table.id, existing[0].id));
            return c.json(updated);
        }
    });
};
createSingletonCrud('persyaratan', persyaratan, updatePersyaratanSchema, {
    persyaratanSantri: 'Belum diatur',
    persyaratanSantriwati: 'Belum diatur'
});
createSingletonCrud('alur-pendaftaran', alurPendaftaran, updateAlurPendaftaranSchema, {
    alurPendaftaran: 'Belum diatur',
    tahapanTes: 'Belum diatur'
});
createSingletonCrud('kmi', kmi, updateKmiSchema, {
    visiKmi: 'Belum diatur',
    profilKmi: 'Belum diatur'
});
core.get('/founders', async (c) => {
    const data = await db.select().from(founders).where(eq(founders.isDeleted, false)).orderBy(asc(founders.id));
    const publicData = data.map(f => ({
        ...f,
        nik: undefined,
        email: f.email ? decrypt(f.email) : '',
    }));
    return c.json(publicData);
});
core.get('/founders/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const [item] = await db.select().from(founders).where(eq(founders.id, id));
    if (!item || item.isDeleted)
        return c.json({ error: 'Not found' }, 404);
    return c.json({
        ...item,
        nik: undefined,
        email: item.email ? decrypt(item.email) : '',
    });
});
core.get('/admin/founders', adminMiddleware, async (c) => {
    const data = await db.select().from(founders).where(eq(founders.isDeleted, false));
    const fullData = data.map(f => ({
        ...f,
        nik: f.nik ? decrypt(f.nik) : '',
        email: f.email ? decrypt(f.email) : '',
    }));
    return c.json(fullData);
});
core.get('/admin/founders/:id', adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    const [item] = await db.select().from(founders).where(eq(founders.id, id));
    if (!item)
        return c.json({ error: 'Not found' }, 404);
    return c.json({
        ...item,
        nik: item.nik ? decrypt(item.nik) : '',
        email: item.email ? decrypt(item.email) : '',
    });
});
core.post('/admin/founders', adminMiddleware, zValidator('json', createFounderSchema), async (c) => {
    const user = c.get('user');
    const data = c.req.valid('json');
    const existing = await db.select({ count: sql `count(*)` }).from(founders).where(eq(founders.isDeleted, false));
    if (Number(existing[0]?.count) >= 5) {
        return c.json({ error: 'Maksimal 5 entri pendiri' }, 400);
    }
    const allFounders = await db.select().from(founders).where(eq(founders.isDeleted, false));
    for (const f of allFounders) {
        if (decrypt(f.nik) === data.nik)
            return c.json({ error: 'NIK sudah terdaftar' }, 400);
        if (decrypt(f.email) === data.email)
            return c.json({ error: 'Email sudah terdaftar' }, 400);
    }
    const [newItem] = await db.insert(founders).values({
        ...data,
        nik: encrypt(data.nik),
        email: encrypt(data.email),
        createdBy: user.id,
        updatedBy: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false
    }).returning();
    return c.json({
        ...newItem,
        nik: decrypt(newItem.nik),
        email: decrypt(newItem.email)
    });
});
core.put('/admin/founders/:id', adminMiddleware, zValidator('json', updateFounderSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const user = c.get('user');
    const data = c.req.valid('json');
    const [existing] = await db.select().from(founders).where(eq(founders.id, id));
    if (!existing)
        return c.json({ error: 'Not found' }, 404);
    if (data.nik || data.email) {
        const allFounders = await db.select().from(founders).where(eq(founders.isDeleted, false));
        for (const f of allFounders) {
            if (f.id === id)
                continue;
            if (data.nik && decrypt(f.nik) === data.nik)
                return c.json({ error: 'NIK sudah terdaftar' }, 400);
            if (data.email && decrypt(f.email) === data.email)
                return c.json({ error: 'Email sudah terdaftar' }, 400);
        }
    }
    const updateData = { ...data, updatedAt: new Date().toISOString(), updatedBy: user.id };
    if (data.nik)
        updateData.nik = encrypt(data.nik);
    if (data.email)
        updateData.email = encrypt(data.email);
    await db.update(founders).set(updateData).where(eq(founders.id, id));
    const [updated] = await db.select().from(founders).where(eq(founders.id, id));
    return c.json({
        ...updated,
        nik: decrypt(updated.nik),
        email: decrypt(updated.email)
    });
});
core.delete('/admin/founders/:id', adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    const user = c.get('user');
    await db.update(founders).set({
        isDeleted: true,
        updatedAt: new Date().toISOString(),
        updatedBy: user.id
    }).where(eq(founders.id, id));
    return c.json({ message: 'Deleted' });
});
export default core;
