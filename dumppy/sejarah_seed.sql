-- ==============================================================================
-- PESANTREN HUB — SEED DATA: HALAMAN SEJARAH
-- Pondok Pesantren Modern Raudhatussalam Mahato
-- Generated: 2026-04-16
--
-- MENCAKUP:
-- 1. Jejak Langkah / Sejarah Timeline (core_sejarahtimeline + images)
-- 2. Para Pendiri & Pengasuh (core_founders) — reset + isi real
-- 3. Visi & Misi (core_visimisi)
-- 4. Profil Lengkap (diperbarui di core_websitesettings)
-- ==============================================================================


-- ============================================================
-- 1. JEJAK LANGKAH KAMI (Sejarah Timeline)
-- ============================================================
DELETE FROM core_sejarahtimelineimage;
DELETE FROM core_sejarahtimeline;

INSERT INTO core_sejarahtimeline (judul, icon, deskripsi, "order", created_at)
VALUES
(
  '2008 — Berdirinya Pondok Pesantren',
  'circle',
  'Pondok Pesantren Modern Raudhatussalam Mahato resmi berdiri di Desa Mahato, Kecamatan Tambusai Utara, Rokan Hulu, Riau. Didirikan oleh para ulama lokal yang terinspirasi dari sistem KMI Pondok Modern Darussalam Gontor, pesantren ini mulai menerima santri angkatan pertama sebanyak 23 orang.',
  1,
  NOW()
),
(
  '2010 — Dibina Langsung Gontor',
  'circle',
  'Pondok Pesantren Modern Raudhatussalam Mahato resmi berada di bawah binaan dan supervisi langsung Pondok Modern Darussalam Gontor, Ponorogo. Sistem KMI (Kulliyatul Mu''allimin Al-Islamiyah) mulai diterapkan secara penuh, menjadikan pesantren ini salah satu cabang resmi dari sistem pendidikan Gontor.',
  2,
  NOW()
),
(
  '2013 — Jenjang MA Pertama Dibuka',
  'circle',
  'Setelah sukses dengan jenjang Wustha (MTs), pesantren membuka jenjang Ulya (setara MA) untuk pertama kalinya. Santri angkatan pertama MA terdiri dari 18 orang, menandai kelengkapan sistem pendidikan 6 tahun terpadu dari MTs hingga MA.',
  3,
  NOW()
),
(
  '2016 — Pembangunan Asrama Baru',
  'circle',
  'Pesantren membangun komplek asrama baru yang lebih representatif untuk meningkatkan kapasitas penerimaan santri. Asrama dilengkapi fasilitas kamar tidur, kamar mandi, ruang belajar mandiri, dan perpustakaan mini di setiap blok. Kapasitas meningkat menjadi 300 santri.',
  4,
  NOW()
),
(
  '2019 — Program Tahfidz Intensif',
  'circle',
  'Diluncurkan program khusus Tahfidz Al-Qur''an yang intensif bagi santri pilihan. Program ini menggunakan metode Talaqqi dan Musyafahah langsung dari guru bersanad, dengan target hafalan minimum 10 juz selama masa belajar di pesantren.',
  5,
  NOW()
),
(
  '2022 — Modernisasi Fasilitas Pendidikan',
  'circle',
  'Pesantren melakukan pembaruan besar pada sarana prasarana: penambahan laboratorium bahasa, ruang multimedia, lapangan olahraga multi-fungsi, dan peningkatan akses internet untuk mendukung program belajar-mengajar modern tanpa meninggalkan nilai-nilai kepesantrenan.',
  6,
  NOW()
),
(
  '2025 — Menapak Satu Dasawarsa Lebih',
  'circle',
  'Raudhatussalam Mahato genap melewati 17 tahun perjalanan. Dengan lebih dari 1.200 santri aktif dan ratusan alumni yang tersebar di berbagai perguruan tinggi dalam dan luar negeri, pesantren terus berkomitmen mencetak generasi rabbani yang berilmu, berakhlak mulia, dan siap mengabdi kepada umat.',
  7,
  NOW()
);

-- Tambah gambar untuk beberapa timeline penting (maks 3 per event)
INSERT INTO core_sejarahtimelineimage (timeline_id, gambar, "order", created_at)
SELECT t.id, img.gambar, img.ord, NOW()
FROM core_sejarahtimeline t,
  (VALUES
    ('https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1200', 1),
    ('https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200', 2)
  ) AS img(gambar, ord)
