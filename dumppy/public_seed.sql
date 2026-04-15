-- SEED DATA for Public Content (Fasilitas, Ekskul, Galeri, Jadwal)

-- FASILITAS (20 Records)
INSERT INTO core_fasilitas (nama, icon, gambar, "order", created_at) VALUES 
('Masjid Jami', 'Church', 'https://images.unsplash.com/photo-1542668595-fa9394e5b686?q=80&w=2000', 1, NOW()),
('Asrama Putra', 'Bed', 'https://images.unsplash.com/photo-1555854817-5b2260d50c47?q=80&w=2000', 2, NOW()),
('Asrama Putri', 'Home', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2000', 3, NOW()),
('Ruang Kelas Modern', 'PencilLine', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2000', 4, NOW()),
('Perpustakaan Digital', 'Library', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000', 5, NOW()),
('Laboratorium Komputer', 'Monitor', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2000', 6, NOW()),
('Laboratorium Sains', 'Beaker', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2000', 7, NOW()),
('Lapangan Basket', 'Trophy', 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2000', 8, NOW()),
('Lapangan Sepak Bola', 'Flame', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000', 9, NOW()),
('Aula Serbaguna', 'Users', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2000', 10, NOW()),
('Dapur Higienis', 'Utensils', 'https://images.unsplash.com/photo-1556910103-1c02744aae4d?q=80&w=2000', 11, NOW()),
('Kantin Sehat', 'Coffee', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000', 12, NOW()),
('Poliklinik Pesantren', 'Stethoscope', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000', 13, NOW()),
('Koperasi Santri', 'ShoppingBag', 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=2000', 14, NOW()),
('Gedung Perkantoran', 'Briefcase', 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000', 15, NOW()),
('Guest House', 'Building2', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000', 16, NOW()),
('Area Parkir Luas', 'MapPin', 'https://images.unsplash.com/photo-1470224114660-3f6686c562eb?q=80&w=2000', 17, NOW()),
('Taman Relaksasi', 'Palmtree', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=2000', 18, NOW()),
('Workshop Keterampilan', 'Settings', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000', 19, NOW()),
('Media Center', 'Radio', 'https://images.unsplash.com/photo-1478737270239-2f02b07bc290?q=80&w=2000', 20, NOW());

-- EKSTRAKURIKULER (20 Records)
INSERT INTO core_ekstrakurikuler (nama, icon, gambar, "order", created_at) VALUES 
('Pramuka', 'Flag', 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?q=80&w=2000', 1, NOW()),
('Pencak Silat', 'Target', 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2000', 2, NOW()),
('Panahan', 'ArrowUp', 'https://images.unsplash.com/photo-1511376339137-73b755ef6643?q=80&w=2000', 3, NOW()),
('Kaligrafi Kontemporer', 'PenTool', 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=2000', 4, NOW()),
('Hadrah & Rebana', 'Music', 'https://images.unsplash.com/photo-1514320297442-711c2eed467b?q=80&w=2000', 5, NOW()),
('Tahfizh Al-Quran', 'BookOpen', 'https://images.unsplash.com/photo-1609599006353-e629aaab31ce?q=80&w=2000', 6, NOW()),
('Karya Ilmiah Remaja', 'Lightbulb', 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=2000', 7, NOW()),
('English Club', 'Globe', 'https://images.unsplash.com/photo-1543167664-400ce94460a1?q=80&w=2000', 8, NOW()),
('Arabic Club', 'Languages', 'https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?q=80&w=2000', 9, NOW()),
('Robotik', 'Cpu', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2000', 10, NOW()),
('Broadcasting', 'Mic', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2000', 11, NOW()),
('Fotografi', 'Camera', 'https://images.unsplash.com/photo-1452784444945-3f422708fe5e?q=80&w=2000', 12, NOW()),
('Seni Desain Grafis', 'Palette', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000', 13, NOW()),
('Basket', 'Dribbble', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2000', 14, NOW()),
('Futsal', 'Activity', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000', 15, NOW()),
('Badminton', 'Wind', 'https://images.unsplash.com/photo-1626225453262-216b3ca3e542?q=80&w=2000', 16, NOW()),
('Tata Boga', 'Soup', 'https://images.unsplash.com/photo-1556910103-1c02744aae4d?q=80&w=2000', 17, NOW()),
('Menjahit', 'Scissors', 'https://images.unsplash.com/photo-1528570291687-3403a539da66?q=80&w=2000', 18, NOW()),
('Pecinta Alam', 'Mountain', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000', 19, NOW()),
('Jurnalistik Santri', 'FileText', 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2000', 20, NOW());

-- GAMBAR UNTUK EKSKUL (Diberikan fallback jika gambar nulll agar tidak error constraint)
INSERT INTO core_ekstrakurikulerimage (gambar, alt_text, "order", created_at, ekstrakurikuler_id)
SELECT COALESCE(gambar, 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?q=80&w=1000'), nama, 1, NOW(), id FROM core_ekstrakurikuler;

-- DOKUMENTASI/GALERI (20 Records)
INSERT INTO core_dokumentasi (judul, deskripsi, kategori, lokasi, "order", is_published, created_at, updated_at) VALUES 
('Wisuda Tahfizh V', 'Moment bahagia santriwati yang menyelesaikan hafalan 30 juz al-quran.', 'Akademik', 'Aula Pesantren', 1, true, NOW(), NOW()),
('Lari Pagi Bersama', 'Kegiatan menjaga kesehatan jasmani santri setiap hari jumat.', 'Olahraga', 'Area Sekitar Pesantren', 2, true, NOW(), NOW()),
('Lomba Pidato 3 Bahasa', 'Mengasah kemampuan retorika dalam bahasa Arab, Inggris, dan Indonesia.', 'Lomba', 'Gedung Kesenian', 3, true, NOW(), NOW()),
('Bakti Sosial Ramadhan', 'Santri membagikan sembako kepada masyarakat sekitar pesantren.', 'Sosial', 'Desa Mahato', 4, true, NOW(), NOW()),
('Kajian Umum Ahad Pagi', 'Pencerahan rohani bagi santri dan masyarakat sekitar mahato.', 'Keagamaan', 'Masjid Jami', 5, true, NOW(), NOW()),
('Perkemahan Sabtu Minggu', 'Membangun karakter disiplin melalui kegiatan kepramukaan persami.', 'Pramuka', 'Hutan Lindung', 6, true, NOW(), NOW()),
('Ujian Akhir Semester', 'Keseriusan santri menguji ilmu yang didapat selama satu semester.', 'Akademik', 'Ruang Kelas', 7, true, NOW(), NOW()),
('Latihan Silat Tapak Suci', 'Pelestarian budaya silat dan pertahanan diri bagi santri.', 'Olahraga', 'Lapangan Tengah', 8, true, NOW(), NOW()),
('Pentas Seni Tahunan', 'Malam pagelaran seni santri Raudhatussalam Mahato.', 'Seni', 'Panggung Terbuka', 9, true, NOW(), NOW()),
('Kunjungan Edukasi Museum', 'Mempelajari sejarah perjuangan bangsa di museum daerah.', 'Edukasi', 'Museum Pekanbaru', 10, true, NOW(), NOW()),
('Pelatihan Wirausaha Lele', 'Pemberdayaan santri dalam bidang perikanan darat.', 'Ekonomi', 'Kolam Pesantren', 11, true, NOW(), NOW()),
('Lomba Kaligrafi Nasional', 'Partisipasi santri dalam ajang kaligrafi tingkat nasional.', 'Lomba', 'Jakarta', 12, true, NOW(), NOW()),
('Khutbah Jumat Santri', 'Latihan menjadi khatib jumat bagi santri kelas akhir.', 'Keagamaan', 'Masjid Cabang', 13, true, NOW(), NOW()),
('Cerdas Cermat Agama', 'Kompetisi pengetahuan agama antar asrama.', 'Lomba', 'Perpustakaan', 14, true, NOW(), NOW()),
('Penyembelihan Hewan Qurban', 'Edukasi tata cara penyembelihan sesuai syariat islam.', 'Keagamaan', 'Area Penyembelihan', 15, true, NOW(), NOW()),
('Workshop Desain Grafis', 'Membekali santri dengan kemampuan teknologi informasi.', 'Edukasi', 'Lab Komputer', 16, true, NOW(), NOW()),
('Lomba Masak Antar Kamar', 'Menumbuhkan kekompakan dan kemandirian santriwati.', 'Social', 'Dapur Utama', 17, true, NOW(), NOW()),
('Pembekalan KKN Santri', 'Persiapan pengabdian masyarakat bagi santri pengabdian.', 'Edukasi', 'Aula', 18, true, NOW(), NOW()),
('Ziarah Makam Wali', 'Mengenang jasa para penyebar islam di tanah air.', 'Keagamaan', 'Sumatera Barat', 19, true, NOW(), NOW()),
('Upacara Hari Santri', 'Memperingati hari santri nasional dengan penuh khidmat.', 'Nasional', 'Lapangan Utama', 20, true, NOW(), NOW());

-- GAMBAR UNTUK GALERI/DOKUMENTASI
INSERT INTO core_dokumentasiimage (gambar, alt_text, "order", created_at, dokumentasi_id)
SELECT 
  CASE id % 4
    WHEN 0 THEN 'https://images.unsplash.com/photo-1542668595-fa9394e5b686?q=80&w=2000'
    WHEN 1 THEN 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?q=80&w=2000'
    WHEN 2 THEN 'https://images.unsplash.com/photo-1523050853064-909386801977?q=80&w=2000'
    ELSE 'https://images.unsplash.com/photo-1606761568285-1e0d58224f24?q=80&w=2000'
  END,
  judul, 1, NOW(), id 
FROM core_dokumentasi;

-- JADWAL HARIAN (20 Putra, 20 Putri)
INSERT INTO core_jadwalharian (waktu, judul, deskripsi, kategori, target, "order", created_at) VALUES 
-- PUTRA
('04:00', 'Bangun Pagi & Shalat Tahajud', 'Mempersiapkan diri menghadap Allah di sepertiga malam.', 'ibadah', 'putra', 1, NOW()),
('04:45', 'Shalat Subuh Berjamaah', 'Kewajiban utama memulai hari dengan barakah.', 'ibadah', 'putra', 2, NOW()),
('05:30', 'Kajian Kitab Kuning', 'Pelajaran literatur klasik islam bersama asatidz.', 'akademik', 'putra', 3, NOW()),
('06:30', 'Olahraga & Kebersihan', 'Menjaga kesehatan fisik dan kebersihan lingkungan.', 'istirahat', 'putra', 4, NOW()),
('07:15', 'Sarapan Pagi', 'Suplai energi untuk aktivitas belajar di kelas.', 'istirahat', 'putra', 5, NOW()),
('07:30', 'Apel Pagi & Masuk Kelas', 'Persiapan kedisiplinan belajar sesi pagi.', 'akademik', 'putra', 6, NOW()),
('09:30', 'Istirahat Pertama', 'Relaksasi sejenak di sela pelajaran.', 'istirahat', 'putra', 7, NOW()),
('12:00', 'Shalat Dzuhur & Makan Siang', 'Istirahat siang dan pemenuhan kebutuhan lahir batin.', 'ibadah', 'putra', 8, NOW()),
('13:30', 'Masuk Kelas Sesi Siang', 'Melanjutkan materi pelajaran sekolah.', 'akademik', 'putra', 9, NOW()),
('15:00', 'Shalat Ashar Berjamaah', 'Menjaga waktu shalat di tengah kesibukan.', 'ibadah', 'putra', 10, NOW()),
('15:45', 'Ekstrakurikuler Wajib', 'Kegiatan pengembangan diri dan bakat.', 'ekstrakurikuler', 'putra', 11, NOW()),
('17:00', 'Mandi Pagi / Sore', 'Menjaga kesegaran tubuh.', 'istirahat', 'putra', 12, NOW()),
('18:00', 'Makan Malam', 'Makan malam berjamaah di dapur umum.', 'istirahat', 'putra', 13, NOW()),
('18:30', 'Shalat Maghrib & Tadarus', 'Memperdalam hafalan dan bacaan al-quran.', 'ibadah', 'putra', 14, NOW()),
('19:30', 'Shalat Isya Berjamaah', 'Penghujung waktu shalat wajib harian.', 'ibadah', 'putra', 15, NOW()),
('20:00', 'Belajar Mandiri Terpimpin', 'Mengerjakan tugas dan mengulang pelajaran esok hari.', 'akademik', 'putra', 16, NOW()),
('21:15', 'Absensi Malam', 'Pengecekan kehadiran santri di asrama.', 'istirahat', 'putra', 17, NOW()),
('21:30', 'Istirahat / Tidur Malam', 'Meregenerasi energi untuk hari esok.', 'istirahat', 'putra', 18, NOW()),
('03:45', 'Persiapan Qiyamul Lail', 'Membangunkan santri pelan-pelan.', 'istirahat', 'putra', 19, NOW()),
('16:30', 'Kegiatan Bebas Terpimpin', 'Waktu santai santri di area pesantren.', 'istirahat', 'putra', 20, NOW()),

-- PUTRI
('04:00', 'Bangun Pagi & Shalat Tahajud', 'Tilawah mandiri dan munajat pagi.', 'ibadah', 'putri', 1, NOW()),
('04:45', 'Shalat Subuh Berjamaah', 'Kewajiban utama mengawali hari.', 'ibadah', 'putri', 2, NOW()),
('05:30', 'Muhadatsah (Bahasa)', 'Latihan percakapan bahasa arab/inggris.', 'akademik', 'putri', 3, NOW()),
('06:15', 'Kebersihan Asrama (Ro''an)', 'Membudayakan lingkungan bersih and asri.', 'istirahat', 'putri', 4, NOW()),
('07:00', 'Sarapan Pagi', 'Makan pagi bersama di kantin asrama.', 'istirahat', 'putri', 5, NOW()),
('07:30', 'KBM Sesi Pagi', 'Pembelajaran formal di sekolah.', 'akademik', 'putri', 6, NOW()),
('10:00', 'Shalat Dhuha Berjamaah', 'Membiasakan amalan sunnah di waktu dhuha.', 'ibadah', 'putri', 7, NOW()),
('12:00', 'Shalat Dzuhur & Istirahat', 'Waktu tenang dan shalat berjamaah.', 'ibadah', 'putri', 8, NOW()),
('13:30', 'Sesi Belajar Ketrampilan', 'Menjahit, memasak, atau seni islami.', 'akademik', 'putri', 9, NOW()),
('15:00', 'Shalat Ashar & Kultum', 'Siraman rohani singkat antar santriwati.', 'ibadah', 'putri', 10, NOW()),
('15:45', 'Ekskul Putri (Archery)', 'Melatih fokus melalui olahraga panahan.', 'ekstrakurikuler', 'putri', 11, NOW()),
('17:00', 'Mandi & Cuci Pakaian', 'Kemandirian santriwati dalam kebersihan.', 'istirahat', 'putri', 12, NOW()),
('18:00', 'Makan Malam Putri', 'Suasana kekeluargaan di ruang makan putri.', 'istirahat', 'putri', 13, NOW()),
('18:30', 'Shalat Maghrib & Tahfizh', 'Setoran hafalan al-quran kepada ustadzah.', 'ibadah', 'putri', 14, NOW()),
('19:30', 'Shalat Isya Berjamaah', 'Ketenangan jiwa di akhir waktu.', 'ibadah', 'putri', 15, NOW()),
('20:00', 'Takrar Al-Lughah', 'Mengulang kosa kata bahasa baru.', 'akademik', 'putri', 16, NOW()),
('21:00', 'Persiapan Tidur', 'Bersih-bersih diri sebelum istirahat.', 'istirahat', 'putri', 17, NOW()),
('21:30', 'Istirahat / Tidur', 'Mematikan lampu asrama.', 'istirahat', 'putri', 18, NOW()),
('20:45', 'Evaluasi Harian Pengasuhan', 'Bimbingan dari ustadzah pengasuh asrama.', 'akademik', 'putri', 19, NOW()),
('16:45', 'Taman Bacaan', 'Membaca buku di gazebo taman putri.', 'istirahat', 'putri', 20, NOW());
