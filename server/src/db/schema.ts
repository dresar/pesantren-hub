import { pgTable, serial, varchar, text, integer, boolean, timestamp, date, decimal, bigserial, json, bigint } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ... (existing tables)

export const users = pgTable('users_user', {
  id: serial('id').primaryKey(),
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
  isNotificationSeen: boolean('is_notification_seen').default(false).notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  verificationStatus: varchar('verification_status', { length: 20 }).default('none').notNull(),
  rejectedReason: text('rejected_reason'),
  // Publication specific fields
  publicationRole: varchar('publication_role', { length: 20 }).default('none'), // 'author', 'editor', 'reviewer'
  publicationStatus: varchar('publication_status', { length: 20 }).default('none'), // 'pending', 'approved', 'rejected'
  isPublicationRegistered: boolean('is_publication_registered').default(false),
  publicationVerified: boolean('publication_verified').default(false),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});

export const publicationProfiles = pgTable('publication_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  bio: text('bio'),
  institution: varchar('institution', { length: 200 }),
  whatsapp: varchar('whatsapp', { length: 20 }),
  expertise: text('expertise'), // Comma separated list of expertise
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const publicationCategories = pgTable('publication_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  type: varchar('type', { length: 20 }).notNull(), // 'article', 'journal'
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const publicationVolumes = pgTable('publication_volumes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(), // "Vol 1 No 1"
  year: integer('year').notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const publicationArticles = pgTable('publication_articles', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt').notNull(),
  featuredImage: text('featured_image'),
  authorId: integer('author_id').notNull().references(() => users.id),
  categoryId: integer('category_id').references(() => publicationCategories.id),
  type: varchar('type', { length: 20 }).notNull(), // 'article', 'journal'
  status: varchar('status', { length: 20 }).default('draft').notNull(), // 'draft', 'pending', 'approved', 'rejected'
  approvedById: integer('approved_by_id').references(() => users.id),
  approvedAt: timestamp('approved_at', { mode: 'string' }),
  rejectionReason: text('rejection_reason'),
  viewsCount: integer('views_count').default(0).notNull(),
  volumeId: integer('volume_id').references(() => publicationVolumes.id), // For journals
  collaborationId: integer('collaboration_id').references(() => publicationCollaborations.id), // For collaboration projects
  pdfFile: text('pdf_file'), // For journals
  keywords: text('keywords'), // For SEO/Tags
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const publicationCollaborations = pgTable('publication_collaborations', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  ownerId: integer('owner_id').notNull().references(() => users.id),
  status: varchar('status', { length: 20 }).default('active').notNull(), // 'active', 'completed', 'archived'
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const publicationCollaborationMembers = pgTable('publication_collaboration_members', {
  id: serial('id').primaryKey(),
  collaborationId: integer('collaboration_id').notNull().references(() => publicationCollaborations.id),
  userId: integer('user_id').notNull().references(() => users.id),
  role: varchar('role', { length: 50 }).notNull(), // 'owner', 'editor', 'viewer'
  joinedAt: timestamp('joined_at', { mode: 'string' }).notNull().defaultNow(),
});

export const publicationCollaborationInvites = pgTable('publication_collaboration_invites', {
  id: serial('id').primaryKey(),
  collaborationId: integer('collaboration_id').notNull().references(() => publicationCollaborations.id),
  inviterId: integer('inviter_id').notNull().references(() => users.id),
  inviteeId: integer('invitee_id').notNull().references(() => users.id),
  role: varchar('role', { length: 50 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  respondedAt: timestamp('responded_at', { mode: 'string' }),
});

export const publicationDiscussions = pgTable('publication_discussions', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').references(() => publicationArticles.id), // Optional, can be general discussion
  userId: integer('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  parentId: integer('parent_id'), // For threaded replies (self-reference handled in logic)
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const publicationCategoriesRelations = relations(publicationCategories, ({ many }) => ({
  articles: many(publicationArticles),
}));

export const publicationVolumesRelations = relations(publicationVolumes, ({ many }) => ({
  journals: many(publicationArticles),
}));

export const publicationArticlesRelations = relations(publicationArticles, ({ one, many }) => ({
  author: one(users, {
    fields: [publicationArticles.authorId],
    references: [users.id],
    relationName: 'publicationArticles',
  }),
  category: one(publicationCategories, {
    fields: [publicationArticles.categoryId],
    references: [publicationCategories.id],
  }),
  approvedBy: one(users, {
    fields: [publicationArticles.approvedById],
    references: [users.id],
    relationName: 'approvedArticles',
  }),
  volume: one(publicationVolumes, {
    fields: [publicationArticles.volumeId],
    references: [publicationVolumes.id],
  }),
  collaboration: one(publicationCollaborations, {
    fields: [publicationArticles.collaborationId],
    references: [publicationCollaborations.id],
  }),
  discussions: many(publicationDiscussions),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
  loginHistory: many(loginHistory),
  blogPosts: many(blogPosts),
  verifiedPayments: many(payments),
  notifications: many(notifications),
  mediaFiles: many(mediaFiles),
  mediaLogs: many(mediaLogs),
  publicationArticles: many(publicationArticles, { relationName: 'publicationArticles' }),
  approvedArticles: many(publicationArticles, { relationName: 'approvedArticles' }),
  publicationProfile: one(publicationProfiles, {
    fields: [users.id],
    references: [publicationProfiles.userId],
  }),
  collaborationsOwned: many(publicationCollaborations, { relationName: 'collaborationOwner' }),
  collaborationMemberships: many(publicationCollaborationMembers),
  discussions: many(publicationDiscussions),
}));

export const publicationProfilesRelations = relations(publicationProfiles, ({ one }) => ({
  user: one(users, {
    fields: [publicationProfiles.userId],
    references: [users.id],
  }),
}));

export const publicationCollaborationsRelations = relations(publicationCollaborations, ({ one, many }) => ({
  owner: one(users, {
    fields: [publicationCollaborations.ownerId],
    references: [users.id],
    relationName: 'collaborationOwner',
  }),
  members: many(publicationCollaborationMembers),
  invites: many(publicationCollaborationInvites),
  articles: many(publicationArticles),
}));

export const publicationCollaborationMembersRelations = relations(publicationCollaborationMembers, ({ one }) => ({
  collaboration: one(publicationCollaborations, {
    fields: [publicationCollaborationMembers.collaborationId],
    references: [publicationCollaborations.id],
  }),
  user: one(users, {
    fields: [publicationCollaborationMembers.userId],
    references: [users.id],
  }),
}));

export const publicationCollaborationInvitesRelations = relations(publicationCollaborationInvites, ({ one }) => ({
  collaboration: one(publicationCollaborations, {
    fields: [publicationCollaborationInvites.collaborationId],
    references: [publicationCollaborations.id],
  }),
  inviter: one(users, {
    fields: [publicationCollaborationInvites.inviterId],
    references: [users.id],
  }),
  invitee: one(users, {
    fields: [publicationCollaborationInvites.inviteeId],
    references: [users.id],
  }),
}));

export const publicationArticleAudits = pgTable('publication_article_audits', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').notNull().references(() => publicationArticles.id),
  userId: integer('user_id').notNull().references(() => users.id),
  changeSummary: text('change_summary').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
});

export const publicationArticleAuditsRelations = relations(publicationArticleAudits, ({ one }) => ({
  article: one(publicationArticles, {
    fields: [publicationArticleAudits.articleId],
    references: [publicationArticles.id],
  }),
  user: one(users, {
    fields: [publicationArticleAudits.userId],
    references: [users.id],
  }),
}));

export const publicationDiscussionsRelations = relations(publicationDiscussions, ({ one }) => ({
  user: one(users, {
    fields: [publicationDiscussions.userId],
    references: [users.id],
  }),
  article: one(publicationArticles, {
    fields: [publicationDiscussions.articleId],
    references: [publicationArticles.id],
  }),
}));

export const loginHistory = pgTable('users_loginhistory', {
  id: serial('id').primaryKey(),
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
  id: serial('id').primaryKey(),
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
  id: serial('id').primaryKey(),
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
  fotoSantri: text('foto_santri'),
  fotoKtp: text('foto_ktp'),
  fotoAkta: text('foto_akta'),
  fotoIjazah: text('foto_ijazah'),
  fotoKk: text('foto_kk'),
  suratSehat: text('surat_sehat'),
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
  kewarganegaraan: varchar('kewarganegaraan', { length: 50 }).notNull(),
  kewarganegaraanAyah: varchar('kewarganegaraan_ayah', { length: 50 }).notNull(),
  kewarganegaraanIbu: varchar('kewarganegaraan_ibu', { length: 50 }).notNull(),
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
  parents: many(santriParents),
}));

export const examSchedules = pgTable('admissions_exam_schedules', {
  id: serial('id').primaryKey(),
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
  id: serial('id').primaryKey(),
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
  id: serial('id').primaryKey(),
  namaBank: varchar('nama_bank', { length: 100 }).notNull(),
  namaBankCustom: varchar('nama_bank_custom', { length: 100 }).notNull(),
  logo: text('logo'),
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
  id: serial('id').primaryKey(),
  bankPengirim: varchar('bank_pengirim', { length: 50 }).notNull(),
  noRekeningPengirim: varchar('no_rekening_pengirim', { length: 50 }).notNull(),
  namaPemilikRekening: varchar('nama_pemilik_rekening', { length: 200 }).notNull(),
  rekeningTujuan: varchar('rekening_tujuan', { length: 50 }).notNull(),
  jumlahTransfer: decimal('jumlah_transfer', { precision: 12, scale: 2 }).notNull(),
  buktiTransfer: text('bukti_transfer'),
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
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});

export const blogCategoriesRelations = relations(blogCategories, ({ many }) => ({
  posts: many(blogPosts),
}));

export const blogTags = pgTable('blog_tag', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});

export const blogTagsRelations = relations(blogTags, ({ many }) => ({
  posts: many(blogPostTags),
}));

export const blogPosts = pgTable('blog_blogpost', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt').notNull(),
  featuredImage: text('featured_image'),
  metaTitle: varchar('meta_title', { length: 200 }).notNull(),
  metaDescription: text('meta_description').notNull(),
  metaKeywords: varchar('meta_keywords', { length: 255 }).notNull(),
  videoFile: text('video_file'),
  videoUrl: varchar('video_url', { length: 500 }),
  gallery: json('gallery').$type<string[]>(),
  viewsCount: integer('views_count').notNull().default(0),
  likesCount: integer('likes_count').notNull().default(0),
  sharesCount: integer('shares_count').notNull().default(0),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  publishedAt: timestamp('published_at', { mode: 'string' }),
  isFeatured: boolean('is_featured').notNull().default(false),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
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
  id: serial('id').primaryKey(),
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
  id: serial('id').primaryKey(),
  judul: varchar('judul', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  konten: text('konten').notNull(),
  gambar: text('gambar'),
  status: varchar('status', { length: 20 }).notNull(),
  isPenting: boolean('is_penting').notNull(),
  publishedAt: timestamp('published_at', { mode: 'string' }),
  metaTitle: varchar('meta_title', { length: 200 }).notNull(),
  metaDescription: text('meta_description').notNull(),
  // Popup Pengumuman fields
  popupEnabled: boolean('popup_enabled').default(false).notNull(),
  popupImage: text('popup_image'),
  popupStartDate: timestamp('popup_start_date', { mode: 'string' }),
  popupEndDate: timestamp('popup_end_date', { mode: 'string' }),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});

// Struktur Organisasi
export const strukturOrganisasi = pgTable('core_struktur_organisasi', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 200 }).notNull(),
  jabatan: varchar('jabatan', { length: 200 }).notNull(),
  foto: text('foto'),
  parentId: integer('parent_id'),
  level: integer('level').notNull().default(0), // 0=top, 1=dept head, 2=staff
  order: integer('order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

// Konfigurasi Isi Formulir
export const formConfig = pgTable('core_form_config', {
  id: serial('id').primaryKey(),
  formName: varchar('form_name', { length: 100 }).notNull(), // 'pendaftaran'
  fieldKey: varchar('field_key', { length: 100 }).notNull(),
  fieldLabel: varchar('field_label', { length: 200 }).notNull(),
  fieldValue: text('field_value').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const blogTestimonials = pgTable('blog_testimoni', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 200 }).notNull(),
  foto: text('foto'),
  jabatan: varchar('jabatan', { length: 200 }).notNull(),
  testimoni: text('testimoni').notNull(),
  rating: integer('rating').notNull(),
  isPublished: boolean('is_published').notNull().default(true),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
});

export const websiteRegistrationFlow = pgTable('core_registration_flow', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  order: integer('order').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});

export const websiteSettings = pgTable('core_websitesettings', {
  id: serial('id').primaryKey(),
  namaPondok: varchar('nama_pondok', { length: 200 }).notNull(),
  arabicName: varchar('arabic_name', { length: 500 }).notNull(),
  alamat: text('alamat').notNull(),
  logo: text('logo'),
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
  qrCodeImage: text('qr_code_image'),
  deskripsi: text('deskripsi').notNull(),
  favicon: text('favicon'),
  metaTitle: varchar('meta_title', { length: 200 }).notNull(),
  metaDescription: text('meta_description').notNull(),
  metaKeywords: varchar('meta_keywords', { length: 500 }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
  headerMobileImage: text('header_mobile_image'),
  headerMobileHeight: integer('header_mobile_height').notNull(),
  maintenanceMessage: text('maintenance_message').notNull(),
  maintenanceMode: boolean('maintenance_mode').notNull(),
  profilSingkat: text('profil_singkat'),
  profilLengkap: text('profil_lengkap'),
  gambarProfil: text('gambar_profil'),
});

export const founders = pgTable('core_founders', {
  id: serial('id').primaryKey(),
  namaLengkap: varchar('nama_lengkap', { length: 100 }).notNull(),
  tanggalLahir: date('tanggal_lahir', { mode: 'string' }).notNull(),
  jabatan: varchar('jabatan', { length: 50 }).notNull(),
  nik: text('nik').notNull(),
  email: text('email').notNull(),
  noTelepon: varchar('no_telepon', { length: 20 }).notNull(),
  alamat: varchar('alamat', { length: 255 }).notNull(),
  foto: text('foto').notNull(),
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
  id: serial('id').primaryKey(),
  pertanyaan: varchar('pertanyaan', { length: 500 }).notNull(),
  jawaban: text('jawaban').notNull(),
  kategori: varchar('kategori', { length: 100 }).notNull(),
  order: integer('order').notNull(),
  isPublished: boolean('is_published').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});

export const programs = pgTable('core_program', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  deskripsi: text('deskripsi').notNull(),
  gambar: text('gambar'),
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
  id: serial('id').primaryKey(),
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
  id: serial('id').primaryKey(),
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
  id: serial('id').primaryKey(),
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
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  subtitle: varchar('subtitle', { length: 200 }).notNull(),
  image: text('image'),
  order: integer('order').notNull(),
  isActive: boolean('is_active').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});

export const sejarahTimeline = pgTable('core_sejarahtimeline', {
  id: serial('id').primaryKey(),
  judul: varchar('judul', { length: 200 }).notNull(),
  icon: text('icon').notNull(),
  deskripsi: text('deskripsi').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});

export const sejarahTimelineRelations = relations(sejarahTimeline, ({ many }) => ({
  images: many(sejarahTimelineImages),
}));

export const sejarahTimelineImages = pgTable('core_sejarahtimelineimage', {
  id: serial('id').primaryKey(),
  gambar: text('gambar').notNull(),
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
  id: serial('id').primaryKey(),
  visi: text('visi').notNull(),
  misi: text('misi').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});

export const programPendidikan = pgTable('core_programpendidikan', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 200 }).notNull(),
  akreditasi: varchar('akreditasi', { length: 50 }).notNull(),
  icon: text('icon').notNull(),
  gambar: text('gambar'),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});

export const programPendidikanRelations = relations(programPendidikan, ({ many }) => ({
  images: many(programPendidikanImages),
}));

export const programPendidikanImages = pgTable('core_programpendidikanimage', {
  id: serial('id').primaryKey(),
  gambar: text('gambar').notNull(),
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
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 200 }).notNull(),
  icon: text('icon').notNull(),
  gambar: text('gambar'),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});

