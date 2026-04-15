-- ==============================================================================
-- PESANTREN HUB — RESET & SEED: PROGRAM PENDIDIKAN + JENJANG
-- Pondok Pesantren Modern Raudhatussalam Mahato
-- Generated: 2026-04-16
-- ==============================================================================

-- ============================================================
-- BAGIAN 1: RESET & SEED "core_programpendidikan" (Program Pendidikan)
-- Tabel ini menampilkan program/bidang keilmuan di pesantren
-- ============================================================
DELETE FROM core_programpendidikanimage;
DELETE FROM core_programpendidikan;

INSERT INTO core_programpendidikan (nama, akreditasi, icon, gambar, "order", created_at)
VALUES
(
  'Pendidikan Diniyyah (KMI)',
  'Terakreditasi',
  'BookOpen',
  'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800',
  1,
  NOW()
),
(
  'Bahasa Arab & Al-Qur''an',
  'Terakreditasi',
  'Book',
  'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800',
  2,
  NOW()
),
(
  'Tahfidz Al-Qur''an',
  'Terakreditasi',
  'Star',
  'https://images.unsplash.com/photo-1584468697059-a779e23e1f76?auto=format&fit=crop&q=80&w=800',
  3,
  NOW()
);

-- Insert gambar untuk setiap program pendidikan (maks 3 gambar)
-- Program 1: Pendidikan Diniyyah (KMI)
INSERT INTO core_programpendidikanimage (program_id, gambar, alt_text, "order", created_at)
SELECT 
  p.id,
  img.gambar,
  img.alt_text,
  img.ord,
  NOW()
FROM core_programpendidikan p,
  (VALUES
    ('https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=1200', 'Kegiatan Belajar KMI', 1),
    ('https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80&w=1200', 'Kelas Diniyyah Santri', 2),
    ('https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1200', 'Suasana Pembelajaran', 3)
  ) AS img(gambar, alt_text, ord)
WHERE p.nama = 'Pendidikan Diniyyah (KMI)';

-- Program 2: Bahasa Arab & Al-Qur'an
INSERT INTO core_programpendidikanimage (program_id, gambar, alt_text, "order", created_at)
SELECT 
  p.id,
  img.gambar,
  img.alt_text,
  img.ord,
  NOW()
FROM core_programpendidikan p,
  (VALUES
    ('https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=1200', 'Pembelajaran Bahasa Arab', 1),
    ('https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&q=80&w=1200', 'Belajar Tilawah Al-Qur''an', 2),
    ('https://images.unsplash.com/photo-1592375474978-54abb14ad3b6?auto=format&fit=crop&q=80&w=1200', 'Mushaf Al-Qur''an', 3)
  ) AS img(gambar, alt_text, ord)
WHERE p.nama = 'Bahasa Arab & Al-Qur''an';

-- Program 3: Tahfidz Al-Qur'an
INSERT INTO core_programpendidikanimage (program_id, gambar, alt_text, "order", created_at)
SELECT 
  p.id,
  img.gambar,
  img.alt_text,
  img.ord,
  NOW()
FROM core_programpendidikan p,
  (VALUES
    ('https://images.unsplash.com/photo-1584468697059-a779e23e1f76?auto=format&fit=crop&q=80&w=1200', 'Setoran Hafalan Santri', 1),
    ('https://images.unsplash.com/photo-1569399078436-6abb2a243e47?auto=format&fit=crop&q=80&w=1200', 'Bimbingan Tahfidz', 2),
    ('https://images.unsplash.com/photo-1603796846097-bee99e4a601f?auto=format&fit=crop&q=80&w=1200', 'Wisuda Hafidz', 3)
  ) AS img(gambar, alt_text, ord)
WHERE p.nama = 'Tahfidz Al-Qur''an';


-- ============================================================
-- BAGIAN 2: RESET & SEED "core_program" (Jenjang Pendidikan)
-- Tabel ini menampilkan jenjang formal: MTs dan MA
-- ============================================================
DELETE FROM core_program;

INSERT INTO core_program (nama, slug, deskripsi, gambar, tanggal_mulai, tanggal_selesai, status, is_featured, meta_title, meta_description, "order", created_at, updated_at)
VALUES
(
  'Madrasah Tsanawiyah (MTs) — Jenjang Wustha',
  'madrasah-tsanawiyah',
  'Jenjang Wustha (setara SMP) diperuntukkan bagi lulusan SD/MI/Sederajat dengan masa belajar 3 tahun. Kurikulum memadukan pelajaran agama ala Gontor dengan mata pelajaran umum nasional. Santri dibekali kemampuan berbahasa Arab dan Inggris aktif sejak tahun pertama, serta pembentukan karakter disiplin, mandiri, dan berakhlak mulia.',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1200',
  NULL,
  NULL,
  'published',
  true,
  'Program MTs Pondok Pesantren Raudhatussalam Mahato',
  'Jenjang Wustha (setara SMP) untuk lulusan SD/MI dengan kurikulum terpadu KMI Gontor.',
  1,
  NOW(),
  NOW()
),
(
  'Madrasah Aliyah (MA) — Jenjang Ulya',
  'madrasah-aliyah',
  'Jenjang Ulya (setara SMA) diperuntukkan bagi lulusan SMP/MTs/Sederajat dengan masa belajar 3 tahun. Kurikulum meliputi ilmu agama mendalam (Fiqih, Tafsir, Hadist), sains, matematika, serta bahasa Arab dan Inggris aktif. Lulusan siap melanjutkan ke perguruan tinggi dalam maupun luar negeri, atau terjun langsung mengabdi di masyarakat.',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200',
  NULL,
  NULL,
  'published',
  true,
  'Program MA Pondok Pesantren Raudhatussalam Mahato',
  'Jenjang Ulya (setara SMA) untuk lulusan SMP/MTs dengan kurikulum terpadu nasional dan diniyyah.',
  2,
  NOW(),
  NOW()
),
(
  'Program Intensif Bahasa & Tahfidz',
  'program-intensif-tahfidz',
  'Program khusus 1 tahun untuk santri baru yang ingin memperkuat fondasi bahasa Arab, penguasaan mufrodat (kosakata), dan setoran hafalan Al-Qur''an sebelum memasuki jenjang reguler. Program ini menjadi jembatan bagi santri tanpa latar belakang pesantren agar mampu mengikuti sistem KMI secara optimal.',
  'https://images.unsplash.com/photo-1584468697059-a779e23e1f76?auto=format&fit=crop&q=80&w=1200',
  NULL,
  NULL,
  'published',
  true,
  'Program Intensif Tahfidz Raudhatussalam Mahato',
  'Program intensif bahasa Arab dan tahfidz Al-Qur''an untuk santri baru.',
  3,
  NOW(),
  NOW()
);

-- ==============================================================================
-- SELESAI
-- Jalankan di Neon SQL Editor.
-- Setelah dijalankan, data lama terhapus dan diganti dengan 3 data baru:
--   Program Pendidikan: Diniyyah KMI, Bahasa Arab & Al-Qur'an, Tahfidz
--   Jenjang: MTs, MA, Program Intensif
-- ==============================================================================
