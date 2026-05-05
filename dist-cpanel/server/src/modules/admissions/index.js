"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const auth_1 = require("../../middleware/auth");
const admissions_schema_1 = require("./admissions.schema");
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
const admissions = new hono_1.Hono();
admissions.get('/public/announcements', async (c) => {
    try {
        const passedSantri = await db_1.db.query.examResults.findMany({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.examResults.status, 'lulus'), (0, drizzle_orm_1.eq)(schema_1.examResults.isPublished, true)),
            with: {
                santri: {
                    columns: {
                        namaLengkap: true,
                        nisn: true,
                        asalSekolah: true,
                        fotoSantri: true,
                    }
                }
            },
            orderBy: [(0, drizzle_orm_1.desc)(schema_1.examResults.totalScore)]
        });
        return c.json(passedSantri);
    }
    catch (error) {
        console.error('Error fetching announcements:', error);
        return c.json({ error: 'Failed to fetch announcements' }, 500);
    }
});
admissions.use('*', auth_1.authMiddleware);
admissions.post('/register', (0, zod_validator_1.zValidator)('json', admissions_schema_1.santriRegistrationSchema), async (c) => {
    const user = c.get('user');
    const data = c.req.valid('json');
    const existingSantri = await db_1.db.query.santri.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.santri.nisn, data.nisn),
    });
    if (existingSantri) {
        return c.json({ error: 'NISN already registered' }, 400);
    }
    const [newSantri] = await db_1.db.insert(schema_1.santri).values({
        ...data,
        status: 'pending',
        tanggalLahir: new Date(data.tanggalLahir),
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
    return c.json({
        message: 'Santri registration successful',
        santri: newSantri,
    }, 201);
});
const scheduleSchema = zod_1.z.object({
    santriId: zod_1.z.number(),
    type: zod_1.z.enum(['written', 'interview', 'quran']),
    scheduledDate: zod_1.z.string(),
    location: zod_1.z.string(),
    examiner: zod_1.z.string().optional(),
    status: zod_1.z.enum(['scheduled', 'completed', 'cancelled']).default('scheduled'),
    notes: zod_1.z.string().optional(),
});
admissions.get('/schedules', async (c) => {
    const user = c.get('user');
    if (user.role === 'user') {
        const mySantri = await db_1.db.query.santri.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.santri.email, user.email)
        });
        if (!mySantri) {
            return c.json([]);
        }
        // Strict Access Control
        if (!['verified', 'accepted'].includes(mySantri.status)) {
            return c.json([]);
        }
        const schedules = await db_1.db.query.examSchedules.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.examSchedules.santriId, mySantri.id),
            orderBy: [(0, drizzle_orm_1.desc)(schema_1.examSchedules.scheduledDate)]
        });
        return c.json(schedules);
    }
    else {
        const schedules = await db_1.db.select({
            id: schema_1.examSchedules.id,
            santriId: schema_1.examSchedules.santriId,
            type: schema_1.examSchedules.type,
            scheduledDate: schema_1.examSchedules.scheduledDate,
            location: schema_1.examSchedules.location,
            examiner: schema_1.examSchedules.examiner,
            status: schema_1.examSchedules.status,
            notes: schema_1.examSchedules.notes,
            createdAt: schema_1.examSchedules.createdAt,
            updatedAt: schema_1.examSchedules.updatedAt,
            santri: {
                id: schema_1.santri.id,
                namaLengkap: schema_1.santri.namaLengkap,
                nisn: schema_1.santri.nisn,
            }
        })
            .from(schema_1.examSchedules)
            .leftJoin(schema_1.santri, (0, drizzle_orm_1.eq)(schema_1.examSchedules.santriId, schema_1.santri.id))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.examSchedules.scheduledDate));
        return c.json(schedules);
    }
});
admissions.post('/schedules', (0, zod_validator_1.zValidator)('json', scheduleSchema), async (c) => {
    const user = c.get('user');
    if (!['superadmin', 'admin', 'petugaspendaftaran'].includes(user.role) && !user.isSuperuser) {
        return c.json({ error: 'Unauthorized' }, 403);
    }
    const data = c.req.valid('json');
    // Validate Santri Status
    const targetSantri = await db_1.db.query.santri.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.santri.id, data.santriId)
    });
    if (!targetSantri) {
        return c.json({ error: 'Santri not found' }, 404);
    }
    if (!['verified', 'accepted'].includes(targetSantri.status)) {
        return c.json({ error: 'Santri status must be verified to assign exam schedule' }, 400);
    }
    const [newSchedule] = await db_1.db.insert(schema_1.examSchedules).values({
        ...data,
        scheduledDate: new Date(data.scheduledDate).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }).returning();
    // Send Notification
    const targetUser = await db_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.email, targetSantri.email)
    });
    if (targetUser) {
        await db_1.db.insert(schema_1.notifications).values({
            userId: targetUser.id,
            title: 'Jadwal Ujian Baru',
            message: `Jadwal ujian ${data.type} telah ditetapkan pada ${new Date(data.scheduledDate).toLocaleString()}`,
            type: 'info',
            isRead: false,
            createdAt: new Date().toISOString(),
        });
    }
    return c.json(newSchedule, 201);
});
admissions.put('/schedules/:id', (0, zod_validator_1.zValidator)('json', scheduleSchema.partial()), async (c) => {
    const user = c.get('user');
    if (!['superadmin', 'admin', 'petugaspendaftaran'].includes(user.role) && !user.isSuperuser) {
        return c.json({ error: 'Unauthorized' }, 403);
    }
    const id = parseInt(c.req.param('id'));
    const data = c.req.valid('json');
    await db_1.db.update(schema_1.examSchedules).set({
        ...data,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate).toISOString() : undefined,
        updatedAt: new Date().toISOString(),
    }).where((0, drizzle_orm_1.eq)(schema_1.examSchedules.id, id));
    return c.json({ success: true });
});
admissions.delete('/schedules/:id', async (c) => {
    const user = c.get('user');
    if (!['superadmin', 'admin', 'petugaspendaftaran'].includes(user.role) && !user.isSuperuser) {
        return c.json({ error: 'Unauthorized' }, 403);
    }
    const id = parseInt(c.req.param('id'));
    await db_1.db.delete(schema_1.examSchedules).where((0, drizzle_orm_1.eq)(schema_1.examSchedules.id, id));
    return c.json({ success: true });
});
const resultSchema = zod_1.z.object({
    santriId: zod_1.z.number(),
    writtenTestScore: zod_1.z.number().optional(),
    interviewScore: zod_1.z.number().optional(),
    quranTestScore: zod_1.z.number().optional(),
    totalScore: zod_1.z.number().optional(),
    status: zod_1.z.enum(['lulus', 'tidak_lulus', 'pending', 'cadangan']).default('pending'),
    isPublished: zod_1.z.boolean().default(false),
    notes: zod_1.z.string().optional(),
});
admissions.get('/results', async (c) => {
    const user = c.get('user');
    if (user.role === 'user') {
        const mySantri = await db_1.db.query.santri.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.santri.email, user.email)
        });
        if (!mySantri)
            return c.json(null);
        const result = await db_1.db.query.examResults.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.examResults.santriId, mySantri.id), (0, drizzle_orm_1.eq)(schema_1.examResults.isPublished, true))
        });
        return c.json(result);
    }
    else {
        const results = await db_1.db.select({
            id: schema_1.examResults.id,
            santriId: schema_1.examResults.santriId,
            writtenTestScore: schema_1.examResults.writtenTestScore,
            interviewScore: schema_1.examResults.interviewScore,
            quranTestScore: schema_1.examResults.quranTestScore,
            totalScore: schema_1.examResults.totalScore,
            status: schema_1.examResults.status,
            decisionDate: schema_1.examResults.decisionDate,
            isPublished: schema_1.examResults.isPublished,
            notes: schema_1.examResults.notes,
            createdAt: schema_1.examResults.createdAt,
            updatedAt: schema_1.examResults.updatedAt,
            santri: {
                id: schema_1.santri.id,
                namaLengkap: schema_1.santri.namaLengkap,
                nisn: schema_1.santri.nisn,
            }
        })
            .from(schema_1.examResults)
            .leftJoin(schema_1.santri, (0, drizzle_orm_1.eq)(schema_1.examResults.santriId, schema_1.santri.id))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.examResults.totalScore));
        return c.json(results);
    }
});
admissions.post('/results', (0, zod_validator_1.zValidator)('json', resultSchema), async (c) => {
    const user = c.get('user');
    if (!['superadmin', 'admin', 'petugaspendaftaran'].includes(user.role) && !user.isSuperuser) {
        return c.json({ error: 'Unauthorized' }, 403);
    }
    const data = c.req.valid('json');
    const existing = await db_1.db.query.examResults.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.examResults.santriId, data.santriId)
    });
    if (existing) {
        await db_1.db.update(schema_1.examResults).set({
            ...data,
            decisionDate: data.status !== 'pending' ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString(),
        }).where((0, drizzle_orm_1.eq)(schema_1.examResults.id, existing.id));
        return c.json({ message: 'Result updated' });
    }
    else {
        const [inserted] = await db_1.db.insert(schema_1.examResults).values({
            ...data,
            decisionDate: data.status !== 'pending' ? new Date().toISOString() : undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }).returning();
        return c.json({ message: 'Result created', id: inserted.id });
    }
});
exports.default = admissions;