export const ekstrakurikuler = pgTable('core_ekstrakurikuler', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 200 }).notNull(),
  icon: text('icon').notNull(),
  gambar: text('gambar'),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});

export const ekstrakurikulerRelations = relations(ekstrakurikuler, ({ many }) => ({
  images: many(ekstrakurikulerImages),
}));

export const ekstrakurikulerImages = pgTable('core_ekstrakurikulerimage', {
  id: serial('id').primaryKey(),
  gambar: text('gambar').notNull(),
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
  id: serial('id').primaryKey(),
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
  id: serial('id').primaryKey(),
  gambar: text('gambar').notNull(),
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
  id: serial('id').primaryKey(),
  waktu: varchar('waktu', { length: 50 }).notNull(),
  judul: varchar('judul', { length: 200 }).notNull(),
  deskripsi: text('deskripsi').notNull(),
  kategori: varchar('kategori', { length: 20 }).notNull(),
  target: varchar('target', { length: 20 }),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});

export const persyaratan = pgTable('core_persyaratan', {
  id: serial('id').primaryKey(),
  persyaratanSantri: text('persyaratan_santri').notNull(),
  persyaratanSantriwati: text('persyaratan_santriwati').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});

export const alurPendaftaran = pgTable('core_alurpendaftaran', {
  id: serial('id').primaryKey(),
  gambarUtama: text('gambar_utama'),
  alurPendaftaran: text('alur_pendaftaran').notNull(),
  tahapanTes: text('tahapan_tes').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});

