-- ==============================================================================
-- PESANTREN HUB — SCHEMA BACKUP (STRUCTURE ONLY, NO DATA)
-- Database: Neon PostgreSQL (neondb)
-- Generated: 2026-04-16
-- Deskripsi: File ini berisi semua CREATE TABLE tanpa data.
--            Bisa digunakan untuk restore struktur database dari awal.
-- ==============================================================================

-- Aktifkan ekstensi yang dibutuhkan
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. USERS & AUTH
-- ==============================================================================
CREATE TABLE IF NOT EXISTS users_user (
    id SERIAL PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login TIMESTAMP,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150) NOT NULL DEFAULT '',
    last_name VARCHAR(150) NOT NULL DEFAULT '',
    email VARCHAR(254) NOT NULL DEFAULT '',
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    date_joined TIMESTAMP NOT NULL DEFAULT NOW(),
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    phone VARCHAR(20) NOT NULL DEFAULT '',
    avatar TEXT,
    is_notification_seen BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_status VARCHAR(20) NOT NULL DEFAULT 'none',
    rejected_reason TEXT,
    publication_role VARCHAR(20) DEFAULT 'none',
    publication_status VARCHAR(20) DEFAULT 'none',
    is_publication_registered BOOLEAN DEFAULT FALSE,
    publication_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users_loginhistory (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users_user(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    login_at TIMESTAMP NOT NULL DEFAULT NOW(),
    is_success BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users_user(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 2. CORE - WEBSITE SETTINGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_websitesettings (
    id SERIAL PRIMARY KEY,
    nama_pondok VARCHAR(200) NOT NULL DEFAULT '',
    arabic_name VARCHAR(200) DEFAULT '',
    alamat TEXT DEFAULT '',
    no_telepon VARCHAR(20) DEFAULT '',
    email VARCHAR(254) DEFAULT '',
    website VARCHAR(200) DEFAULT '',
    facebook VARCHAR(200) DEFAULT '',
    instagram VARCHAR(200) DEFAULT '',
    twitter VARCHAR(200) DEFAULT '',
    tiktok VARCHAR(200) DEFAULT '',
    youtube VARCHAR(200) DEFAULT '',
    logo TEXT,
    favicon TEXT,
    hero_title VARCHAR(200) DEFAULT '',
    hero_subtitle TEXT DEFAULT '',
    hero_tagline VARCHAR(200) DEFAULT '',
    hero_cta_primary_text VARCHAR(100) DEFAULT 'Daftar Sekarang',
    hero_cta_primary_link VARCHAR(200) DEFAULT '/pendaftaran',
    hero_cta_secondary_text VARCHAR(100) DEFAULT 'Tentang Kami',
    hero_cta_secondary_link VARCHAR(200) DEFAULT '/tentang',
    cta_title VARCHAR(200) DEFAULT '',
    cta_description TEXT DEFAULT '',
    cta_primary_text VARCHAR(100) DEFAULT '',
    cta_primary_link VARCHAR(200) DEFAULT '',
    cta_secondary_text VARCHAR(100) DEFAULT '',
    cta_secondary_link VARCHAR(200) DEFAULT '',
    announcement_text TEXT DEFAULT '',
    announcement_link VARCHAR(200) DEFAULT '',
    announcement_active BOOLEAN DEFAULT FALSE,
    lokasi_pendaftaran TEXT DEFAULT '',
    google_maps_link TEXT DEFAULT '',
    google_maps_embed_code TEXT DEFAULT '',
    deskripsi TEXT DEFAULT '',
    profil_singkat TEXT DEFAULT '',
    gambar_profil TEXT,
    meta_title VARCHAR(200) DEFAULT '',
    meta_description TEXT DEFAULT '',
    meta_keywords TEXT DEFAULT '',
    maintenance_mode BOOLEAN DEFAULT FALSE,
    maintenance_message TEXT DEFAULT '',
    header_mobile_height INTEGER DEFAULT 60,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. CORE - HERO SECTION
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_herosection (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(200) NOT NULL,
    image TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. CORE - REGISTRATION FLOW (Alur Pendaftaran Steps)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_registration_flow (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100) NOT NULL DEFAULT 'circle',
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. CORE - FAQ
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_faq (
    id SERIAL PRIMARY KEY,
    pertanyaan TEXT NOT NULL,
    jawaban TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 6. CORE - PROGRAMS (Program Unggulan / Jenjang)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_program (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    deskripsi TEXT NOT NULL,
    gambar TEXT,
    icon TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'published',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    meta_title VARCHAR(200),
    meta_description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 7. CORE - PROGRAM PENDIDIKAN
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_programpendidikan (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    deskripsi TEXT NOT NULL,
    gambar TEXT,
    akreditasi VARCHAR(50) NOT NULL DEFAULT 'Belum Terakreditasi',
    durasi VARCHAR(100),
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS core_programpendidikanimage (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES core_programpendidikan(id) ON DELETE CASCADE,
    gambar TEXT NOT NULL,
    alt_text VARCHAR(200),
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 8. CORE - FASILITAS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_fasilitas (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    deskripsi TEXT NOT NULL,
    gambar TEXT,
    icon VARCHAR(100),
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 9. CORE - EKSTRAKURIKULER
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_ekstrakurikuler (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    deskripsi TEXT NOT NULL,
    gambar TEXT,
    icon VARCHAR(100),
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS core_ekstrakurikulerimage (
    id SERIAL PRIMARY KEY,
    ekstrakurikuler_id INTEGER REFERENCES core_ekstrakurikuler(id) ON DELETE CASCADE,
    gambar TEXT NOT NULL,
    alt_text VARCHAR(200),
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 10. CORE - DOKUMENTASI
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_dokumentasi (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(200) NOT NULL,
    deskripsi TEXT,
    kategori VARCHAR(100),
    tanggal DATE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS core_dokumentasiimage (
    id SERIAL PRIMARY KEY,
    dokumentasi_id INTEGER REFERENCES core_dokumentasi(id) ON DELETE CASCADE,
    gambar TEXT NOT NULL,
    alt_text VARCHAR(200),
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 11. CORE - JADWAL HARIAN
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_jadwalharian (
    id SERIAL PRIMARY KEY,
    waktu VARCHAR(10) NOT NULL,
    kegiatan VARCHAR(200) NOT NULL,
    deskripsi TEXT,
    target VARCHAR(50) NOT NULL DEFAULT 'semua',
    kategori VARCHAR(50) NOT NULL DEFAULT 'kegiatan',
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 12. CORE - PERSYARATAN & ALUR PENDAFTARAN (Singleton)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_persyaratan (
    id SERIAL PRIMARY KEY,
    persyaratan_santri TEXT NOT NULL DEFAULT '',
    persyaratan_santriwati TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS core_alurpendaftaran (
    id SERIAL PRIMARY KEY,
    alur_pendaftaran TEXT NOT NULL DEFAULT '',
    tahapan_tes TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 13. CORE - BIAYA PENDIDIKAN
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_biayapendidikan (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    deskripsi TEXT,
    nominal DECIMAL(15, 2) NOT NULL DEFAULT 0,
    jenis VARCHAR(50) NOT NULL DEFAULT 'masuk',
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 14. CORE - CONTACT PERSONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_contactperson (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    jabatan VARCHAR(200),
    no_hp VARCHAR(20) NOT NULL,
    email VARCHAR(254),
    foto TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 15. CORE - SOCIAL MEDIA
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_socialmedia (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    icon VARCHAR(100),
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 16. CORE - SERAGAM
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_seragam (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    deskripsi TEXT,
    gambar TEXT,
    warna VARCHAR(100),
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 17. CORE - KMI (Singleton)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_kmi (
    id SERIAL PRIMARY KEY,
    visi_kmi TEXT NOT NULL DEFAULT '',
    profil_kmi TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 18. CORE - STATISTIK
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_statistik (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(200) NOT NULL,
    nilai VARCHAR(100) NOT NULL,
    icon VARCHAR(100) NOT NULL DEFAULT 'Users',
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 19. CORE - MEDIA
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_media (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    url TEXT NOT NULL,
    tipe VARCHAR(50) NOT NULL DEFAULT 'gambar',
    deskripsi TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 20. CORE - BAGIAN JABATAN
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_bagianjabatan (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    deskripsi TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 21. CORE - TENAGA PENGAJAR
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_tenagapengajar (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    jabatan VARCHAR(200),
    bidang_studi VARCHAR(200),
    pendidikan VARCHAR(200),
    foto TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 22. CORE - INFORMASI TAMBAHAN
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_informasitambahan (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(200) NOT NULL,
    konten TEXT NOT NULL,
    ikon VARCHAR(100),
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 23. CORE - VISI MISI (Singleton)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_visimisi (
    id SERIAL PRIMARY KEY,
    visi TEXT NOT NULL DEFAULT '',
    misi TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 24. CORE - KONTAK (Form Pesan Masuk)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_kontak (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    email VARCHAR(254) NOT NULL,
    no_hp VARCHAR(20),
    subjek VARCHAR(200),
    pesan TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    balasan TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 25. CORE - FOUNDERS (Pendiri)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_founders (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    nik TEXT NOT NULL,
    email TEXT NOT NULL,
    jabatan VARCHAR(200),
    foto TEXT,
    deskripsi TEXT,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_by INTEGER REFERENCES users_user(id),
    updated_by INTEGER REFERENCES users_user(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 26. CORE - STRUKTUR ORGANISASI
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_struktur_organisasi (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    jabatan VARCHAR(200) NOT NULL,
    foto TEXT,
    parent_id INTEGER REFERENCES core_struktur_organisasi(id) ON DELETE SET NULL,
    level INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 27. CORE - SEJARAH TIMELINE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_sejarahtimeline (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(200) NOT NULL,
    icon TEXT NOT NULL DEFAULT 'circle',
    deskripsi TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS core_sejarahtimelineimage (
    id SERIAL PRIMARY KEY,
    timeline_id INTEGER REFERENCES core_sejarahtimeline(id) ON DELETE CASCADE,
    gambar TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 28. CORE - WHATSAPP TEMPLATES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_whatsapptemplate (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    konten TEXT NOT NULL,
    kategori VARCHAR(100),
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS core_whatsapptemplatekategori (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 29. CORE - FORM CONFIG
-- ==============================================================================
CREATE TABLE IF NOT EXISTS core_form_config (
    id SERIAL PRIMARY KEY,
    form_name VARCHAR(100) NOT NULL,
    field_key VARCHAR(100) NOT NULL,
    field_label VARCHAR(200) NOT NULL,
    field_value TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(form_name, field_key)
);

-- ==============================================================================
-- 30. ADMISSIONS - SANTRI & PENDAFTARAN
-- ==============================================================================
CREATE TABLE IF NOT EXISTS admissions_santri (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users_user(id) ON DELETE SET NULL,
    nama_lengkap VARCHAR(200) NOT NULL,
    nik VARCHAR(20),
    jenis_kelamin VARCHAR(10) NOT NULL,
    tempat_lahir VARCHAR(100),
    tanggal_lahir DATE,
    alamat TEXT,
    asal_sekolah VARCHAR(200),
    program_pilihan VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'draft',
    catatan TEXT,
    foto TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admissions_parents (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    nik VARCHAR(20),
    pekerjaan VARCHAR(200),
    no_hp VARCHAR(20),
    email VARCHAR(254),
    hubungan VARCHAR(50) NOT NULL DEFAULT 'ayah',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admissions_santri_parents (
    id SERIAL PRIMARY KEY,
    santri_id INTEGER REFERENCES admissions_santri(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES admissions_parents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admissions_exam_schedules (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    tanggal TIMESTAMP NOT NULL,
    lokasi VARCHAR(200),
    kuota INTEGER NOT NULL DEFAULT 0,
    deskripsi TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admissions_exam_results (
    id SERIAL PRIMARY KEY,
    santri_id INTEGER REFERENCES admissions_santri(id) ON DELETE CASCADE,
    schedule_id INTEGER REFERENCES admissions_exam_schedules(id) ON DELETE SET NULL,
    nilai_tulis DECIMAL(5,2),
    nilai_lisan DECIMAL(5,2),
    nilai_akhir DECIMAL(5,2),
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    catatan TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 31. PAYMENTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS payments_bankaccount (
    id SERIAL PRIMARY KEY,
    nama_bank VARCHAR(100) NOT NULL,
    nama_rekening VARCHAR(200) NOT NULL,
    nomor_rekening VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments_payment (
    id SERIAL PRIMARY KEY,
    santri_id INTEGER REFERENCES admissions_santri(id) ON DELETE CASCADE,
    bank_account_id INTEGER REFERENCES payments_bankaccount(id) ON DELETE SET NULL,
    jumlah DECIMAL(15, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    bukti_transfer TEXT,
    catatan TEXT,
    verified_by INTEGER REFERENCES users_user(id) ON DELETE SET NULL,
    verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 32. BLOG
-- ==============================================================================
CREATE TABLE IF NOT EXISTS blog_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_tag (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_blogpost (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    author_id INTEGER REFERENCES users_user(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES blog_category(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    views_count INTEGER NOT NULL DEFAULT 0,
    meta_title VARCHAR(200),
    meta_description TEXT,
    published_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_blogpost_tags (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES blog_blogpost(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES blog_tag(id) ON DELETE CASCADE,
    UNIQUE(post_id, tag_id)
);

CREATE TABLE IF NOT EXISTS blog_pengumuman (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    gambar TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    tanggal_mulai DATE,
    tanggal_selesai DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_testimoni (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    foto TEXT,
    jabatan VARCHAR(200) NOT NULL,
    testimoni TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 33. DOCUMENTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS document_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS document_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS document_logs (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES document_templates(id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES users_user(id) ON DELETE SET NULL,
    santri_id INTEGER REFERENCES admissions_santri(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 34. MEDIA FILES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS media_accounts (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    api_key TEXT,
    api_secret TEXT,
    cloud_name VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_files (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(50),
    size BIGINT,
    provider VARCHAR(50),
    public_id TEXT,
    uploaded_by INTEGER REFERENCES users_user(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_logs (
    id SERIAL PRIMARY KEY,
    file_id INTEGER REFERENCES media_files(id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES users_user(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 35. PUBLICATION / JURNAL
-- ==============================================================================
CREATE TABLE IF NOT EXISTS publication_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users_user(id) ON DELETE CASCADE,
    bio TEXT,
    institution VARCHAR(200),
    whatsapp VARCHAR(20),
    expertise TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS publication_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS publication_volumes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS publication_collaborations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id INTEGER NOT NULL REFERENCES users_user(id),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS publication_articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    featured_image TEXT,
    author_id INTEGER NOT NULL REFERENCES users_user(id),
    category_id INTEGER REFERENCES publication_categories(id),
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    approved_by_id INTEGER REFERENCES users_user(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    views_count INTEGER NOT NULL DEFAULT 0,
    volume_id INTEGER REFERENCES publication_volumes(id),
    collaboration_id INTEGER REFERENCES publication_collaborations(id),
    pdf_file TEXT,
    keywords TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS publication_collaboration_members (
    id SERIAL PRIMARY KEY,
    collaboration_id INTEGER NOT NULL REFERENCES publication_collaborations(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users_user(id) ON DELETE CASCADE,
    role VARCHAR(30) NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS publication_collaboration_invites (
    id SERIAL PRIMARY KEY,
    collaboration_id INTEGER NOT NULL REFERENCES publication_collaborations(id) ON DELETE CASCADE,
    invited_by INTEGER NOT NULL REFERENCES users_user(id),
    invited_user INTEGER NOT NULL REFERENCES users_user(id),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS publication_discussions (
    id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL REFERENCES publication_articles(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users_user(id),
    parent_id INTEGER REFERENCES publication_discussions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS publication_article_audits (
    id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL REFERENCES publication_articles(id) ON DELETE CASCADE,
    reviewed_by INTEGER NOT NULL REFERENCES users_user(id),
    status VARCHAR(20) NOT NULL,
    note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 36. ADMIN PANEL UTILITIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS admin_panel_bugnote (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'open',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    created_by INTEGER REFERENCES users_user(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_panel_convertedimage (
    id SERIAL PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    converted_url TEXT NOT NULL,
    format VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- END OF SCHEMA BACKUP
-- Gunakan file ini untuk restore struktur database dari awal.
-- JANGAN jalankan file ini di database yang sudah memiliki tabel aktif
-- kecuali menggunakan IF NOT EXISTS (sudah digunakan di atas, aman).
-- ==============================================================================
