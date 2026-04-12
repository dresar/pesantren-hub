-- ============================================================================
-- Migration: 0002 - Add Normalized Parents/Guardians Tables
-- 
-- Tujuan:
--   Memindahkan data orang tua dari kolom denormalisasi di admissions_santri
--   ke tabel terpisah yang ternormalisasi. Data lama di admissions_santri
--   TIDAK dihapus (backward compatible) hingga migrasi data selesai.
--
-- Tabel baru:
--   admissions_parents       → Data unik setiap orang tua / wali
--   admissions_santri_parents → Junction table: hubungan santri ↔ orang tua
-- ============================================================================

CREATE TABLE IF NOT EXISTS "admissions_parents" (
  "id"                   bigserial PRIMARY KEY NOT NULL,
  
  -- Identitas
  "nik"                  varchar(16) NOT NULL UNIQUE,
  "nama_lengkap"         varchar(200) NOT NULL,
  
  -- Kontak
  "no_hp"                varchar(20) NOT NULL,
  "email"                varchar(254),
  "alamat"               text NOT NULL,
  
  -- Data Pribadi
  "tempat_lahir"         varchar(100),
  "tanggal_lahir"        date,
  "status"               varchar(20) NOT NULL DEFAULT 'Hidup',
  -- values: 'Hidup', 'Meninggal', 'Bercerai'
  "agama"                varchar(20),
  "kewarganegaraan"      varchar(20) DEFAULT 'WNI',
  
  -- Sosial Ekonomi
  "pendidikan_terakhir"  varchar(50),
  "pekerjaan"            varchar(100),
  "penghasilan"          varchar(50),
  
  "created_at"           timestamp NOT NULL DEFAULT now(),
  "updated_at"           timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "admissions_santri_parents" (
  "id"                   bigserial PRIMARY KEY NOT NULL,
  "santri_id"            integer NOT NULL,
  "parent_id"            integer NOT NULL,
  
  -- Hubungan: 'Ayah Kandung', 'Ibu Kandung', 'Wali', 'Ayah Tiri', 'Ibu Tiri'
  "hubungan"             varchar(50) NOT NULL,
  
  -- Kontak utama yang dihubungi
  "is_primary_contact"   boolean NOT NULL DEFAULT false,
  
  CONSTRAINT "admissions_santri_parents_santri_id_fkey"
    FOREIGN KEY ("santri_id")
    REFERENCES "admissions_santri" ("id")
    ON DELETE CASCADE,
  
  CONSTRAINT "admissions_santri_parents_parent_id_fkey"
    FOREIGN KEY ("parent_id")
    REFERENCES "admissions_parents" ("id")
    ON DELETE CASCADE
);

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS "idx_santri_parents_santri_id"
  ON "admissions_santri_parents" ("santri_id");

CREATE INDEX IF NOT EXISTS "idx_santri_parents_parent_id"
  ON "admissions_santri_parents" ("parent_id");

CREATE INDEX IF NOT EXISTS "idx_parents_nik"
  ON "admissions_parents" ("nik");