export const biayaPendidikan = pgTable('core_biayapendidikan', {
  id: serial('id').primaryKey(),
  tipe: varchar('tipe', { length: 50 }).notNull(),
  nama: varchar('nama', { length: 200 }).notNull(),
  jumlah: decimal('jumlah', { precision: 12, scale: 0 }).notNull(),
  keterangan: varchar('keterangan', { length: 200 }).notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});

export const contactPersons = pgTable('core_contactperson', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 200 }).notNull(),
  foto: text('foto'),
  noHp: varchar('no_hp', { length: 20 }).notNull(),
  order: integer('order').notNull(),
  isActive: boolean('is_active').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});

export const socialMedia = pgTable('core_socialmedia', {
  id: serial('id').primaryKey(),
  platform: varchar('platform', { length: 50 }).notNull(),
  username: varchar('username', { length: 200 }).notNull(),
  url: varchar('url', { length: 200 }).notNull(),
  order: integer('order').notNull(),
  isActive: boolean('is_active').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});

export const seragam = pgTable('core_seragam', {
  id: serial('id').primaryKey(),
  hari: varchar('hari', { length: 50 }).notNull(),
  seragamPutra: varchar('seragam_putra', { length: 200 }),
  gambarPutra: text('gambar_putra'),
  seragamPutri: varchar('seragam_putri', { length: 200 }),
  gambarPutri: text('gambar_putri'),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});

