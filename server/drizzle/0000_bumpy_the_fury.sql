CREATE TABLE IF NOT EXISTS "admin_panel_bugnote" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"page_url" varchar(200) NOT NULL,
	"status" varchar(20) NOT NULL,
	"created_at" timestamp NOT NULL,
	"created_by_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin_panel_convertedimage" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"original_filename" varchar(255) NOT NULL,
	"webp_image" varchar(100) NOT NULL,
	"original_size" integer NOT NULL,
	"converted_size" integer NOT NULL,
	"compression_ratio" numeric(10, 2) NOT NULL,
	"quality" integer NOT NULL,
	"width" integer,
	"height" integer,
	"created_at" timestamp NOT NULL,
	"created_by_id" integer,
	"judul" varchar(200) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_alurpendaftaran" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"gambar_utama" text,
	"alur_pendaftaran" text NOT NULL,
	"tahapan_tes" text NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_bagianjabatan" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nama" varchar(200) NOT NULL,
	"deskripsi" text NOT NULL,
	"order" integer NOT NULL,
	"is_active" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "core_bagianjabatan_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments_bankaccount" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nama_bank" varchar(100) NOT NULL,
	"nama_bank_custom" varchar(100) NOT NULL,
	"logo" text,
	"nomor_rekening" varchar(50) NOT NULL,
	"nama_pemilik_rekening" varchar(200) NOT NULL,
	"biaya_pendaftaran" numeric(10, 0) NOT NULL,
	"is_active" boolean NOT NULL,
	"keterangan" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_biayapendidikan" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"tipe" varchar(50) NOT NULL,
	"nama" varchar(200) NOT NULL,
	"jumlah" numeric(12, 0) NOT NULL,
	"keterangan" varchar(200) NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blog_pengumuman" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"judul" varchar(200) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"konten" text NOT NULL,
	"gambar" text,
	"status" varchar(20) NOT NULL,
	"is_penting" boolean NOT NULL,
	"published_at" timestamp,
	"meta_title" varchar(200) NOT NULL,
	"meta_description" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "blog_pengumuman_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blog_category" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "blog_category_name_unique" UNIQUE("name"),
	CONSTRAINT "blog_category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blog_blogpost_tags" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"blogpost_id" integer NOT NULL,
	"tag_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blog_blogpost" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"excerpt" text NOT NULL,
	"featured_image" text,
	"meta_title" varchar(200) NOT NULL,
	"meta_description" text NOT NULL,
	"meta_keywords" varchar(255) NOT NULL,
	"video_file" text,
	"video_url" varchar(500),
	"gallery" json,
	"views_count" integer DEFAULT 0 NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"shares_count" integer DEFAULT 0 NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"author_id" integer NOT NULL,
	"category_id" integer,
	CONSTRAINT "blog_blogpost_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blog_tag" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"slug" varchar(50) NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "blog_tag_name_unique" UNIQUE("name"),
	CONSTRAINT "blog_tag_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blog_testimoni" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nama" varchar(200) NOT NULL,
	"foto" text,
	"jabatan" varchar(200) NOT NULL,
	"testimoni" text NOT NULL,
	"rating" integer NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_contactperson" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nama" varchar(200) NOT NULL,
	"foto" text,
	"no_hp" varchar(20) NOT NULL,
	"order" integer NOT NULL,
	"is_active" boolean NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_dokumentasi" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"judul" varchar(200) NOT NULL,
	"deskripsi" text NOT NULL,
	"kategori" varchar(50) NOT NULL,
	"tanggal_kegiatan" date,
	"lokasi" varchar(200) NOT NULL,
	"order" integer NOT NULL,
	"is_published" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_dokumentasiimage" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"gambar" text NOT NULL,
	"alt_text" varchar(200) NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"dokumentasi_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_ekstrakurikuler" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nama" varchar(200) NOT NULL,
	"icon" text NOT NULL,
	"gambar" text,
	"order" integer NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_ekstrakurikulerimage" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"gambar" text NOT NULL,
	"alt_text" varchar(200) NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"ekstrakurikuler_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admissions_exam_results" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"santri_id" integer NOT NULL,
	"written_test_score" numeric(5, 2),
	"interview_test_score" numeric(5, 2),
	"quran_test_score" numeric(5, 2),
	"total_score" numeric(5, 2),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"decision_date" timestamp,
	"is_published" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admissions_exam_schedules" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"santri_id" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"scheduled_date" timestamp NOT NULL,
	"location" varchar(200) NOT NULL,
	"examiner" varchar(200),
	"status" varchar(20) DEFAULT 'scheduled' NOT NULL,
	"notes" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_faq" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"pertanyaan" varchar(500) NOT NULL,
	"jawaban" text NOT NULL,
	"kategori" varchar(100) NOT NULL,
	"order" integer NOT NULL,
	"is_published" boolean NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_fasilitas" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nama" varchar(200) NOT NULL,
	"icon" text NOT NULL,
	"gambar" text,
	"order" integer NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_founders" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nama_lengkap" varchar(100) NOT NULL,
	"tanggal_lahir" date NOT NULL,
	"jabatan" varchar(50) NOT NULL,
	"nik" text NOT NULL,
	"email" text NOT NULL,
	"no_telepon" varchar(20) NOT NULL,
	"alamat" varchar(255) NOT NULL,
	"foto" text NOT NULL,
	"pendidikan_terakhir" varchar(20) NOT NULL,
	"profil_singkat" varchar(200) NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_by" integer,
	"updated_by" integer,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_herosection" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"subtitle" varchar(200) NOT NULL,
	"image" text,
	"order" integer NOT NULL,
	"is_active" boolean NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_informasitambahan" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"judul" varchar(200) NOT NULL,
	"deskripsi" text NOT NULL,
	"icon" text NOT NULL,
	"warna" varchar(20) NOT NULL,
	"order" integer NOT NULL,
	"is_published" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_jadwalharian" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"waktu" varchar(50) NOT NULL,
	"judul" varchar(200) NOT NULL,
	"deskripsi" text NOT NULL,
	"kategori" varchar(20) NOT NULL,
	"target" varchar(20),
	"order" integer NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_kmi" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"visi_kmi" text NOT NULL,
	"profil_kmi" text NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_kontak" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nama" varchar(200) NOT NULL,
	"email" varchar(254) NOT NULL,
	"no_hp" varchar(20) NOT NULL,
	"subjek" varchar(200) NOT NULL,
	"pesan" text NOT NULL,
	"status" varchar(20) NOT NULL,
	"balasan" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_loginhistory" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"username" varchar(150) NOT NULL,
	"ip_address" varchar(39),
	"user_agent" text NOT NULL,
	"status" varchar(10) NOT NULL,
	"error_message" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_media" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"tipe" varchar(10) NOT NULL,
	"judul" varchar(200) NOT NULL,
	"sub_judul" varchar(300) NOT NULL,
	"gambar" text,
	"video_file" text,
	"featured_image" text,
	"order" integer NOT NULL,
	"is_published" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media_accounts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"provider" varchar(50) NOT NULL,
	"email" varchar(254) NOT NULL,
	"api_key" varchar(100) NOT NULL,
	"api_secret" varchar(100) NOT NULL,
	"cloud_name" varchar(100),
	"url_endpoint" varchar(200),
	"quota_limit" bigint NOT NULL,
	"quota_used" bigint DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media_files" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"account_id" integer,
	"url" text NOT NULL,
	"public_id" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"category" varchar(50) NOT NULL,
	"uploaded_by" integer,
	"metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"action" varchar(50) NOT NULL,
	"details" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"max_file_size" integer DEFAULT 5242880 NOT NULL,
	"allowed_formats" text DEFAULT 'jpg,jpeg,png,webp,pdf' NOT NULL,
	"compression_quality" integer DEFAULT 80 NOT NULL,
	"enable_webp_conversion" boolean DEFAULT true NOT NULL,
	"default_storage_provider" varchar(50) DEFAULT 'cloudinary' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"action_url" varchar(200),
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments_payment" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"bank_pengirim" varchar(50) NOT NULL,
	"no_rekening_pengirim" varchar(50) NOT NULL,
	"nama_pemilik_rekening" varchar(200) NOT NULL,
	"rekening_tujuan" varchar(50) NOT NULL,
	"jumlah_transfer" numeric(12, 2) NOT NULL,
	"bukti_transfer" text,
	"status" varchar(20) NOT NULL,
	"catatan" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"verified_at" timestamp,
	"santri_id" integer NOT NULL,
	"verified_by_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_persyaratan" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"persyaratan_santri" text NOT NULL,
	"persyaratan_santriwati" text NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_programpendidikan" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nama" varchar(200) NOT NULL,
	"akreditasi" varchar(50) NOT NULL,
	"icon" text NOT NULL,
	"gambar" text,
	"order" integer NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_programpendidikanimage" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"gambar" text NOT NULL,
	"alt_text" varchar(200) NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"program_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_program" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nama" varchar(200) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"deskripsi" text NOT NULL,
	"gambar" text,
	"tanggal_mulai" date,
	"tanggal_selesai" date,
	"status" varchar(20) NOT NULL,
	"is_featured" boolean NOT NULL,
	"meta_title" varchar(200) NOT NULL,
	"meta_description" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "core_program_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admissions_santri" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nama_lengkap" varchar(200) NOT NULL,
	"nisn" varchar(10) NOT NULL,
	"tempat_lahir" varchar(100) NOT NULL,
	"tanggal_lahir" date NOT NULL,
	"jenis_kelamin" varchar(10) NOT NULL,
	"agama" varchar(20) NOT NULL,
	"golongan_darah" varchar(3) NOT NULL,
	"tinggi_badan" integer,
	"berat_badan" integer,
	"nama_ayah" varchar(200) NOT NULL,
	"nik_ayah" varchar(16) NOT NULL,
	"nama_ibu" varchar(200) NOT NULL,
	"nik_ibu" varchar(16) NOT NULL,
	"pekerjaan_ayah" varchar(100) NOT NULL,
	"pekerjaan_ibu" varchar(100) NOT NULL,
	"no_hp_ayah" varchar(15) NOT NULL,
	"no_hp_ibu" varchar(15) NOT NULL,
	"alamat_orangtua" text NOT NULL,
	"alamat" text NOT NULL,
	"no_hp" varchar(15) NOT NULL,
	"email" varchar(254) NOT NULL,
	"asal_sekolah" varchar(200) NOT NULL,
	"kelas_terakhir" varchar(50) NOT NULL,
	"tahun_lulus" varchar(4) NOT NULL,
	"no_ijazah" varchar(50) NOT NULL,
	"foto_santri" text,
	"foto_ktp" text,
	"foto_akta" text,
	"foto_ijazah" text,
	"foto_kk" text,
	"surat_sehat" text,
	"foto_santri_approved" boolean NOT NULL,
	"foto_ktp_approved" boolean NOT NULL,
	"foto_akta_approved" boolean NOT NULL,
	"foto_ijazah_approved" boolean NOT NULL,
	"foto_kk_approved" boolean DEFAULT false NOT NULL,
	"surat_sehat_approved" boolean NOT NULL,
	"catatan" text NOT NULL,
	"status" varchar(20) NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"agama_ayah" varchar(20) NOT NULL,
	"agama_ibu" varchar(20) NOT NULL,
	"anak_ke" integer,
	"bahasa_sehari_hari" varchar(50) NOT NULL,
	"desa" varchar(100) NOT NULL,
	"jumlah_saudara" integer,
	"kabupaten" varchar(100) NOT NULL,
	"kecamatan" varchar(100) NOT NULL,
	"kelas_diterima" varchar(50) NOT NULL,
	"kewarganegaraan" varchar(50) NOT NULL,
	"kewarganegaraan_ayah" varchar(50) NOT NULL,
	"kewarganegaraan_ibu" varchar(50) NOT NULL,
	"kode_pos" varchar(10) NOT NULL,
	"nama_panggilan" varchar(100) NOT NULL,
	"npsn_sekolah" varchar(20) NOT NULL,
	"pendidikan_ayah" varchar(50) NOT NULL,
	"pendidikan_ibu" varchar(50) NOT NULL,
	"penghasilan_ayah" varchar(50),
	"penghasilan_ibu" varchar(50),
	"provinsi" varchar(100) NOT NULL,
	"riwayat_penyakit" varchar(200) NOT NULL,
	"status_ayah" varchar(10) NOT NULL,
	"status_ibu" varchar(10) NOT NULL,
	"tanggal_diterima" date,
	"tanggal_lahir_ayah" date,
	"tanggal_lahir_ibu" date,
	"tempat_lahir_ayah" varchar(100) NOT NULL,
	"tempat_lahir_ibu" varchar(100) NOT NULL,
	"tinggal_dengan" varchar(50) NOT NULL,
	CONSTRAINT "admissions_santri_nisn_unique" UNIQUE("nisn")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_sejarahtimeline" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"judul" varchar(200) NOT NULL,
	"icon" text NOT NULL,
	"deskripsi" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_sejarahtimelineimage" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"gambar" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"timeline_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_seragam" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"hari" varchar(50) NOT NULL,
	"seragam_putra" varchar(200),
	"gambar_putra" text,
	"seragam_putri" varchar(200),
	"gambar_putri" text,
	"order" integer NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_socialmedia" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"platform" varchar(50) NOT NULL,
	"username" varchar(200) NOT NULL,
	"url" varchar(200) NOT NULL,
	"order" integer NOT NULL,
	"is_active" boolean NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_statistik" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"judul" varchar(200) NOT NULL,
	"nilai" varchar(100) NOT NULL,
	"icon" text NOT NULL,
	"deskripsi" varchar(300) NOT NULL,
	"warna" varchar(50) NOT NULL,
	"order" integer NOT NULL,
	"is_published" boolean NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system_settings" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"maintenance_mode" boolean DEFAULT false NOT NULL,
	"allow_registration" boolean DEFAULT true NOT NULL,
	"debug_mode" boolean DEFAULT false NOT NULL,
	"session_timeout" integer DEFAULT 60 NOT NULL,
	"max_upload_size" integer DEFAULT 5 NOT NULL,
	"backup_frequency" varchar(20) DEFAULT 'daily' NOT NULL,
	"log_retention_days" integer DEFAULT 30 NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_tenagapengajar" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nama_lengkap" varchar(200) NOT NULL,
	"nama_panggilan" varchar(100),
	"jenis_kelamin" varchar(1) NOT NULL,
	"foto" text,
	"tempat_lahir" varchar(100),
	"tanggal_lahir" date,
	"alamat" text,
	"no_hp" varchar(20) NOT NULL,
	"email" varchar(254),
	"pendidikan_terakhir" varchar(200),
	"universitas" varchar(200),
	"tahun_lulus" varchar(4),
	"bidang_keahlian" varchar(200),
	"mata_pelajaran" varchar(300),
	"pengalaman_mengajar" text,
	"prestasi" text,
	"riwayat_pendidikan" text,
	"organisasi" text,
	"karya_tulis" text,
	"motto" varchar(300),
	"whatsapp" varchar(20),
	"facebook" varchar(200),
	"instagram" varchar(200),
	"twitter" varchar(200),
	"linkedin" varchar(200),
	"youtube" varchar(200),
	"tiktok" varchar(200),
	"order" integer NOT NULL,
	"is_published" boolean NOT NULL,
	"is_featured" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"bagian_jabatan_id" integer,
	"jabatan" varchar(100)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_user" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"password" varchar(128) NOT NULL,
	"last_login" timestamp,
	"is_superuser" boolean NOT NULL,
	"username" varchar(150) NOT NULL,
	"first_name" varchar(150) NOT NULL,
	"last_name" varchar(150) NOT NULL,
	"email" varchar(254) NOT NULL,
	"is_staff" boolean NOT NULL,
	"is_active" boolean NOT NULL,
	"date_joined" timestamp NOT NULL,
	"role" varchar(20) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"avatar" text,
	"is_notification_seen" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_visimisi" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"visi" text NOT NULL,
	"misi" text NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_registration_flow" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"order" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_websitesettings" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nama_pondok" varchar(200) NOT NULL,
	"arabic_name" varchar(500) NOT NULL,
	"alamat" text NOT NULL,
	"logo" text,
	"no_telepon" varchar(20) NOT NULL,
	"email" varchar(254) NOT NULL,
	"website" varchar(200) NOT NULL,
	"facebook" varchar(200) NOT NULL,
	"instagram" varchar(200) NOT NULL,
	"twitter" varchar(200) NOT NULL,
	"tiktok" varchar(200) NOT NULL,
	"hero_title" varchar(200) NOT NULL,
	"hero_subtitle" varchar(200) NOT NULL,
	"hero_tagline" varchar(300) NOT NULL,
	"hero_cta_primary_text" varchar(100) NOT NULL,
	"hero_cta_primary_link" varchar(200) NOT NULL,
	"hero_cta_secondary_text" varchar(100) NOT NULL,
	"hero_cta_secondary_link" varchar(200) NOT NULL,
	"cta_title" varchar(200) DEFAULT 'Siap Bergabung?' NOT NULL,
	"cta_description" text NOT NULL,
	"cta_primary_text" varchar(100) DEFAULT 'Daftar Sekarang' NOT NULL,
	"cta_primary_link" varchar(200) DEFAULT '/pendaftaran' NOT NULL,
	"cta_secondary_text" varchar(100) DEFAULT 'Hubungi Kami' NOT NULL,
	"cta_secondary_link" varchar(200) DEFAULT '/kontak' NOT NULL,
	"announcement_text" varchar(300),
	"announcement_link" varchar(200),
	"announcement_active" boolean DEFAULT false,
	"lokasi_pendaftaran" text NOT NULL,
	"google_maps_link" varchar(200) NOT NULL,
	"google_maps_embed_code" text NOT NULL,
	"qr_code_image" text,
	"deskripsi" text NOT NULL,
	"favicon" text,
	"meta_title" varchar(200) NOT NULL,
	"meta_description" text NOT NULL,
	"meta_keywords" varchar(500) NOT NULL,
	"updated_at" timestamp NOT NULL,
	"header_mobile_image" text,
	"header_mobile_height" integer NOT NULL,
	"maintenance_message" text NOT NULL,
	"maintenance_mode" boolean NOT NULL,
	"profil_singkat" text,
	"profil_lengkap" text,
	"gambar_profil" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_whatsapptemplatekategori" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nama" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"deskripsi" text NOT NULL,
	"order" integer NOT NULL,
	"is_active" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "core_whatsapptemplatekategori_nama_unique" UNIQUE("nama"),
	CONSTRAINT "core_whatsapptemplatekategori_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_whatsapptemplate" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nama" varchar(200) NOT NULL,
	"tipe" varchar(20) NOT NULL,
	"pesan" text NOT NULL,
	"variabel" varchar(500) NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"kategori_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admin_panel_bugnote" ADD CONSTRAINT "admin_panel_bugnote_created_by_id_users_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "users_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admin_panel_convertedimage" ADD CONSTRAINT "admin_panel_convertedimage_created_by_id_users_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "users_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blog_blogpost_tags" ADD CONSTRAINT "blog_blogpost_tags_blogpost_id_blog_blogpost_id_fk" FOREIGN KEY ("blogpost_id") REFERENCES "blog_blogpost"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blog_blogpost_tags" ADD CONSTRAINT "blog_blogpost_tags_tag_id_blog_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "blog_tag"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blog_blogpost" ADD CONSTRAINT "blog_blogpost_author_id_users_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "users_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blog_blogpost" ADD CONSTRAINT "blog_blogpost_category_id_blog_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "blog_category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core_dokumentasiimage" ADD CONSTRAINT "core_dokumentasiimage_dokumentasi_id_core_dokumentasi_id_fk" FOREIGN KEY ("dokumentasi_id") REFERENCES "core_dokumentasi"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core_ekstrakurikulerimage" ADD CONSTRAINT "core_ekstrakurikulerimage_ekstrakurikuler_id_core_ekstrakurikuler_id_fk" FOREIGN KEY ("ekstrakurikuler_id") REFERENCES "core_ekstrakurikuler"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admissions_exam_results" ADD CONSTRAINT "admissions_exam_results_santri_id_admissions_santri_id_fk" FOREIGN KEY ("santri_id") REFERENCES "admissions_santri"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admissions_exam_schedules" ADD CONSTRAINT "admissions_exam_schedules_santri_id_admissions_santri_id_fk" FOREIGN KEY ("santri_id") REFERENCES "admissions_santri"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core_founders" ADD CONSTRAINT "core_founders_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "users_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core_founders" ADD CONSTRAINT "core_founders_updated_by_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "users_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_loginhistory" ADD CONSTRAINT "users_loginhistory_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media_files" ADD CONSTRAINT "media_files_account_id_media_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "media_accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media_files" ADD CONSTRAINT "media_files_uploaded_by_users_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "users_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments_payment" ADD CONSTRAINT "payments_payment_santri_id_admissions_santri_id_fk" FOREIGN KEY ("santri_id") REFERENCES "admissions_santri"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments_payment" ADD CONSTRAINT "payments_payment_verified_by_id_users_user_id_fk" FOREIGN KEY ("verified_by_id") REFERENCES "users_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core_programpendidikanimage" ADD CONSTRAINT "core_programpendidikanimage_program_id_core_programpendidikan_id_fk" FOREIGN KEY ("program_id") REFERENCES "core_programpendidikan"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core_sejarahtimelineimage" ADD CONSTRAINT "core_sejarahtimelineimage_timeline_id_core_sejarahtimeline_id_fk" FOREIGN KEY ("timeline_id") REFERENCES "core_sejarahtimeline"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core_tenagapengajar" ADD CONSTRAINT "core_tenagapengajar_bagian_jabatan_id_core_bagianjabatan_id_fk" FOREIGN KEY ("bagian_jabatan_id") REFERENCES "core_bagianjabatan"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core_whatsapptemplate" ADD CONSTRAINT "core_whatsapptemplate_kategori_id_core_whatsapptemplatekategori_id_fk" FOREIGN KEY ("kategori_id") REFERENCES "core_whatsapptemplatekategori"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
