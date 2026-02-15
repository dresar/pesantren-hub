import { z } from 'zod';
export const updateWebsiteSettingsSchema = z.object({
  namaPondok: z.string().optional(),
  arabicName: z.string().optional(),
  alamat: z.string().optional(),
  logo: z.string().optional(),
  headerMobileImage: z.string().optional(),
  headerMobileHeight: z.number().optional(),
  noTelepon: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  facebook: z.string().url().optional(),
  instagram: z.string().url().optional(),
  twitter: z.string().url().optional(),
  tiktok: z.string().url().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroTagline: z.string().optional(),
  heroCtaPrimaryText: z.string().optional(),
  heroCtaPrimaryLink: z.string().optional(),
  heroCtaSecondaryText: z.string().optional(),
  heroCtaSecondaryLink: z.string().optional(),
  ctaTitle: z.string().optional(),
  ctaDescription: z.string().optional(),
  ctaPrimaryText: z.string().optional(),
  ctaPrimaryLink: z.string().optional(),
  ctaSecondaryText: z.string().optional(),
  ctaSecondaryLink: z.string().optional(),
  announcementText: z.string().optional(),
  announcementLink: z.string().optional(),
  announcementActive: z.boolean().optional(),
  lokasiPendaftaran: z.string().optional(),
  googleMapsLink: z.string().optional(),
  googleMapsEmbedCode: z.string().optional(),
  qrCodeImage: z.string().optional(),
  deskripsi: z.string().optional(),
  favicon: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  maintenanceMode: z.boolean().optional(),
  maintenanceMessage: z.string().optional(),
  profilSingkat: z.string().optional(),
  gambarProfil: z.string().optional(),
});
export const createFaqSchema = z.object({
  pertanyaan: z.string().min(1),
  jawaban: z.string().min(1),
  kategori: z.string().optional(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
});
export const updateFaqSchema = createFaqSchema.partial();
export const createProgramSchema = z.object({
  nama: z.string().min(1),
  slug: z.string().optional(), 
  deskripsi: z.string().min(1),
  gambar: z.string().optional(),
  tanggalMulai: z.string().optional(), 
  tanggalSelesai: z.string().optional(), 
  status: z.enum(['draft', 'published']).optional(),
  isFeatured: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  order: z.number().optional(),
});
export const updateProgramSchema = createProgramSchema.partial();
export const createWhatsAppTemplateSchema = z.object({
  nama: z.string().min(1),
  kategoriId: z.number().optional(),
  tipe: z.enum(['public', 'system', 'admin', 'user']).optional(),
  pesan: z.string().min(1),
  variabel: z.string().optional(),
  order: z.number().optional(),
});
export const updateWhatsAppTemplateSchema = createWhatsAppTemplateSchema.partial();
export const createFounderSchema = z.object({
  namaLengkap: z.string().max(100),
  tanggalLahir: z.string(), 
  jabatan: z.enum(['Pendiri', 'Pengasuh', 'Penasehat']),
  nik: z.string().length(16).regex(/^\d+$/, 'NIK harus berupa angka'),
  email: z.string().email(),
  noTelepon: z.string().min(10).max(15).regex(/^\d+$/, 'Nomor telepon harus berupa angka'),
  alamat: z.string().max(255),
  foto: z.string(),
  pendidikanTerakhir: z.enum(['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3']),
  profilSingkat: z.string().max(200),
});
export const updateFounderSchema = createFounderSchema.partial();
export const createKontakSchema = z.object({
  nama: z.string().min(1),
  email: z.string().email(),
  noHp: z.string().optional(),
  subjek: z.string().min(1),
  pesan: z.string().min(1),
});
export const replyKontakSchema = z.object({
  balasan: z.string().min(1),
  status: z.enum(['dibaca', 'dibalas', 'selesai']).optional(),
});
export const createHeroSectionSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  image: z.string().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});
export const updateHeroSectionSchema = createHeroSectionSchema.partial();
export const createSejarahTimelineSchema = z.object({
  judul: z.string().min(1),
  icon: z.string().optional(),
  deskripsi: z.string().min(1),
  order: z.number().optional(),
  images: z.array(z.string()).optional(),
});
export const updateSejarahTimelineSchema = createSejarahTimelineSchema.partial();
export const updateVisiMisiSchema = z.object({
  visi: z.string(),
  misi: z.string(),
});
export const createProgramPendidikanSchema = z.object({
  nama: z.string().min(1),
  akreditasi: z.string().optional(),
  icon: z.string().optional(),
  gambar: z.string().optional(),
  order: z.number().optional(),
});
export const updateProgramPendidikanSchema = createProgramPendidikanSchema.partial();
export const createFasilitasSchema = z.object({
  nama: z.string().min(1),
  icon: z.string().min(1),
  gambar: z.string().optional(),
  order: z.number().optional(),
});
export const updateFasilitasSchema = createFasilitasSchema.partial();
export const createEkstrakurikulerSchema = z.object({
  nama: z.string().min(1),
  icon: z.string().min(1),
  gambar: z.string().optional(),
  order: z.number().optional(),
});
export const updateEkstrakurikulerSchema = createEkstrakurikulerSchema.partial();
export const createDokumentasiSchema = z.object({
  judul: z.string().min(1),
  deskripsi: z.string().optional(),
  kategori: z.enum(['kegiatan', 'acara', 'pembelajaran', 'ekstrakurikuler', 'prestasi', 'lainnya']).optional(),
  tanggalKegiatan: z.string().optional(),
  lokasi: z.string().optional(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
  images: z.array(z.string()).optional(),
});
export const updateDokumentasiSchema = createDokumentasiSchema.partial();
export const createJadwalHarianSchema = z.object({
  waktu: z.string().min(1),
  judul: z.string().min(1),
  deskripsi: z.string().min(1),
  kategori: z.enum(['santri', 'santriwati']).optional(),
  order: z.number().optional(),
});
export const updateJadwalHarianSchema = createJadwalHarianSchema.partial();
export const updatePersyaratanSchema = z.object({
  persyaratanSantri: z.string().optional(),
  persyaratanSantriwati: z.string().optional(),
});
export const updateAlurPendaftaranSchema = z.object({
  gambarUtama: z.string().optional(),
  alurPendaftaran: z.string().optional(),
  tahapanTes: z.string().optional(),
});
export const createWebsiteRegistrationFlowSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});
export const updateWebsiteRegistrationFlowSchema = createWebsiteRegistrationFlowSchema.partial();
export const createBiayaPendidikanSchema = z.object({
  tipe: z.enum(['tahunan', 'bulanan', 'perlengkapan_putra', 'perlengkapan_putri']),
  nama: z.string().min(1),
  jumlah: z.number().min(0),
  keterangan: z.string().optional(),
  order: z.number().optional(),
});
export const updateBiayaPendidikanSchema = createBiayaPendidikanSchema.partial();
export const createContactPersonSchema = z.object({
  nama: z.string().min(1),
  foto: z.string().optional(),
  noHp: z.string().min(1),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});
