"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInformasiTambahanSchema = exports.createInformasiTambahanSchema = exports.updateTenagaPengajarSchema = exports.createTenagaPengajarSchema = exports.updateBagianJabatanSchema = exports.createBagianJabatanSchema = exports.updateMediaSchema = exports.createMediaSchema = exports.updateStatistikSchema = exports.createStatistikSchema = exports.updateSeragamSchema = exports.createSeragamSchema = exports.updateSocialMediaSchema = exports.createSocialMediaSchema = exports.updateContactPersonSchema = exports.createContactPersonSchema = exports.updateBiayaPendidikanSchema = exports.createBiayaPendidikanSchema = exports.updateWebsiteRegistrationFlowSchema = exports.createWebsiteRegistrationFlowSchema = exports.updateAlurPendaftaranSchema = exports.updatePersyaratanSchema = exports.updateJadwalHarianSchema = exports.createJadwalHarianSchema = exports.updateDokumentasiSchema = exports.createDokumentasiSchema = exports.updateEkstrakurikulerSchema = exports.createEkstrakurikulerSchema = exports.updateFasilitasSchema = exports.createFasilitasSchema = exports.updateProgramPendidikanSchema = exports.createProgramPendidikanSchema = exports.updateVisiMisiSchema = exports.updateSejarahTimelineSchema = exports.createSejarahTimelineSchema = exports.updateHeroSectionSchema = exports.createHeroSectionSchema = exports.replyKontakSchema = exports.createKontakSchema = exports.updateFounderSchema = exports.createFounderSchema = exports.updateWhatsAppTemplateSchema = exports.createWhatsAppTemplateSchema = exports.updateProgramSchema = exports.createProgramSchema = exports.updateFaqSchema = exports.createFaqSchema = exports.updateWebsiteSettingsSchema = void 0;
const zod_1 = require("zod");
exports.updateWebsiteSettingsSchema = zod_1.z.object({
    namaPondok: zod_1.z.string().optional(),
    arabicName: zod_1.z.string().optional(),
    alamat: zod_1.z.string().optional(),
    logo: zod_1.z.string().optional(),
    headerMobileImage: zod_1.z.string().optional(),
    headerMobileHeight: zod_1.z.number().optional(),
    noTelepon: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    website: zod_1.z.string().url().optional(),
    facebook: zod_1.z.string().url().optional(),
    instagram: zod_1.z.string().url().optional(),
    twitter: zod_1.z.string().url().optional(),
    tiktok: zod_1.z.string().url().optional(),
    heroTitle: zod_1.z.string().optional(),
    heroSubtitle: zod_1.z.string().optional(),
    heroTagline: zod_1.z.string().optional(),
    heroCtaPrimaryText: zod_1.z.string().optional(),
    heroCtaPrimaryLink: zod_1.z.string().optional(),
    heroCtaSecondaryText: zod_1.z.string().optional(),
    heroCtaSecondaryLink: zod_1.z.string().optional(),
    ctaTitle: zod_1.z.string().optional(),
    ctaDescription: zod_1.z.string().optional(),
    ctaPrimaryText: zod_1.z.string().optional(),
    ctaPrimaryLink: zod_1.z.string().optional(),
    ctaSecondaryText: zod_1.z.string().optional(),
    ctaSecondaryLink: zod_1.z.string().optional(),
    announcementText: zod_1.z.string().optional(),
    announcementLink: zod_1.z.string().optional(),
    announcementActive: zod_1.z.boolean().optional(),
    lokasiPendaftaran: zod_1.z.string().optional(),
    googleMapsLink: zod_1.z.string().optional(),
    googleMapsEmbedCode: zod_1.z.string().optional(),
    qrCodeImage: zod_1.z.string().optional(),
    deskripsi: zod_1.z.string().optional(),
    favicon: zod_1.z.string().optional(),
    metaTitle: zod_1.z.string().optional(),
    metaDescription: zod_1.z.string().optional(),
    metaKeywords: zod_1.z.string().optional(),
    maintenanceMode: zod_1.z.boolean().optional(),
    maintenanceMessage: zod_1.z.string().optional(),
    profilSingkat: zod_1.z.string().optional(),
    gambarProfil: zod_1.z.string().optional(),
});
exports.createFaqSchema = zod_1.z.object({
    pertanyaan: zod_1.z.string().min(1),
    jawaban: zod_1.z.string().min(1),
    kategori: zod_1.z.string().optional(),
    order: zod_1.z.number().optional(),
    isPublished: zod_1.z.boolean().optional(),
});
exports.updateFaqSchema = exports.createFaqSchema.partial();
exports.createProgramSchema = zod_1.z.object({
    nama: zod_1.z.string().min(1),
    slug: zod_1.z.string().optional(),
    deskripsi: zod_1.z.string().min(1),
    gambar: zod_1.z.string().optional(),
    tanggalMulai: zod_1.z.string().optional(),
    tanggalSelesai: zod_1.z.string().optional(),
    status: zod_1.z.enum(['draft', 'published']).optional(),
    isFeatured: zod_1.z.boolean().optional(),
    metaTitle: zod_1.z.string().optional(),
    metaDescription: zod_1.z.string().optional(),
    order: zod_1.z.number().optional(),
});
exports.updateProgramSchema = exports.createProgramSchema.partial();
exports.createWhatsAppTemplateSchema = zod_1.z.object({
    nama: zod_1.z.string().min(1),
    kategoriId: zod_1.z.number().optional(),
    tipe: zod_1.z.enum(['public', 'system', 'admin', 'user']).optional(),
    pesan: zod_1.z.string().min(1),
    variabel: zod_1.z.string().optional(),
    order: zod_1.z.number().optional(),
});
exports.updateWhatsAppTemplateSchema = exports.createWhatsAppTemplateSchema.partial();
exports.createFounderSchema = zod_1.z.object({
    namaLengkap: zod_1.z.string().max(100),
    tanggalLahir: zod_1.z.string(),
    jabatan: zod_1.z.enum(['Pendiri', 'Pengasuh', 'Penasehat']),
    nik: zod_1.z.string().length(16).regex(/^\d+$/, 'NIK harus berupa angka'),
    email: zod_1.z.string().email(),
    noTelepon: zod_1.z.string().min(10).max(15).regex(/^\d+$/, 'Nomor telepon harus berupa angka'),
    alamat: zod_1.z.string().max(255),
    foto: zod_1.z.string(),
    pendidikanTerakhir: zod_1.z.enum(['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3']),
    profilSingkat: zod_1.z.string().max(200),
});
exports.updateFounderSchema = exports.createFounderSchema.partial();
exports.createKontakSchema = zod_1.z.object({
    nama: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    noHp: zod_1.z.string().optional(),
    subjek: zod_1.z.string().min(1),
    pesan: zod_1.z.string().min(1),
});
exports.replyKontakSchema = zod_1.z.object({
    balasan: zod_1.z.string().min(1),
    status: zod_1.z.enum(['dibaca', 'dibalas', 'selesai']).optional(),
});
exports.createHeroSectionSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    subtitle: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
    order: zod_1.z.number().optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.updateHeroSectionSchema = exports.createHeroSectionSchema.partial();
