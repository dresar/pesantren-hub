-- ============================================================
-- SUPER SEED: KMI GONTOR STANDARD & REALTIME DUMMY DATA
-- Database: Pesantren-Hub
-- ============================================================

-- 1. TAHUN AJARAN & SEMESTER
INSERT INTO kmi_tahun_ajaran (nama, tanggal_mulai, tanggal_selesai, is_aktif, keterangan) VALUES
('2024/2025', '2024-07-15', '2025-06-30', false, 'Tahun ajaran lalu'),
('2025/2026', '2025-07-14', '2026-06-30', true, 'Tahun ajaran berjalan')
ON CONFLICT DO NOTHING;

INSERT INTO kmi_semester (tahun_ajaran_id, semester, tanggal_mulai, tanggal_selesai, is_aktif)
SELECT id, 'ganjil', '2025-07-14', '2025-12-31', false FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO kmi_semester (tahun_ajaran_id, semester, tanggal_mulai, tanggal_selesai, is_aktif)
SELECT id, 'genap', '2026-01-05', '2026-06-30', true FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1
ON CONFLICT DO NOTHING;

-- 2. JENJANG PENDIDIKAN KMI
INSERT INTO kmi_jenjang (nama, kode, program, urutan, keterangan) VALUES
('Kelas I KMI', 'KMI-1', 'reguler', 1, 'Tahun Pertama Reguler'),
('Kelas II KMI', 'KMI-2', 'reguler', 2, 'Tahun Kedua Reguler'),
('Kelas III KMI', 'KMI-3', 'reguler', 3, 'Tahun Ketiga Reguler'),
('Kelas IV KMI', 'KMI-4', 'reguler', 4, 'Tahun Keempat Reguler'),
('Kelas V KMI', 'KMI-5', 'reguler', 5, 'Tahun Kelima Reguler'),
('Kelas VI KMI', 'KMI-6', 'reguler', 6, 'Tahun Akhir (Nihai)'),
('Kelas I Intensif', 'INT-1', 'intensif', 7, 'Tahun Pertama Intensif (Lulusan SMP/MTs)'),
('Kelas III Intensif', 'INT-3', 'intensif', 8, 'Tahun Ketiga Intensif')
ON CONFLICT (kode) DO NOTHING;

-- 3. RUMPUN MATA PELAJARAN KMI
INSERT INTO kmi_rumpun_mapel (nama, nama_arab, kode, warna, urutan) VALUES
('Dirasah Islamiyah', 'الدراسات الإسلامية', 'ISL', '#10B981', 1),
('Ulum Arabiyah', 'العلوم العربية', 'ARB', '#3B82F6', 2),
('Ulum Ammah (Eksakta & Sosial)', 'العلوم العامة', 'AMM', '#8B5CF6', 3),
('Kegiatan & Skill', 'المهارات والأنشطة', 'KGT', '#F59E0B', 4)
ON CONFLICT (kode) DO NOTHING;

