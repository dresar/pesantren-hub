import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq, like, or, and, desc, asc, inArray, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '../../db';
import { santri, payments, users, loginHistory, notifications } from '../../db/schema';
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
  const id = parseInt(c.req.param('id'));
  const userResult = await db.select({
    id: users.id,
    username: users.username,
    email: users.email,
    firstName: users.firstName,
    lastName: users.lastName,
    role: users.role,
    isActive: users.isActive,
    createdAt: users.createdAt,
  })
  .from(users)
  .where(eq(users.id, id));
  const user = userResult[0];
  if (!user) return c.json({ error: 'User not found' }, 404);
  const history = await db.select()
    .from(loginHistory)
    .where(eq(loginHistory.userId, id))
    .orderBy(desc(loginHistory.createdAt))
    .limit(10);
  return c.json({ 
    data: {
      ...user,
      loginHistory: history
    } 
  });
});
admin.post('/users', zValidator('json', createUserSchema), async (c) => {
  const data = c.req.valid('json');
  const existing = await db.select().from(users).where(or(eq(users.username, data.username), eq(users.email, data.email))).limit(1);
  if (existing.length > 0) return c.json({ error: 'Username or email already exists' }, 400);
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const [newUser] = await db.insert(users).values({
    username: data.username,
    email: data.email,
    password: hashedPassword,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    role: data.role,
    isActive: data.isActive,
    isStaff: ['superadmin', 'admin', 'staff'].includes(data.role),
    isSuperuser: data.role === 'superadmin',
    dateJoined: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning({
    id: users.id,
    username: users.username,
    email: users.email,
    role: users.role
  });
  return c.json({ message: 'User created', data: newUser }, 201);
});
admin.put('/users/:id', zValidator('json', updateUserSchema), async (c) => {
  const id = parseInt(c.req.param('id'));
  const data = c.req.valid('json');
  const updateData: any = {
    ...data,
    updatedAt: new Date(),
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
  const id = parseInt(c.req.param('id'));
  try {
    await db.delete(loginHistory).where(eq(loginHistory.userId, id));
    await db.delete(users)
      .where(eq(users.id, id));
    return c.json({ message: 'User deleted' });
  } catch (error) {
    return c.json({ error: 'Cannot delete user. Might be referenced by other records.' }, 400);
  }
});
admin.get('/santri', zValidator('query', searchFilterSchema), async (c) => {
  const query = c.req.valid('query');
  const page = query.page || 1;
  const limit = query.limit ? Math.min(query.limit, 1000) : 20;
  const offset = (page - 1) * limit;
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
  const id = parseInt(c.req.param('id'));
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
  return c.json(newSantri, 201);
});
admin.put('/santri/:id', zValidator('json', santriRegistrationSchema.partial()), async (c) => {
  const id = parseInt(c.req.param('id'));
  const data = c.req.valid('json');
  const updateData: any = { ...data };
  if (data.tanggalLahir) {
    updateData.tanggalLahir = new Date(data.tanggalLahir);
  }
  await db.update(santri)
    .set({ ...updateData, updatedAt: new Date() })
    .where(eq(santri.id, id));
  const updatedSantri = await db.select().from(santri).where(eq(santri.id, id));
  if (updatedSantri.length === 0) {
    return c.json({ error: 'Santri not found' }, 404);
  }
  return c.json(updatedSantri[0]);
});
admin.delete('/santri/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
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
      .set({ status: 'accepted', updatedAt: new Date() })
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
    await db.update(santri)
      .set({ status: 'rejected', updatedAt: new Date() })
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
          message: 'Mohon maaf, pendaftaran Anda belum diterima. Silakan periksa kembali dokumen dan persyaratan.',
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
          tanggalLahir: item.tanggalLahir ? new Date(item.tanggalLahir) : new Date(),
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
          createdAt: new Date(),
          updatedAt: new Date(),
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
  const id = parseInt(c.req.param('id'));
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