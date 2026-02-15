import { pgTable, serial, varchar, text, integer, boolean, timestamp, date, decimal, bigserial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
export const users = pgTable('users_user', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  password: varchar('password', { length: 128 }).notNull(),
  lastLogin: timestamp('last_login', { mode: 'string' }),
  isSuperuser: boolean('is_superuser').notNull(),
  username: varchar('username', { length: 150 }).notNull().unique(),
  firstName: varchar('first_name', { length: 150 }).notNull(),
  lastName: varchar('last_name', { length: 150 }).notNull(),
  email: varchar('email', { length: 254 }).notNull(),
  isStaff: boolean('is_staff').notNull(),
  isActive: boolean('is_active').notNull(),
  dateJoined: timestamp('date_joined', { mode: 'string' }).notNull(),
  role: varchar('role', { length: 20 }).notNull(), 
  phone: varchar('phone', { length: 20 }).notNull(),
  avatar: text('avatar'),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const usersRelations = relations(users, ({ many }) => ({
  loginHistory: many(loginHistory),
  blogPosts: many(blogPosts),
  verifiedPayments: many(payments),
  notifications: many(notifications),
}));
export const loginHistory = pgTable('users_loginhistory', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  username: varchar('username', { length: 150 }).notNull(),
  ipAddress: varchar('ip_address', { length: 39 }),
  userAgent: text('user_agent').notNull(),
  status: varchar('status', { length: 10 }).notNull(),
  errorMessage: varchar('error_message', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  userId: integer('user_id').references(() => users.id),
});
export const loginHistoryRelations = relations(loginHistory, ({ one }) => ({
  user: one(users, {
    fields: [loginHistory.userId],
    references: [users.id],
  }),
}));
export const notifications = pgTable('notifications', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).notNull(), 
  isRead: boolean('is_read').default(false).notNull(),
  actionUrl: varchar('action_url', { length: 200 }),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
export const santri = pgTable('admissions_santri', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  namaLengkap: varchar('nama_lengkap', { length: 200 }).notNull(),
  nisn: varchar('nisn', { length: 10 }).notNull().unique(),
  tempatLahir: varchar('tempat_lahir', { length: 100 }).notNull(),
  tanggalLahir: date('tanggal_lahir', { mode: 'string' }).notNull(),
  jenisKelamin: varchar('jenis_kelamin', { length: 10 }).notNull(),
  agama: varchar('agama', { length: 20 }).notNull(),
  golonganDarah: varchar('golongan_darah', { length: 3 }).notNull(),
  tinggiBadan: integer('tinggi_badan'),
  beratBadan: integer('berat_badan'),
  namaAyah: varchar('nama_ayah', { length: 200 }).notNull(),
  nikAyah: varchar('nik_ayah', { length: 16 }).notNull(),
  namaIbu: varchar('nama_ibu', { length: 200 }).notNull(),
  nikIbu: varchar('nik_ibu', { length: 16 }).notNull(),
  pekerjaanAyah: varchar('pekerjaan_ayah', { length: 100 }).notNull(),
  pekerjaanIbu: varchar('pekerjaan_ibu', { length: 100 }).notNull(),
  noHpAyah: varchar('no_hp_ayah', { length: 15 }).notNull(),
  noHpIbu: varchar('no_hp_ibu', { length: 15 }).notNull(),
  alamatOrangTua: text('alamat_orangtua').notNull(),
  alamat: text('alamat').notNull(),
  noHp: varchar('no_hp', { length: 15 }).notNull(),
  email: varchar('email', { length: 254 }).notNull(),
  asalSekolah: varchar('asal_sekolah', { length: 200 }).notNull(),
  kelasTerakhir: varchar('kelas_terakhir', { length: 50 }).notNull(),
  tahunLulus: varchar('tahun_lulus', { length: 4 }).notNull(),
  noIjazah: varchar('no_ijazah', { length: 50 }).notNull(),
  fotoSantri: varchar('foto_santri', { length: 100 }),
  fotoKtp: varchar('foto_ktp', { length: 100 }),
  fotoAkta: varchar('foto_akta', { length: 100 }),
  fotoIjazah: varchar('foto_ijazah', { length: 100 }),
  fotoKk: varchar('foto_kk', { length: 100 }),
  suratSehat: varchar('surat_sehat', { length: 100 }),
  fotoSantriApproved: boolean('foto_santri_approved').notNull(),
  fotoKtpApproved: boolean('foto_ktp_approved').notNull(),
  fotoAktaApproved: boolean('foto_akta_approved').notNull(),
  fotoIjazahApproved: boolean('foto_ijazah_approved').notNull(),
  fotoKkApproved: boolean('foto_kk_approved').notNull().default(false),
  suratSehatApproved: boolean('surat_sehat_approved').notNull(),
  catatan: text('catatan').notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
  agamaAyah: varchar('agama_ayah', { length: 20 }).notNull(),
  agamaIbu: varchar('agama_ibu', { length: 20 }).notNull(),
  anakKe: integer('anak_ke'),
  bahasaSehariHari: varchar('bahasa_sehari_hari', { length: 50 }).notNull(),
  desa: varchar('desa', { length: 100 }).notNull(),
  jumlahSaudara: integer('jumlah_saudara'),
  kabupaten: varchar('kabupaten', { length: 100 }).notNull(),
  kecamatan: varchar('kecamatan', { length: 100 }).notNull(),
  kelasDiterima: varchar('kelas_diterima', { length: 50 }).notNull(),
  kewarganegaraan: varchar('kewarganegaraan', { length: 10 }).notNull(),
  kewarganegaraanAyah: varchar('kewarganegaraan_ayah', { length: 10 }).notNull(),
  kewarganegaraanIbu: varchar('kewarganegaraan_ibu', { length: 10 }).notNull(),
  kodePos: varchar('kode_pos', { length: 10 }).notNull(),
  namaPanggilan: varchar('nama_panggilan', { length: 100 }).notNull(),
  npsnSekolah: varchar('npsn_sekolah', { length: 20 }).notNull(),
  pendidikanAyah: varchar('pendidikan_ayah', { length: 50 }).notNull(),
  pendidikanIbu: varchar('pendidikan_ibu', { length: 50 }).notNull(),
  penghasilanAyah: varchar('penghasilan_ayah', { length: 50 }),
  penghasilanIbu: varchar('penghasilan_ibu', { length: 50 }),
  provinsi: varchar('provinsi', { length: 100 }).notNull(),
  riwayatPenyakit: varchar('riwayat_penyakit', { length: 200 }).notNull(),
  statusAyah: varchar('status_ayah', { length: 10 }).notNull(),
  statusIbu: varchar('status_ibu', { length: 10 }).notNull(),
  tanggalDiterima: date('tanggal_diterima', { mode: 'string' }),
  tanggalLahirAyah: date('tanggal_lahir_ayah', { mode: 'string' }),
  tanggalLahirIbu: date('tanggal_lahir_ibu', { mode: 'string' }),
  tempatLahirAyah: varchar('tempat_lahir_ayah', { length: 100 }).notNull(),
  tempatLahirIbu: varchar('tempat_lahir_ibu', { length: 100 }).notNull(),
  tinggalDengan: varchar('tinggal_dengan', { length: 50 }).notNull(),
});
export const santriRelations = relations(santri, ({ one, many }) => ({
  payment: one(payments, {
    fields: [santri.id],
    references: [payments.santriId],
  }),
  examSchedules: many(examSchedules),
  examResult: one(examResults),
}));
export const examSchedules = pgTable('admissions_exam_schedules', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  santriId: integer('santri_id').notNull().references(() => santri.id),
  type: varchar('type', { length: 20 }).notNull(),
  scheduledDate: timestamp('scheduled_date', { mode: 'string' }).notNull(),
  location: varchar('location', { length: 200 }).notNull(),
  examiner: varchar('examiner', { length: 200 }),
  status: varchar('status', { length: 20 }).notNull().default('scheduled'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const examSchedulesRelations = relations(examSchedules, ({ one }) => ({
  santri: one(santri, {
    fields: [examSchedules.santriId],
    references: [santri.id],
  }),
}));
export const examResults = pgTable('admissions_exam_results', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  santriId: integer('santri_id').notNull().references(() => santri.id),
  writtenTestScore: decimal('written_test_score', { precision: 5, scale: 2 }),
  interviewScore: decimal('interview_test_score', { precision: 5, scale: 2 }),
  quranTestScore: decimal('quran_test_score', { precision: 5, scale: 2 }),
  totalScore: decimal('total_score', { precision: 5, scale: 2 }),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  decisionDate: timestamp('decision_date', { mode: 'string' }),
  isPublished: boolean('is_published').notNull().default(false),
  notes: text('notes'),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const examResultsRelations = relations(examResults, ({ one }) => ({
  santri: one(santri, {
    fields: [examResults.santriId],
    references: [santri.id],
  }),
}));
export const bankAccounts = pgTable('payments_bankaccount', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  namaBank: varchar('nama_bank', { length: 100 }).notNull(),
  namaBankCustom: varchar('nama_bank_custom', { length: 100 }).notNull(),
  nomorRekening: varchar('nomor_rekening', { length: 50 }).notNull(),
  namaPemilik: varchar('nama_pemilik_rekening', { length: 200 }).notNull(),
  biayaPendaftaran: decimal('biaya_pendaftaran', { precision: 10, scale: 0 }).notNull(),
  isActive: boolean('is_active').notNull(),
  keterangan: text('keterangan').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const payments = pgTable('payments_payment', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  bankPengirim: varchar('bank_pengirim', { length: 50 }).notNull(),
  noRekeningPengirim: varchar('no_rekening_pengirim', { length: 50 }).notNull(),
  namaPemilikRekening: varchar('nama_pemilik_rekening', { length: 200 }).notNull(),
  rekeningTujuan: varchar('rekening_tujuan', { length: 50 }).notNull(),
  jumlahTransfer: decimal('jumlah_transfer', { precision: 12, scale: 2 }).notNull(),
  buktiTransfer: varchar('bukti_transfer', { length: 100 }),
  status: varchar('status', { length: 20 }).notNull(),
  catatan: text('catatan').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
  verifiedAt: timestamp('verified_at', { mode: 'string' }),
  santriId: integer('santri_id').notNull().references(() => santri.id),
  verifiedById: integer('verified_by_id').references(() => users.id),
});
export const paymentsRelations = relations(payments, ({ one }) => ({
  santri: one(santri, {
    fields: [payments.santriId],
    references: [santri.id],
  }),
  verifiedBy: one(users, {
    fields: [payments.verifiedById],
    references: [users.id],
  }),
}));
export const blogCategories = pgTable('blog_category', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});
export const blogCategoriesRelations = relations(blogCategories, ({ many }) => ({
  posts: many(blogPosts),
}));
export const blogTags = pgTable('blog_tag', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});
export const blogTagsRelations = relations(blogTags, ({ many }) => ({
  posts: many(blogPostTags),
}));
export const blogPosts = pgTable('blog_blogpost', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt').notNull(),
  featuredImage: text('featured_image'),
  metaTitle: varchar('meta_title', { length: 200 }).notNull(),
  metaDescription: text('meta_description').notNull(),
  metaKeywords: varchar('meta_keywords', { length: 255 }).notNull(),
  videoFile: varchar('video_file', { length: 100 }),
  viewsCount: integer('views_count').notNull(),
  likesCount: integer('likes_count').notNull(),
  sharesCount: integer('shares_count').notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  publishedAt: timestamp('published_at', { mode: 'string' }),
  isFeatured: boolean('is_featured').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
  authorId: integer('author_id').notNull().references(() => users.id),
  categoryId: integer('category_id').references(() => blogCategories.id),
});
export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
  category: one(blogCategories, {
    fields: [blogPosts.categoryId],
    references: [blogCategories.id],
  }),
  tags: many(blogPostTags),
}));
export const blogPostTags = pgTable('blog_blogpost_tags', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  blogpostId: integer('blogpost_id').notNull().references(() => blogPosts.id),
  tagId: integer('tag_id').notNull().references(() => blogTags.id),
});
export const blogPostTagsRelations = relations(blogPostTags, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogPostTags.blogpostId],
    references: [blogPosts.id],
  }),
  tag: one(blogTags, {
    fields: [blogPostTags.tagId],
    references: [blogTags.id],
  }),
}));
export const blogAnnouncements = pgTable('blog_pengumuman', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  judul: varchar('judul', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  konten: text('konten').notNull(),
  gambar: varchar('gambar', { length: 100 }),
  status: varchar('status', { length: 20 }).notNull(),
  isPenting: boolean('is_penting').notNull(),
  publishedAt: timestamp('published_at', { mode: 'string' }),
  metaTitle: varchar('meta_title', { length: 200 }).notNull(),
  metaDescription: text('meta_description').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const blogTestimonials = pgTable('blog_testimoni', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  nama: varchar('nama', { length: 200 }).notNull(),
  foto: varchar('foto', { length: 100 }),
  jabatan: varchar('jabatan', { length: 200 }).notNull(),
  testimoni: text('testimoni').notNull(),
  rating: integer('rating').notNull(),
  isPublished: boolean('is_published').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});
export const websiteRegistrationFlow = pgTable('core_registration_flow', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  icon: varchar('icon', { length: 50 }).notNull(),
  order: integer('order').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const websiteSettings = pgTable('core_websitesettings', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  namaPondok: varchar('nama_pondok', { length: 200 }).notNull(),
  arabicName: varchar('arabic_name', { length: 500 }).notNull(),
  alamat: text('alamat').notNull(),
  logo: varchar('logo', { length: 100 }),
  noTelepon: varchar('no_telepon', { length: 20 }).notNull(),
  email: varchar('email', { length: 254 }).notNull(),
  website: varchar('website', { length: 200 }).notNull(),
  facebook: varchar('facebook', { length: 200 }).notNull(),
  instagram: varchar('instagram', { length: 200 }).notNull(),
  twitter: varchar('twitter', { length: 200 }).notNull(),
  tiktok: varchar('tiktok', { length: 200 }).notNull(),
  heroTitle: varchar('hero_title', { length: 200 }).notNull(),
  heroSubtitle: varchar('hero_subtitle', { length: 200 }).notNull(),
  heroTagline: varchar('hero_tagline', { length: 300 }).notNull(),
  heroCtaPrimaryText: varchar('hero_cta_primary_text', { length: 100 }).notNull(),
  heroCtaPrimaryLink: varchar('hero_cta_primary_link', { length: 200 }).notNull(),
  heroCtaSecondaryText: varchar('hero_cta_secondary_text', { length: 100 }).notNull(),
  heroCtaSecondaryLink: varchar('hero_cta_secondary_link', { length: 200 }).notNull(),
  ctaTitle: varchar('cta_title', { length: 200 }).notNull().default('Siap Bergabung?'),
  ctaDescription: text('cta_description').notNull(),
  ctaPrimaryText: varchar('cta_primary_text', { length: 100 }).notNull().default('Daftar Sekarang'),
  ctaPrimaryLink: varchar('cta_primary_link', { length: 200 }).notNull().default('/pendaftaran'),
  ctaSecondaryText: varchar('cta_secondary_text', { length: 100 }).notNull().default('Hubungi Kami'),
  ctaSecondaryLink: varchar('cta_secondary_link', { length: 200 }).notNull().default('/kontak'),
  announcementText: varchar('announcement_text', { length: 300 }),
  announcementLink: varchar('announcement_link', { length: 200 }),
  announcementActive: boolean('announcement_active').default(false),
  lokasiPendaftaran: text('lokasi_pendaftaran').notNull(),
  googleMapsLink: varchar('google_maps_link', { length: 200 }).notNull(),
  googleMapsEmbedCode: text('google_maps_embed_code').notNull(),
  qrCodeImage: varchar('qr_code_image', { length: 100 }),
  deskripsi: text('deskripsi').notNull(),
  favicon: varchar('favicon', { length: 100 }),
  metaTitle: varchar('meta_title', { length: 200 }).notNull(),
  metaDescription: text('meta_description').notNull(),
  metaKeywords: varchar('meta_keywords', { length: 500 }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
  headerMobileImage: varchar('header_mobile_image', { length: 100 }),
  headerMobileHeight: integer('header_mobile_height').notNull(),
  maintenanceMessage: text('maintenance_message').notNull(),
  maintenanceMode: boolean('maintenance_mode').notNull(),
  profilSingkat: text('profil_singkat'),
  profilLengkap: text('profil_lengkap'),
  gambarProfil: varchar('gambar_profil', { length: 100 }),
});
export const founders = pgTable('core_founders', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  namaLengkap: varchar('nama_lengkap', { length: 100 }).notNull(),
  tanggalLahir: date('tanggal_lahir', { mode: 'string' }).notNull(),
  jabatan: varchar('jabatan', { length: 50 }).notNull(),
  nik: text('nik').notNull(),
  email: text('email').notNull(),
  noTelepon: varchar('no_telepon', { length: 20 }).notNull(),
  alamat: varchar('alamat', { length: 255 }).notNull(),
  foto: varchar('foto', { length: 200 }).notNull(),
  pendidikanTerakhir: varchar('pendidikan_terakhir', { length: 20 }).notNull(),
  profilSingkat: varchar('profil_singkat', { length: 200 }).notNull(),
  isDeleted: boolean('is_deleted').notNull().default(false),
  createdBy: integer('created_by').references(() => users.id),
  updatedBy: integer('updated_by').references(() => users.id),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const foundersRelations = relations(founders, ({ one }) => ({
  creator: one(users, {
    fields: [founders.createdBy],
    references: [users.id],
  }),
  updater: one(users, {
    fields: [founders.updatedBy],
    references: [users.id],
  }),
}));
export const faq = pgTable('core_faq', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  pertanyaan: varchar('pertanyaan', { length: 500 }).notNull(),
  jawaban: text('jawaban').notNull(),
  kategori: varchar('kategori', { length: 100 }).notNull(),
  order: integer('order').notNull(),
  isPublished: boolean('is_published').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});
export const programs = pgTable('core_program', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  nama: varchar('nama', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  deskripsi: text('deskripsi').notNull(),
  gambar: varchar('gambar', { length: 100 }),
  tanggalMulai: date('tanggal_mulai', { mode: 'string' }),
  tanggalSelesai: date('tanggal_selesai', { mode: 'string' }),
  status: varchar('status', { length: 20 }).notNull(),
  isFeatured: boolean('is_featured').notNull(),
  metaTitle: varchar('meta_title', { length: 200 }).notNull(),
  metaDescription: text('meta_description').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const whatsappTemplateCategories = pgTable('core_whatsapptemplatekategori', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  nama: varchar('nama', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  deskripsi: text('deskripsi').notNull(),
  order: integer('order').notNull(),
  isActive: boolean('is_active').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const whatsappTemplateCategoriesRelations = relations(whatsappTemplateCategories, ({ many }) => ({
  templates: many(whatsappTemplates),
}));
export const whatsappTemplates = pgTable('core_whatsapptemplate', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  nama: varchar('nama', { length: 200 }).notNull(),
  tipe: varchar('tipe', { length: 20 }).notNull(),
  pesan: text('pesan').notNull(),
  variabel: varchar('variabel', { length: 500 }).notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
  kategoriId: integer('kategori_id').references(() => whatsappTemplateCategories.id),
});
export const whatsappTemplatesRelations = relations(whatsappTemplates, ({ one }) => ({
  kategori: one(whatsappTemplateCategories, {
    fields: [whatsappTemplates.kategoriId],
    references: [whatsappTemplateCategories.id],
  }),
}));
export const kontak = pgTable('core_kontak', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  nama: varchar('nama', { length: 200 }).notNull(),
  email: varchar('email', { length: 254 }).notNull(),
  noHp: varchar('no_hp', { length: 20 }).notNull(),
  subjek: varchar('subjek', { length: 200 }).notNull(),
  pesan: text('pesan').notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  balasan: text('balasan').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const heroSection = pgTable('core_herosection', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  subtitle: varchar('subtitle', { length: 200 }).notNull(),
  image: varchar('image', { length: 100 }),
  order: integer('order').notNull(),
  isActive: boolean('is_active').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});
export const sejarahTimeline = pgTable('core_sejarahtimeline', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  judul: varchar('judul', { length: 200 }).notNull(),
  icon: varchar('icon', { length: 100 }).notNull(),
  deskripsi: text('deskripsi').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});
export const sejarahTimelineRelations = relations(sejarahTimeline, ({ many }) => ({
  images: many(sejarahTimelineImages),
}));
export const sejarahTimelineImages = pgTable('core_sejarahtimelineimage', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  gambar: varchar('gambar', { length: 100 }).notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  timelineId: integer('timeline_id').notNull().references(() => sejarahTimeline.id),
});
export const sejarahTimelineImagesRelations = relations(sejarahTimelineImages, ({ one }) => ({
  timeline: one(sejarahTimeline, {
    fields: [sejarahTimelineImages.timelineId],
    references: [sejarahTimeline.id],
  }),
}));
export const visiMisi = pgTable('core_visimisi', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  visi: text('visi').notNull(),
  misi: text('misi').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const programPendidikan = pgTable('core_programpendidikan', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  nama: varchar('nama', { length: 200 }).notNull(),
  akreditasi: varchar('akreditasi', { length: 50 }).notNull(),
  icon: varchar('icon', { length: 100 }).notNull(),
  gambar: varchar('gambar', { length: 100 }),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});
export const programPendidikanRelations = relations(programPendidikan, ({ many }) => ({
  images: many(programPendidikanImages),
}));
export const programPendidikanImages = pgTable('core_programpendidikanimage', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  gambar: varchar('gambar', { length: 100 }).notNull(),
  altText: varchar('alt_text', { length: 200 }).notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  programId: integer('program_id').notNull().references(() => programPendidikan.id),
});
export const programPendidikanImagesRelations = relations(programPendidikanImages, ({ one }) => ({
  program: one(programPendidikan, {
    fields: [programPendidikanImages.programId],
    references: [programPendidikan.id],
  }),
}));
export const fasilitas = pgTable('core_fasilitas', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  nama: varchar('nama', { length: 200 }).notNull(),
  icon: varchar('icon', { length: 100 }).notNull(),
  gambar: varchar('gambar', { length: 100 }),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});
export const ekstrakurikuler = pgTable('core_ekstrakurikuler', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  nama: varchar('nama', { length: 200 }).notNull(),
  icon: varchar('icon', { length: 100 }).notNull(),
  gambar: text('gambar'),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});
