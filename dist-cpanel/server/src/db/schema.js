"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faq = exports.foundersRelations = exports.founders = exports.websiteSettings = exports.websiteRegistrationFlow = exports.blogTestimonials = exports.formConfig = exports.strukturOrganisasi = exports.blogAnnouncements = exports.blogPostTagsRelations = exports.blogPostTags = exports.blogPostsRelations = exports.blogPosts = exports.blogTagsRelations = exports.blogTags = exports.blogCategoriesRelations = exports.blogCategories = exports.paymentsRelations = exports.payments = exports.bankAccounts = exports.examResultsRelations = exports.examResults = exports.examSchedulesRelations = exports.examSchedules = exports.santriRelations = exports.santri = exports.notificationsRelations = exports.notifications = exports.loginHistoryRelations = exports.loginHistory = exports.publicationDiscussionsRelations = exports.publicationArticleAuditsRelations = exports.publicationArticleAudits = exports.publicationCollaborationInvitesRelations = exports.publicationCollaborationMembersRelations = exports.publicationCollaborationsRelations = exports.publicationProfilesRelations = exports.usersRelations = exports.publicationArticlesRelations = exports.publicationVolumesRelations = exports.publicationCategoriesRelations = exports.publicationDiscussions = exports.publicationCollaborationInvites = exports.publicationCollaborationMembers = exports.publicationCollaborations = exports.publicationArticles = exports.publicationVolumes = exports.publicationCategories = exports.publicationProfiles = exports.users = void 0;
exports.admissionsParents = exports.mediaFilesRelations = exports.mediaLogs = exports.mediaFiles = exports.mediaAccounts = exports.documentTemplates = exports.documentLogs = exports.documentSettings = exports.systemSettings = exports.adminConvertedImages = exports.adminBugnotes = exports.informasiTambahan = exports.tenagaPengajarRelations = exports.tenagaPengajar = exports.bagianJabatanRelations = exports.bagianJabatan = exports.media = exports.statistik = exports.seragam = exports.socialMedia = exports.contactPersons = exports.biayaPendidikan = exports.alurPendaftaran = exports.persyaratan = exports.jadwalHarian = exports.dokumentasiImagesRelations = exports.dokumentasiImages = exports.dokumentasiRelations = exports.dokumentasi = exports.ekstrakurikulerImagesRelations = exports.ekstrakurikulerImages = exports.ekstrakurikulerRelations = exports.ekstrakurikuler = exports.fasilitas = exports.programPendidikanImagesRelations = exports.programPendidikanImages = exports.programPendidikanRelations = exports.programPendidikan = exports.visiMisi = exports.sejarahTimelineImagesRelations = exports.sejarahTimelineImages = exports.sejarahTimelineRelations = exports.sejarahTimeline = exports.heroSection = exports.kontak = exports.whatsappTemplatesRelations = exports.whatsappTemplates = exports.whatsappTemplateCategoriesRelations = exports.whatsappTemplateCategories = exports.programs = void 0;
exports.admissionsParentsRelations = exports.santriParents = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// ... (existing tables)
exports.users = (0, pg_core_1.pgTable)('users_user', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    password: (0, pg_core_1.varchar)('password', { length: 128 }).notNull(),
    lastLogin: (0, pg_core_1.timestamp)('last_login', { mode: 'string' }),
    isSuperuser: (0, pg_core_1.boolean)('is_superuser').notNull(),
    username: (0, pg_core_1.varchar)('username', { length: 150 }).notNull().unique(),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 150 }).notNull(),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 150 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 254 }).notNull(),
    isStaff: (0, pg_core_1.boolean)('is_staff').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').notNull(),
    dateJoined: (0, pg_core_1.timestamp)('date_joined', { mode: 'string' }).notNull(),
    role: (0, pg_core_1.varchar)('role', { length: 20 }).notNull(),
    phone: (0, pg_core_1.varchar)('phone', { length: 20 }).notNull(),
    avatar: (0, pg_core_1.text)('avatar'),
    isNotificationSeen: (0, pg_core_1.boolean)('is_notification_seen').default(false).notNull(),
    isVerified: (0, pg_core_1.boolean)('is_verified').default(false).notNull(),
    verificationStatus: (0, pg_core_1.varchar)('verification_status', { length: 20 }).default('none').notNull(),
    rejectedReason: (0, pg_core_1.text)('rejected_reason'),
    // Publication specific fields
    publicationRole: (0, pg_core_1.varchar)('publication_role', { length: 20 }).default('none'), // 'author', 'editor', 'reviewer'
    publicationStatus: (0, pg_core_1.varchar)('publication_status', { length: 20 }).default('none'), // 'pending', 'approved', 'rejected'
    isPublicationRegistered: (0, pg_core_1.boolean)('is_publication_registered').default(false),
    publicationVerified: (0, pg_core_1.boolean)('publication_verified').default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.publicationProfiles = (0, pg_core_1.pgTable)('publication_profiles', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').notNull().references(() => exports.users.id).unique(),
    bio: (0, pg_core_1.text)('bio'),
    institution: (0, pg_core_1.varchar)('institution', { length: 200 }),
    whatsapp: (0, pg_core_1.varchar)('whatsapp', { length: 20 }),
    expertise: (0, pg_core_1.text)('expertise'), // Comma separated list of expertise
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull().defaultNow(),
});
exports.publicationCategories = (0, pg_core_1.pgTable)('publication_categories', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 100 }).notNull().unique(),
    type: (0, pg_core_1.varchar)('type', { length: 20 }).notNull(), // 'article', 'journal'
    description: (0, pg_core_1.text)('description'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull().defaultNow(),
});
exports.publicationVolumes = (0, pg_core_1.pgTable)('publication_volumes', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(), // "Vol 1 No 1"
    year: (0, pg_core_1.integer)('year').notNull(),
    description: (0, pg_core_1.text)('description'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    isPublished: (0, pg_core_1.boolean)('is_published').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull().defaultNow(),
});
exports.publicationArticles = (0, pg_core_1.pgTable)('publication_articles', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 255 }).notNull().unique(),
    content: (0, pg_core_1.text)('content').notNull(),
    excerpt: (0, pg_core_1.text)('excerpt').notNull(),
    featuredImage: (0, pg_core_1.text)('featured_image'),
    authorId: (0, pg_core_1.integer)('author_id').notNull().references(() => exports.users.id),
    categoryId: (0, pg_core_1.integer)('category_id').references(() => exports.publicationCategories.id),
    type: (0, pg_core_1.varchar)('type', { length: 20 }).notNull(), // 'article', 'journal'
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('draft').notNull(), // 'draft', 'pending', 'approved', 'rejected'
    approvedById: (0, pg_core_1.integer)('approved_by_id').references(() => exports.users.id),
    approvedAt: (0, pg_core_1.timestamp)('approved_at', { mode: 'string' }),
    rejectionReason: (0, pg_core_1.text)('rejection_reason'),
    viewsCount: (0, pg_core_1.integer)('views_count').default(0).notNull(),
    volumeId: (0, pg_core_1.integer)('volume_id').references(() => exports.publicationVolumes.id), // For journals
    collaborationId: (0, pg_core_1.integer)('collaboration_id').references(() => exports.publicationCollaborations.id), // For collaboration projects
    pdfFile: (0, pg_core_1.text)('pdf_file'), // For journals
    keywords: (0, pg_core_1.text)('keywords'), // For SEO/Tags
    metaTitle: (0, pg_core_1.varchar)('meta_title', { length: 255 }),
    metaDescription: (0, pg_core_1.text)('meta_description'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull().defaultNow(),
});
exports.publicationCollaborations = (0, pg_core_1.pgTable)('publication_collaborations', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    ownerId: (0, pg_core_1.integer)('owner_id').notNull().references(() => exports.users.id),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('active').notNull(), // 'active', 'completed', 'archived'
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull().defaultNow(),
});
exports.publicationCollaborationMembers = (0, pg_core_1.pgTable)('publication_collaboration_members', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    collaborationId: (0, pg_core_1.integer)('collaboration_id').notNull().references(() => exports.publicationCollaborations.id),
    userId: (0, pg_core_1.integer)('user_id').notNull().references(() => exports.users.id),
    role: (0, pg_core_1.varchar)('role', { length: 50 }).notNull(), // 'owner', 'editor', 'viewer'
    joinedAt: (0, pg_core_1.timestamp)('joined_at', { mode: 'string' }).notNull().defaultNow(),
});
exports.publicationCollaborationInvites = (0, pg_core_1.pgTable)('publication_collaboration_invites', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    collaborationId: (0, pg_core_1.integer)('collaboration_id').notNull().references(() => exports.publicationCollaborations.id),
    inviterId: (0, pg_core_1.integer)('inviter_id').notNull().references(() => exports.users.id),
    inviteeId: (0, pg_core_1.integer)('invitee_id').notNull().references(() => exports.users.id),
    role: (0, pg_core_1.varchar)('role', { length: 50 }).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull().default('pending'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull().defaultNow(),
    respondedAt: (0, pg_core_1.timestamp)('responded_at', { mode: 'string' }),
});
exports.publicationDiscussions = (0, pg_core_1.pgTable)('publication_discussions', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    articleId: (0, pg_core_1.integer)('article_id').references(() => exports.publicationArticles.id), // Optional, can be general discussion
    userId: (0, pg_core_1.integer)('user_id').notNull().references(() => exports.users.id),
    content: (0, pg_core_1.text)('content').notNull(),
    parentId: (0, pg_core_1.integer)('parent_id'), // For threaded replies (self-reference handled in logic)
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull().defaultNow(),
});
exports.publicationCategoriesRelations = (0, drizzle_orm_1.relations)(exports.publicationCategories, ({ many }) => ({
    articles: many(exports.publicationArticles),
}));
exports.publicationVolumesRelations = (0, drizzle_orm_1.relations)(exports.publicationVolumes, ({ many }) => ({
    journals: many(exports.publicationArticles),
}));
exports.publicationArticlesRelations = (0, drizzle_orm_1.relations)(exports.publicationArticles, ({ one, many }) => ({
    author: one(exports.users, {
        fields: [exports.publicationArticles.authorId],
        references: [exports.users.id],
        relationName: 'publicationArticles',
    }),
    category: one(exports.publicationCategories, {
        fields: [exports.publicationArticles.categoryId],
        references: [exports.publicationCategories.id],
    }),
    approvedBy: one(exports.users, {
        fields: [exports.publicationArticles.approvedById],
        references: [exports.users.id],
        relationName: 'approvedArticles',
    }),
    volume: one(exports.publicationVolumes, {
        fields: [exports.publicationArticles.volumeId],
        references: [exports.publicationVolumes.id],
    }),
    collaboration: one(exports.publicationCollaborations, {
        fields: [exports.publicationArticles.collaborationId],
        references: [exports.publicationCollaborations.id],
    }),
    discussions: many(exports.publicationDiscussions),
}));
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many, one }) => ({
    loginHistory: many(exports.loginHistory),
    blogPosts: many(exports.blogPosts),
    verifiedPayments: many(exports.payments),
    notifications: many(exports.notifications),
    mediaFiles: many(exports.mediaFiles),
    mediaLogs: many(exports.mediaLogs),
    publicationArticles: many(exports.publicationArticles, { relationName: 'publicationArticles' }),
    approvedArticles: many(exports.publicationArticles, { relationName: 'approvedArticles' }),
    publicationProfile: one(exports.publicationProfiles, {
        fields: [exports.users.id],
        references: [exports.publicationProfiles.userId],
    }),
    collaborationsOwned: many(exports.publicationCollaborations, { relationName: 'collaborationOwner' }),
    collaborationMemberships: many(exports.publicationCollaborationMembers),
    discussions: many(exports.publicationDiscussions),
}));
exports.publicationProfilesRelations = (0, drizzle_orm_1.relations)(exports.publicationProfiles, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.publicationProfiles.userId],
        references: [exports.users.id],
    }),
}));
exports.publicationCollaborationsRelations = (0, drizzle_orm_1.relations)(exports.publicationCollaborations, ({ one, many }) => ({
    owner: one(exports.users, {
        fields: [exports.publicationCollaborations.ownerId],
        references: [exports.users.id],
        relationName: 'collaborationOwner',
    }),
    members: many(exports.publicationCollaborationMembers),
    invites: many(exports.publicationCollaborationInvites),
    articles: many(exports.publicationArticles),
}));
exports.publicationCollaborationMembersRelations = (0, drizzle_orm_1.relations)(exports.publicationCollaborationMembers, ({ one }) => ({
    collaboration: one(exports.publicationCollaborations, {
        fields: [exports.publicationCollaborationMembers.collaborationId],
        references: [exports.publicationCollaborations.id],
    }),
    user: one(exports.users, {
        fields: [exports.publicationCollaborationMembers.userId],
        references: [exports.users.id],
    }),
}));
exports.publicationCollaborationInvitesRelations = (0, drizzle_orm_1.relations)(exports.publicationCollaborationInvites, ({ one }) => ({
    collaboration: one(exports.publicationCollaborations, {
        fields: [exports.publicationCollaborationInvites.collaborationId],
        references: [exports.publicationCollaborations.id],
    }),
    inviter: one(exports.users, {
        fields: [exports.publicationCollaborationInvites.inviterId],
        references: [exports.users.id],
    }),
    invitee: one(exports.users, {
        fields: [exports.publicationCollaborationInvites.inviteeId],
        references: [exports.users.id],
    }),
}));
exports.publicationArticleAudits = (0, pg_core_1.pgTable)('publication_article_audits', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    articleId: (0, pg_core_1.integer)('article_id').notNull().references(() => exports.publicationArticles.id),
    userId: (0, pg_core_1.integer)('user_id').notNull().references(() => exports.users.id),
    changeSummary: (0, pg_core_1.text)('change_summary').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull().defaultNow(),
});
exports.publicationArticleAuditsRelations = (0, drizzle_orm_1.relations)(exports.publicationArticleAudits, ({ one }) => ({
    article: one(exports.publicationArticles, {
        fields: [exports.publicationArticleAudits.articleId],
        references: [exports.publicationArticles.id],
    }),
    user: one(exports.users, {
        fields: [exports.publicationArticleAudits.userId],
        references: [exports.users.id],
    }),
}));
exports.publicationDiscussionsRelations = (0, drizzle_orm_1.relations)(exports.publicationDiscussions, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.publicationDiscussions.userId],
        references: [exports.users.id],
    }),
    article: one(exports.publicationArticles, {
        fields: [exports.publicationDiscussions.articleId],
        references: [exports.publicationArticles.id],
    }),
}));
exports.loginHistory = (0, pg_core_1.pgTable)('users_loginhistory', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    username: (0, pg_core_1.varchar)('username', { length: 150 }).notNull(),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 39 }),
    userAgent: (0, pg_core_1.text)('user_agent').notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 10 }).notNull(),
    errorMessage: (0, pg_core_1.varchar)('error_message', { length: 255 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id),
});
exports.loginHistoryRelations = (0, drizzle_orm_1.relations)(exports.loginHistory, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.loginHistory.userId],
        references: [exports.users.id],
    }),
}));
exports.notifications = (0, pg_core_1.pgTable)('notifications', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').notNull().references(() => exports.users.id),
    title: (0, pg_core_1.varchar)('title', { length: 200 }).notNull(),
    message: (0, pg_core_1.text)('message').notNull(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    isRead: (0, pg_core_1.boolean)('is_read').default(false).notNull(),
    actionUrl: (0, pg_core_1.varchar)('action_url', { length: 200 }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
});
exports.notificationsRelations = (0, drizzle_orm_1.relations)(exports.notifications, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.notifications.userId],
        references: [exports.users.id],
    }),
}));
exports.santri = (0, pg_core_1.pgTable)('admissions_santri', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    namaLengkap: (0, pg_core_1.varchar)('nama_lengkap', { length: 200 }).notNull(),
    nisn: (0, pg_core_1.varchar)('nisn', { length: 10 }).notNull().unique(),
    tempatLahir: (0, pg_core_1.varchar)('tempat_lahir', { length: 100 }).notNull(),
    tanggalLahir: (0, pg_core_1.date)('tanggal_lahir', { mode: 'string' }).notNull(),
    jenisKelamin: (0, pg_core_1.varchar)('jenis_kelamin', { length: 10 }).notNull(),
    agama: (0, pg_core_1.varchar)('agama', { length: 20 }).notNull(),
    golonganDarah: (0, pg_core_1.varchar)('golongan_darah', { length: 3 }).notNull(),
    tinggiBadan: (0, pg_core_1.integer)('tinggi_badan'),
    beratBadan: (0, pg_core_1.integer)('berat_badan'),
    namaAyah: (0, pg_core_1.varchar)('nama_ayah', { length: 200 }).notNull(),
    nikAyah: (0, pg_core_1.varchar)('nik_ayah', { length: 16 }).notNull(),
    namaIbu: (0, pg_core_1.varchar)('nama_ibu', { length: 200 }).notNull(),
    nikIbu: (0, pg_core_1.varchar)('nik_ibu', { length: 16 }).notNull(),
    pekerjaanAyah: (0, pg_core_1.varchar)('pekerjaan_ayah', { length: 100 }).notNull(),
    pekerjaanIbu: (0, pg_core_1.varchar)('pekerjaan_ibu', { length: 100 }).notNull(),
    noHpAyah: (0, pg_core_1.varchar)('no_hp_ayah', { length: 15 }).notNull(),
    noHpIbu: (0, pg_core_1.varchar)('no_hp_ibu', { length: 15 }).notNull(),
    alamatOrangTua: (0, pg_core_1.text)('alamat_orangtua').notNull(),
    alamat: (0, pg_core_1.text)('alamat').notNull(),
    noHp: (0, pg_core_1.varchar)('no_hp', { length: 15 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 254 }).notNull(),
    asalSekolah: (0, pg_core_1.varchar)('asal_sekolah', { length: 200 }).notNull(),
    kelasTerakhir: (0, pg_core_1.varchar)('kelas_terakhir', { length: 50 }).notNull(),
    tahunLulus: (0, pg_core_1.varchar)('tahun_lulus', { length: 4 }).notNull(),
    noIjazah: (0, pg_core_1.varchar)('no_ijazah', { length: 50 }).notNull(),
    fotoSantri: (0, pg_core_1.text)('foto_santri'),
    fotoKtp: (0, pg_core_1.text)('foto_ktp'),
    fotoAkta: (0, pg_core_1.text)('foto_akta'),
    fotoIjazah: (0, pg_core_1.text)('foto_ijazah'),
    fotoKk: (0, pg_core_1.text)('foto_kk'),
    suratSehat: (0, pg_core_1.text)('surat_sehat'),
    fotoSantriApproved: (0, pg_core_1.boolean)('foto_santri_approved').notNull(),
    fotoKtpApproved: (0, pg_core_1.boolean)('foto_ktp_approved').notNull(),
    fotoAktaApproved: (0, pg_core_1.boolean)('foto_akta_approved').notNull(),
    fotoIjazahApproved: (0, pg_core_1.boolean)('foto_ijazah_approved').notNull(),
    fotoKkApproved: (0, pg_core_1.boolean)('foto_kk_approved').notNull().default(false),
    suratSehatApproved: (0, pg_core_1.boolean)('surat_sehat_approved').notNull(),
    catatan: (0, pg_core_1.text)('catatan').notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
    agamaAyah: (0, pg_core_1.varchar)('agama_ayah', { length: 20 }).notNull(),
    agamaIbu: (0, pg_core_1.varchar)('agama_ibu', { length: 20 }).notNull(),
    anakKe: (0, pg_core_1.integer)('anak_ke'),
    bahasaSehariHari: (0, pg_core_1.varchar)('bahasa_sehari_hari', { length: 50 }).notNull(),
    desa: (0, pg_core_1.varchar)('desa', { length: 100 }).notNull(),
    jumlahSaudara: (0, pg_core_1.integer)('jumlah_saudara'),
    kabupaten: (0, pg_core_1.varchar)('kabupaten', { length: 100 }).notNull(),
    kecamatan: (0, pg_core_1.varchar)('kecamatan', { length: 100 }).notNull(),
    kelasDiterima: (0, pg_core_1.varchar)('kelas_diterima', { length: 50 }).notNull(),
    kewarganegaraan: (0, pg_core_1.varchar)('kewarganegaraan', { length: 50 }).notNull(),
    kewarganegaraanAyah: (0, pg_core_1.varchar)('kewarganegaraan_ayah', { length: 50 }).notNull(),
    kewarganegaraanIbu: (0, pg_core_1.varchar)('kewarganegaraan_ibu', { length: 50 }).notNull(),
    kodePos: (0, pg_core_1.varchar)('kode_pos', { length: 10 }).notNull(),
    namaPanggilan: (0, pg_core_1.varchar)('nama_panggilan', { length: 100 }).notNull(),
    npsnSekolah: (0, pg_core_1.varchar)('npsn_sekolah', { length: 20 }).notNull(),
    pendidikanAyah: (0, pg_core_1.varchar)('pendidikan_ayah', { length: 50 }).notNull(),
    pendidikanIbu: (0, pg_core_1.varchar)('pendidikan_ibu', { length: 50 }).notNull(),
    penghasilanAyah: (0, pg_core_1.varchar)('penghasilan_ayah', { length: 50 }),
    penghasilanIbu: (0, pg_core_1.varchar)('penghasilan_ibu', { length: 50 }),
    provinsi: (0, pg_core_1.varchar)('provinsi', { length: 100 }).notNull(),
    riwayatPenyakit: (0, pg_core_1.varchar)('riwayat_penyakit', { length: 200 }).notNull(),
    statusAyah: (0, pg_core_1.varchar)('status_ayah', { length: 10 }).notNull(),
    statusIbu: (0, pg_core_1.varchar)('status_ibu', { length: 10 }).notNull(),
    tanggalDiterima: (0, pg_core_1.date)('tanggal_diterima', { mode: 'string' }),
    tanggalLahirAyah: (0, pg_core_1.date)('tanggal_lahir_ayah', { mode: 'string' }),
    tanggalLahirIbu: (0, pg_core_1.date)('tanggal_lahir_ibu', { mode: 'string' }),
    tempatLahirAyah: (0, pg_core_1.varchar)('tempat_lahir_ayah', { length: 100 }).notNull(),
    tempatLahirIbu: (0, pg_core_1.varchar)('tempat_lahir_ibu', { length: 100 }).notNull(),
    tinggalDengan: (0, pg_core_1.varchar)('tinggal_dengan', { length: 50 }).notNull(),
});
exports.santriRelations = (0, drizzle_orm_1.relations)(exports.santri, ({ one, many }) => ({
    payment: one(exports.payments, {
        fields: [exports.santri.id],
        references: [exports.payments.santriId],
    }),
    examSchedules: many(exports.examSchedules),
    examResult: one(exports.examResults),
    parents: many(exports.santriParents),
}));
exports.examSchedules = (0, pg_core_1.pgTable)('admissions_exam_schedules', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    santriId: (0, pg_core_1.integer)('santri_id').notNull().references(() => exports.santri.id),
    type: (0, pg_core_1.varchar)('type', { length: 20 }).notNull(),
    scheduledDate: (0, pg_core_1.timestamp)('scheduled_date', { mode: 'string' }).notNull(),
    location: (0, pg_core_1.varchar)('location', { length: 200 }).notNull(),
    examiner: (0, pg_core_1.varchar)('examiner', { length: 200 }),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull().default('scheduled'),
    notes: (0, pg_core_1.text)('notes'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.examSchedulesRelations = (0, drizzle_orm_1.relations)(exports.examSchedules, ({ one }) => ({
    santri: one(exports.santri, {
        fields: [exports.examSchedules.santriId],
        references: [exports.santri.id],
    }),
}));
exports.examResults = (0, pg_core_1.pgTable)('admissions_exam_results', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    santriId: (0, pg_core_1.integer)('santri_id').notNull().references(() => exports.santri.id),
    writtenTestScore: (0, pg_core_1.decimal)('written_test_score', { precision: 5, scale: 2 }),
    interviewScore: (0, pg_core_1.decimal)('interview_test_score', { precision: 5, scale: 2 }),
    quranTestScore: (0, pg_core_1.decimal)('quran_test_score', { precision: 5, scale: 2 }),
    totalScore: (0, pg_core_1.decimal)('total_score', { precision: 5, scale: 2 }),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull().default('pending'),
    decisionDate: (0, pg_core_1.timestamp)('decision_date', { mode: 'string' }),
    isPublished: (0, pg_core_1.boolean)('is_published').notNull().default(false),
    notes: (0, pg_core_1.text)('notes'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.examResultsRelations = (0, drizzle_orm_1.relations)(exports.examResults, ({ one }) => ({
    santri: one(exports.santri, {
        fields: [exports.examResults.santriId],
        references: [exports.santri.id],
    }),
}));
exports.bankAccounts = (0, pg_core_1.pgTable)('payments_bankaccount', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    namaBank: (0, pg_core_1.varchar)('nama_bank', { length: 100 }).notNull(),
    namaBankCustom: (0, pg_core_1.varchar)('nama_bank_custom', { length: 100 }).notNull(),
    logo: (0, pg_core_1.text)('logo'),
    nomorRekening: (0, pg_core_1.varchar)('nomor_rekening', { length: 50 }).notNull(),
    namaPemilik: (0, pg_core_1.varchar)('nama_pemilik_rekening', { length: 200 }).notNull(),
    biayaPendaftaran: (0, pg_core_1.decimal)('biaya_pendaftaran', { precision: 10, scale: 0 }).notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').notNull(),
    keterangan: (0, pg_core_1.text)('keterangan').notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.payments = (0, pg_core_1.pgTable)('payments_payment', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    bankPengirim: (0, pg_core_1.varchar)('bank_pengirim', { length: 50 }).notNull(),
    noRekeningPengirim: (0, pg_core_1.varchar)('no_rekening_pengirim', { length: 50 }).notNull(),
    namaPemilikRekening: (0, pg_core_1.varchar)('nama_pemilik_rekening', { length: 200 }).notNull(),
    rekeningTujuan: (0, pg_core_1.varchar)('rekening_tujuan', { length: 50 }).notNull(),
    jumlahTransfer: (0, pg_core_1.decimal)('jumlah_transfer', { precision: 12, scale: 2 }).notNull(),
    buktiTransfer: (0, pg_core_1.text)('bukti_transfer'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull(),
    catatan: (0, pg_core_1.text)('catatan').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
    verifiedAt: (0, pg_core_1.timestamp)('verified_at', { mode: 'string' }),
    santriId: (0, pg_core_1.integer)('santri_id').notNull().references(() => exports.santri.id),
    verifiedById: (0, pg_core_1.integer)('verified_by_id').references(() => exports.users.id),
});
exports.paymentsRelations = (0, drizzle_orm_1.relations)(exports.payments, ({ one }) => ({
    santri: one(exports.santri, {
        fields: [exports.payments.santriId],
        references: [exports.santri.id],
    }),
    verifiedBy: one(exports.users, {
        fields: [exports.payments.verifiedById],
        references: [exports.users.id],
    }),
}));
exports.blogCategories = (0, pg_core_1.pgTable)('blog_category', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull().unique(),
    slug: (0, pg_core_1.varchar)('slug', { length: 100 }).notNull().unique(),
    order: (0, pg_core_1.integer)('order').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
});
exports.blogCategoriesRelations = (0, drizzle_orm_1.relations)(exports.blogCategories, ({ many }) => ({
    posts: many(exports.blogPosts),
}));
exports.blogTags = (0, pg_core_1.pgTable)('blog_tag', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 50 }).notNull().unique(),
    slug: (0, pg_core_1.varchar)('slug', { length: 50 }).notNull().unique(),
    order: (0, pg_core_1.integer)('order').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
});
exports.blogTagsRelations = (0, drizzle_orm_1.relations)(exports.blogTags, ({ many }) => ({
    posts: many(exports.blogPostTags),
}));
exports.blogPosts = (0, pg_core_1.pgTable)('blog_blogpost', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    title: (0, pg_core_1.varchar)('title', { length: 200 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 200 }).notNull().unique(),
    content: (0, pg_core_1.text)('content').notNull(),
    excerpt: (0, pg_core_1.text)('excerpt').notNull(),
    featuredImage: (0, pg_core_1.text)('featured_image'),
    metaTitle: (0, pg_core_1.varchar)('meta_title', { length: 200 }).notNull(),
    metaDescription: (0, pg_core_1.text)('meta_description').notNull(),
    metaKeywords: (0, pg_core_1.varchar)('meta_keywords', { length: 255 }).notNull(),
    videoFile: (0, pg_core_1.text)('video_file'),
    videoUrl: (0, pg_core_1.varchar)('video_url', { length: 500 }),
    gallery: (0, pg_core_1.json)('gallery').$type(),
    viewsCount: (0, pg_core_1.integer)('views_count').notNull().default(0),
    likesCount: (0, pg_core_1.integer)('likes_count').notNull().default(0),
    sharesCount: (0, pg_core_1.integer)('shares_count').notNull().default(0),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull().default('draft'),
    publishedAt: (0, pg_core_1.timestamp)('published_at', { mode: 'string' }),
    isFeatured: (0, pg_core_1.boolean)('is_featured').notNull().default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull().defaultNow(),
    authorId: (0, pg_core_1.integer)('author_id').notNull().references(() => exports.users.id),
    categoryId: (0, pg_core_1.integer)('category_id').references(() => exports.blogCategories.id),
});
exports.blogPostsRelations = (0, drizzle_orm_1.relations)(exports.blogPosts, ({ one, many }) => ({
    author: one(exports.users, {
        fields: [exports.blogPosts.authorId],
        references: [exports.users.id],
    }),
    category: one(exports.blogCategories, {
        fields: [exports.blogPosts.categoryId],
        references: [exports.blogCategories.id],
    }),
    tags: many(exports.blogPostTags),
}));
exports.blogPostTags = (0, pg_core_1.pgTable)('blog_blogpost_tags', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    blogpostId: (0, pg_core_1.integer)('blogpost_id').notNull().references(() => exports.blogPosts.id),
    tagId: (0, pg_core_1.integer)('tag_id').notNull().references(() => exports.blogTags.id),
});
exports.blogPostTagsRelations = (0, drizzle_orm_1.relations)(exports.blogPostTags, ({ one }) => ({
    post: one(exports.blogPosts, {
        fields: [exports.blogPostTags.blogpostId],
        references: [exports.blogPosts.id],
    }),
    tag: one(exports.blogTags, {
        fields: [exports.blogPostTags.tagId],
        references: [exports.blogTags.id],
    }),
}));
exports.blogAnnouncements = (0, pg_core_1.pgTable)('blog_pengumuman', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    judul: (0, pg_core_1.varchar)('judul', { length: 200 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 200 }).notNull().unique(),
    konten: (0, pg_core_1.text)('konten').notNull(),
    gambar: (0, pg_core_1.text)('gambar'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull(),
    isPenting: (0, pg_core_1.boolean)('is_penting').notNull(),
    publishedAt: (0, pg_core_1.timestamp)('published_at', { mode: 'string' }),
    metaTitle: (0, pg_core_1.varchar)('meta_title', { length: 200 }).notNull(),
    metaDescription: (0, pg_core_1.text)('meta_description').notNull(),
    // Popup Pengumuman fields
    popupEnabled: (0, pg_core_1.boolean)('popup_enabled').default(false).notNull(),
    popupImage: (0, pg_core_1.text)('popup_image'),
    popupStartDate: (0, pg_core_1.timestamp)('popup_start_date', { mode: 'string' }),
    popupEndDate: (0, pg_core_1.timestamp)('popup_end_date', { mode: 'string' }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
// Struktur Organisasi
exports.strukturOrganisasi = (0, pg_core_1.pgTable)('core_struktur_organisasi', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    nama: (0, pg_core_1.varchar)('nama', { length: 200 }).notNull(),
    jabatan: (0, pg_core_1.varchar)('jabatan', { length: 200 }).notNull(),
    foto: (0, pg_core_1.text)('foto'),
    parentId: (0, pg_core_1.integer)('parent_id'),
    level: (0, pg_core_1.integer)('level').notNull().default(0), // 0=top, 1=dept head, 2=staff
    order: (0, pg_core_1.integer)('order').notNull().default(0),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull().defaultNow(),
});
// Konfigurasi Isi Formulir
exports.formConfig = (0, pg_core_1.pgTable)('core_form_config', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    formName: (0, pg_core_1.varchar)('form_name', { length: 100 }).notNull(), // 'pendaftaran'
    fieldKey: (0, pg_core_1.varchar)('field_key', { length: 100 }).notNull(),
    fieldLabel: (0, pg_core_1.varchar)('field_label', { length: 200 }).notNull(),
    fieldValue: (0, pg_core_1.text)('field_value').notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull().defaultNow(),
});
exports.blogTestimonials = (0, pg_core_1.pgTable)('blog_testimoni', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    nama: (0, pg_core_1.varchar)('nama', { length: 200 }).notNull(),
    foto: (0, pg_core_1.text)('foto'),
    jabatan: (0, pg_core_1.varchar)('jabatan', { length: 200 }).notNull(),
    testimoni: (0, pg_core_1.text)('testimoni').notNull(),
    rating: (0, pg_core_1.integer)('rating').notNull(),
    isPublished: (0, pg_core_1.boolean)('is_published').notNull().default(true),
    order: (0, pg_core_1.integer)('order').notNull().default(0),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull().defaultNow(),
});
exports.websiteRegistrationFlow = (0, pg_core_1.pgTable)('core_registration_flow', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    title: (0, pg_core_1.varchar)('title', { length: 200 }).notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    icon: (0, pg_core_1.text)('icon').notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.websiteSettings = (0, pg_core_1.pgTable)('core_websitesettings', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    namaPondok: (0, pg_core_1.varchar)('nama_pondok', { length: 200 }).notNull(),
    arabicName: (0, pg_core_1.varchar)('arabic_name', { length: 500 }).notNull(),
    alamat: (0, pg_core_1.text)('alamat').notNull(),
    logo: (0, pg_core_1.text)('logo'),
    noTelepon: (0, pg_core_1.varchar)('no_telepon', { length: 20 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 254 }).notNull(),
    website: (0, pg_core_1.varchar)('website', { length: 200 }).notNull(),
    facebook: (0, pg_core_1.varchar)('facebook', { length: 200 }).notNull(),
    instagram: (0, pg_core_1.varchar)('instagram', { length: 200 }).notNull(),
    twitter: (0, pg_core_1.varchar)('twitter', { length: 200 }).notNull(),
    tiktok: (0, pg_core_1.varchar)('tiktok', { length: 200 }).notNull(),
    heroTitle: (0, pg_core_1.varchar)('hero_title', { length: 200 }).notNull(),
    heroSubtitle: (0, pg_core_1.varchar)('hero_subtitle', { length: 200 }).notNull(),
    heroTagline: (0, pg_core_1.varchar)('hero_tagline', { length: 300 }).notNull(),
    heroCtaPrimaryText: (0, pg_core_1.varchar)('hero_cta_primary_text', { length: 100 }).notNull(),
    heroCtaPrimaryLink: (0, pg_core_1.varchar)('hero_cta_primary_link', { length: 200 }).notNull(),
    heroCtaSecondaryText: (0, pg_core_1.varchar)('hero_cta_secondary_text', { length: 100 }).notNull(),
    heroCtaSecondaryLink: (0, pg_core_1.varchar)('hero_cta_secondary_link', { length: 200 }).notNull(),
    ctaTitle: (0, pg_core_1.varchar)('cta_title', { length: 200 }).notNull().default('Siap Bergabung?'),
    ctaDescription: (0, pg_core_1.text)('cta_description').notNull(),
    ctaPrimaryText: (0, pg_core_1.varchar)('cta_primary_text', { length: 100 }).notNull().default('Daftar Sekarang'),
    ctaPrimaryLink: (0, pg_core_1.varchar)('cta_primary_link', { length: 200 }).notNull().default('/pendaftaran'),
    ctaSecondaryText: (0, pg_core_1.varchar)('cta_secondary_text', { length: 100 }).notNull().default('Hubungi Kami'),
    ctaSecondaryLink: (0, pg_core_1.varchar)('cta_secondary_link', { length: 200 }).notNull().default('/kontak'),
    announcementText: (0, pg_core_1.varchar)('announcement_text', { length: 300 }),
    announcementLink: (0, pg_core_1.varchar)('announcement_link', { length: 200 }),
    announcementActive: (0, pg_core_1.boolean)('announcement_active').default(false),
    lokasiPendaftaran: (0, pg_core_1.text)('lokasi_pendaftaran').notNull(),
    googleMapsLink: (0, pg_core_1.varchar)('google_maps_link', { length: 200 }).notNull(),
    googleMapsEmbedCode: (0, pg_core_1.text)('google_maps_embed_code').notNull(),
    qrCodeImage: (0, pg_core_1.text)('qr_code_image'),
    deskripsi: (0, pg_core_1.text)('deskripsi').notNull(),
    favicon: (0, pg_core_1.text)('favicon'),
    metaTitle: (0, pg_core_1.varchar)('meta_title', { length: 200 }).notNull(),
    metaDescription: (0, pg_core_1.text)('meta_description').notNull(),
    metaKeywords: (0, pg_core_1.varchar)('meta_keywords', { length: 500 }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
    headerMobileImage: (0, pg_core_1.text)('header_mobile_image'),
    headerMobileHeight: (0, pg_core_1.integer)('header_mobile_height').notNull(),
    maintenanceMessage: (0, pg_core_1.text)('maintenance_message').notNull(),
    maintenanceMode: (0, pg_core_1.boolean)('maintenance_mode').notNull(),
    profilSingkat: (0, pg_core_1.text)('profil_singkat'),
    profilLengkap: (0, pg_core_1.text)('profil_lengkap'),
    gambarProfil: (0, pg_core_1.text)('gambar_profil'),
});
exports.founders = (0, pg_core_1.pgTable)('core_founders', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    namaLengkap: (0, pg_core_1.varchar)('nama_lengkap', { length: 100 }).notNull(),
    tanggalLahir: (0, pg_core_1.date)('tanggal_lahir', { mode: 'string' }).notNull(),
    jabatan: (0, pg_core_1.varchar)('jabatan', { length: 50 }).notNull(),
    nik: (0, pg_core_1.text)('nik').notNull(),
    email: (0, pg_core_1.text)('email').notNull(),
    noTelepon: (0, pg_core_1.varchar)('no_telepon', { length: 20 }).notNull(),
    alamat: (0, pg_core_1.varchar)('alamat', { length: 255 }).notNull(),
    foto: (0, pg_core_1.text)('foto').notNull(),
    pendidikanTerakhir: (0, pg_core_1.varchar)('pendidikan_terakhir', { length: 20 }).notNull(),
    profilSingkat: (0, pg_core_1.text)('profil_singkat').notNull(),
    bioLengkap: (0, pg_core_1.text)('bio_lengkap'),
    riwayatPendidikan: (0, pg_core_1.text)('riwayat_pendidikan'),
    prestasi: (0, pg_core_1.text)('prestasi'),
    isDeleted: (0, pg_core_1.boolean)('is_deleted').notNull().default(false),
    createdBy: (0, pg_core_1.integer)('created_by').references(() => exports.users.id),
    updatedBy: (0, pg_core_1.integer)('updated_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.foundersRelations = (0, drizzle_orm_1.relations)(exports.founders, ({ one }) => ({
    creator: one(exports.users, {
        fields: [exports.founders.createdBy],
        references: [exports.users.id],
    }),
    updater: one(exports.users, {
        fields: [exports.founders.updatedBy],
        references: [exports.users.id],
    }),
}));
exports.faq = (0, pg_core_1.pgTable)('core_faq', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    pertanyaan: (0, pg_core_1.varchar)('pertanyaan', { length: 500 }).notNull(),
    jawaban: (0, pg_core_1.text)('jawaban').notNull(),
    kategori: (0, pg_core_1.varchar)('kategori', { length: 100 }).notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    isPublished: (0, pg_core_1.boolean)('is_published').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
});
exports.programs = (0, pg_core_1.pgTable)('core_program', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    nama: (0, pg_core_1.varchar)('nama', { length: 200 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 200 }).notNull().unique(),
    deskripsi: (0, pg_core_1.text)('deskripsi').notNull(),
    gambar: (0, pg_core_1.text)('gambar'),
    tanggalMulai: (0, pg_core_1.date)('tanggal_mulai', { mode: 'string' }),
    tanggalSelesai: (0, pg_core_1.date)('tanggal_selesai', { mode: 'string' }),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull(),
    isFeatured: (0, pg_core_1.boolean)('is_featured').notNull(),
    metaTitle: (0, pg_core_1.varchar)('meta_title', { length: 200 }).notNull(),
    metaDescription: (0, pg_core_1.text)('meta_description').notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.whatsappTemplateCategories = (0, pg_core_1.pgTable)('core_whatsapptemplatekategori', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    nama: (0, pg_core_1.varchar)('nama', { length: 100 }).notNull().unique(),
    slug: (0, pg_core_1.varchar)('slug', { length: 100 }).notNull().unique(),
    deskripsi: (0, pg_core_1.text)('deskripsi').notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.whatsappTemplateCategoriesRelations = (0, drizzle_orm_1.relations)(exports.whatsappTemplateCategories, ({ many }) => ({
    templates: many(exports.whatsappTemplates),
}));
exports.whatsappTemplates = (0, pg_core_1.pgTable)('core_whatsapptemplate', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    nama: (0, pg_core_1.varchar)('nama', { length: 200 }).notNull(),
    tipe: (0, pg_core_1.varchar)('tipe', { length: 20 }).notNull(),
    pesan: (0, pg_core_1.text)('pesan').notNull(),
    variabel: (0, pg_core_1.varchar)('variabel', { length: 500 }).notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
    kategoriId: (0, pg_core_1.integer)('kategori_id').references(() => exports.whatsappTemplateCategories.id),
});
exports.whatsappTemplatesRelations = (0, drizzle_orm_1.relations)(exports.whatsappTemplates, ({ one }) => ({
    kategori: one(exports.whatsappTemplateCategories, {
        fields: [exports.whatsappTemplates.kategoriId],
        references: [exports.whatsappTemplateCategories.id],
    }),
}));
exports.kontak = (0, pg_core_1.pgTable)('core_kontak', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    nama: (0, pg_core_1.varchar)('nama', { length: 200 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 254 }).notNull(),
    noHp: (0, pg_core_1.varchar)('no_hp', { length: 20 }).notNull(),
    subjek: (0, pg_core_1.varchar)('subjek', { length: 200 }).notNull(),
    pesan: (0, pg_core_1.text)('pesan').notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull(),
    balasan: (0, pg_core_1.text)('balasan').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.heroSection = (0, pg_core_1.pgTable)('core_herosection', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    title: (0, pg_core_1.varchar)('title', { length: 200 }).notNull(),
    subtitle: (0, pg_core_1.varchar)('subtitle', { length: 200 }).notNull(),
    image: (0, pg_core_1.text)('image'),
    order: (0, pg_core_1.integer)('order').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
});
exports.sejarahTimeline = (0, pg_core_1.pgTable)('core_sejarahtimeline', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    judul: (0, pg_core_1.varchar)('judul', { length: 200 }).notNull(),
    icon: (0, pg_core_1.text)('icon').notNull(),
    deskripsi: (0, pg_core_1.text)('deskripsi').notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
});
exports.sejarahTimelineRelations = (0, drizzle_orm_1.relations)(exports.sejarahTimeline, ({ many }) => ({
    images: many(exports.sejarahTimelineImages),
}));
exports.sejarahTimelineImages = (0, pg_core_1.pgTable)('core_sejarahtimelineimage', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    gambar: (0, pg_core_1.text)('gambar').notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    timelineId: (0, pg_core_1.integer)('timeline_id').notNull().references(() => exports.sejarahTimeline.id),
});
exports.sejarahTimelineImagesRelations = (0, drizzle_orm_1.relations)(exports.sejarahTimelineImages, ({ one }) => ({
    timeline: one(exports.sejarahTimeline, {
        fields: [exports.sejarahTimelineImages.timelineId],
        references: [exports.sejarahTimeline.id],
    }),
}));
exports.visiMisi = (0, pg_core_1.pgTable)('core_visimisi', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    visi: (0, pg_core_1.text)('visi').notNull(),
    misi: (0, pg_core_1.text)('misi').notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.programPendidikan = (0, pg_core_1.pgTable)('core_programpendidikan', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    nama: (0, pg_core_1.varchar)('nama', { length: 200 }).notNull(),
    akreditasi: (0, pg_core_1.varchar)('akreditasi', { length: 50 }).notNull(),
    icon: (0, pg_core_1.text)('icon').notNull(),
    gambar: (0, pg_core_1.text)('gambar'),
    order: (0, pg_core_1.integer)('order').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
});
exports.programPendidikanRelations = (0, drizzle_orm_1.relations)(exports.programPendidikan, ({ many }) => ({
    images: many(exports.programPendidikanImages),
}));
exports.programPendidikanImages = (0, pg_core_1.pgTable)('core_programpendidikanimage', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    gambar: (0, pg_core_1.text)('gambar').notNull(),
    altText: (0, pg_core_1.varchar)('alt_text', { length: 200 }).notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    programId: (0, pg_core_1.integer)('program_id').notNull().references(() => exports.programPendidikan.id),
});
exports.programPendidikanImagesRelations = (0, drizzle_orm_1.relations)(exports.programPendidikanImages, ({ one }) => ({
    program: one(exports.programPendidikan, {
        fields: [exports.programPendidikanImages.programId],
        references: [exports.programPendidikan.id],
    }),
}));
exports.fasilitas = (0, pg_core_1.pgTable)('core_fasilitas', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    nama: (0, pg_core_1.varchar)('nama', { length: 200 }).notNull(),
    icon: (0, pg_core_1.text)('icon').notNull(),
    gambar: (0, pg_core_1.text)('gambar'),
    order: (0, pg_core_1.integer)('order').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
});
exports.ekstrakurikuler = (0, pg_core_1.pgTable)('core_ekstrakurikuler', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    nama: (0, pg_core_1.varchar)('nama', { length: 200 }).notNull(),
    icon: (0, pg_core_1.text)('icon').notNull(),
    gambar: (0, pg_core_1.text)('gambar'),
    order: (0, pg_core_1.integer)('order').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
});
exports.ekstrakurikulerRelations = (0, drizzle_orm_1.relations)(exports.ekstrakurikuler, ({ many }) => ({
    images: many(exports.ekstrakurikulerImages),
}));
exports.ekstrakurikulerImages = (0, pg_core_1.pgTable)('core_ekstrakurikulerimage', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    gambar: (0, pg_core_1.text)('gambar').notNull(),
    altText: (0, pg_core_1.varchar)('alt_text', { length: 200 }).notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    ekstrakurikulerId: (0, pg_core_1.integer)('ekstrakurikuler_id').notNull().references(() => exports.ekstrakurikuler.id),
});
exports.ekstrakurikulerImagesRelations = (0, drizzle_orm_1.relations)(exports.ekstrakurikulerImages, ({ one }) => ({
    ekstrakurikuler: one(exports.ekstrakurikuler, {
        fields: [exports.ekstrakurikulerImages.ekstrakurikulerId],
        references: [exports.ekstrakurikuler.id],
    }),
}));
exports.dokumentasi = (0, pg_core_1.pgTable)('core_dokumentasi', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    judul: (0, pg_core_1.varchar)('judul', { length: 200 }).notNull(),
    deskripsi: (0, pg_core_1.text)('deskripsi').notNull(),
    kategori: (0, pg_core_1.varchar)('kategori', { length: 50 }).notNull(),
    tanggalKegiatan: (0, pg_core_1.date)('tanggal_kegiatan', { mode: 'string' }),
    lokasi: (0, pg_core_1.varchar)('lokasi', { length: 200 }).notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    isPublished: (0, pg_core_1.boolean)('is_published').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.dokumentasiRelations = (0, drizzle_orm_1.relations)(exports.dokumentasi, ({ many }) => ({
    images: many(exports.dokumentasiImages),
}));
exports.dokumentasiImages = (0, pg_core_1.pgTable)('core_dokumentasiimage', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    gambar: (0, pg_core_1.text)('gambar').notNull(),
    altText: (0, pg_core_1.varchar)('alt_text', { length: 200 }).notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    dokumentasiId: (0, pg_core_1.integer)('dokumentasi_id').notNull().references(() => exports.dokumentasi.id),
});
exports.dokumentasiImagesRelations = (0, drizzle_orm_1.relations)(exports.dokumentasiImages, ({ one }) => ({
    dokumentasi: one(exports.dokumentasi, {
        fields: [exports.dokumentasiImages.dokumentasiId],
        references: [exports.dokumentasi.id],
    }),
}));
exports.jadwalHarian = (0, pg_core_1.pgTable)('core_jadwalharian', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    waktu: (0, pg_core_1.varchar)('waktu', { length: 50 }).notNull(),
    judul: (0, pg_core_1.varchar)('judul', { length: 200 }).notNull(),
    deskripsi: (0, pg_core_1.text)('deskripsi').notNull(),
    kategori: (0, pg_core_1.varchar)('kategori', { length: 20 }).notNull(),
    target: (0, pg_core_1.varchar)('target', { length: 20 }),
    order: (0, pg_core_1.integer)('order').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
});
exports.persyaratan = (0, pg_core_1.pgTable)('core_persyaratan', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    persyaratanSantri: (0, pg_core_1.text)('persyaratan_santri').notNull(),
    persyaratanSantriwati: (0, pg_core_1.text)('persyaratan_santriwati').notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.alurPendaftaran = (0, pg_core_1.pgTable)('core_alurpendaftaran', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    gambarUtama: (0, pg_core_1.text)('gambar_utama'),
    alurPendaftaran: (0, pg_core_1.text)('alur_pendaftaran').notNull(),
    tahapanTes: (0, pg_core_1.text)('tahapan_tes').notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.biayaPendidikan = (0, pg_core_1.pgTable)('core_biayapendidikan', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    tipe: (0, pg_core_1.varchar)('tipe', { length: 50 }).notNull(),
    nama: (0, pg_core_1.varchar)('nama', { length: 200 }).notNull(),
    jumlah: (0, pg_core_1.decimal)('jumlah', { precision: 12, scale: 0 }).notNull(),
    keterangan: (0, pg_core_1.varchar)('keterangan', { length: 200 }).notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
});
exports.contactPersons = (0, pg_core_1.pgTable)('core_contactperson', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    nama: (0, pg_core_1.varchar)('nama', { length: 200 }).notNull(),
    foto: (0, pg_core_1.text)('foto'),
    noHp: (0, pg_core_1.varchar)('no_hp', { length: 20 }).notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
});
exports.socialMedia = (0, pg_core_1.pgTable)('core_socialmedia', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    platform: (0, pg_core_1.varchar)('platform', { length: 50 }).notNull(),
    username: (0, pg_core_1.varchar)('username', { length: 200 }).notNull(),
    url: (0, pg_core_1.varchar)('url', { length: 200 }).notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
});
exports.seragam = (0, pg_core_1.pgTable)('core_seragam', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    hari: (0, pg_core_1.varchar)('hari', { length: 50 }).notNull(),
    seragamPutra: (0, pg_core_1.varchar)('seragam_putra', { length: 200 }),
    gambarPutra: (0, pg_core_1.text)('gambar_putra'),
    seragamPutri: (0, pg_core_1.varchar)('seragam_putri', { length: 200 }),
    gambarPutri: (0, pg_core_1.text)('gambar_putri'),
    order: (0, pg_core_1.integer)('order').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
});
exports.statistik = (0, pg_core_1.pgTable)('core_statistik', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    judul: (0, pg_core_1.varchar)('judul', { length: 200 }).notNull(),
    nilai: (0, pg_core_1.varchar)('nilai', { length: 100 }).notNull(),
    icon: (0, pg_core_1.text)('icon').notNull(),
    deskripsi: (0, pg_core_1.varchar)('deskripsi', { length: 300 }).notNull(),
    warna: (0, pg_core_1.varchar)('warna', { length: 50 }).notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    isPublished: (0, pg_core_1.boolean)('is_published').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
});
exports.media = (0, pg_core_1.pgTable)('core_media', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    tipe: (0, pg_core_1.varchar)('tipe', { length: 10 }).notNull(),
    judul: (0, pg_core_1.varchar)('judul', { length: 200 }).notNull(),
    subJudul: (0, pg_core_1.varchar)('sub_judul', { length: 300 }).notNull(),
    gambar: (0, pg_core_1.text)('gambar'),
    videoFile: (0, pg_core_1.text)('video_file'),
    featuredImage: (0, pg_core_1.text)('featured_image'),
    order: (0, pg_core_1.integer)('order').notNull(),
    isPublished: (0, pg_core_1.boolean)('is_published').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.bagianJabatan = (0, pg_core_1.pgTable)('core_bagianjabatan', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    nama: (0, pg_core_1.varchar)('nama', { length: 200 }).notNull().unique(),
    deskripsi: (0, pg_core_1.text)('deskripsi').notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.bagianJabatanRelations = (0, drizzle_orm_1.relations)(exports.bagianJabatan, ({ many }) => ({
    tenagaPengajar: many(exports.tenagaPengajar),
}));
exports.tenagaPengajar = (0, pg_core_1.pgTable)('core_tenagapengajar', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    namaLengkap: (0, pg_core_1.varchar)('nama_lengkap', { length: 200 }).notNull(),
    namaPanggilan: (0, pg_core_1.varchar)('nama_panggilan', { length: 100 }),
    jenisKelamin: (0, pg_core_1.varchar)('jenis_kelamin', { length: 1 }).notNull(),
    foto: (0, pg_core_1.text)('foto'),
    tempatLahir: (0, pg_core_1.varchar)('tempat_lahir', { length: 100 }),
    tanggalLahir: (0, pg_core_1.date)('tanggal_lahir', { mode: 'string' }),
    alamat: (0, pg_core_1.text)('alamat'),
    noHp: (0, pg_core_1.varchar)('no_hp', { length: 20 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 254 }),
    pendidikanTerakhir: (0, pg_core_1.varchar)('pendidikan_terakhir', { length: 200 }),
    universitas: (0, pg_core_1.varchar)('universitas', { length: 200 }),
    tahunLulus: (0, pg_core_1.varchar)('tahun_lulus', { length: 4 }),
    bidangKeahlian: (0, pg_core_1.varchar)('bidang_keahlian', { length: 200 }),
    mataPelajaran: (0, pg_core_1.varchar)('mata_pelajaran', { length: 300 }),
    pengalamanMengajar: (0, pg_core_1.text)('pengalaman_mengajar'),
    prestasi: (0, pg_core_1.text)('prestasi'),
    riwayatPendidikan: (0, pg_core_1.text)('riwayat_pendidikan'),
    organisasi: (0, pg_core_1.text)('organisasi'),
    karyaTulis: (0, pg_core_1.text)('karya_tulis'),
    motto: (0, pg_core_1.varchar)('motto', { length: 300 }),
    whatsapp: (0, pg_core_1.varchar)('whatsapp', { length: 20 }),
    facebook: (0, pg_core_1.varchar)('facebook', { length: 200 }),
    instagram: (0, pg_core_1.varchar)('instagram', { length: 200 }),
    twitter: (0, pg_core_1.varchar)('twitter', { length: 200 }),
    linkedin: (0, pg_core_1.varchar)('linkedin', { length: 200 }),
    youtube: (0, pg_core_1.varchar)('youtube', { length: 200 }),
    tiktok: (0, pg_core_1.varchar)('tiktok', { length: 200 }),
    order: (0, pg_core_1.integer)('order').notNull(),
    isPublished: (0, pg_core_1.boolean)('is_published').notNull(),
    isFeatured: (0, pg_core_1.boolean)('is_featured').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
    bagianJabatanId: (0, pg_core_1.integer)('bagian_jabatan_id').references(() => exports.bagianJabatan.id),
    jabatan: (0, pg_core_1.varchar)('jabatan', { length: 100 }),
});
exports.tenagaPengajarRelations = (0, drizzle_orm_1.relations)(exports.tenagaPengajar, ({ one }) => ({
    bagianJabatan: one(exports.bagianJabatan, {
        fields: [exports.tenagaPengajar.bagianJabatanId],
        references: [exports.bagianJabatan.id],
    }),
}));
exports.informasiTambahan = (0, pg_core_1.pgTable)('core_informasitambahan', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    judul: (0, pg_core_1.varchar)('judul', { length: 200 }).notNull(),
    deskripsi: (0, pg_core_1.text)('deskripsi').notNull(),
    icon: (0, pg_core_1.text)('icon').notNull(),
    warna: (0, pg_core_1.varchar)('warna', { length: 20 }).notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    isPublished: (0, pg_core_1.boolean)('is_published').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.adminBugnotes = (0, pg_core_1.pgTable)('admin_panel_bugnote', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    title: (0, pg_core_1.varchar)('title', { length: 200 }).notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    screenshot: (0, pg_core_1.text)('screenshot'),
    pageUrl: (0, pg_core_1.varchar)('page_url', { length: 200 }).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    createdById: (0, pg_core_1.integer)('created_by_id').references(() => exports.users.id),
});
exports.adminConvertedImages = (0, pg_core_1.pgTable)('admin_panel_convertedimage', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    originalFilename: (0, pg_core_1.varchar)('original_filename', { length: 255 }).notNull(),
    webpImage: (0, pg_core_1.varchar)('webp_image', { length: 100 }).notNull(),
    originalSize: (0, pg_core_1.integer)('original_size').notNull(),
    convertedSize: (0, pg_core_1.integer)('converted_size').notNull(),
    compressionRatio: (0, pg_core_1.decimal)('compression_ratio', { precision: 10, scale: 2 }).notNull(),
    quality: (0, pg_core_1.integer)('quality').notNull(),
    width: (0, pg_core_1.integer)('width'),
    height: (0, pg_core_1.integer)('height'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    createdById: (0, pg_core_1.integer)('created_by_id').references(() => exports.users.id),
    judul: (0, pg_core_1.varchar)('judul', { length: 200 }).notNull(),
});
exports.systemSettings = (0, pg_core_1.pgTable)('system_settings', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    maintenanceMode: (0, pg_core_1.boolean)('maintenance_mode').default(false).notNull(),
    allowRegistration: (0, pg_core_1.boolean)('allow_registration').default(true).notNull(),
    debugMode: (0, pg_core_1.boolean)('debug_mode').default(false).notNull(),
    sessionTimeout: (0, pg_core_1.integer)('session_timeout').default(60).notNull(),
    maxUploadSize: (0, pg_core_1.integer)('max_upload_size').default(5).notNull(),
    backupFrequency: (0, pg_core_1.varchar)('backup_frequency', { length: 20 }).default('daily').notNull(),
    logRetentionDays: (0, pg_core_1.integer)('log_retention_days').default(30).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.documentSettings = (0, pg_core_1.pgTable)('document_settings', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    kopSuratImage: (0, pg_core_1.text)('kop_surat_image'),
    kopSuratHeight: (0, pg_core_1.integer)('kop_surat_height').default(30).notNull(),
    kopSuratOpacity: (0, pg_core_1.integer)('kop_surat_opacity').default(100).notNull(),
    showKopSurat: (0, pg_core_1.boolean)('show_kop_surat').default(true).notNull(),
    marginTop: (0, pg_core_1.integer)('margin_top').default(10).notNull(),
    marginBottom: (0, pg_core_1.integer)('margin_bottom').default(10).notNull(),
    marginLeft: (0, pg_core_1.integer)('margin_left').default(15).notNull(),
    marginRight: (0, pg_core_1.integer)('margin_right').default(15).notNull(),
    paperSize: (0, pg_core_1.varchar)('paper_size', { length: 10 }).default('A4').notNull(),
    orientation: (0, pg_core_1.varchar)('orientation', { length: 10 }).default('portrait').notNull(),
    watermarkText: (0, pg_core_1.varchar)('watermark_text', { length: 100 }),
    watermarkOpacity: (0, pg_core_1.integer)('watermark_opacity').default(10).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.documentLogs = (0, pg_core_1.pgTable)('document_logs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id),
    action: (0, pg_core_1.varchar)('action', { length: 50 }).notNull(),
    details: (0, pg_core_1.text)('details'),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 39 }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
});
exports.documentTemplates = (0, pg_core_1.pgTable)('document_templates', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 200 }).notNull(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(), // 'biodata', 'kuitansi', 'surat_keterangan', 'custom'
    content: (0, pg_core_1.text)('content').notNull(),
    description: (0, pg_core_1.text)('description'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull(),
});
exports.mediaAccounts = (0, pg_core_1.pgTable)('media_accounts', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    provider: (0, pg_core_1.varchar)('provider', { length: 50 }).notNull(), // 'imagekit', 'cloudinary', 'local'
    config: (0, pg_core_1.json)('config').notNull(), // API keys, secrets, etc.
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    isDefault: (0, pg_core_1.boolean)('is_default').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull().defaultNow(),
});
exports.mediaFiles = (0, pg_core_1.pgTable)('media_files', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    filename: (0, pg_core_1.varchar)('filename', { length: 255 }).notNull(),
    originalName: (0, pg_core_1.varchar)('original_name', { length: 255 }).notNull(),
    mimetype: (0, pg_core_1.varchar)('mimetype', { length: 100 }).notNull(),
    size: (0, pg_core_1.integer)('size').notNull(),
    url: (0, pg_core_1.text)('url').notNull(),
    path: (0, pg_core_1.text)('path').notNull(), // Cloud path or local path
    thumbnailUrl: (0, pg_core_1.text)('thumbnail_url'),
    provider: (0, pg_core_1.varchar)('provider', { length: 50 }).notNull(),
    accountId: (0, pg_core_1.integer)('account_id').references(() => exports.mediaAccounts.id),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id),
    folder: (0, pg_core_1.varchar)('folder', { length: 255 }).default('/'),
    metadata: (0, pg_core_1.json)('metadata'), // Width, height, etc.
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull().defaultNow(),
});
exports.mediaLogs = (0, pg_core_1.pgTable)('media_logs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    action: (0, pg_core_1.varchar)('action', { length: 50 }).notNull(), // 'upload', 'delete', 'move'
    fileId: (0, pg_core_1.integer)('file_id').references(() => exports.mediaFiles.id),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id),
    details: (0, pg_core_1.text)('details'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull().defaultNow(),
});
exports.mediaFilesRelations = (0, drizzle_orm_1.relations)(exports.mediaFiles, ({ one }) => ({
    account: one(exports.mediaAccounts, {
        fields: [exports.mediaFiles.accountId],
        references: [exports.mediaAccounts.id],
    }),
    uploader: one(exports.users, {
        fields: [exports.mediaFiles.userId],
        references: [exports.users.id],
    }),
}));
// ─────────────────────────────────────────────────────────────────────────────
// PARENTS / WALI SANTRI — Data Orang Tua yang Ternormalisasi
// ─────────────────────────────────────────────────────────────────────────────
exports.admissionsParents = (0, pg_core_1.pgTable)('admissions_parents', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    // Identitas
    nik: (0, pg_core_1.varchar)('nik', { length: 16 }).notNull().unique(),
    namaLengkap: (0, pg_core_1.varchar)('nama_lengkap', { length: 200 }).notNull(),
    // Kontak
    noHp: (0, pg_core_1.varchar)('no_hp', { length: 20 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 254 }),
    alamat: (0, pg_core_1.text)('alamat').notNull(),
    // Data Pribadi
    tempatLahir: (0, pg_core_1.varchar)('tempat_lahir', { length: 100 }),
    tanggalLahir: (0, pg_core_1.date)('tanggal_lahir', { mode: 'string' }),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull().default('Hidup'), // Hidup, Meninggal, Bercerai
    agama: (0, pg_core_1.varchar)('agama', { length: 20 }),
    kewarganegaraan: (0, pg_core_1.varchar)('kewarganegaraan', { length: 20 }).default('WNI'),
    // Sosial Ekonomi
    pendidikanTerakhir: (0, pg_core_1.varchar)('pendidikan_terakhir', { length: 50 }),
    pekerjaan: (0, pg_core_1.varchar)('pekerjaan', { length: 100 }),
    penghasilan: (0, pg_core_1.varchar)('penghasilan', { length: 50 }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).notNull().defaultNow(),
});
// Junction table: menghubungkan Santri dengan Orang Tua / Wali
exports.santriParents = (0, pg_core_1.pgTable)('admissions_santri_parents', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    santriId: (0, pg_core_1.integer)('santri_id').notNull().references(() => exports.santri.id, { onDelete: 'cascade' }),
    parentId: (0, pg_core_1.integer)('parent_id').notNull().references(() => exports.admissionsParents.id, { onDelete: 'cascade' }),
    // Hubungan: 'Ayah Kandung', 'Ibu Kandung', 'Wali', 'Ayah Tiri', 'Ibu Tiri', dll.
    hubungan: (0, pg_core_1.varchar)('hubungan', { length: 50 }).notNull(),
    // Apakah ini kontak utama yang dihubungi?
    isPrimaryContact: (0, pg_core_1.boolean)('is_primary_contact').default(false).notNull(),
});
exports.admissionsParentsRelations = (0, drizzle_orm_1.relations)(exports.admissionsParents, ({ many }) => ({
    children: many(exports.santriParents),
}));
