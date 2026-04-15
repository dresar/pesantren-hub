-- ==============================================================================
-- PESANTREN HUB — CLEANUP SQL: HAPUS TABEL DUPLIKAT & TIDAK TERPAKAI
-- Database: Neon PostgreSQL (neondb)
-- Generated: 2026-04-16
--
-- ANALISIS DUPLIKAT & TIDAK TERPAKAI:
-- Dari total 68 tabel di database, ditemukan:
--
-- 1. core_whatsapptemplatekategori
--    - TIDAK DIGUNAKAN di schema.ts Drizzle aktif
--    - Template WhatsApp tidak menggunakan foreign key ke tabel ini
--    - AMAN untuk dihapus
--
-- 2. core_form_config
--    - Fitur /admin/form-config sudah DIHAPUS dari aplikasi
--    - Tidak ada lagi frontend yang menggunakan tabel ini
--    - AMAN untuk dihapus
--
-- CATATAN PENTING:
-- - core_program ≠ duplikat dari core_programpendidikan
--   core_program = Program Unggulan/Jenjang (halaman /program)
--   core_programpendidikan = Program spesifik dengan akreditasi
--   KEDUANYA DIGUNAKAN, jangan dihapus.
--
-- - drizzle.__drizzle_migrations = tabel sistem migrasi Drizzle, JANGAN dihapus
--
-- CARA PENGGUNAAN:
-- 1. Buka Neon SQL Editor di https://console.neon.tech
-- 2. Pilih database neondb
-- 3. Copy-paste seluruh isi file ini
-- 4. Klik "Run" untuk mengeksekusi
-- ==============================================================================

-- Pertama, pastikan tidak ada data penting sebelum menghapus:
-- (Cek dulu apakah ada data)

-- SELECT COUNT(*) FROM core_whatsapptemplatekategori;   -- Cek isi
-- SELECT COUNT(*) FROM core_form_config;                 -- Cek isi

-- ==============================================================================
-- HAPUS TABEL: core_form_config
-- Alasan: Fitur Form Config sudah dihapus dari admin panel (tidak ada UI-nya)
-- ==============================================================================
DROP TABLE IF EXISTS core_form_config CASCADE;

-- ==============================================================================
-- HAPUS TABEL: core_whatsapptemplatekategori
-- Alasan: Tidak digunakan dalam schema Drizzle aktif.
--         Template WhatsApp tidak memerlukan kategori terpisah.
-- ==============================================================================
DROP TABLE IF EXISTS core_whatsapptemplatekategori CASCADE;

-- ==============================================================================
-- VERIFIKASI: Pastikan tabel yang penting MASIH ADA
-- Jalankan query ini setelah DROP untuk konfirmasi:
-- ==============================================================================
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- ==============================================================================
-- HASIL YANG DIHARAPKAN SETELAH CLEANUP:
-- Total tabel berkurang dari 68 → 66 tabel
-- Tabel yang dihapus: core_form_config, core_whatsapptemplatekategori
-- ==============================================================================