exports.createSejarahTimelineSchema = zod_1.z.object({
    judul: zod_1.z.string().min(1),
    icon: zod_1.z.string().optional(),
    deskripsi: zod_1.z.string().min(1),
    order: zod_1.z.number().optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateSejarahTimelineSchema = exports.createSejarahTimelineSchema.partial();
exports.updateVisiMisiSchema = zod_1.z.object({
    visi: zod_1.z.string(),
    misi: zod_1.z.string(),
});
exports.createProgramPendidikanSchema = zod_1.z.object({
    nama: zod_1.z.string().min(1),
    akreditasi: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
    gambar: zod_1.z.string().optional(),
    order: zod_1.z.number().or(zod_1.z.string().regex(/^\d+$/).transform(Number)).optional(),
});
exports.updateProgramPendidikanSchema = exports.createProgramPendidikanSchema.partial();
exports.createFasilitasSchema = zod_1.z.object({
    nama: zod_1.z.string().min(1),
    icon: zod_1.z.string().min(1),
    gambar: zod_1.z.string().optional(),
    order: zod_1.z.number().optional(),
});
exports.updateFasilitasSchema = exports.createFasilitasSchema.partial();
exports.createEkstrakurikulerSchema = zod_1.z.object({
    nama: zod_1.z.string().min(1),
    icon: zod_1.z.string().min(1),
    gambar: zod_1.z.string().optional(),
    order: zod_1.z.number().optional(),
    images: zod_1.z.array(zod_1.z.string()).max(5).optional(),
});
exports.updateEkstrakurikulerSchema = exports.createEkstrakurikulerSchema.partial();
exports.createDokumentasiSchema = zod_1.z.object({
    judul: zod_1.z.string().min(1),
    deskripsi: zod_1.z.string().optional(),
    kategori: zod_1.z.enum(['kegiatan', 'acara', 'pembelajaran', 'ekstrakurikuler', 'prestasi', 'lainnya']).optional(),
    tanggalKegiatan: zod_1.z.string().optional(),
    lokasi: zod_1.z.string().optional(),
    order: zod_1.z.number().optional(),
    isPublished: zod_1.z.boolean().optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateDokumentasiSchema = exports.createDokumentasiSchema.partial();
exports.createJadwalHarianSchema = zod_1.z.object({
    waktu: zod_1.z.string().min(1),
    judul: zod_1.z.string().min(1),
    deskripsi: zod_1.z.string().min(1),
    kategori: zod_1.z.enum(['ibadah', 'pendidikan', 'istirahat', 'kegiatan']).optional(),
    target: zod_1.z.enum(['putra', 'putri', 'semua']).optional(),
    order: zod_1.z.number().optional(),
});
exports.updateJadwalHarianSchema = exports.createJadwalHarianSchema.partial();
exports.updatePersyaratanSchema = zod_1.z.object({
    persyaratanSantri: zod_1.z.string().optional(),
    persyaratanSantriwati: zod_1.z.string().optional(),
});
exports.updateAlurPendaftaranSchema = zod_1.z.object({
    gambarUtama: zod_1.z.string().optional(),
    alurPendaftaran: zod_1.z.string().optional(),
    tahapanTes: zod_1.z.string().optional(),
});
exports.createWebsiteRegistrationFlowSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    icon: zod_1.z.string().min(1),
    order: zod_1.z.number().optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.updateWebsiteRegistrationFlowSchema = exports.createWebsiteRegistrationFlowSchema.partial();
exports.createBiayaPendidikanSchema = zod_1.z.object({
    tipe: zod_1.z.enum(['tahunan', 'bulanan', 'perlengkapan_putra', 'perlengkapan_putri']),
    nama: zod_1.z.string().min(1),
    jumlah: zod_1.z.number().min(0),
    keterangan: zod_1.z.string().optional(),
    order: zod_1.z.number().optional(),
});
exports.updateBiayaPendidikanSchema = exports.createBiayaPendidikanSchema.partial();
exports.createContactPersonSchema = zod_1.z.object({
    nama: zod_1.z.string().min(1),
    foto: zod_1.z.string().optional(),
    noHp: zod_1.z.string().min(1),
    order: zod_1.z.number().optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.updateContactPersonSchema = exports.createContactPersonSchema.partial();
exports.createSocialMediaSchema = zod_1.z.object({
    platform: zod_1.z.enum(['instagram', 'facebook', 'tiktok', 'twitter']),
    username: zod_1.z.string().min(1),
    url: zod_1.z.string().url(),
    order: zod_1.z.number().optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.updateSocialMediaSchema = exports.createSocialMediaSchema.partial();
exports.createSeragamSchema = zod_1.z.object({
    hari: zod_1.z.string().min(1),
    seragamPutra: zod_1.z.string().optional(),
    gambarPutra: zod_1.z.string().optional(),
    seragamPutri: zod_1.z.string().optional(),
    gambarPutri: zod_1.z.string().optional(),
    order: zod_1.z.number().optional(),
});
exports.updateSeragamSchema = exports.createSeragamSchema.partial();
exports.createStatistikSchema = zod_1.z.object({
    judul: zod_1.z.string().min(1),
    nilai: zod_1.z.string().min(1),
    icon: zod_1.z.string().optional(),
    deskripsi: zod_1.z.string().optional(),
    warna: zod_1.z.enum(['green', 'blue', 'purple', 'orange', 'red']).optional(),
    order: zod_1.z.number().optional(),
    isPublished: zod_1.z.boolean().optional(),
});
exports.updateStatistikSchema = exports.createStatistikSchema.partial();
exports.createMediaSchema = zod_1.z.object({
    tipe: zod_1.z.enum(['gallery', 'video']),
    judul: zod_1.z.string().min(1),
    subJudul: zod_1.z.string().optional(),
    gambar: zod_1.z.string().optional(),
    videoFile: zod_1.z.string().optional(),
    featuredImage: zod_1.z.string().optional(),
    order: zod_1.z.number().optional(),
    isPublished: zod_1.z.boolean().optional(),
});
exports.updateMediaSchema = exports.createMediaSchema.partial();
exports.createBagianJabatanSchema = zod_1.z.object({
    nama: zod_1.z.string().min(1),
    deskripsi: zod_1.z.string().optional(),
    order: zod_1.z.number().optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.updateBagianJabatanSchema = exports.createBagianJabatanSchema.partial();
exports.createTenagaPengajarSchema = zod_1.z.object({
    namaLengkap: zod_1.z.string().min(1),
    namaPanggilan: zod_1.z.string().optional(),
    jenisKelamin: zod_1.z.enum(['L', 'P']),
    foto: zod_1.z.string().optional(),
    bagianJabatanId: zod_1.z.number().optional(),
    jabatan: zod_1.z.string().optional(),
    tempatLahir: zod_1.z.string().optional(),
    tanggalLahir: zod_1.z.string().optional(),
    alamat: zod_1.z.string().optional(),
    noHp: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
    pendidikanTerakhir: zod_1.z.string().optional(),
    universitas: zod_1.z.string().optional(),
    tahunLulus: zod_1.z.string().optional(),
    bidangKeahlian: zod_1.z.string().optional(),
    mataPelajaran: zod_1.z.string().optional(),
    pengalamanMengajar: zod_1.z.string().optional(),
    prestasi: zod_1.z.string().optional(),
    riwayatPendidikan: zod_1.z.string().optional(),
    organisasi: zod_1.z.string().optional(),
    karyaTulis: zod_1.z.string().optional(),
    motto: zod_1.z.string().optional(),
    whatsapp: zod_1.z.string().optional(),
    facebook: zod_1.z.string().optional(),
    instagram: zod_1.z.string().optional(),
    twitter: zod_1.z.string().optional(),
    linkedin: zod_1.z.string().optional(),
    youtube: zod_1.z.string().optional(),
    tiktok: zod_1.z.string().optional(),
    order: zod_1.z.number().optional(),
    isPublished: zod_1.z.boolean().optional(),
    isFeatured: zod_1.z.boolean().optional(),
});
exports.updateTenagaPengajarSchema = exports.createTenagaPengajarSchema.partial();
exports.createInformasiTambahanSchema = zod_1.z.object({
    judul: zod_1.z.string().min(1),
    deskripsi: zod_1.z.string().min(1),
    icon: zod_1.z.string().optional(),
    warna: zod_1.z.enum(['green', 'blue', 'purple', 'orange', 'red', 'teal', 'pink']).optional(),
    order: zod_1.z.number().optional(),
    isPublished: zod_1.z.boolean().optional(),
});
exports.updateInformasiTambahanSchema = exports.createInformasiTambahanSchema.partial();