-- 4. 30+ MATA PELAJARAN KMI GONTOR
INSERT INTO kmi_mapel (rumpun_id, nama, nama_arab, kode, kitab_referensi, untuk_jenjang, bobot_harian, bobot_uts, bobot_uas, kkm, is_ujian, urutan, is_active)
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='ARB' LIMIT 1), 'Nahwu', 'النحو', 'NAH', 'Al-Ajurumiyah, Imrithi, Alfiyah', '1,2,3,4,5,6', 20, 30, 50, 75, true, 1, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='ARB' LIMIT 1), 'Shorof', 'الصرف', 'SHR', 'Amtsilati Tashrifiyah, Kailani', '1,2,3,4', 20, 30, 50, 75, true, 2, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='ARB' LIMIT 1), 'Muthola''ah', 'المطالعة', 'MTH', 'Al-Qira''ah Al-Rasyidah', '1,2,3,4,5,6', 20, 30, 50, 70, true, 3, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='ARB' LIMIT 1), 'Insya''', 'الإنشاء', 'INS', 'Al-Muwajjah', '1,2,3,4,5,6', 20, 30, 50, 70, true, 4, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='ARB' LIMIT 1), 'Mahfudzot', 'المحفوظات', 'MAH', 'Al-Mahfudzat', '1,2,3,4,5,6', 20, 30, 50, 75, true, 5, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='ARB' LIMIT 1), 'Balaghah', 'البلاغة', 'BLG', 'Al-Balaghah Al-Wadhihah', '4,5,6', 20, 30, 50, 70, true, 6, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='ARB' LIMIT 1), 'Tarikh Adab Lughah', 'تاريخ الأدب اللغوي', 'TAL', 'Tarikh Adab', '5,6', 20, 30, 50, 70, true, 7, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='ISL' LIMIT 1), 'Tafsir', 'التفسير', 'TFS', 'Tafsir Jalalain', '4,5,6', 20, 30, 50, 70, true, 8, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='ISL' LIMIT 1), 'Hadits', 'الحديث', 'HDT', 'Bulughul Maram, Riyadhus Shalihin', '2,3,4,5,6', 20, 30, 50, 70, true, 9, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='ISL' LIMIT 1), 'Fiqih', 'الفقه', 'FQH', 'Fathul Qarib, Fathul Mu''in', '1,2,3,4,5,6', 20, 30, 50, 70, true, 10, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='ISL' LIMIT 1), 'Ushul Fiqih', 'أصول الفقه', 'USH', 'Al-Waraqat', '5,6', 20, 30, 50, 70, true, 11, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='ISL' LIMIT 1), 'Tauhid / Aqidah', 'التوحيد', 'TAU', 'Aqidatul Awam, Ummul Barahin', '1,2,3,4,5,6', 20, 30, 50, 70, true, 12, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='ISL' LIMIT 1), 'Tarikh Islam', 'تاريخ الإسلام', 'TRK', 'Khulasah Nurul Yaqin', '1,2,3,4,5,6', 20, 30, 50, 70, true, 13, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='ISL' LIMIT 1), 'Tajwid', 'التجويد', 'TJW', 'Tuhfatul Athfal, Jazariyah', '1,2,3', 20, 30, 50, 70, true, 14, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='ISL' LIMIT 1), 'Faraid', 'الفرائض', 'FRD', 'Ar-Rahbiyah', '5,6', 20, 30, 50, 70, true, 15, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='ISL' LIMIT 1), 'Adyan', 'مقارنة الأديان', 'ADY', 'Muqaranatul Adyan', '6', 20, 30, 50, 70, true, 16, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='AMM' LIMIT 1), 'Matematika', 'الرياضيات', 'MAT', 'Buku Paket MIPA', '1,2,3,4,5,6', 20, 30, 50, 65, true, 17, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='AMM' LIMIT 1), 'Fisika', 'الفيزياء', 'FIS', 'Buku Paket MIPA', '3,4,5,6', 20, 30, 50, 65, true, 18, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='AMM' LIMIT 1), 'Biologi', 'علم الأحياء', 'BIO', 'Buku Paket MIPA', '2,3,4,5,6', 20, 30, 50, 65, true, 19, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='AMM' LIMIT 1), 'Kimia', 'الكيمياء', 'KIM', 'Buku Paket MIPA', '4,5,6', 20, 30, 50, 65, true, 20, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='AMM' LIMIT 1), 'Geografi', 'الجغرافيا', 'GEO', 'Buku Paket IPS', '1,2,3', 20, 30, 50, 70, true, 21, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='AMM' LIMIT 1), 'English Reading', 'المطالعة الإنجليزية', 'E-RD', 'English Reader KMI', '1,2,3,4,5,6', 20, 30, 50, 70, true, 22, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='AMM' LIMIT 1), 'English Grammar', 'القواعد الإنجليزية', 'E-GR', 'Grammar in Use', '1,2,3,4,5,6', 20, 30, 50, 70, true, 23, true UNION ALL
SELECT (SELECT id FROM kmi_rumpun_mapel WHERE kode='AMM' LIMIT 1), 'Mantiq', 'المنطق', 'MNQ', 'Ilmu mantiq dasar', '5,6', 20, 30, 50, 70, true, 24, true 
ON CONFLICT DO NOTHING;

-- 5. JAM PELAJARAN KMI
INSERT INTO kmi_jam_pelajaran (jam_ke, jam_mulai, jam_selesai, keterangan) VALUES
(1, '07:00', '07:45', 'Hishoh Ula'),
(2, '07:45', '08:30', 'Hishoh Tsaniyah'),
(3, '08:30', '09:15', 'Hishoh Tsalitsah'),
(4, '09:15', '09:45', 'Rokhah (Istirahat 1)'),
(5, '09:45', '10:30', 'Hishoh Robi''ah'),
(6, '10:30', '11:15', 'Hishoh Khomisah'),
(7, '11:15', '12:00', 'Hishoh Sadisah'),
(8, '12:00', '13:30', 'Ishoma (Dzuhur)'),
(9, '13:30', '14:15', 'Hishoh Sabi''ah (Siang)'),
(10, '14:15', '15:00', 'Hishoh Tsaminah (Siang)')
ON CONFLICT DO NOTHING;

