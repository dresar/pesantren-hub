CREATE TABLE `admin_panel_bugnote` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text NOT NULL,
	`page_url` varchar(200) NOT NULL,
	`status` varchar(20) NOT NULL,
	`created_at` datetime NOT NULL,
	`created_by_id` bigint,
	CONSTRAINT `admin_panel_bugnote_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `admin_panel_convertedimage` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`original_filename` varchar(255) NOT NULL,
	`webp_image` varchar(100) NOT NULL,
	`original_size` bigint NOT NULL,
	`converted_size` bigint NOT NULL,
	`compression_ratio` decimal(10,2) NOT NULL,
	`quality` int NOT NULL,
	`width` int,
	`height` int,
	`created_at` datetime NOT NULL,
	`created_by_id` bigint,
	`judul` varchar(200) NOT NULL,
	CONSTRAINT `admin_panel_convertedimage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_alurpendaftaran` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`gambar_utama` varchar(100),
	`alur_pendaftaran` text NOT NULL,
	`tahapan_tes` text NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `core_alurpendaftaran_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_bagianjabatan` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`nama` varchar(200) NOT NULL,
	`deskripsi` text NOT NULL,
	`order` int NOT NULL,
	`is_active` boolean NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `core_bagianjabatan_id` PRIMARY KEY(`id`),
	CONSTRAINT `core_bagianjabatan_nama_unique` UNIQUE(`nama`)
);
--> statement-breakpoint
CREATE TABLE `payments_bankaccount` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`nama_bank` varchar(100) NOT NULL,
	`nama_bank_custom` varchar(100) NOT NULL,
	`nomor_rekening` varchar(50) NOT NULL,
	`nama_pemilik_rekening` varchar(200) NOT NULL,
	`biaya_pendaftaran` decimal(10,0) NOT NULL,
	`is_active` boolean NOT NULL,
	`keterangan` text NOT NULL,
	`order` int NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `payments_bankaccount_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_biayapendidikan` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`tipe` varchar(50) NOT NULL,
	`nama` varchar(200) NOT NULL,
	`jumlah` decimal(12,0) NOT NULL,
	`keterangan` varchar(200) NOT NULL,
	`order` int NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `core_biayapendidikan_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_pengumuman` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`judul` varchar(200) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`konten` text NOT NULL,
	`gambar` varchar(100),
	`status` varchar(20) NOT NULL,
	`is_penting` boolean NOT NULL,
	`published_at` datetime,
	`meta_title` varchar(200) NOT NULL,
	`meta_description` text NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `blog_pengumuman_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_pengumuman_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `blog_category` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`order` int NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `blog_category_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_category_name_unique` UNIQUE(`name`),
	CONSTRAINT `blog_category_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `blog_blogpost_tags` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`blogpost_id` bigint NOT NULL,
	`tag_id` bigint NOT NULL,
	CONSTRAINT `blog_blogpost_tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_blogpost` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`content` text NOT NULL,
	`excerpt` text NOT NULL,
	`featured_image` varchar(100),
	`meta_title` varchar(200) NOT NULL,
	`meta_description` text NOT NULL,
	`meta_keywords` varchar(255) NOT NULL,
	`video_file` varchar(100),
	`views_count` int NOT NULL,
	`likes_count` int NOT NULL,
	`shares_count` int NOT NULL,
	`status` varchar(20) NOT NULL,
	`published_at` datetime,
	`is_featured` boolean NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`author_id` bigint NOT NULL,
	`category_id` bigint,
	CONSTRAINT `blog_blogpost_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_blogpost_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `blog_tag` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`slug` varchar(50) NOT NULL,
	`order` int NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `blog_tag_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_tag_name_unique` UNIQUE(`name`),
	CONSTRAINT `blog_tag_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `blog_testimoni` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`nama` varchar(200) NOT NULL,
	`foto` varchar(100),
	`jabatan` varchar(200) NOT NULL,
	`testimoni` text NOT NULL,
	`rating` int NOT NULL,
	`is_published` boolean NOT NULL,
	`order` int NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `blog_testimoni_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_contactperson` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`nama` varchar(200) NOT NULL,
	`foto` varchar(100),
	`no_hp` varchar(20) NOT NULL,
	`order` int NOT NULL,
	`is_active` boolean NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `core_contactperson_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents_documenttemplate` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`nama` varchar(200) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`deskripsi` text NOT NULL,
	`html_template` text NOT NULL,
	`css_template` text NOT NULL,
	`ukuran_kertas` varchar(20) NOT NULL,
	`orientasi` varchar(20) NOT NULL,
	`margin_top` varchar(20) NOT NULL,
	`margin_right` varchar(20) NOT NULL,
	`margin_bottom` varchar(20) NOT NULL,
	`margin_left` varchar(20) NOT NULL,
	`is_active` boolean NOT NULL,
	`order` int NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `documents_documenttemplate_id` PRIMARY KEY(`id`),
	CONSTRAINT `documents_documenttemplate_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `core_dokumentasi` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`judul` varchar(200) NOT NULL,
	`deskripsi` text NOT NULL,
	`kategori` varchar(50) NOT NULL,
	`tanggal_kegiatan` date,
	`lokasi` varchar(200) NOT NULL,
	`order` int NOT NULL,
	`is_published` boolean NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `core_dokumentasi_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_dokumentasiimage` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`gambar` varchar(100) NOT NULL,
	`alt_text` varchar(200) NOT NULL,
	`order` int NOT NULL,
	`created_at` datetime NOT NULL,
	`dokumentasi_id` bigint NOT NULL,
	CONSTRAINT `core_dokumentasiimage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_ekstrakurikuler` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`nama` varchar(200) NOT NULL,
	`icon` varchar(100) NOT NULL,
	`order` int NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `core_ekstrakurikuler_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_ekstrakurikulerimage` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`gambar` varchar(100) NOT NULL,
	`alt_text` varchar(200) NOT NULL,
	`order` int NOT NULL,
	`created_at` datetime NOT NULL,
	`ekstrakurikuler_id` bigint NOT NULL,
	CONSTRAINT `core_ekstrakurikulerimage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_faq` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`pertanyaan` varchar(500) NOT NULL,
	`jawaban` text NOT NULL,
	`kategori` varchar(100) NOT NULL,
	`order` int NOT NULL,
	`is_published` boolean NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `core_faq_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_fasilitas` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`nama` varchar(200) NOT NULL,
	`icon` varchar(100) NOT NULL,
	`gambar` varchar(100),
	`order` int NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `core_fasilitas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_herosection` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`subtitle` varchar(200) NOT NULL,
	`image` varchar(100),
	`order` int NOT NULL,
	`is_active` boolean NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `core_herosection_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_informasitambahan` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`judul` varchar(200) NOT NULL,
	`deskripsi` text NOT NULL,
	`icon` varchar(100) NOT NULL,
	`warna` varchar(20) NOT NULL,
	`order` int NOT NULL,
	`is_published` boolean NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `core_informasitambahan_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_jadwalharian` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`waktu` varchar(50) NOT NULL,
	`judul` varchar(200) NOT NULL,
	`deskripsi` text NOT NULL,
	`kategori` varchar(20) NOT NULL,
	`order` int NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `core_jadwalharian_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_kmi` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`visi_kmi` text NOT NULL,
	`profil_kmi` text NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `core_kmi_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_kontak` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`nama` varchar(200) NOT NULL,
	`email` varchar(254) NOT NULL,
	`no_hp` varchar(20) NOT NULL,
	`subjek` varchar(200) NOT NULL,
	`pesan` text NOT NULL,
	`status` varchar(20) NOT NULL,
	`balasan` text NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `core_kontak_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users_loginhistory` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`username` varchar(150) NOT NULL,
	`ip_address` varchar(39),
	`user_agent` text NOT NULL,
	`status` varchar(10) NOT NULL,
	`error_message` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL,
	`user_id` bigint,
	CONSTRAINT `users_loginhistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_media` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`tipe` varchar(10) NOT NULL,
	`judul` varchar(200) NOT NULL,
	`sub_judul` varchar(300) NOT NULL,
	`gambar` varchar(100),
	`video_file` varchar(100),
	`featured_image` varchar(100),
	`order` int NOT NULL,
	`is_published` boolean NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `core_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`user_id` bigint NOT NULL,
	`title` varchar(200) NOT NULL,
	`message` text NOT NULL,
	`type` varchar(50) NOT NULL,
	`is_read` boolean NOT NULL DEFAULT false,
	`action_url` varchar(200),
	`created_at` datetime NOT NULL,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments_payment` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`bank_pengirim` varchar(50) NOT NULL,
	`no_rekening_pengirim` varchar(50) NOT NULL,
	`nama_pemilik_rekening` varchar(200) NOT NULL,
	`rekening_tujuan` varchar(50) NOT NULL,
	`jumlah_transfer` decimal(12,2) NOT NULL,
	`bukti_transfer` varchar(100),
	`status` varchar(20) NOT NULL,
	`catatan` text NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`verified_at` datetime,
	`santri_id` bigint NOT NULL,
	`verified_by_id` bigint,
	CONSTRAINT `payments_payment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_persyaratan` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`persyaratan_santri` text NOT NULL,
	`persyaratan_santriwati` text NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `core_persyaratan_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_programpendidikan` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`nama` varchar(200) NOT NULL,
	`akreditasi` varchar(50) NOT NULL,
	`icon` varchar(100) NOT NULL,
	`gambar` varchar(100),
	`order` int NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `core_programpendidikan_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_programpendidikanimage` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`gambar` varchar(100) NOT NULL,
	`alt_text` varchar(200) NOT NULL,
	`order` int NOT NULL,
	`created_at` datetime NOT NULL,
	`program_id` bigint NOT NULL,
	CONSTRAINT `core_programpendidikanimage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_program` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`nama` varchar(200) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`deskripsi` text NOT NULL,
	`gambar` varchar(100),
	`tanggal_mulai` date,
	`tanggal_selesai` date,
	`status` varchar(20) NOT NULL,
	`is_featured` boolean NOT NULL,
	`meta_title` varchar(200) NOT NULL,
	`meta_description` text NOT NULL,
	`order` int NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `core_program_id` PRIMARY KEY(`id`),
	CONSTRAINT `core_program_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `admissions_santri` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`nama_lengkap` varchar(200) NOT NULL,
	`nisn` varchar(10) NOT NULL,
	`tempat_lahir` varchar(100) NOT NULL,
	`tanggal_lahir` date NOT NULL,
	`jenis_kelamin` varchar(10) NOT NULL,
	`agama` varchar(20) NOT NULL,
	`golongan_darah` varchar(3) NOT NULL,
	`tinggi_badan` int,
	`berat_badan` int,
	`nama_ayah` varchar(200) NOT NULL,
	`nik_ayah` varchar(16) NOT NULL,
	`nama_ibu` varchar(200) NOT NULL,
	`nik_ibu` varchar(16) NOT NULL,
	`pekerjaan_ayah` varchar(100) NOT NULL,
	`pekerjaan_ibu` varchar(100) NOT NULL,
	`no_hp_ayah` varchar(15) NOT NULL,
	`no_hp_ibu` varchar(15) NOT NULL,
	`alamat_orangtua` text NOT NULL,
	`alamat` text NOT NULL,
	`no_hp` varchar(15) NOT NULL,
	`email` varchar(254) NOT NULL,
	`asal_sekolah` varchar(200) NOT NULL,
	`kelas_terakhir` varchar(50) NOT NULL,
	`tahun_lulus` varchar(4) NOT NULL,
	`no_ijazah` varchar(50) NOT NULL,
	`foto_santri` varchar(100),
	`foto_ktp` varchar(100),
	`foto_akta` varchar(100),
	`foto_ijazah` varchar(100),
	`foto_kk` varchar(100),
	`surat_sehat` varchar(100),
	`foto_santri_approved` boolean NOT NULL,
	`foto_ktp_approved` boolean NOT NULL,
	`foto_akta_approved` boolean NOT NULL,
	`foto_ijazah_approved` boolean NOT NULL,
	`surat_sehat_approved` boolean NOT NULL,
	`catatan` text NOT NULL,
	`status` varchar(20) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`agama_ayah` varchar(20) NOT NULL,
	`agama_ibu` varchar(20) NOT NULL,
	`anak_ke` int,
	`bahasa_sehari_hari` varchar(50) NOT NULL,
	`desa` varchar(100) NOT NULL,
	`jumlah_saudara` int,
	`kabupaten` varchar(100) NOT NULL,
	`kecamatan` varchar(100) NOT NULL,
	`kelas_diterima` varchar(50) NOT NULL,
	`kewarganegaraan` varchar(10) NOT NULL,
	`kewarganegaraan_ayah` varchar(10) NOT NULL,
	`kewarganegaraan_ibu` varchar(10) NOT NULL,
	`kode_pos` varchar(10) NOT NULL,
	`nama_panggilan` varchar(100) NOT NULL,
	`npsn_sekolah` varchar(20) NOT NULL,
	`pendidikan_ayah` varchar(50) NOT NULL,
	`pendidikan_ibu` varchar(50) NOT NULL,
	`provinsi` varchar(100) NOT NULL,
	`riwayat_penyakit` varchar(200) NOT NULL,
	`status_ayah` varchar(10) NOT NULL,
	`status_ibu` varchar(10) NOT NULL,
	`tanggal_diterima` date,
	`tanggal_lahir_ayah` date,
	`tanggal_lahir_ibu` date,
	`tempat_lahir_ayah` varchar(100) NOT NULL,
	`tempat_lahir_ibu` varchar(100) NOT NULL,
	`tinggal_dengan` varchar(50) NOT NULL,
	CONSTRAINT `admissions_santri_id` PRIMARY KEY(`id`),
	CONSTRAINT `admissions_santri_nisn_unique` UNIQUE(`nisn`)
);
--> statement-breakpoint
CREATE TABLE `core_sejarahtimeline` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`judul` varchar(200) NOT NULL,
	`icon` varchar(100) NOT NULL,
	`deskripsi` text NOT NULL,
	`order` int NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `core_sejarahtimeline_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_sejarahtimelineimage` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`gambar` varchar(100) NOT NULL,
	`order` int NOT NULL,
	`created_at` datetime NOT NULL,
	`timeline_id` bigint NOT NULL,
	CONSTRAINT `core_sejarahtimelineimage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_seragam` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`hari` varchar(50) NOT NULL,
	`kategori` varchar(20) NOT NULL,
	`seragam_putra` varchar(200) NOT NULL,
	`seragam_putri` varchar(200) NOT NULL,
	`seragam` varchar(200) NOT NULL,
	`order` int NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `core_seragam_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_socialmedia` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`platform` varchar(50) NOT NULL,
	`username` varchar(200) NOT NULL,
	`url` varchar(200) NOT NULL,
	`order` int NOT NULL,
	`is_active` boolean NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `core_socialmedia_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_statistik` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`judul` varchar(200) NOT NULL,
	`nilai` varchar(100) NOT NULL,
	`icon` varchar(100) NOT NULL,
	`deskripsi` varchar(300) NOT NULL,
	`warna` varchar(50) NOT NULL,
	`order` int NOT NULL,
	`is_published` boolean NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `core_statistik_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `system_settings` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`maintenance_mode` boolean NOT NULL DEFAULT false,
	`allow_registration` boolean NOT NULL DEFAULT true,
	`debug_mode` boolean NOT NULL DEFAULT false,
	`session_timeout` int NOT NULL DEFAULT 60,
	`max_upload_size` int NOT NULL DEFAULT 5,
	`backup_frequency` varchar(20) NOT NULL DEFAULT 'daily',
	`log_retention_days` int NOT NULL DEFAULT 30,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `system_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_tenagapengajar` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`nama_lengkap` varchar(200) NOT NULL,
	`nama_panggilan` varchar(100) NOT NULL,
	`jenis_kelamin` varchar(1) NOT NULL,
	`foto` varchar(100),
	`tempat_lahir` varchar(100) NOT NULL,
	`tanggal_lahir` date,
	`alamat` text NOT NULL,
	`no_hp` varchar(20) NOT NULL,
	`email` varchar(254) NOT NULL,
	`pendidikan_terakhir` varchar(200) NOT NULL,
	`universitas` varchar(200) NOT NULL,
	`tahun_lulus` varchar(4) NOT NULL,
	`bidang_keahlian` varchar(200) NOT NULL,
	`mata_pelajaran` varchar(300) NOT NULL,
	`pengalaman_mengajar` text NOT NULL,
	`prestasi` text NOT NULL,
	`riwayat_pendidikan` text NOT NULL,
	`organisasi` text NOT NULL,
	`karya_tulis` text NOT NULL,
	`motto` varchar(300) NOT NULL,
	`whatsapp` varchar(20) NOT NULL,
	`facebook` varchar(200) NOT NULL,
	`instagram` varchar(200) NOT NULL,
	`twitter` varchar(200) NOT NULL,
	`linkedin` varchar(200) NOT NULL,
	`youtube` varchar(200) NOT NULL,
	`tiktok` varchar(200) NOT NULL,
	`order` int NOT NULL,
	`is_published` boolean NOT NULL,
	`is_featured` boolean NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`bagian_jabatan_id` bigint,
	CONSTRAINT `core_tenagapengajar_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users_user` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`password` varchar(128) NOT NULL,
	`last_login` datetime,
	`is_superuser` boolean NOT NULL,
	`username` varchar(150) NOT NULL,
	`first_name` varchar(150) NOT NULL,
	`last_name` varchar(150) NOT NULL,
	`email` varchar(254) NOT NULL,
	`is_staff` boolean NOT NULL,
	`is_active` boolean NOT NULL,
	`date_joined` datetime NOT NULL,
	`role` varchar(20) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`avatar` text,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `users_user_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_user_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `core_visimisi` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`visi` text NOT NULL,
	`misi` text NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `core_visimisi_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_websitesettings` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`nama_pondok` varchar(200) NOT NULL,
	`arabic_name` varchar(500) NOT NULL,
	`alamat` text NOT NULL,
	`logo` varchar(100),
	`no_telepon` varchar(20) NOT NULL,
	`email` varchar(254) NOT NULL,
	`website` varchar(200) NOT NULL,
	`facebook` varchar(200) NOT NULL,
	`instagram` varchar(200) NOT NULL,
	`twitter` varchar(200) NOT NULL,
	`tiktok` varchar(200) NOT NULL,
	`hero_title` varchar(200) NOT NULL,
	`hero_subtitle` varchar(200) NOT NULL,
	`hero_tagline` varchar(300) NOT NULL,
	`hero_cta_primary_text` varchar(100) NOT NULL,
	`hero_cta_primary_link` varchar(200) NOT NULL,
	`hero_cta_secondary_text` varchar(100) NOT NULL,
	`hero_cta_secondary_link` varchar(200) NOT NULL,
	`announcement_text` varchar(300),
	`announcement_link` varchar(200),
	`announcement_active` boolean DEFAULT false,
	`lokasi_pendaftaran` text NOT NULL,
	`google_maps_link` varchar(200) NOT NULL,
	`google_maps_embed_code` text NOT NULL,
	`qr_code_image` varchar(100),
	`deskripsi` text NOT NULL,
	`favicon` varchar(100),
	`meta_title` varchar(200) NOT NULL,
	`meta_description` text NOT NULL,
	`meta_keywords` varchar(500) NOT NULL,
	`updated_at` datetime NOT NULL,
	`header_mobile_image` varchar(100),
	`header_mobile_height` int NOT NULL,
	`maintenance_message` text NOT NULL,
	`maintenance_mode` boolean NOT NULL,
	CONSTRAINT `core_websitesettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `core_whatsapptemplatekategori` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`nama` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`deskripsi` text NOT NULL,
	`order` int NOT NULL,
	`is_active` boolean NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `core_whatsapptemplatekategori_id` PRIMARY KEY(`id`),
	CONSTRAINT `core_whatsapptemplatekategori_nama_unique` UNIQUE(`nama`),
	CONSTRAINT `core_whatsapptemplatekategori_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `core_whatsapptemplate` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`nama` varchar(200) NOT NULL,
	`tipe` varchar(20) NOT NULL,
	`pesan` text NOT NULL,
	`variabel` varchar(500) NOT NULL,
	`order` int NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`kategori_id` bigint,
	CONSTRAINT `core_whatsapptemplate_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `admin_panel_bugnote` ADD CONSTRAINT `admin_panel_bugnote_created_by_id_users_user_id_fk` FOREIGN KEY (`created_by_id`) REFERENCES `users_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `admin_panel_convertedimage` ADD CONSTRAINT `admin_panel_convertedimage_created_by_id_users_user_id_fk` FOREIGN KEY (`created_by_id`) REFERENCES `users_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_blogpost_tags` ADD CONSTRAINT `blog_blogpost_tags_blogpost_id_blog_blogpost_id_fk` FOREIGN KEY (`blogpost_id`) REFERENCES `blog_blogpost`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_blogpost_tags` ADD CONSTRAINT `blog_blogpost_tags_tag_id_blog_tag_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `blog_tag`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_blogpost` ADD CONSTRAINT `blog_blogpost_author_id_users_user_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_blogpost` ADD CONSTRAINT `blog_blogpost_category_id_blog_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `blog_category`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `core_dokumentasiimage` ADD CONSTRAINT `core_dokumentasiimage_dokumentasi_id_core_dokumentasi_id_fk` FOREIGN KEY (`dokumentasi_id`) REFERENCES `core_dokumentasi`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `core_ekstrakurikulerimage` ADD CONSTRAINT `core_ekstrakurikulerimage_ekstrakurikuler_id_core_ekstrakurikuler_id_fk` FOREIGN KEY (`ekstrakurikuler_id`) REFERENCES `core_ekstrakurikuler`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users_loginhistory` ADD CONSTRAINT `users_loginhistory_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments_payment` ADD CONSTRAINT `payments_payment_santri_id_admissions_santri_id_fk` FOREIGN KEY (`santri_id`) REFERENCES `admissions_santri`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments_payment` ADD CONSTRAINT `payments_payment_verified_by_id_users_user_id_fk` FOREIGN KEY (`verified_by_id`) REFERENCES `users_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `core_programpendidikanimage` ADD CONSTRAINT `core_programpendidikanimage_program_id_core_programpendidikan_id_fk` FOREIGN KEY (`program_id`) REFERENCES `core_programpendidikan`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `core_sejarahtimelineimage` ADD CONSTRAINT `core_sejarahtimelineimage_timeline_id_core_sejarahtimeline_id_fk` FOREIGN KEY (`timeline_id`) REFERENCES `core_sejarahtimeline`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `core_tenagapengajar` ADD CONSTRAINT `core_tenagapengajar_bagian_jabatan_id_core_bagianjabatan_id_fk` FOREIGN KEY (`bagian_jabatan_id`) REFERENCES `core_bagianjabatan`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `core_whatsapptemplate` ADD CONSTRAINT `core_whatsapptemplate_kategori_id_core_whatsapptemplatekategori_id_fk` FOREIGN KEY (`kategori_id`) REFERENCES `core_whatsapptemplatekategori`(`id`) ON DELETE no action ON UPDATE no action;