export const ekstrakurikulerRelations = relations(ekstrakurikuler, ({ many }) => ({
  images: many(ekstrakurikulerImages),
}));
export const ekstrakurikulerImages = pgTable('core_ekstrakurikulerimage', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  gambar: varchar('gambar', { length: 100 }).notNull(),
  altText: varchar('alt_text', { length: 200 }).notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  ekstrakurikulerId: integer('ekstrakurikuler_id').notNull().references(() => ekstrakurikuler.id),
});
export const ekstrakurikulerImagesRelations = relations(ekstrakurikulerImages, ({ one }) => ({
  ekstrakurikuler: one(ekstrakurikuler, {
    fields: [ekstrakurikulerImages.ekstrakurikulerId],
    references: [ekstrakurikuler.id],
  }),
}));
export const dokumentasi = pgTable('core_dokumentasi', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  judul: varchar('judul', { length: 200 }).notNull(),
  deskripsi: text('deskripsi').notNull(),
  kategori: varchar('kategori', { length: 50 }).notNull(),
  tanggalKegiatan: date('tanggal_kegiatan', { mode: 'string' }),
  lokasi: varchar('lokasi', { length: 200 }).notNull(),
  order: integer('order').notNull(),
  isPublished: boolean('is_published').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const dokumentasiRelations = relations(dokumentasi, ({ many }) => ({
  images: many(dokumentasiImages),
}));
export const dokumentasiImages = pgTable('core_dokumentasiimage', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  gambar: varchar('gambar', { length: 100 }).notNull(),
  altText: varchar('alt_text', { length: 200 }).notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  dokumentasiId: integer('dokumentasi_id').notNull().references(() => dokumentasi.id),
});
export const dokumentasiImagesRelations = relations(dokumentasiImages, ({ one }) => ({
  dokumentasi: one(dokumentasi, {
    fields: [dokumentasiImages.dokumentasiId],
    references: [dokumentasi.id],
  }),
}));
export const jadwalHarian = pgTable('core_jadwalharian', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  waktu: varchar('waktu', { length: 50 }).notNull(),
  judul: varchar('judul', { length: 200 }).notNull(),
  deskripsi: text('deskripsi').notNull(),
  kategori: varchar('kategori', { length: 20 }).notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});