export const kmi = pgTable('core_kmi', {
  id: serial('id').primaryKey(),
  visiKmi: text('visi_kmi').notNull(),
  profilKmi: text('profil_kmi').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});

export const statistik = pgTable('core_statistik', {
  id: serial('id').primaryKey(),
  judul: varchar('judul', { length: 200 }).notNull(),
  nilai: varchar('nilai', { length: 100 }).notNull(),
  icon: text('icon').notNull(),
  deskripsi: varchar('deskripsi', { length: 300 }).notNull(),
  warna: varchar('warna', { length: 50 }).notNull(),
  order: integer('order').notNull(),
  isPublished: boolean('is_published').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});

export const media = pgTable('core_media', {
  id: serial('id').primaryKey(),
  tipe: varchar('tipe', { length: 10 }).notNull(),
  judul: varchar('judul', { length: 200 }).notNull(),
  subJudul: varchar('sub_judul', { length: 300 }).notNull(),
  gambar: text('gambar'),
  videoFile: text('video_file'),
  featuredImage: text('featured_image'),
  order: integer('order').notNull(),
  isPublished: boolean('is_published').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});

export const bagianJabatan = pgTable('core_bagianjabatan', {
  id: serial('id').primaryKey(),
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
  id: serial('id').primaryKey(),
  namaLengkap: varchar('nama_lengkap', { length: 200 }).notNull(),
  namaPanggilan: varchar('nama_panggilan', { length: 100 }),
  jenisKelamin: varchar('jenis_kelamin', { length: 1 }).notNull(),
  foto: text('foto'),
  tempatLahir: varchar('tempat_lahir', { length: 100 }),
  tanggalLahir: date('tanggal_lahir', { mode: 'string' }),
  alamat: text('alamat'),
  noHp: varchar('no_hp', { length: 20 }).notNull(),
  email: varchar('email', { length: 254 }),
  pendidikanTerakhir: varchar('pendidikan_terakhir', { length: 200 }),
  universitas: varchar('universitas', { length: 200 }),
  tahunLulus: varchar('tahun_lulus', { length: 4 }),
  bidangKeahlian: varchar('bidang_keahlian', { length: 200 }),
  mataPelajaran: varchar('mata_pelajaran', { length: 300 }),
  pengalamanMengajar: text('pengalaman_mengajar'),
  prestasi: text('prestasi'),
  riwayatPendidikan: text('riwayat_pendidikan'),
  organisasi: text('organisasi'),
  karyaTulis: text('karya_tulis'),
  motto: varchar('motto', { length: 300 }),
  whatsapp: varchar('whatsapp', { length: 20 }),
  facebook: varchar('facebook', { length: 200 }),
  instagram: varchar('instagram', { length: 200 }),
  twitter: varchar('twitter', { length: 200 }),
  linkedin: varchar('linkedin', { length: 200 }),
  youtube: varchar('youtube', { length: 200 }),
  tiktok: varchar('tiktok', { length: 200 }),
  order: integer('order').notNull(),
  isPublished: boolean('is_published').notNull(),
  isFeatured: boolean('is_featured').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
  bagianJabatanId: integer('bagian_jabatan_id').references(() => bagianJabatan.id),
  jabatan: varchar('jabatan', { length: 100 }), 
});