-- 6. KO-KURIKULER
INSERT INTO kmi_kokur_jenis (nama, nama_arab, deskripsi, frekuensi, waktu_pelaksanaan, is_wajib, is_dinilai, urutan) VALUES
('Muhadharah Akbar', 'المحاضرة العامة', 'Latihan Pidato 3 Bahasa mingguan', 'Kamis Malam', '20:00 - 22:00', true, true, 1),
('Muwajjah Malam', 'الموجه لیلا', 'Belajar mandiri terbimbing asrama', 'Setiap Malam', '20:00 - 22:00', true, false, 2),
('Pramuka', 'الكشافة', 'Pendidikan kepanduan wajib santri', 'Kamis Siang', '14:00 - 15:30', true, true, 3),
('Muhadatsah Pagi', 'المحادثة الصباحية', 'Percakapan bahasa aktif (Arab/Inggris)', 'Selasa & Jumat', '05:30 - 06:15', true, false, 4)
ON CONFLICT DO NOTHING;

-- 7. DUMMY GURU (TEACHERS)
INSERT INTO users_user (username, password, first_name, last_name, email, role, phone, is_superuser, is_staff, is_active, created_at, updated_at, date_joined) VALUES
('ustadz.ahmad', 'password123', 'Ahmad', 'Muzakki', 'ahmad@gontor.ac.id', 'guru', '081234567801', false, true, true, now(), now(), now()),
('ustadz.budi', 'password123', 'Budi', 'Santoso', 'budi@gontor.ac.id', 'guru', '081234567802', false, true, true, now(), now(), now()),
('ustadz.cecep', 'password123', 'Cecep', 'Gorbachev', 'cecep@gontor.ac.id', 'guru', '081234567803', false, true, true, now(), now(), now()),
('ustadz.daniel', 'password123', 'Daniel', 'Ikhwan', 'daniel@gontor.ac.id', 'guru', '081234567804', false, true, true, now(), now(), now())
ON CONFLICT (username) DO NOTHING;

-- 8. KELAS
INSERT INTO kmi_kelas (nama, jenjang_id, tahun_ajaran_id, wali_kelas_id, jenis_kelamin, kapasitas, ruang_kelas)
SELECT '1-B', (SELECT id FROM kmi_jenjang WHERE kode='KMI-1' LIMIT 1), (SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1), (SELECT id FROM users_user WHERE username='ustadz.ahmad' LIMIT 1), 'putra', 35, 'Gedung Saudi Lt.1'
WHERE NOT EXISTS (SELECT 1 FROM kmi_kelas WHERE nama='1-B' AND tahun_ajaran_id=(SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1));

INSERT INTO kmi_kelas (nama, jenjang_id, tahun_ajaran_id, wali_kelas_id, jenis_kelamin, kapasitas, ruang_kelas)
SELECT '1-C', (SELECT id FROM kmi_jenjang WHERE kode='KMI-1' LIMIT 1), (SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1), (SELECT id FROM users_user WHERE username='ustadz.budi' LIMIT 1), 'putra', 35, 'Gedung Saudi Lt.2'
WHERE NOT EXISTS (SELECT 1 FROM kmi_kelas WHERE nama='1-C' AND tahun_ajaran_id=(SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1));

-- 9. ANGGOTA KELAS (Ambil santri existing dari admissions_santri)
INSERT INTO kmi_anggota_kelas (kelas_id, santri_id, nomor_urut, status, tanggal_masuk, created_at)
SELECT 
  (SELECT id FROM kmi_kelas WHERE nama='1-B' AND tahun_ajaran_id=(SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1) LIMIT 1), 
  id, 
  row_number() OVER (ORDER BY id), 
  'aktif', 
  '2025-07-14', 
  now()
FROM admissions_santri
WHERE NOT EXISTS (SELECT 1 FROM kmi_anggota_kelas WHERE santri_id = admissions_santri.id)
LIMIT 15;

INSERT INTO kmi_anggota_kelas (kelas_id, santri_id, nomor_urut, status, tanggal_masuk, created_at)
SELECT 
  (SELECT id FROM kmi_kelas WHERE nama='1-C' AND tahun_ajaran_id=(SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1) LIMIT 1), 
  id, 
  row_number() OVER (ORDER BY id), 
  'aktif', 
  '2025-07-14', 
  now()
FROM admissions_santri
WHERE NOT EXISTS (SELECT 1 FROM kmi_anggota_kelas WHERE santri_id = admissions_santri.id)
LIMIT 15;

-- 10. GURU MAPEL (PENUGASAN)
INSERT INTO kmi_guru_mapel (guru_id, mapel_id, kelas_id, semester_id, jam_per_minggu)
SELECT 
  (SELECT id FROM users_user WHERE username='ustadz.ahmad' LIMIT 1),
  (SELECT id FROM kmi_mapel WHERE kode='MTH' LIMIT 1),
  (SELECT id FROM kmi_kelas WHERE nama='1-B' AND tahun_ajaran_id=(SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1) LIMIT 1),
  (SELECT id FROM kmi_semester WHERE semester='genap' AND tahun_ajaran_id=(SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1) LIMIT 1),
  4