export const persyaratan = pgTable('core_persyaratan', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  persyaratanSantri: text('persyaratan_santri').notNull(),
  persyaratanSantriwati: text('persyaratan_santriwati').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const alurPendaftaran = pgTable('core_alurpendaftaran', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  gambarUtama: varchar('gambar_utama', { length: 100 }),
  alurPendaftaran: text('alur_pendaftaran').notNull(),
  tahapanTes: text('tahapan_tes').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const biayaPendidikan = pgTable('core_biayapendidikan', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  tipe: varchar('tipe', { length: 50 }).notNull(),
  nama: varchar('nama', { length: 200 }).notNull(),
  jumlah: decimal('jumlah', { precision: 12, scale: 0 }).notNull(),
  keterangan: varchar('keterangan', { length: 200 }).notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});
export const contactPersons = pgTable('core_contactperson', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  nama: varchar('nama', { length: 200 }).notNull(),
  foto: varchar('foto', { length: 100 }),
  noHp: varchar('no_hp', { length: 20 }).notNull(),
  order: integer('order').notNull(),
  isActive: boolean('is_active').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});
export const socialMedia = pgTable('core_socialmedia', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  platform: varchar('platform', { length: 50 }).notNull(),
  username: varchar('username', { length: 200 }).notNull(),
  url: varchar('url', { length: 200 }).notNull(),
  order: integer('order').notNull(),
  isActive: boolean('is_active').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});