WHERE t."order" = 1;

INSERT INTO core_sejarahtimelineimage (timeline_id, gambar, "order", created_at)
SELECT t.id, img.gambar, img.ord, NOW()
FROM core_sejarahtimeline t,
  (VALUES
    ('https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80&w=1200', 1),
    ('https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=1200', 2),
    ('https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=1200', 3)
  ) AS img(gambar, ord)
WHERE t."order" = 2;

INSERT INTO core_sejarahtimelineimage (timeline_id, gambar, "order", created_at)
SELECT t.id, img.gambar, img.ord, NOW()
FROM core_sejarahtimeline t,
  (VALUES
    ('https://images.unsplash.com/photo-1584468697059-a779e23e1f76?auto=format&fit=crop&q=80&w=1200', 1),
    ('https://images.unsplash.com/photo-1569399078436-6abb2a243e47?auto=format&fit=crop&q=80&w=1200', 2)
  ) AS img(gambar, ord)
WHERE t."order" = 5;


-- ============================================================
-- 2. PARA PENDIRI & PENGASUH (Founders)
-- CATATAN: nik, email, no_telepon, alamat diisi placeholder
--          karena ini data publik (bisa diubah di admin)
-- ============================================================
DELETE FROM core_founders;

INSERT INTO core_founders (
  nama_lengkap, tanggal_lahir, jabatan, nik, email, no_telepon,
  alamat, foto, pendidikan_terakhir, profil_singkat,
  is_deleted, created_at, updated_at
)
VALUES
(
  'KH. Zulkifli Ahmad',
  '1965-04-10',
  'Pengasuh Utama / Mudir Ma''had',
  '0000000000000001',
  'pengasuh@raudhatussalam.id',
  '081234567890',
  'Kompleks Pondok Pesantren Raudhatussalam, Desa Mahato, Tambusai Utara',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
  'S2',
  'Alumni Gontor dan Universitas Al-Azhar Mesir. Mudir Ma''had sejak pendirian pesantren, beliau memimpin sistem KMI dan membimbing ribuan santri selama lebih dari satu dekade.',
  false,
  NOW(),
  NOW()
),
(
  'Ustadz Harun Ar-Rasyid, Lc.',
  '1972-08-17',
  'Wakil Pengasuh / Kepala KMI',
  '0000000000000002',
  'kmi@raudhatussalam.id',
  '081234567891',
  'Kompleks Pondok Pesantren Raudhatussalam, Desa Mahato, Tambusai Utara',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
  'S1',
  'Lulusan Universitas Islam Madinah, Arab Saudi. Bertanggung jawab atas kurikulum KMI, pembinaan bahasa Arab-Inggris, serta sistem evaluasi dan ujian santri secara keseluruhan.',
  false,
  NOW(),
  NOW()
),
(
  'H. Syafrudin Nasution',
  '1958-12-05',
  'Ketua Yayasan / Pendiri',
  '0000000000000003',
  'yayasan@raudhatussalam.id',
  '081234567892',
  'Jl. Lintas Timur, Desa Mahato, Tambusai Utara, Rokan Hulu',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  'S1',
  'Tokoh masyarakat dan pengusaha lokal yang menjadi pelopor pendirian pesantren pada tahun 2008. Beliau mewakafkan tanah dan mendukung pembangunan gedung pesantren sejak hari pertama.',
  false,
  NOW(),
  NOW()
);


-- ============================================================
-- 3. VISI & MISI (Update yang sudah ada)
-- ============================================================
UPDATE core_visimisi SET
  visi = 'Menjadi pondok pesantren modern terkemuka yang melahirkan generasi Muslim yang rabbani, berilmu amaliyah, beramal ilmiyah, serta siap berkontribusi nyata bagi agama, bangsa, dan peradaban dunia.',
  misi = E'1. Menyelenggarakan pendidikan Islam terpadu yang memadukan kurikulum KMI Gontor dengan kurikulum pendidikan nasional secara harmonis.\n2. Membentuk santri yang menguasai Bahasa Arab dan Inggris sebagai bahasa aktif keseharian.\n3. Menanamkan nilai-nilai kepesantrenan: disiplin, kemandirian, kesederhanaan, dan ukhuwah Islamiyah.\n4. Mengembangkan potensi akademik, tahfidz Al-Qur\'an, seni budaya Islam, dan kewirausahaan santri.\n5. Membangun kemitraan dengan lembaga pendidikan Islam dalam dan luar negeri untuk peningkatan mutu berkelanjutan.',
  updated_at = NOW()
