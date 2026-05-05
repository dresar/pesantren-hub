-- Seed file for core_dokumentasi and core_dokumentasiimage
DELETE FROM core_dokumentasi CASCADE;
INSERT INTO core_dokumentasi (id, judul, deskripsi, kategori, tanggal_kegiatan, lokasi, is_published, "order", created_at, updated_at) VALUES
(101, 'Kegiatan Masa Ta''aruf Siswa Baru (MATASBA)', 'Rangkaian kegiatan orientasi dan pengenalan lingkungan pondok pesantren bagi para santri baru angkatan 2026. Kegiatan ini diisi dengan seminar motivasi, pengenalan asrama, dan outbond.', 'Pendidikan', '2026-07-15', 'Aula Utama', true, 1, NOW(), NOW()),
(102, 'Peringatan Hari Santri Nasional 2026', 'Upacara bendera peringatan Hari Santri Nasional yang diikuti oleh seluruh santri, ustadz, dan pengurus pesantren. Dilanjutkan dengan pawai obor di malam harinya.', 'Kegiatan Besar', '2026-10-22', 'Lapangan', true, 2, NOW(), NOW()),
(103, 'Ujian Tahfidz Al-Qur''an Semester Ganjil', 'Pelaksanaan ujian lisan hafalan Al-Qur''an bagi seluruh santri program tahfidz. Menguji kelancaran dan tajwid bacaan.', 'Akademik', '2026-12-10', 'Masjid', false, 3, NOW(), NOW()),
(104, 'Lomba Olahraga Antar Asrama (PORSENI)', 'Pekan olahraga dan seni yang mempertandingkan futsal, voli, bulu tangkis, pidato tiga bahasa, dan kaligrafi antar asrama santri.', 'Ekstrakurikuler', '2026-08-20', 'Serbaguna', false, 4, NOW(), NOW()),
(105, 'Kunjungan Studi Banding Pesantren Modern', 'Pondok Pesantren menerima kunjungan dari pengurus pesantren luar daerah untuk studi banding tentang kurikulum dan manajemen.', 'Kunjungan', '2026-09-05', 'Gedung A', false, 5, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET 
    judul = EXCLUDED.judul, 
    deskripsi = EXCLUDED.deskripsi, 
    kategori = EXCLUDED.kategori, 
    tanggal_kegiatan = EXCLUDED.tanggal_kegiatan,
    lokasi = EXCLUDED.lokasi,
    is_published = EXCLUDED.is_published,
    "order" = EXCLUDED."order",
    updated_at = NOW();

SELECT setval('core_dokumentasi_id_seq', 105);

DELETE FROM core_dokumentasiimage WHERE dokumentasi_id IN (101, 102, 103, 104, 105);

INSERT INTO core_dokumentasiimage (dokumentasi_id, gambar, alt_text, "order", created_at) VALUES
(101, 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070', 'Suasana Seminar MATASBA', 1, NOW()),
(101, 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070', 'Kegiatan Outbound Santri', 2, NOW()),
(102, 'https://imanjnf.github.io/assets/images/pesantren.jpg', 'Upacara Hari Santri', 1, NOW()),
(102, 'https://images.unsplash.com/photo-1560961803-057bf9e7c51e?q=80&w=2070', 'Pawai Obor', 2, NOW()),
(103, 'https://images.unsplash.com/photo-1609599006353-e629aaab315a?q=80&w=2070', 'Santri sedang ujian lisan', 1, NOW()),
(104, 'https://images.unsplash.com/photo-1628863615175-1e0bc87ca185?q=80&w=2070', 'Pertandingan Futsal Final', 1, NOW()),
(104, 'https://images.unsplash.com/photo-1516131206008-5b4cf534b070?q=80&w=2070', 'Lomba Kaligrafi', 2, NOW()),
(104, 'https://images.unsplash.com/photo-1507560461415-99731cfa035c?q=80&w=2070', 'Penyerahan Piala', 3, NOW()),
(105, 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070', 'Sesi Presentasi Kurikulum', 1, NOW());