export const updateContactPersonSchema = createContactPersonSchema.partial();
export const createSocialMediaSchema = z.object({
  platform: z.enum(['instagram', 'facebook', 'tiktok', 'twitter']),
  username: z.string().min(1),
  url: z.string().url(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});
export const updateSocialMediaSchema = createSocialMediaSchema.partial();
export const createSeragamSchema = z.object({
  hari: z.string().min(1),
  seragamPutra: z.string().optional(),
  gambarPutra: z.string().optional(),
  seragamPutri: z.string().optional(),
  gambarPutri: z.string().optional(),
  order: z.number().optional(),
});
export const updateSeragamSchema = createSeragamSchema.partial();
export const updateKmiSchema = z.object({
  visiKmi: z.string().optional(),
  profilKmi: z.string().optional(),
});
export const createStatistikSchema = z.object({
  judul: z.string().min(1),
  nilai: z.string().min(1),
  icon: z.string().optional(),
  deskripsi: z.string().optional(),
  warna: z.enum(['green', 'blue', 'purple', 'orange', 'red']).optional(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
});
export const updateStatistikSchema = createStatistikSchema.partial();
export const createMediaSchema = z.object({
  tipe: z.enum(['gallery', 'video']),
  judul: z.string().min(1),
  subJudul: z.string().optional(),
  gambar: z.string().optional(),
  videoFile: z.string().optional(),
  featuredImage: z.string().optional(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
});
export const updateMediaSchema = createMediaSchema.partial();
export const createBagianJabatanSchema = z.object({
  nama: z.string().min(1),
  deskripsi: z.string().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});
export const updateBagianJabatanSchema = createBagianJabatanSchema.partial();
export const createTenagaPengajarSchema = z.object({
  namaLengkap: z.string().min(1),
  namaPanggilan: z.string().optional(),
  jenisKelamin: z.enum(['L', 'P']),
  foto: z.string().optional(),
  bagianJabatanId: z.number().optional(),
  tempatLahir: z.string().optional(),
  tanggalLahir: z.string().optional(),
  alamat: z.string().optional(),
  noHp: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  pendidikanTerakhir: z.string().optional(),
  universitas: z.string().optional(),
  tahunLulus: z.string().optional(),
  bidangKeahlian: z.string().optional(),
  mataPelajaran: z.string().optional(),
  pengalamanMengajar: z.string().optional(),
  prestasi: z.string().optional(),
  riwayatPendidikan: z.string().optional(),
  organisasi: z.string().optional(),
  karyaTulis: z.string().optional(),
  motto: z.string().optional(),
  whatsapp: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});
export const updateTenagaPengajarSchema = createTenagaPengajarSchema.partial();
export const createInformasiTambahanSchema = z.object({
  judul: z.string().min(1),
  deskripsi: z.string().min(1),
  icon: z.string().optional(),
  warna: z.enum(['green', 'blue', 'purple', 'orange', 'red', 'teal', 'pink']).optional(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
});
export const updateInformasiTambahanSchema = createInformasiTambahanSchema.partial();