export const tenagaPengajarRelations = relations(tenagaPengajar, ({ one }) => ({
  bagianJabatan: one(bagianJabatan, {
    fields: [tenagaPengajar.bagianJabatanId],
    references: [bagianJabatan.id],
  }),
}));

export const informasiTambahan = pgTable('core_informasitambahan', {
  id: serial('id').primaryKey(),
  judul: varchar('judul', { length: 200 }).notNull(),
  deskripsi: text('deskripsi').notNull(),
  icon: text('icon').notNull(),
  warna: varchar('warna', { length: 20 }).notNull(),
  order: integer('order').notNull(),
  isPublished: boolean('is_published').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});

export const adminBugnotes = pgTable('admin_panel_bugnote', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  pageUrl: varchar('page_url', { length: 200 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  createdById: integer('created_by_id').references(() => users.id),
});

export const adminConvertedImages = pgTable('admin_panel_convertedimage', {
  id: serial('id').primaryKey(),
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
  id: serial('id').primaryKey(),
  maintenanceMode: boolean('maintenance_mode').default(false).notNull(),
  allowRegistration: boolean('allow_registration').default(true).notNull(),
  debugMode: boolean('debug_mode').default(false).notNull(),
  sessionTimeout: integer('session_timeout').default(60).notNull(),
  maxUploadSize: integer('max_upload_size').default(5).notNull(),
  backupFrequency: varchar('backup_frequency', { length: 20 }).default('daily').notNull(),
  logRetentionDays: integer('log_retention_days').default(30).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});

export const documentSettings = pgTable('document_settings', {
  id: serial('id').primaryKey(),
  kopSuratImage: text('kop_surat_image'),
  kopSuratHeight: integer('kop_surat_height').default(30).notNull(),
  kopSuratOpacity: integer('kop_surat_opacity').default(100).notNull(),
  showKopSurat: boolean('show_kop_surat').default(true).notNull(),
  marginTop: integer('margin_top').default(10).notNull(),
  marginBottom: integer('margin_bottom').default(10).notNull(),
  marginLeft: integer('margin_left').default(15).notNull(),
  marginRight: integer('margin_right').default(15).notNull(),
  paperSize: varchar('paper_size', { length: 10 }).default('A4').notNull(),
  orientation: varchar('orientation', { length: 10 }).default('portrait').notNull(),
  watermarkText: varchar('watermark_text', { length: 100 }),
  watermarkOpacity: integer('watermark_opacity').default(10).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});

export const documentLogs = pgTable('document_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  action: varchar('action', { length: 50 }).notNull(),
  details: text('details'),
  ipAddress: varchar('ip_address', { length: 39 }),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
});

