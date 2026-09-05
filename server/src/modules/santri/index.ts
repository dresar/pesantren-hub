import { Hono } from 'hono';
import { db } from '../../db';
import { santri, notifications, blogAnnouncements, bankAccounts, payments, users } from '../../db/schema';
import { authMiddleware, AuthUser } from '../../middleware/auth';
import { eq, desc, and } from 'drizzle-orm';
import { writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, mkdirSync } from 'fs';
const app = new Hono();
const uploadDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}
const saveFile = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const ext = extname(file.name);
  const filename = `${uuidv4()}${ext}`;
  const filepath = join(uploadDir, filename);
  await writeFile(filepath, Buffer.from(buffer));
  return `/uploads/${filename}`;
};
app.use('*', authMiddleware);
const getCurrentUser = async (id: number) => {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0];
};
const findSantriByUser = async (userRecord: { email: string; phone: string }) => {
  let record = await db.query.santri.findFirst({
    where: eq(santri.email, userRecord.email),
  });
  if (!record && userRecord.phone) {
    record = await db.query.santri.findFirst({
      where: eq(santri.noHp, userRecord.phone),
    });
  }
  return record;
};
app.get('/dashboard', async (c) => {
  const user = c.get('user') as AuthUser;
  const currentUser = await getCurrentUser(user.id);
  const existingSantri = await findSantriByUser(currentUser);
  const announcements = await db.query.blogAnnouncements.findMany({
    orderBy: [desc(blogAnnouncements.createdAt)],
    limit: 5,
  });
  let step = 0;
  let statusMessage = 'Silakan lengkapi formulir pendaftaran.';
  let status = 'draft';
  if (existingSantri) {
    status = existingSantri.status;
    if (status === 'pending' || status === 'submitted') {
      step = 1;
      statusMessage = 'Pendaftaran sedang diverifikasi.';
    } else if (status === 'verified') {
      step = 2;
      statusMessage = 'Dokumen terverifikasi. Menunggu jadwal tes.';
    } else if (status === 'accepted') {
      step = 3;
      statusMessage = 'Selamat! Anda diterima.';
    } else if (status === 'rejected') {
      step = 3;
      statusMessage = existingSantri.catatan || 'Mohon maaf, Anda belum diterima.';
    }
  }
  return c.json({
    registrationStatus: {
      status,
      message: statusMessage,
      step,
    },
    announcements: announcements.map(a => ({
      id: a.id,
      title: a.judul,
      content: a.konten,
      date: a.createdAt,
    })),
  });
});
app.get('/bank-accounts', async (c) => {
  const accounts = await db.query.bankAccounts.findMany({
    where: eq(bankAccounts.isActive, true),
    orderBy: [desc(bankAccounts.order)],
  });
  return c.json(accounts);
});
app.post('/payments', async (c) => {
  const user = c.get('user') as AuthUser;
  const currentUser = await getCurrentUser(user.id);
  const body = await c.req.parseBody();
  const existingSantri = await findSantriByUser(currentUser);
  if (!existingSantri) {
    return c.json({ error: 'Data santri tidak ditemukan.' }, 404);
  }
  let buktiTransferUrl = '';
  if (body['buktiTransfer'] instanceof File) {
    buktiTransferUrl = await saveFile(body['buktiTransfer']);
  } else {
    return c.json({ error: 'Bukti transfer wajib diupload.' }, 400);
  }
  try {
    await db.insert(payments).values({
      bankPengirim: body['bankPengirim'] as string,
      noRekeningPengirim: body['noRekeningPengirim'] as string,
      namaPemilikRekening: body['namaPemilikRekening'] as string,
      rekeningTujuan: body['rekeningTujuan'] as string,
      jumlahTransfer: body['jumlahTransfer'] as string,
      buktiTransfer: buktiTransferUrl,
      status: 'pending',
      catatan: body['catatan'] as string || '-',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      santriId: existingSantri.id,
    });
    await db.insert(notifications).values({
      userId: currentUser.id,
      title: 'Bukti Pembayaran Diterima',
      message: 'Bukti pembayaran Anda berhasil dikirim dan sedang diverifikasi.',
      type: 'info',
      isRead: false,
      actionUrl: '/app/pembayaran',
      createdAt: new Date().toISOString(),
    });
    return c.json({ message: 'Bukti pembayaran berhasil dikirim!' });
  } catch (error) {
    console.error('Payment upload error:', error);
    return c.json({ error: 'Gagal menyimpan bukti pembayaran.' }, 500);
  }
});
app.get('/registration-status', async (c) => {
  const user = c.get('user') as AuthUser;
  const currentUser = await getCurrentUser(user.id);
  const existingSantri = await findSantriByUser(currentUser);
  if (!existingSantri) {
    return c.json({
      status: 'draft',
      accountCreatedDate: currentUser.createdAt,
      summary: [
        { label: 'Nama Lengkap', value: currentUser.username },
        { label: 'Email', value: currentUser.email },
      ],
    });
  }
  let step = 0;
  let statusMessage = 'Silakan lengkapi formulir pendaftaran.';
  const status = existingSantri.status;
  if (status === 'pending' || status === 'submitted') {
    step = 1;
    statusMessage = 'Pendaftaran sedang diverifikasi.';
  } else if (status === 'verified') {
    step = 2;
    statusMessage = 'Dokumen terverifikasi. Menunggu jadwal tes.';
  } else if (status === 'accepted') {
    step = 3;
    statusMessage = 'Selamat! Anda diterima.';
  } else if (status === 'rejected') {
    step = 3;
    statusMessage = existingSantri.catatan || 'Mohon maaf, Anda belum diterima.';
  }
  let paymentStatus = 'unpaid';
  let paymentDate = null;
  try {
    const payment = await db.query.payments.findFirst({
        where: eq(payments.santriId, existingSantri.id)
    });
    if (payment) {
        paymentStatus = payment.status;
        paymentDate = payment.createdAt;
    }
  } catch (e) {
    console.error('Error fetching payment:', e);
  }
  return c.json({
    status: existingSantri.status,
    message: statusMessage,
    step,
    paymentStatus, 
    accountCreatedDate: currentUser.createdAt || new Date().toISOString(),
    formSubmittedDate: existingSantri.createdAt,
    paymentDate,
    verifiedDate: existingSantri.updatedAt,
    interviewDate: null,
    acceptedDate: null,
    summary: [
      { label: 'Nama Lengkap', value: existingSantri.namaLengkap },
      { label: 'NISN', value: existingSantri.nisn },
      { label: 'Asal Sekolah', value: existingSantri.asalSekolah },
      { label: 'Status Pendaftaran', value: existingSantri.status },
      { label: 'Status Pembayaran', value: paymentStatus },
    ],
  });
});
app.get('/payment', async (c) => {
  const user = c.get('user') as AuthUser;
  const currentUser = await getCurrentUser(user.id);
  const existingSantri = await findSantriByUser(currentUser);
  if (!existingSantri) {
    return c.json({ error: 'Santri not found' }, 404);
  }
  const payment = await db.query.payments.findFirst({
    where: eq(payments.santriId, existingSantri.id),
    orderBy: [desc(payments.createdAt)],
  });
  if (!payment) {
    return c.json({ data: null });
  }
  return c.json({
    data: {
      id: payment.id,
      bank_pengirim: payment.bankPengirim,
      no_rekening_pengirim: payment.noRekeningPengirim,
      nama_pemilik_rekening: payment.namaPemilikRekening,
      rekening_tujuan: payment.rekeningTujuan,
      jumlah_transfer: payment.jumlahTransfer,
      bukti_transfer: payment.buktiTransfer,
      status: payment.status,
      catatan: payment.catatan,
      created_at: payment.createdAt,
      verified_at: payment.verifiedAt,
    }
  });
});
app.post('/registration', async (c) => {
  const user = c.get('user') as AuthUser;
  const currentUser = await getCurrentUser(user.id);
  const body = await c.req.parseBody();
  const nisnRaw = String(body['nisn'] || '');
  const existingSantri = await findSantriByUser(currentUser);
  
  // Strict NISN validation only for NEW registrations
  if (!existingSantri && !/^\d{10}$/.test(nisnRaw)) {
    return c.json({ error: 'NISN harus tepat 10 digit angka.' }, 400);
  }

  const isDraft = body['isDraft'] === 'true';
  const newStatus = isDraft ? 'draft' : 'submitted';

  if (existingSantri) {
    if (existingSantri.status !== 'draft' && existingSantri.status !== 'rejected') {
       return c.json({ error: 'Pendaftaran Anda sedang diproses atau sudah diterima.' }, 400);
    }
    
    // Allow update if draft or rejected (re-submission)
    // Handle file uploads (only update if new file provided)
    let fotoSantriUrl = existingSantri.fotoSantri;
    let fotoKkUrl = existingSantri.fotoKk;
    let fotoAktaUrl = existingSantri.fotoAkta;
    let fotoIjazahUrl = existingSantri.fotoIjazah;

    if (body['fotoSantri'] instanceof File) fotoSantriUrl = await saveFile(body['fotoSantri']);
    if (body['fotoKk'] instanceof File) fotoKkUrl = await saveFile(body['fotoKk']);
    if (body['fotoAkta'] instanceof File) fotoAktaUrl = await saveFile(body['fotoAkta']);
    if (body['fotoIjazah'] instanceof File) fotoIjazahUrl = await saveFile(body['fotoIjazah']);

    const updateData = {
        namaLengkap: body['namaLengkap'] as string || existingSantri.namaLengkap,
        nisn: nisnRaw || existingSantri.nisn,
        tempatLahir: body['tempatLahir'] as string || existingSantri.tempatLahir,
        tanggalLahir: body['tanggalLahir'] as string || existingSantri.tanggalLahir,
        jenisKelamin: (body['jenisKelamin'] as string) === 'laki-laki' ? 'L' : (body['jenisKelamin'] as string) === 'perempuan' ? 'P' : (body['jenisKelamin'] as string || existingSantri.jenisKelamin),
        agama: body['agama'] as string || existingSantri.agama,
        golonganDarah: body['golonganDarah'] as string || existingSantri.golonganDarah,
        namaAyah: body['namaAyah'] as string || existingSantri.namaAyah,
        nikAyah: body['nikAyah'] as string || existingSantri.nikAyah,
        namaIbu: body['namaIbu'] as string || existingSantri.namaIbu,
        nikIbu: body['nikIbu'] as string || existingSantri.nikIbu,
        pekerjaanAyah: body['pekerjaanAyah'] as string || existingSantri.pekerjaanAyah,
        pekerjaanIbu: body['pekerjaanIbu'] as string || existingSantri.pekerjaanIbu,
        noHpAyah: body['noHpAyah'] as string || body['noWhatsapp'] as string || existingSantri.noHpAyah,
        noHpIbu: body['noHpIbu'] as string || body['noWhatsapp'] as string || existingSantri.noHpIbu,
        alamatOrangTua: body['alamatOrangTua'] as string || existingSantri.alamatOrangTua,
        alamat: body['alamat'] as string || existingSantri.alamat,
        noHp: body['noWhatsapp'] as string || existingSantri.noHp,
        asalSekolah: body['namaSekolah'] as string || existingSantri.asalSekolah,
        kelasTerakhir: body['kelasTerakhir'] as string || existingSantri.kelasTerakhir,
        tahunLulus: body['tahunLulus'] as string || existingSantri.tahunLulus,
        noIjazah: body['noIjazah'] as string || existingSantri.noIjazah,
        fotoSantri: fotoSantriUrl,
        fotoKk: fotoKkUrl,
        fotoAkta: fotoAktaUrl,
        fotoIjazah: fotoIjazahUrl,
        agamaAyah: body['agama'] as string || existingSantri.agamaAyah,
        agamaIbu: body['agama'] as string || existingSantri.agamaIbu,
        bahasaSehariHari: body['bahasaSehariHari'] as string || existingSantri.bahasaSehariHari,
        desa: body['desa'] as string || existingSantri.desa,
        kabupaten: body['kabupaten'] as string || existingSantri.kabupaten,
        kecamatan: body['kecamatan'] as string || existingSantri.kecamatan,
        kewarganegaraan: body['kewarganegaraan'] as string || existingSantri.kewarganegaraan,
        kodePos: body['kodePos'] as string || existingSantri.kodePos,
        namaPanggilan: body['namaPanggilan'] as string || existingSantri.namaPanggilan,
        npsnSekolah: body['npsnSekolah'] as string || existingSantri.npsnSekolah,
        pendidikanAyah: body['pendidikanAyah'] as string || existingSantri.pendidikanAyah,
        pendidikanIbu: body['pendidikanIbu'] as string || existingSantri.pendidikanIbu,
        penghasilanAyah: body['penghasilanAyah'] as string || existingSantri.penghasilanAyah,
        penghasilanIbu: body['penghasilanIbu'] as string || existingSantri.penghasilanIbu,
        provinsi: body['provinsi'] as string || existingSantri.provinsi,
        riwayatPenyakit: body['riwayatPenyakit'] as string || existingSantri.riwayatPenyakit,
        statusAyah: body['statusAyah'] as string || existingSantri.statusAyah,
        statusIbu: body['statusIbu'] as string || existingSantri.statusIbu,
        tinggalDengan: body['tinggalDengan'] as string || existingSantri.tinggalDengan,
        anakKe: body['anakKe'] ? parseInt(body['anakKe'] as string) : existingSantri.anakKe,
        jumlahSaudara: body['jumlahSaudara'] ? parseInt(body['jumlahSaudara'] as string) : existingSantri.jumlahSaudara,
        tinggiBadan: body['tinggiBadan'] ? parseInt(body['tinggiBadan'] as string) : existingSantri.tinggiBadan,
        beratBadan: body['beratBadan'] ? parseInt(body['beratBadan'] as string) : existingSantri.beratBadan,
        status: newStatus,
        catatan: body['prestasi'] || body['hobi'] ? `Prestasi: ${body['prestasi'] || '-'}\nHobi: ${body['hobi'] || '-'}\nKeahlian: ${body['keahlian'] || '-'}\nCatatan Lain: ${body['catatan'] || '-'}` : existingSantri.catatan,
        updatedAt: new Date().toISOString(),
    };

    await db.update(santri).set(updateData).where(eq(santri.id, existingSantri.id));
    
    if (newStatus === 'submitted') {
        await db.insert(notifications).values({
            userId: currentUser.id,
            title: 'Pendaftaran Terkirim',
            message: 'Form pendaftaran berhasil dikirim. Status Anda sekarang pending dan menunggu verifikasi.',
            type: 'info',
            isRead: false,
            actionUrl: '/app/status',
            createdAt: new Date().toISOString(),
        });
        return c.json({ message: 'Pendaftaran berhasil dikirim!' });
    } else {
        return c.json({ message: 'Draft berhasil disimpan.' });
    }
  }

  const duplicateNisn = await db.query.santri.findFirst({
    where: eq(santri.nisn, nisnRaw),
  });
  if (duplicateNisn) {
    return c.json({ error: 'NISN sudah terdaftar. Silakan periksa kembali.' }, 400);
  }
  let fotoSantriUrl = '';
  let fotoKkUrl = '';
  let fotoAktaUrl = '';
  let fotoIjazahUrl = '';
  if (body['fotoSantri'] instanceof File) fotoSantriUrl = await saveFile(body['fotoSantri']);
  if (body['fotoKk'] instanceof File) fotoKkUrl = await saveFile(body['fotoKk']);
  if (body['fotoAkta'] instanceof File) fotoAktaUrl = await saveFile(body['fotoAkta']);
  if (body['fotoIjazah'] instanceof File) fotoIjazahUrl = await saveFile(body['fotoIjazah']);
  const data = {
    namaLengkap: body['namaLengkap'] as string || user.username,
    nisn: nisnRaw,
    tempatLahir: body['tempatLahir'] as string || '-',
    tanggalLahir: body['tanggalLahir'] as string || new Date().toISOString().split('T')[0],
    jenisKelamin: (body['jenisKelamin'] as string) === 'laki-laki' ? 'L' : (body['jenisKelamin'] as string) === 'perempuan' ? 'P' : (body['jenisKelamin'] as string || 'L'),
    agama: body['agama'] as string || 'Islam',  
    golonganDarah: body['golonganDarah'] as string || '-', 
    namaAyah: body['namaAyah'] as string || '-',
    nikAyah: body['nikAyah'] as string || '-', 
    namaIbu: body['namaIbu'] as string || '-',
    nikIbu: body['nikIbu'] as string || '-', 
    pekerjaanAyah: body['pekerjaanAyah'] as string || '-',
    pekerjaanIbu: body['pekerjaanIbu'] as string || '-',
    noHpAyah: body['noHpAyah'] as string || body['noWhatsapp'] as string || '-',
    noHpIbu: body['noHpIbu'] as string || body['noWhatsapp'] as string || '-', 
    alamatOrangTua: body['alamatOrangTua'] as string || '-',
    alamat: body['alamat'] as string || '-',
    noHp: body['noWhatsapp'] as string || '-',
    email: currentUser.email, 
    asalSekolah: body['namaSekolah'] as string || '-',
    kelasTerakhir: body['kelasTerakhir'] as string || '6 SD', 
    tahunLulus: body['tahunLulus'] as string || new Date().getFullYear().toString(),
    noIjazah: body['noIjazah'] as string || '-', 
    fotoSantri: fotoSantriUrl,
    fotoKk: fotoKkUrl,
    fotoAkta: fotoAktaUrl,
    fotoIjazah: fotoIjazahUrl,
    agamaAyah: body['agama'] as string || 'Islam',
    agamaIbu: body['agama'] as string || 'Islam',
    bahasaSehariHari: body['bahasaSehariHari'] as string || 'Indonesia',
    desa: body['desa'] as string || '-',
    kabupaten: body['kabupaten'] as string || '-',
    kecamatan: body['kecamatan'] as string || '-',
    kelasDiterima: '-',
    kewarganegaraan: body['kewarganegaraan'] as string || 'WNI',
    kewarganegaraanAyah: 'WNI',
    kewarganegaraanIbu: 'WNI',
    kodePos: body['kodePos'] as string || '-',
    namaPanggilan: body['namaPanggilan'] as string || '-',
    npsnSekolah: body['npsnSekolah'] as string || '-',
    pendidikanAyah: body['pendidikanAyah'] as string || '-',
    pendidikanIbu: body['pendidikanIbu'] as string || '-',
    penghasilanAyah: body['penghasilanAyah'] as string || '-',
    penghasilanIbu: body['penghasilanIbu'] as string || '-',
    provinsi: body['provinsi'] as string || '-',
    riwayatPenyakit: body['riwayatPenyakit'] as string || '-',
    statusAyah: body['statusAyah'] as string || 'Hidup',
    statusIbu: body['statusIbu'] as string || 'Hidup',
    tempatLahirAyah: '-',
    tempatLahirIbu: '-',
    tinggalDengan: body['tinggalDengan'] as string || 'Orang Tua',
    anakKe: body['anakKe'] ? parseInt(body['anakKe'] as string) : undefined,
    jumlahSaudara: body['jumlahSaudara'] ? parseInt(body['jumlahSaudara'] as string) : undefined,
    tinggiBadan: body['tinggiBadan'] ? parseInt(body['tinggiBadan'] as string) : undefined,
    beratBadan: body['beratBadan'] ? parseInt(body['beratBadan'] as string) : undefined,
    status: newStatus,
    fotoSantriApproved: false,
    fotoKtpApproved: false,
    fotoAktaApproved: false,
    fotoIjazahApproved: false,
    suratSehatApproved: false,
    catatan: `Prestasi: ${body['prestasi'] || '-'}\nHobi: ${body['hobi'] || '-'}\nKeahlian: ${body['keahlian'] || '-'}\nCatatan Lain: ${body['catatan'] || '-'}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  try {
    await db.insert(santri).values(data);
    if (newStatus === 'submitted') {
        await db.insert(notifications).values({
            userId: currentUser.id,
            title: 'Pendaftaran Terkirim',
            message: 'Form pendaftaran berhasil dikirim. Status Anda sekarang pending dan menunggu verifikasi.',
            type: 'info',
            isRead: false,
            actionUrl: '/app/status',
            createdAt: new Date().toISOString(),
        });
        return c.json({ message: 'Pendaftaran berhasil dikirim!' });
    } else {
        return c.json({ message: 'Draft berhasil disimpan.' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Gagal menyimpan data pendaftaran.' }, 500);
  }
});
app.get('/notifications', async (c) => {
  const user = c.get('user') as AuthUser;
  const userNotifications = await db.query.notifications.findMany({
    where: eq(notifications.userId, user.id),
    orderBy: [desc(notifications.createdAt)],
  });
  return c.json(userNotifications.map(n => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    read: n.isRead,
    date: n.createdAt,
  })));
});
app.get('/schedule', async (c) => {
  return c.json([
    { time: '07:00 - 08:00', activity: 'Tahfidz Al-Quran', type: 'ibadah', day: 'Senin' },
    { time: '08:00 - 09:30', activity: 'Matematika', type: 'akademik', day: 'Senin' },
    { time: '09:30 - 10:00', activity: 'Istirahat', type: 'istirahat', day: 'Senin' },
    { time: '10:00 - 11:30', activity: 'Bahasa Arab', type: 'akademik', day: 'Senin' },
  ]);
});
export default app;