WHERE NOT EXISTS (SELECT 1 FROM kmi_guru_mapel WHERE guru_id=(SELECT id FROM users_user WHERE username='ustadz.ahmad' LIMIT 1) AND mapel_id=(SELECT id FROM kmi_mapel WHERE kode='MTH' LIMIT 1) AND kelas_id=(SELECT id FROM kmi_kelas WHERE nama='1-B' AND tahun_ajaran_id=(SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1) LIMIT 1));

INSERT INTO kmi_guru_mapel (guru_id, mapel_id, kelas_id, semester_id, jam_per_minggu)
SELECT 
  (SELECT id FROM users_user WHERE username='ustadz.budi' LIMIT 1),
  (SELECT id FROM kmi_mapel WHERE kode='FQH' LIMIT 1),
  (SELECT id FROM kmi_kelas WHERE nama='1-B' AND tahun_ajaran_id=(SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1) LIMIT 1),
  (SELECT id FROM kmi_semester WHERE semester='genap' AND tahun_ajaran_id=(SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1) LIMIT 1),
  2
WHERE NOT EXISTS (SELECT 1 FROM kmi_guru_mapel WHERE guru_id=(SELECT id FROM users_user WHERE username='ustadz.budi' LIMIT 1) AND mapel_id=(SELECT id FROM kmi_mapel WHERE kode='FQH' LIMIT 1) AND kelas_id=(SELECT id FROM kmi_kelas WHERE nama='1-B' AND tahun_ajaran_id=(SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1) LIMIT 1));

-- 11. JADWAL PELAJARAN
INSERT INTO kmi_jadwal (kelas_id, mapel_id, guru_id, semester_id, hari, jam_ke, jam_mulai, jam_selesai)
SELECT 
  (SELECT id FROM kmi_kelas WHERE nama='1-B' AND tahun_ajaran_id=(SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1) LIMIT 1),
  (SELECT id FROM kmi_mapel WHERE kode='MTH' LIMIT 1),
  (SELECT id FROM users_user WHERE username='ustadz.ahmad' LIMIT 1),
  (SELECT id FROM kmi_semester WHERE semester='genap' AND tahun_ajaran_id=(SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1) LIMIT 1),
  'Senin', 1, '07:00', '07:45'
WHERE NOT EXISTS (SELECT 1 FROM kmi_jadwal WHERE hari='Senin' AND jam_ke=1 AND kelas_id=(SELECT id FROM kmi_kelas WHERE nama='1-B' AND tahun_ajaran_id=(SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1) LIMIT 1));

INSERT INTO kmi_jadwal (kelas_id, mapel_id, guru_id, semester_id, hari, jam_ke, jam_mulai, jam_selesai)
SELECT 
  (SELECT id FROM kmi_kelas WHERE nama='1-B' AND tahun_ajaran_id=(SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1) LIMIT 1),
  (SELECT id FROM kmi_mapel WHERE kode='FQH' LIMIT 1),
  (SELECT id FROM users_user WHERE username='ustadz.budi' LIMIT 1),
  (SELECT id FROM kmi_semester WHERE semester='genap' AND tahun_ajaran_id=(SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1) LIMIT 1),
  'Senin', 2, '07:45', '08:30'
WHERE NOT EXISTS (SELECT 1 FROM kmi_jadwal WHERE hari='Senin' AND jam_ke=2 AND kelas_id=(SELECT id FROM kmi_kelas WHERE nama='1-B' AND tahun_ajaran_id=(SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1) LIMIT 1));

-- 12. KALENDER AKADEMIK
INSERT INTO kmi_kalender_akademik (tahun_ajaran_id, judul, tanggal_mulai, tipe, warna) VALUES
((SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1), 'Masa Aktif KBM Genap', '2026-01-05', 'penting', '#3B82F6'),
((SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1), 'Ujian Tengah Semester', '2026-03-10', 'ujian', '#EF4444'),
((SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1), 'Libur Ramadhan', '2026-03-20', 'libur', '#10B981'),
((SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1), 'Ujian Lisan', '2026-05-15', 'ujian', '#F59E0B'),
((SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1), 'Ujian Tulis (Tahriri)', '2026-05-25', 'ujian', '#EF4444'),
((SELECT id FROM kmi_tahun_ajaran WHERE nama='2025/2026' LIMIT 1), 'Pembagian Rapor & Perpulangan', '2026-06-15', 'penting', '#8B5CF6')
ON CONFLICT DO NOTHING;

-- 13. ABSENSI & NILAI (DIJALANKAN MELALUI NODE SCRIPT JIKA DIPERLUKAN KARENA BUTUH DO BLOCK)