export const documentTemplates = pgTable('document_templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'biodata', 'kuitansi', 'surat_keterangan', 'custom'
  content: text('content').notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});

export const mediaAccounts = pgTable('media_accounts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  provider: varchar('provider', { length: 50 }).notNull(), // 'imagekit', 'cloudinary', 'local'
  config: json('config').notNull(), // API keys, secrets, etc.
  isActive: boolean('is_active').default(true).notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const mediaFiles = pgTable('media_files', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  mimetype: varchar('mimetype', { length: 100 }).notNull(),
  size: integer('size').notNull(),
  url: text('url').notNull(),
  path: text('path').notNull(), // Cloud path or local path
  thumbnailUrl: text('thumbnail_url'),
  provider: varchar('provider', { length: 50 }).notNull(),
  accountId: integer('account_id').references(() => mediaAccounts.id),
  userId: integer('user_id').references(() => users.id),
  folder: varchar('folder', { length: 255 }).default('/'),
  metadata: json('metadata'), // Width, height, etc.
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
});

export const mediaLogs = pgTable('media_logs', {
  id: serial('id').primaryKey(),
  action: varchar('action', { length: 50 }).notNull(), // 'upload', 'delete', 'move'
  fileId: integer('file_id').references(() => mediaFiles.id),
  userId: integer('user_id').references(() => users.id),
  details: text('details'),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
});

