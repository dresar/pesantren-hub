import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db } from '../../db';
import { santri, examSchedules, examResults, users, notifications } from '../../db/schema';
import { authMiddleware, AuthUser } from '../../middleware/auth';
import { santriRegistrationSchema } from './admissions.schema';
import { eq, desc, and } from 'drizzle-orm';
import { z } from 'zod';
const admissions = new Hono();
admissions.get('/public/announcements', async (c) => {
  try {
    const passedSantri = await db.query.examResults.findMany({
      where: and(
        eq(examResults.status, 'lulus'),
        eq(examResults.isPublished, true)
      ),
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
      orderBy: [desc(examResults.totalScore)]
    });
    return c.json(passedSantri);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return c.json({ error: 'Failed to fetch announcements' }, 500);
  }
});
admissions.use('*', authMiddleware);
admissions.post('/register', zValidator('json', santriRegistrationSchema), async (c) => {
  const user = c.get('user') as AuthUser;
  const data = c.req.valid('json');
  const existingSantri = await db.query.santri.findFirst({
    where: eq(santri.nisn, data.nisn),
  });
  if (existingSantri) {
    return c.json({ error: 'NISN already registered' }, 400);
  }
  const [newSantri] = await db.insert(santri).values({
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
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();
  return c.json({
    message: 'Santri registration successful',
    santri: newSantri,
  }, 201);
});
const scheduleSchema = z.object({
  santriId: z.number(),
  type: z.enum(['written', 'interview', 'quran']),
  scheduledDate: z.string(), 
  location: z.string(),
  examiner: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).default('scheduled'),
  notes: z.string().optional(),
});
admissions.get('/schedules', async (c) => {
  const user = c.get('user') as AuthUser;
  if (user.role === 'user') {
    const mySantri = await db.query.santri.findFirst({
      where: eq(santri.email, user.email)
    });
    if (!mySantri) {
      return c.json([]);
    }
    
    // Strict Access Control
    if (!['verified', 'accepted'].includes(mySantri.status)) {
      return c.json([]);
    }

    const schedules = await db.query.examSchedules.findMany({
      where: eq(examSchedules.santriId, mySantri.id),
      orderBy: [desc(examSchedules.scheduledDate)]
    });
    return c.json(schedules);
  } else {
    const schedules = await db.select({
        id: examSchedules.id,
        santriId: examSchedules.santriId,
        type: examSchedules.type,
        scheduledDate: examSchedules.scheduledDate,
        location: examSchedules.location,
        examiner: examSchedules.examiner,
        status: examSchedules.status,
        notes: examSchedules.notes,
        createdAt: examSchedules.createdAt,
        updatedAt: examSchedules.updatedAt,
        santri: {
            id: santri.id,
            namaLengkap: santri.namaLengkap,
            nisn: santri.nisn,
        }
    })
    .from(examSchedules)
    .leftJoin(santri, eq(examSchedules.santriId, santri.id))
    .orderBy(desc(examSchedules.scheduledDate));
    return c.json(schedules);
  }
});
admissions.post('/schedules', zValidator('json', scheduleSchema), async (c) => {
  const user = c.get('user') as AuthUser;
  if (!['superadmin', 'admin', 'petugaspendaftaran'].includes(user.role) && !user.isSuperuser) {
    return c.json({ error: 'Unauthorized' }, 403);
  }
  const data = c.req.valid('json');
  
  // Validate Santri Status
  const targetSantri = await db.query.santri.findFirst({
    where: eq(santri.id, data.santriId)
  });
  
  if (!targetSantri) {
    return c.json({ error: 'Santri not found' }, 404);
  }
  
  if (!['verified', 'accepted'].includes(targetSantri.status)) {
    return c.json({ error: 'Santri status must be verified to assign exam schedule' }, 400);
  }

  const [newSchedule] = await db.insert(examSchedules).values({
    ...data,
    scheduledDate: new Date(data.scheduledDate),
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();

  // Send Notification
  const targetUser = await db.query.users.findFirst({
    where: eq(users.email, targetSantri.email)
  });
  
  if (targetUser) {
    await db.insert(notifications).values({
      userId: targetUser.id,
      title: 'Jadwal Ujian Baru',
      message: `Jadwal ujian ${data.type} telah ditetapkan pada ${new Date(data.scheduledDate).toLocaleString()}`,
      type: 'info',
      isRead: false,
      createdAt: new Date(),
    });
  }

  return c.json(newSchedule, 201);
});
admissions.put('/schedules/:id', zValidator('json', scheduleSchema.partial()), async (c) => {
  const user = c.get('user') as AuthUser;
  if (!['superadmin', 'admin', 'petugaspendaftaran'].includes(user.role) && !user.isSuperuser) {
    return c.json({ error: 'Unauthorized' }, 403);
  }
  const id = parseInt(c.req.param('id'));
  const data = c.req.valid('json');
  await db.update(examSchedules).set({
    ...data,
    scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : undefined,
    updatedAt: new Date(),
  }).where(eq(examSchedules.id, id));
  return c.json({ success: true });
});
admissions.delete('/schedules/:id', async (c) => {
    const user = c.get('user') as AuthUser;
    if (!['superadmin', 'admin', 'petugaspendaftaran'].includes(user.role) && !user.isSuperuser) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    const id = parseInt(c.req.param('id'));
    await db.delete(examSchedules).where(eq(examSchedules.id, id));
    return c.json({ success: true });
});
const resultSchema = z.object({
  santriId: z.number(),
  writtenTestScore: z.number().optional(),
  interviewScore: z.number().optional(),
  quranTestScore: z.number().optional(),
  totalScore: z.number().optional(),
  status: z.enum(['lulus', 'tidak_lulus', 'pending', 'cadangan']).default('pending'),
  isPublished: z.boolean().default(false),
  notes: z.string().optional(),
});
admissions.get('/results', async (c) => {
  const user = c.get('user') as AuthUser;
  if (user.role === 'user') {
    const mySantri = await db.query.santri.findFirst({
      where: eq(santri.email, user.email)
    });
    if (!mySantri) return c.json(null);
    const result = await db.query.examResults.findFirst({
      where: and(
          eq(examResults.santriId, mySantri.id),
          eq(examResults.isPublished, true) 
      )
    });
    return c.json(result);
  } else {
    const results = await db.select({
        id: examResults.id,
        santriId: examResults.santriId,
        writtenTestScore: examResults.writtenTestScore,
        interviewScore: examResults.interviewScore,
        quranTestScore: examResults.quranTestScore,
        totalScore: examResults.totalScore,
        status: examResults.status,
        decisionDate: examResults.decisionDate,
        isPublished: examResults.isPublished,
        notes: examResults.notes,
        createdAt: examResults.createdAt,
        updatedAt: examResults.updatedAt,
        santri: {
            id: santri.id,
            namaLengkap: santri.namaLengkap,
            nisn: santri.nisn,
        }
    })
    .from(examResults)
    .leftJoin(santri, eq(examResults.santriId, santri.id))
    .orderBy(desc(examResults.totalScore));
    return c.json(results);
  }
});
admissions.post('/results', zValidator('json', resultSchema), async (c) => {
  const user = c.get('user') as AuthUser;
  if (!['superadmin', 'admin', 'petugaspendaftaran'].includes(user.role) && !user.isSuperuser) {
    return c.json({ error: 'Unauthorized' }, 403);
  }
  const data = c.req.valid('json');
  const existing = await db.query.examResults.findFirst({
    where: eq(examResults.santriId, data.santriId)
  });
  if (existing) {
    await db.update(examResults).set({
      ...data,
      decisionDate: data.status !== 'pending' ? new Date() : undefined,
      updatedAt: new Date(),
    }).where(eq(examResults.id, existing.id));
    return c.json({ message: 'Result updated' });
  } else {
    const [inserted] = await db.insert(examResults).values({
      ...data,
      decisionDate: data.status !== 'pending' ? new Date() : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return c.json({ message: 'Result created', id: inserted.id });
  }
});
export default admissions;