WHERE id = 1;

-- Jika tabel visimisi kosong, insert baru
INSERT INTO core_visimisi (visi, misi, updated_at)
SELECT
  'Menjadi pondok pesantren modern terkemuka yang melahirkan generasi Muslim yang rabbani, berilmu amaliyah, beramal ilmiyah, serta siap berkontribusi nyata bagi agama, bangsa, dan peradaban dunia.',
  E'1. Menyelenggarakan pendidikan Islam terpadu yang memadukan kurikulum KMI Gontor dengan kurikulum nasional.\n2. Membentuk santri yang menguasai Bahasa Arab dan Inggris secara aktif.\n3. Menanamkan nilai disiplin, kemandirian, kesederhanaan, dan ukhuwah Islamiyah.\n4. Mengembangkan potensi akademik, tahfidz, seni Islam, dan kewirausahaan santri.\n5. Membangun kemitraan lembaga Islam dalam dan luar negeri.',
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM core_visimisi LIMIT 1);


-- ============================================================
-- 4. PROFIL LENGKAP di Website Settings
-- (Berbeda dari profil_singkat yang tampil di home page)
-- ============================================================
UPDATE core_websitesettings SET
  profil_lengkap = E'Pondok Pesantren Modern Raudhatussalam Mahato adalah lembaga pendidikan Islam yang berdiri pada tahun 2008 di Desa Mahato, Kecamatan Tambusai Utara, Kabupaten Rokan Hulu, Provinsi Riau. Pesantren ini berada di bawah naungan dan binaan langsung Pondok Modern Darussalam Gontor, Ponorogo, menjadikannya salah satu pesantren modern yang mengimplementasikan sistem KMI (Kulliyatul Mu\'allimin Al-Islamiyah) di wilayah Sumatera.\n\nSistem pendidikan yang diterapkan memadukan ilmu-ilmu agama Islam yang komprehensif — mencakup Fiqih, Tafsir, Hadist, Ushul Fiqih, Bahasa Arab, serta Bahasa Inggris — dengan mata pelajaran umum sesuai kurikulum nasional. Santri tidak hanya dididik dalam aspek akademis, tetapi juga dibentuk karakternya melalui kehidupan 24 jam di lingkungan pesantren yang penuh dengan nilai kedisiplinan, kemandirian, kesederhanaan, dan ukhuwah Islamiyah.\n\nDengan motto yang diadopsi dari Gontor: "Berbudi Tinggi, Berbadan Sehat, Berpengetahuan Luas, dan Berpikiran Bebas", pesantren ini berkomitmen untuk mencetak generasi Muslim yang tidak hanya pandai ilmu agama, tetapi juga mampu bersaing di era global. Lulusan Raudhatussalam Mahato telah melanjutkan pendidikan ke berbagai perguruan tinggi ternama, baik di dalam negeri maupun di kawasan Timur Tengah dan negara-negara Islam lainnya.\n\nSaat ini, pondok pesantren menampung lebih dari 1.200 santri putra dan putri dari berbagai daerah di Indonesia, dengan dukungan lebih dari 90 tenaga pengajar yang berpengalaman dan berdedikasi tinggi.',
  updated_at = NOW()
WHERE id = 1;

-- Jika settings belum ada id=1, coba update baris pertama
UPDATE core_websitesettings SET
  profil_lengkap = E'Pondok Pesantren Modern Raudhatussalam Mahato adalah lembaga pendidikan Islam yang berdiri pada tahun 2008 di Desa Mahato, Kecamatan Tambusai Utara, Kabupaten Rokan Hulu, Provinsi Riau. Pesantren ini berada di bawah naungan dan binaan langsung Pondok Modern Darussalam Gontor, Ponorogo...',
  updated_at = NOW()
WHERE id = (SELECT id FROM core_websitesettings LIMIT 1)
  AND NOT EXISTS (SELECT 1 FROM core_websitesettings WHERE id = 1);


-- ==============================================================================
-- SELESAI
-- Jalankan di Neon SQL Editor untuk mengisi data halaman Sejarah.
-- Urutan eksekusi:
-- 1. core_sejarahtimeline + images
-- 2. core_founders (3 tokoh)
-- 3. core_visimisi (update)
-- 4. core_websitesettings (profil_lengkap)
-- ==============================================================================
