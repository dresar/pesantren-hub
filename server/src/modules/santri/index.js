import { Hono } from 'hono';
import { db } from '../../db';
import { santri, notifications, blogAnnouncements, bankAccounts, payments, users } from '../../db/schema';
import { authMiddleware } from '../../middleware/auth';
import { eq, desc } from 'drizzle-orm';
import { writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, mkdirSync } from 'fs';
const app = new Hono();
const uploadDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
}
const saveFile = async (file) => {
    const buffer = await file.arrayBuffer();
    const ext = extname(file.name);
    const filename = `${uuidv4()}${ext}`;
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, Buffer.from(buffer));
    return `/uploads/${filename}`;
};
app.use('*', authMiddleware);
const getCurrentUser = async (id) => {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
};
const findSantriByUser = async (userRecord) => {
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
    const user = c.get('user');
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
        }
        else if (status === 'verified') {
            step = 2;
            statusMessage = 'Dokumen terverifikasi. Menunggu jadwal tes.';
        }
        else if (status === 'accepted') {
            step = 3;
            statusMessage = 'Selamat! Anda diterima.';
        }
        else if (status === 'rejected') {
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
    const user = c.get('user');
    const currentUser = await getCurrentUser(user.id);
    const body = await c.req.parseBody();
    const existingSantri = await findSantriByUser(currentUser);
    if (!existingSantri) {
        return c.json({ error: 'Data santri tidak ditemukan.' }, 404);
    }
    let buktiTransferUrl = '';
    if (body['buktiTransfer'] instanceof File) {
        buktiTransferUrl = await saveFile(body['buktiTransfer']);
    }
    else {
        return c.json({ error: 'Bukti transfer wajib diupload.' }, 400);
    }
    try {
        await db.insert(payments).values({
            bankPengirim: body['bankPengirim'],
            noRekeningPengirim: body['noRekeningPengirim'],
            namaPemilikRekening: body['namaPemilikRekening'],
            rekeningTujuan: body['rekeningTujuan'],
            jumlahTransfer: body['jumlahTransfer'],
            buktiTransfer: buktiTransferUrl,
            status: 'pending',
            catatan: body['catatan'] || '-',
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
    }
    catch (error) {
        console.error('Payment upload error:', error);
        return c.json({ error: 'Gagal menyimpan bukti pembayaran.' }, 500);
    }
});
app.get('/registration-status', async (c) => {
    const user = c.get('user');
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
    }
    else if (status === 'verified') {
        step = 2;
        statusMessage = 'Dokumen terverifikasi. Menunggu jadwal tes.';
    }
    else if (status === 'accepted') {
        step = 3;
        statusMessage = 'Selamat! Anda diterima.';
    }
    else if (status === 'rejected') {
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
    }
    catch (e) {
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
    const user = c.get('user');
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
    const user = c.get('user');
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
        if (body['fotoSantri'] instanceof File)
            fotoSantriUrl = await saveFile(body['fotoSantri']);
        if (body['fotoKk'] instanceof File)
            fotoKkUrl = await saveFile(body['fotoKk']);
        if (body['fotoAkta'] instanceof File)
            fotoAktaUrl = await saveFile(body['fotoAkta']);
        if (body['fotoIjazah'] instanceof File)
            fotoIjazahUrl = await saveFile(body['fotoIjazah']);
        const updateData = {
            namaLengkap: body['namaLengkap'] || existingSantri.namaLengkap,
            nisn: nisnRaw || existingSantri.nisn,
            tempatLahir: body['tempatLahir'] || existingSantri.tempatLahir,
            tanggalLahir: body['tanggalLahir'] || existingSantri.tanggalLahir,
            jenisKelamin: body['jenisKelamin'] === 'laki-laki' ? 'L' : body['jenisKelamin'] === 'perempuan' ? 'P' : (body['jenisKelamin'] || existingSantri.jenisKelamin),
            agama: body['agama'] || existingSantri.agama,
            golonganDarah: body['golonganDarah'] || existingSantri.golonganDarah,
            namaAyah: body['namaAyah'] || existingSantri.namaAyah,
            nikAyah: body['nikAyah'] || existingSantri.nikAyah,
            namaIbu: body['namaIbu'] || existingSantri.namaIbu,
            nikIbu: body['nikIbu'] || existingSantri.nikIbu,
            pekerjaanAyah: body['pekerjaanAyah'] || existingSantri.pekerjaanAyah,
            pekerjaanIbu: body['pekerjaanIbu'] || existingSantri.pekerjaanIbu,
            noHpAyah: body['noHpAyah'] || body['noWhatsapp'] || existingSantri.noHpAyah,
            noHpIbu: body['noHpIbu'] || body['noWhatsapp'] || existingSantri.noHpIbu,
            alamatOrangTua: body['alamatOrangTua'] || existingSantri.alamatOrangTua,
            alamat: body['alamat'] || existingSantri.alamat,
            noHp: body['noWhatsapp'] || existingSantri.noHp,
            asalSekolah: body['namaSekolah'] || existingSantri.asalSekolah,
            kelasTerakhir: body['kelasTerakhir'] || existingSantri.kelasTerakhir,
            tahunLulus: body['tahunLulus'] || existingSantri.tahunLulus,
            noIjazah: body['noIjazah'] || existingSantri.noIjazah,
            fotoSantri: fotoSantriUrl,
            fotoKk: fotoKkUrl,
            fotoAkta: fotoAktaUrl,
            fotoIjazah: fotoIjazahUrl,
            agamaAyah: body['agama'] || existingSantri.agamaAyah,
            agamaIbu: body['agama'] || existingSantri.agamaIbu,
            bahasaSehariHari: body['bahasaSehariHari'] || existingSantri.bahasaSehariHari,
            desa: body['desa'] || existingSantri.desa,
            kabupaten: body['kabupaten'] || existingSantri.kabupaten,
            kecamatan: body['kecamatan'] || existingSantri.kecamatan,
            kewarganegaraan: body['kewarganegaraan'] || existingSantri.kewarganegaraan,
            kodePos: body['kodePos'] || existingSantri.kodePos,
            namaPanggilan: body['namaPanggilan'] || existingSantri.namaPanggilan,
            npsnSekolah: body['npsnSekolah'] || existingSantri.npsnSekolah,
            pendidikanAyah: body['pendidikanAyah'] || existingSantri.pendidikanAyah,
            pendidikanIbu: body['pendidikanIbu'] || existingSantri.pendidikanIbu,
            penghasilanAyah: body['penghasilanAyah'] || existingSantri.penghasilanAyah,
            penghasilanIbu: body['penghasilanIbu'] || existingSantri.penghasilanIbu,
            provinsi: body['provinsi'] || existingSantri.provinsi,
            riwayatPenyakit: body['riwayatPenyakit'] || existingSantri.riwayatPenyakit,
            statusAyah: body['statusAyah'] || existingSantri.statusAyah,
            statusIbu: body['statusIbu'] || existingSantri.statusIbu,
            tinggalDengan: body['tinggalDengan'] || existingSantri.tinggalDengan,
            anakKe: body['anakKe'] ? parseInt(body['anakKe']) : existingSantri.anakKe,
            jumlahSaudara: body['jumlahSaudara'] ? parseInt(body['jumlahSaudara']) : existingSantri.jumlahSaudara,
            tinggiBadan: body['tinggiBadan'] ? parseInt(body['tinggiBadan']) : existingSantri.tinggiBadan,
            beratBadan: body['beratBadan'] ? parseInt(body['beratBadan']) : existingSantri.beratBadan,
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
        }
        else {
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
    if (body['fotoSantri'] instanceof File)
        fotoSantriUrl = await saveFile(body['fotoSantri']);
    if (body['fotoKk'] instanceof File)
        fotoKkUrl = await saveFile(body['fotoKk']);
    if (body['fotoAkta'] instanceof File)
        fotoAktaUrl = await saveFile(body['fotoAkta']);
    if (body['fotoIjazah'] instanceof File)
        fotoIjazahUrl = await saveFile(body['fotoIjazah']);
    const data = {
        namaLengkap: body['namaLengkap'] || user.username,
        nisn: nisnRaw,
        tempatLahir: body['tempatLahir'] || '-',
        tanggalLahir: body['tanggalLahir'] || new Date().toISOString().split('T')[0],
        jenisKelamin: body['jenisKelamin'] === 'laki-laki' ? 'L' : body['jenisKelamin'] === 'perempuan' ? 'P' : (body['jenisKelamin'] || 'L'),
        agama: body['agama'] || 'Islam',
        golonganDarah: body['golonganDarah'] || '-',
        namaAyah: body['namaAyah'] || '-',
        nikAyah: body['nikAyah'] || '-',
        namaIbu: body['namaIbu'] || '-',
        nikIbu: body['nikIbu'] || '-',
        pekerjaanAyah: body['pekerjaanAyah'] || '-',
        pekerjaanIbu: body['pekerjaanIbu'] || '-',
        noHpAyah: body['noHpAyah'] || body['noWhatsapp'] || '-',
        noHpIbu: body['noHpIbu'] || body['noWhatsapp'] || '-',
        alamatOrangTua: body['alamatOrangTua'] || '-',
        alamat: body['alamat'] || '-',
        noHp: body['noWhatsapp'] || '-',
        email: currentUser.email,
        asalSekolah: body['namaSekolah'] || '-',
        kelasTerakhir: body['kelasTerakhir'] || '6 SD',
        tahunLulus: body['tahunLulus'] || new Date().getFullYear().toString(),
        noIjazah: body['noIjazah'] || '-',
        fotoSantri: fotoSantriUrl,
        fotoKk: fotoKkUrl,
        fotoAkta: fotoAktaUrl,
        fotoIjazah: fotoIjazahUrl,
        agamaAyah: body['agama'] || 'Islam',
        agamaIbu: body['agama'] || 'Islam',
        bahasaSehariHari: body['bahasaSehariHari'] || 'Indonesia',
        desa: body['desa'] || '-',
        kabupaten: body['kabupaten'] || '-',
        kecamatan: body['kecamatan'] || '-',
        kelasDiterima: '-',
        kewarganegaraan: body['kewarganegaraan'] || 'WNI',
        kewarganegaraanAyah: 'WNI',
        kewarganegaraanIbu: 'WNI',
        kodePos: body['kodePos'] || '-',
        namaPanggilan: body['namaPanggilan'] || '-',
        npsnSekolah: body['npsnSekolah'] || '-',
        pendidikanAyah: body['pendidikanAyah'] || '-',
        pendidikanIbu: body['pendidikanIbu'] || '-',
        penghasilanAyah: body['penghasilanAyah'] || '-',
        penghasilanIbu: body['penghasilanIbu'] || '-',
        provinsi: body['provinsi'] || '-',
        riwayatPenyakit: body['riwayatPenyakit'] || '-',
        statusAyah: body['statusAyah'] || 'Hidup',
        statusIbu: body['statusIbu'] || 'Hidup',
        tempatLahirAyah: '-',
        tempatLahirIbu: '-',
        tinggalDengan: body['tinggalDengan'] || 'Orang Tua',
        anakKe: body['anakKe'] ? parseInt(body['anakKe']) : undefined,
        jumlahSaudara: body['jumlahSaudara'] ? parseInt(body['jumlahSaudara']) : undefined,
        tinggiBadan: body['tinggiBadan'] ? parseInt(body['tinggiBadan']) : undefined,
        beratBadan: body['beratBadan'] ? parseInt(body['beratBadan']) : undefined,
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
        }
        else {
            return c.json({ message: 'Draft berhasil disimpan.' });
        }
    }
    catch (error) {
        console.error('Registration error:', error);
        return c.json({ error: 'Gagal menyimpan data pendaftaran.' }, 500);
    }
});
app.get('/notifications', async (c) => {
    const user = c.get('user');
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