export const mediaFilesRelations = relations(mediaFiles, ({ one }) => ({
  account: one(mediaAccounts, {
    fields: [mediaFiles.accountId],
    references: [mediaAccounts.id],
  }),
  uploader: one(users, {
    fields: [mediaFiles.userId],
    references: [users.id],
  }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// PARENTS / WALI SANTRI — Data Orang Tua yang Ternormalisasi
// ─────────────────────────────────────────────────────────────────────────────

export const admissionsParents = pgTable('admissions_parents', {
  id: serial('id').primaryKey(),

  // Identitas
  nik: varchar('nik', { length: 16 }).notNull().unique(),
  namaLengkap: varchar('nama_lengkap', { length: 200 }).notNull(),

  // Kontak
  noHp: varchar('no_hp', { length: 20 }).notNull(),
  email: varchar('email', { length: 254 }),
  alamat: text('alamat').notNull(),

  // Data Pribadi
  tempatLahir: varchar('tempat_lahir', { length: 100 }),
  tanggalLahir: date('tanggal_lahir', { mode: 'string' }),
  status: varchar('status', { length: 20 }).notNull().default('Hidup'), // Hidup, Meninggal, Bercerai
  agama: varchar('agama', { length: 20 }),
  kewarganegaraan: varchar('kewarganegaraan', { length: 20 }).default('WNI'),

  // Sosial Ekonomi
  pendidikanTerakhir: varchar('pendidikan_terakhir', { length: 50 }),
  pekerjaan: varchar('pekerjaan', { length: 100 }),
  penghasilan: varchar('penghasilan', { length: 50 }),

  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

// Junction table: menghubungkan Santri dengan Orang Tua / Wali
export const santriParents = pgTable('admissions_santri_parents', {
  id: serial('id').primaryKey(),
  santriId: integer('santri_id').notNull().references(() => santri.id, { onDelete: 'cascade' }),
  parentId: integer('parent_id').notNull().references(() => admissionsParents.id, { onDelete: 'cascade' }),

  // Hubungan: 'Ayah Kandung', 'Ibu Kandung', 'Wali', 'Ayah Tiri', 'Ibu Tiri', dll.
  hubungan: varchar('hubungan', { length: 50 }).notNull(),

  // Apakah ini kontak utama yang dihubungi?
  isPrimaryContact: boolean('is_primary_contact').default(false).notNull(),
});

export const admissionsParentsRelations = relations(admissionsParents, ({ many }) => ({
  children: many(santriParents),
}));

export const santriParentsRelations = relations(santriParents, ({ one }) => ({
  santri: one(santri, {
    fields: [santriParents.santriId],
    references: [santri.id],
  }),
  parent: one(admissionsParents, {
    fields: [santriParents.parentId],
    references: [admissionsParents.id],
  }),
}));
