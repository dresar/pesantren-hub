-- ============================================================
-- KMI LMS MIGRATION — CREATE TABLES ONLY (SAFE)
-- Hanya membuat tabel baru, tidak mengubah tabel existing
-- ============================================================

CREATE TABLE IF NOT EXISTS kmi_tahun_ajaran (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(20) NOT NULL,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  is_aktif BOOLEAN NOT NULL DEFAULT false,
  keterangan TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kmi_semester (
  id SERIAL PRIMARY KEY,
  tahun_ajaran_id INTEGER NOT NULL REFERENCES kmi_tahun_ajaran(id),
  semester VARCHAR(10) NOT NULL,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  is_aktif BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kmi_jenjang (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(50) NOT NULL,
  kode VARCHAR(10) NOT NULL UNIQUE,
  program VARCHAR(20) NOT NULL,
  urutan INTEGER NOT NULL DEFAULT 0,
  keterangan TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS kmi_kelas (
  id SERIAL PRIMARY KEY,
  jenjang_id INTEGER NOT NULL REFERENCES kmi_jenjang(id),
  tahun_ajaran_id INTEGER NOT NULL REFERENCES kmi_tahun_ajaran(id),
  nama VARCHAR(20) NOT NULL,
  jenis_kelamin VARCHAR(10) NOT NULL,
  wali_kelas_id INTEGER REFERENCES users_user(id),
  kapasitas INTEGER NOT NULL DEFAULT 35,
  ruang_kelas VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kmi_anggota_kelas (
  id SERIAL PRIMARY KEY,
  kelas_id INTEGER NOT NULL REFERENCES kmi_kelas(id),
  santri_id INTEGER NOT NULL REFERENCES admissions_santri(id),
  nomor_urut INTEGER,
  status VARCHAR(20) NOT NULL DEFAULT 'aktif',
  tanggal_masuk DATE,
  tanggal_keluar DATE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kmi_rumpun_mapel (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  nama_arab VARCHAR(200),
  kode VARCHAR(10) NOT NULL UNIQUE,
  warna VARCHAR(20),
  urutan INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS kmi_mapel (
  id SERIAL PRIMARY KEY,
  rumpun_id INTEGER NOT NULL REFERENCES kmi_rumpun_mapel(id),
  nama VARCHAR(100) NOT NULL,
  nama_arab VARCHAR(200),
  kode VARCHAR(10) NOT NULL UNIQUE,
  kitab_referensi TEXT,
  deskripsi TEXT,
  untuk_jenjang VARCHAR(30),
  bobot_harian INTEGER NOT NULL DEFAULT 20,
  bobot_uts INTEGER NOT NULL DEFAULT 30,
  bobot_uas INTEGER NOT NULL DEFAULT 50,
  kkm INTEGER NOT NULL DEFAULT 70,
  is_ujian BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  urutan INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kmi_guru_mapel (
  id SERIAL PRIMARY KEY,
  guru_id INTEGER NOT NULL REFERENCES users_user(id),
  mapel_id INTEGER NOT NULL REFERENCES kmi_mapel(id),
  kelas_id INTEGER NOT NULL REFERENCES kmi_kelas(id),
  semester_id INTEGER NOT NULL REFERENCES kmi_semester(id),
  jam_per_minggu INTEGER NOT NULL DEFAULT 2,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kmi_jam_pelajaran (
  id SERIAL PRIMARY KEY,
  jam_ke INTEGER NOT NULL,
  jam_mulai VARCHAR(5) NOT NULL,
  jam_selesai VARCHAR(5) NOT NULL,
  keterangan VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS kmi_jadwal (
  id SERIAL PRIMARY KEY,
  kelas_id INTEGER NOT NULL REFERENCES kmi_kelas(id),
  mapel_id INTEGER NOT NULL REFERENCES kmi_mapel(id),
  guru_id INTEGER NOT NULL REFERENCES users_user(id),
  semester_id INTEGER NOT NULL REFERENCES kmi_semester(id),
  hari VARCHAR(10) NOT NULL,
  jam_ke INTEGER NOT NULL,
  jam_mulai VARCHAR(5) NOT NULL,
  jam_selesai VARCHAR(5) NOT NULL,
  ruang_kelas VARCHAR(50),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kmi_absensi (
  id SERIAL PRIMARY KEY,
  kelas_id INTEGER NOT NULL REFERENCES kmi_kelas(id),
  mapel_id INTEGER REFERENCES kmi_mapel(id),
  guru_id INTEGER REFERENCES users_user(id),
  tanggal DATE NOT NULL,
  semester_id INTEGER NOT NULL REFERENCES kmi_semester(id),
  tipe VARCHAR(20) NOT NULL DEFAULT 'pelajaran',
  dicatat_oleh INTEGER REFERENCES users_user(id),
  catatan TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kmi_absensi_detail (
  id SERIAL PRIMARY KEY,
  absensi_id INTEGER NOT NULL REFERENCES kmi_absensi(id) ON DELETE CASCADE,
  santri_id INTEGER NOT NULL REFERENCES admissions_santri(id),
  status VARCHAR(20) NOT NULL,
  keterangan VARCHAR(200),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kmi_nilai (
  id SERIAL PRIMARY KEY,
  santri_id INTEGER NOT NULL REFERENCES admissions_santri(id),
  mapel_id INTEGER NOT NULL REFERENCES kmi_mapel(id),
  kelas_id INTEGER NOT NULL REFERENCES kmi_kelas(id),
  semester_id INTEGER NOT NULL REFERENCES kmi_semester(id),
  guru_id INTEGER REFERENCES users_user(id),
  nilai_uh1 NUMERIC(5,2),
  nilai_uh2 NUMERIC(5,2),
  nilai_uh3 NUMERIC(5,2),
  nilai_uh4 NUMERIC(5,2),
  nilai_harian NUMERIC(5,2),
  nilai_uts NUMERIC(5,2),
  nilai_uas NUMERIC(5,2),
  nilai_akhir NUMERIC(5,2),
  predikat VARCHAR(5),
  keterangan_guru TEXT,
  is_finalized BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kmi_rapor (
  id SERIAL PRIMARY KEY,
  santri_id INTEGER NOT NULL REFERENCES admissions_santri(id),
  kelas_id INTEGER NOT NULL REFERENCES kmi_kelas(id),
  semester_id INTEGER NOT NULL REFERENCES kmi_semester(id),
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  total_hadir INTEGER DEFAULT 0,
  total_sakit INTEGER DEFAULT 0,
  total_izin INTEGER DEFAULT 0,
  total_alfa INTEGER DEFAULT 0,
  peringkat_kelas INTEGER,
  jumlah_siswa_kelas INTEGER,
  nilai_rata_rata NUMERIC(5,2),
  predikat_umum VARCHAR(30),
  catatan_wali_kelas TEXT,
  catatan_kepala_kmi TEXT,
  status_naik_kelas VARCHAR(20),
  kelas_selanjutnya VARCHAR(20),
  dibuat_oleh INTEGER REFERENCES users_user(id),
  disetujui_oleh INTEGER REFERENCES users_user(id),
  tanggal_cetak TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kmi_kokur_jenis (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  nama_arab VARCHAR(200),
  deskripsi TEXT,
  frekuensi VARCHAR(50),
  waktu_pelaksanaan VARCHAR(100),
  is_wajib BOOLEAN NOT NULL DEFAULT true,
  is_dinilai BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  urutan INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS kmi_kokur_sesi (
  id SERIAL PRIMARY KEY,
  jenis_id INTEGER NOT NULL REFERENCES kmi_kokur_jenis(id),
  kelas_id INTEGER NOT NULL REFERENCES kmi_kelas(id),
  pembimbing_id INTEGER REFERENCES users_user(id),
  semester_id INTEGER NOT NULL REFERENCES kmi_semester(id),
  tanggal DATE NOT NULL,
  waktu_mulai VARCHAR(5),
  waktu_selesai VARCHAR(5),
  materi_tema TEXT,
  catatan TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kmi_kokur_absensi (
  id SERIAL PRIMARY KEY,
  sesi_id INTEGER NOT NULL REFERENCES kmi_kokur_sesi(id) ON DELETE CASCADE,
  santri_id INTEGER NOT NULL REFERENCES admissions_santri(id),
  status VARCHAR(20) NOT NULL,
  catatan VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS kmi_kalender_akademik (
  id SERIAL PRIMARY KEY,
  tahun_ajaran_id INTEGER NOT NULL REFERENCES kmi_tahun_ajaran(id),
  judul VARCHAR(200) NOT NULL,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE,
  tipe VARCHAR(30) NOT NULL,
  deskripsi TEXT,
  affects_absensi BOOLEAN NOT NULL DEFAULT false,
  warna VARCHAR(20),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- INDEX untuk performa
CREATE INDEX IF NOT EXISTS idx_kmi_absensi_tanggal ON kmi_absensi(tanggal);
CREATE INDEX IF NOT EXISTS idx_kmi_absensi_kelas ON kmi_absensi(kelas_id);
CREATE INDEX IF NOT EXISTS idx_kmi_nilai_santri ON kmi_nilai(santri_id);
CREATE INDEX IF NOT EXISTS idx_kmi_nilai_kelas_semester ON kmi_nilai(kelas_id, semester_id);
CREATE INDEX IF NOT EXISTS idx_kmi_rapor_santri ON kmi_rapor(santri_id);
CREATE INDEX IF NOT EXISTS idx_kmi_anggota_kelas_santri ON kmi_anggota_kelas(santri_id);