export const seragam = pgTable('core_seragam', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  hari: varchar('hari', { length: 50 }).notNull(),
  seragamPutra: varchar('seragam_putra', { length: 200 }).notNull(),
  gambarPutra: text('gambar_putra'),
  seragamPutri: varchar('seragam_putri', { length: 200 }).notNull(),
  gambarPutri: text('gambar_putri'),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});
export const kmi = pgTable('core_kmi', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  visiKmi: text('visi_kmi').notNull(),
  profilKmi: text('profil_kmi').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const statistik = pgTable('core_statistik', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  judul: varchar('judul', { length: 200 }).notNull(),
  nilai: varchar('nilai', { length: 100 }).notNull(),
  icon: varchar('icon', { length: 100 }).notNull(),
  deskripsi: varchar('deskripsi', { length: 300 }).notNull(),
  warna: varchar('warna', { length: 50 }).notNull(),
  order: integer('order').notNull(),
  isPublished: boolean('is_published').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});
export const media = pgTable('core_media', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  tipe: varchar('tipe', { length: 10 }).notNull(),
  judul: varchar('judul', { length: 200 }).notNull(),
  subJudul: varchar('sub_judul', { length: 300 }).notNull(),
  gambar: varchar('gambar', { length: 100 }),
  videoFile: varchar('video_file', { length: 100 }),
  featuredImage: varchar('featured_image', { length: 100 }),
  order: integer('order').notNull(),
  isPublished: boolean('is_published').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const bagianJabatan = pgTable('core_bagianjabatan', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  nama: varchar('nama', { length: 200 }).notNull().unique(),
  deskripsi: text('deskripsi').notNull(),
  order: integer('order').notNull(),
  isActive: boolean('is_active').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const bagianJabatanRelations = relations(bagianJabatan, ({ many }) => ({
  tenagaPengajar: many(tenagaPengajar),
}));
export const tenagaPengajar = pgTable('core_tenagapengajar', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  namaLengkap: varchar('nama_lengkap', { length: 200 }).notNull(),
  namaPanggilan: varchar('nama_panggilan', { length: 100 }).notNull(),
  jenisKelamin: varchar('jenis_kelamin', { length: 1 }).notNull(),
  foto: varchar('foto', { length: 100 }),
  tempatLahir: varchar('tempat_lahir', { length: 100 }).notNull(),
  tanggalLahir: date('tanggal_lahir', { mode: 'string' }),
  alamat: text('alamat').notNull(),
  noHp: varchar('no_hp', { length: 20 }).notNull(),
  email: varchar('email', { length: 254 }).notNull(),
  pendidikanTerakhir: varchar('pendidikan_terakhir', { length: 200 }).notNull(),
  universitas: varchar('universitas', { length: 200 }).notNull(),
  tahunLulus: varchar('tahun_lulus', { length: 4 }).notNull(),
  bidangKeahlian: varchar('bidang_keahlian', { length: 200 }).notNull(),
  mataPelajaran: varchar('mata_pelajaran', { length: 300 }).notNull(),
  pengalamanMengajar: text('pengalaman_mengajar').notNull(),
  prestasi: text('prestasi').notNull(),
  riwayatPendidikan: text('riwayat_pendidikan').notNull(),
  organisasi: text('organisasi').notNull(),
  karyaTulis: text('karya_tulis').notNull(),
  motto: varchar('motto', { length: 300 }).notNull(),
  whatsapp: varchar('whatsapp', { length: 20 }).notNull(),
  facebook: varchar('facebook', { length: 200 }).notNull(),
  instagram: varchar('instagram', { length: 200 }).notNull(),
  twitter: varchar('twitter', { length: 200 }).notNull(),
  linkedin: varchar('linkedin', { length: 200 }).notNull(),
  youtube: varchar('youtube', { length: 200 }).notNull(),
  tiktok: varchar('tiktok', { length: 200 }).notNull(),
  order: integer('order').notNull(),
  isPublished: boolean('is_published').notNull(),
  isFeatured: boolean('is_featured').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
  bagianJabatanId: integer('bagian_jabatan_id').references(() => bagianJabatan.id),
});
export const tenagaPengajarRelations = relations(tenagaPengajar, ({ one }) => ({
  bagianJabatan: one(bagianJabatan, {
    fields: [tenagaPengajar.bagianJabatanId],
    references: [bagianJabatan.id],
  }),
}));
export const informasiTambahan = pgTable('core_informasitambahan', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  judul: varchar('judul', { length: 200 }).notNull(),
  deskripsi: text('deskripsi').notNull(),
  icon: varchar('icon', { length: 100 }).notNull(),
  warna: varchar('warna', { length: 20 }).notNull(),
  order: integer('order').notNull(),
  isPublished: boolean('is_published').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const documentTemplates = pgTable('documents_documenttemplate', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  nama: varchar('nama', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  deskripsi: text('deskripsi').notNull(),
  htmlTemplate: text('html_template').notNull(),
  cssTemplate: text('css_template').notNull(),
  ukuranKertas: varchar('ukuran_kertas', { length: 20 }).notNull(),
  orientasi: varchar('orientasi', { length: 20 }).notNull(),
  marginTop: varchar('margin_top', { length: 20 }).notNull(),
  marginRight: varchar('margin_right', { length: 20 }).notNull(),
  marginBottom: varchar('margin_bottom', { length: 20 }).notNull(),
  marginLeft: varchar('margin_left', { length: 20 }).notNull(),
  isActive: boolean('is_active').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
export const adminBugnotes = pgTable('admin_panel_bugnote', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  pageUrl: varchar('page_url', { length: 200 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  createdById: integer('created_by_id').references(() => users.id),
});
export const adminConvertedImages = pgTable('admin_panel_convertedimage', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  originalFilename: varchar('original_filename', { length: 255 }).notNull(),
  webpImage: varchar('webp_image', { length: 100 }).notNull(),
  originalSize: integer('original_size').notNull(),
  convertedSize: integer('converted_size').notNull(),
  compressionRatio: decimal('compression_ratio', { precision: 10, scale: 2 }).notNull(),
  quality: integer('quality').notNull(),
  width: integer('width'),
  height: integer('height'),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  createdById: integer('created_by_id').references(() => users.id),
  judul: varchar('judul', { length: 200 }).notNull(),
});
export const systemSettings = pgTable('system_settings', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  maintenanceMode: boolean('maintenance_mode').default(false).notNull(),
  allowRegistration: boolean('allow_registration').default(true).notNull(),
  debugMode: boolean('debug_mode').default(false).notNull(),
  sessionTimeout: integer('session_timeout').default(60).notNull(),
  maxUploadSize: integer('max_upload_size').default(5).notNull(),
  backupFrequency: varchar('backup_frequency', { length: 20 }).default('daily').notNull(),
  logRetentionDays: integer('log_retention_days').default(30).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});