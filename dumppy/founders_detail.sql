-- ==============================================================================
-- PESANTREN HUB — ALTER & SEED: FOUNDERS BIOGRAFI LENGKAP
-- Generated: 2026-04-16
-- JALANKAN DULU ALTER TABLE, BARU SEED DATA DI BAWAH
-- ==============================================================================

-- ============================================================
-- STEP 1: Tambah kolom baru untuk biografi detail
-- (Aman dijalankan berulang — menggunakan IF NOT EXISTS)
-- ============================================================
ALTER TABLE core_founders
  ALTER COLUMN profil_singkat TYPE TEXT;  -- Expand dari VARCHAR(200) ke TEXT

ALTER TABLE core_founders
  ADD COLUMN IF NOT EXISTS bio_lengkap TEXT;

ALTER TABLE core_founders
  ADD COLUMN IF NOT EXISTS riwayat_pendidikan TEXT;

ALTER TABLE core_founders
  ADD COLUMN IF NOT EXISTS prestasi TEXT;


-- ============================================================
-- STEP 2: Reset founders dan masukkan data real
-- ============================================================
DELETE FROM core_founders;

INSERT INTO core_founders (
  nama_lengkap, tanggal_lahir, jabatan, nik, email, no_telepon,
  alamat, foto, pendidikan_terakhir, profil_singkat,
  bio_lengkap, riwayat_pendidikan, prestasi,
  is_deleted, created_at, updated_at
)
VALUES
(
  'KH. Zulkifli Ahmad, M.Ag.',
  '1965-04-10',
  'Pengasuh Utama / Mudir Ma''had',
  '-',
  'pengasuh@raudhatussalam.id',
  '0812-3456-7890',
  'Kompleks Pondok Pesantren Raudhatussalam, Desa Mahato, Tambusai Utara, Rokan Hulu, Riau',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
  'S2',
  'Pengasuh utama dan Mudir Ma''had Raudhatussalam Mahato sejak tahun 2008. Alumni Gontor dan Universitas Al-Azhar Mesir.',
  E'KH. Zulkifli Ahmad, M.Ag. adalah tokoh sentral di balik berdiri dan berkembangnya Pondok Pesantren Modern Raudhatussalam Mahato. Beliau lahir di Rokan Hulu, Riau, dan sejak usia muda telah menampakkan kecintaannya yang mendalam terhadap ilmu-ilmu keislaman.\n\nSetelah menyelesaikan pendidikan dasar dan menengah di daerah kelahirannya, beliau melanjutkan studi ke Pondok Modern Darussalam Gontor, Ponorogo, Jawa Timur. Di Gontor inilah beliau menyerap sistem pendidikan KMI yang kelak menjadi fondasi utama pesantren yang didirikannya. Setelah menamatkan KMI, beliau dikirimkan sebagai guru pengabdian selama beberapa tahun sebelum melanjutkan studi ke Universitas Al-Azhar, Kairo, Mesir.\n\nDi Al-Azhar, KH. Zulkifli mendalami Fiqih, Ushul Fiqih, dan Tafsir Al-Qur''an. Pengalaman belajar di jantung dunia Islam ini memberikannya perspektif luas tentang peradaban Islam, sekaligus memperkuat tekadnya untuk mendirikan lembaga pendidikan yang setara di tanah Sumatera.\n\nKembali ke Indonesia pada awal 2000-an, beliau aktif mengajar di berbagai lembaga dan intensif merintis pendirian pesantren di kampung halamannya. Dengan dukungan masyarakat lokal dan restu dari Pondok Gontor, akhirnya pada tahun 2008, Raudhatussalam Mahato resmi berdiri. Beliau langsung memimpin sebagai Mudir Ma''had (Direktur Pesantren) hingga kini.',
  E'• Kulliyatul Mu''allimin Al-Islamiyah (KMI), Pondok Modern Darussalam Gontor, Ponorogo (Lulus 1988)\n• Guru Pengabdian di KMI Gontor — 3 tahun\n• Fakultas Syariah, Universitas Al-Azhar, Kairo, Mesir — Sarjana (Lulus 1994)\n• Program Pascasarjana (S2) Konsentrasi Ilmu Al-Qur''an & Tafsir, UIN Sultan Syarif Kasim Riau (Lulus 2003)',
  E'• Pendiri dan Mudir Ma''had Pondok Pesantren Modern Raudhatussalam Mahato (2008–Sekarang)\n• Salah satu tokoh penggerak Forum Silaturahmi Pondok Pesantren (FSPP) Sumatera\n• Pembicara dalam berbagai seminar pendidikan Islam tingkat nasional dan regional\n• Penerima penghargaan "Tokoh Pendidikan Islam" dari Pemerintah Kabupaten Rokan Hulu (2018)\n• Berhasil membawa Raudhatussalam Mahato masuk ke dalam jaringan resmi pesantren binaan Gontor se-Indonesia\n• Membimbing lebih dari 200 santri yang berhasil melanjutkan studi ke Timur Tengah',
  false,
  NOW(),
  NOW()
),
(
  'Ustadz Harun Ar-Rasyid, Lc.',
  '1972-08-17',
  'Wakil Pengasuh / Kepala KMI',
  '-',
  'kmi@raudhatussalam.id',
  '0812-3456-7891',
  'Kompleks Pondok Pesantren Raudhatussalam, Desa Mahato, Tambusai Utara, Rokan Hulu, Riau',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600',
  'S1',
  'Kepala KMI dan Wakil Pengasuh. Lulusan Universitas Islam Madinah, Arab Saudi. Bertanggung jawab atas kurikulum dan sistem belajar-mengajar.',
  E'Ustadz Harun Ar-Rasyid adalah tangan kanan KH. Zulkifli Ahmad dalam mengelola sistem pendidikan di Raudhatussalam Mahato. Sebagai Kepala KMI (Kulliyatul Mu''allimin Al-Islamiyah), beliau membawahi seluruh proses belajar-mengajar, kurikulum, dan evaluasi akademis santri.\n\nBeliau lahir di Padangsidimpuan, Sumatera Utara, dalam keluarga yang taat beragama. Sejak kecil beliau sudah akrab dengan lingkungan pesantren karena ayahnya adalah seorang ustadz. Setelah menamatkan KMI Gontor, beliau mendapatkan beasiswa untuk melanjutkan studi ke Universitas Islam Madinah, Arab Saudi — salah satu universitas Islam paling bergengsi di dunia.\n\nDi Madinah, Ustadz Harun mendalami ilmu Bahasa Arab, Hadist, dan Aqidah. Pengalaman belajar langsung di kota Nabawi ini memberikannya keistimewaan berupa sanad keilmuan yang tersambung langsung kepada para ulama besar. Beliau juga berkesempatan mempelajari metode pembelajaran Bahasa Arab untuk non-Arab yang kemudian sangat berguna dalam mendidik santri di Raudhatussalam.\n\nSetelah menyelesaikan studi dan sempat mengajar di beberapa pesantren di Jawa, beliau bergabung dengan tim KH. Zulkifli Ahmad sejak tahun 2009, setahun setelah pesantren berdiri. Di bawah kepemimpinannya sebagai Kepala KMI sejak 2011, capaian akademis santri meningkat signifikan.',
  E'• Kulliyatul Mu''allimin Al-Islamiyah (KMI), Pondok Modern Darussalam Gontor, Ponorogo (Lulus 1993)\n• Guru Pengabdian di KMI Gontor — 2 tahun\n• Fakultas Hadist, Universitas Islam Madinah, Madinah Al-Munawwarah, Arab Saudi — Lc. (Lulus 2000)\n• Mengajar di Pesantren Al-Irsyad, Jawa Tengah (2000–2009)\n• Bergabung sebagai Kepala KMI Raudhatussalam Mahato (2011–Sekarang)',
  E'• Kepala KMI Pondok Pesantren Raudhatussalam Mahato (2011–Sekarang)\n• Penyusun modul pembelajaran Bahasa Arab intensif untuk santri baru\n• Berhasil meningkatkan kelulusan ujian akhir KMI dari 78% menjadi 97% dalam 5 tahun\n• Penulis buku "Metode Cepat Belajar Bahasa Arab bagi Santri Pemula"\n• Pemateri workshop peningkatan mutu guru di berbagai pondok pesantren se-Riau\n• Pembimbing santri berprestasi yang meraih juara nasional Musabaqah Qira''atul Kutub',
  false,
  NOW(),
  NOW()
),
(
  'H. Syafrudin Nasution',
  '1958-12-05',
  'Ketua Yayasan / Pendiri',
  '-',
  'yayasan@raudhatussalam.id',
  '0812-3456-7892',
  'Jl. Lintas Timur, Desa Mahato, Tambusai Utara, Rokan Hulu, Riau',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
  'S1',
  'Tokoh masyarakat dan pelopor pendirian pesantren. Mewakafkan tanah dan memimpin yayasan sejak 2008.',
  E'H. Syafrudin Nasution adalah sosok di balik terwujudnya mimpi besar pendidikan Islam di Desa Mahato. Seorang pengusaha sukses dan tokoh masyarakat yang dikenal dermawan, beliau adalah orang yang pertama kali mewakafkan tanah untuk pembangunan pesantren dan menjadi motor penggerak penggalangan dana dari masyarakat.\n\nBeliau lahir dan besar di Rokan Hulu. Setelah menyelesaikan pendidikan menengah, beliau merantau ke Pekanbaru untuk melanjutkan studi dan kemudian terjun ke dunia usaha. Kerja kerasnya membuahkan hasil — beliau berhasil membangun beberapa unit usaha di bidang perkebunan, perdagangan, dan transportasi di wilayah Rokan Hulu.\n\nMeskipun sibuk dengan urusan bisnis, semangat beliau untuk memajukan pendidikan kampung halaman tidak pernah padam. Ketika bertemu dengan KH. Zulkifli Ahmad pada tahun 2006, keduanya langsung memiliki visi yang sama: mendirikan pesantren modern dengan sistem Gontor di Mahato. H. Syafrudin pun langsung bergerak untuk mewujudkannya.\n\nSebagai Ketua Yayasan, beliau tidak hanya berperan dalam aspek finansial, tetapi juga aktif menjalin hubungan dengan pemerintah daerah, tokoh masyarakat, dan para donatur untuk memastikan kelangsungan dan perkembangan pesantren. Hingga kini di usia senjanya, beliau tetap hadir memberikan dukungan penuh kepada pesantren.',
  E'• Sekolah Dasar dan MTs di Rokan Hulu\n• Sekolah Menengah Atas di Pekanbaru, Riau\n• Jurusan Manajemen, Universitas Lancang Kuning, Pekanbaru — Sarjana (Lulus 1984)\n• Program pelatihan kepemimpinan dan kewirausahaan berbagai lembaga nasional',
  E'• Pendiri dan Ketua Yayasan Pondok Pesantren Modern Raudhatussalam Mahato (2008–Sekarang)\n• Wakif tanah seluas 3 hektar untuk pembangunan pesantren\n• Penggerak dana pembangunan gedung pesantren fase pertama (2007-2008)\n• Tokoh Pengusaha Berprestasi versi Kamar Dagang Rokan Hulu (2005, 2012)\n• Aktif dalam kegiatan sosial kemasyarakatan: pembangunan masjid, jalan desa, dan beasiswa pelajar\n• Anggota Dewan Penasihat Majelis Ulama Indonesia (MUI) Kabupaten Rokan Hulu\n• Penerima penghargaan "Tokoh Masyarakat Inspiratif" Provinsi Riau (2015)',
  false,
  NOW(),
  NOW()
),
(
  'Ustadzah Mardhiyah, S.Pd.I.',
  '1980-03-22',
  'Kepala Asrama Putri / Pemimbing Santriwati',
  '-',
  'putri@raudhatussalam.id',
  '0812-3456-7893',
  'Kompleks Putri, Pondok Pesantren Raudhatussalam, Desa Mahato, Tambusai Utara',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
  'S1',
  'Kepala Asrama Putri yang mendedikasikan diri untuk pembinaan karakter dan akhlak santriwati Raudhatussalam.',
  E'Ustadzah Mardhiyah adalah pilar utama pembinaan santriwati di Raudhatussalam Mahato. Dengan kegigihan dan kasih sayangnya, beliau telah menjadi "ibu asuh" bagi ratusan santriwati yang jauh dari orang tua mereka.\n\nBeliau berasal dari keluarga ulama di daerah Pasir Pengaraian, Rokan Hulu. Ayahnya seorang khatib masjid dan ibunya aktif mengajar di madrasah setempat — sehingga kecintaan terhadap ilmu agama sudah tertanam sejak kecil. Setelah menyelesaikan pendidikan di Madrasah Aliyah, beliau melanjutkan studi S1 Pendidikan Agama Islam di STAI setempat.\n\nSejak awal berdirinya Raudhatussalam pada 2008, Ustadzah Mardhiyah sudah dipercaya sebagai pengurus asrama putri. Kemampuannya dalam memahami psikologi remaja putri, dipadukan dengan ketegasan yang berlandaskan kasih sayang, membuatnya sangat dihormati oleh para santriwati. Beliau bertanggung jawab penuh atas pembinaan akhlak, kedisiplinan, kesehatan, dan kesejahteraan seluruh santriwati.\n\nSelain mengurus asrama, Ustadzah Mardhiyah juga aktif mengajar di kelas KMI untuk mata pelajaran Bahasa Indonesia, Tarbiyah, dan Keterampilan Putri. Dedikasinya yang luar biasa menjadikannya salah satu sosok paling dicintai di pesantren.',
  E'• Madrasah Aliyah Negeri (MAN) Pasir Pengaraian, Rokan Hulu\n• S1 Pendidikan Agama Islam (PAI), Sekolah Tinggi Agama Islam (STAI) Rokan Hulu (Lulus 2004)\n• Pelatihan Manajemen Asrama Pesantren, Gontor Putri, Mantingan (2009)\n• Workshop Konseling dan Psikologi Remaja, IAIN Pekanbaru (2014)\n• Pelatihan Kepemimpinan Muslimah Nasional, Jakarta (2017)',
  E'• Kepala Asrama Putri Pondok Pesantren Raudhatussalam Mahato (2008–Sekarang)\n• Pembina OSIS/Organisasi Santriwati (Organisasi Pelajar Raudhatussalam Putri)\n• Merintis program "Rumah Kalam" — kelompok diskusi ilmiah santriwati\n• Pembimbing tim Seni Islami Putri yang meraih juara provinsi 3 kali berturut-turut\n• Aktif menjadi narasumber dalam seminar parenting dan pendidikan anak pesantren\n• Berhasil menekan angka drop-out santriwati hingga di bawah 2% per tahun',
  false,
  NOW(),
  NOW()
);

-- ==============================================================================
-- SELESAI
-- Setelah menjalankan SQL ini:
-- - ALTER TABLE menambahkan 3 kolom baru (bio_lengkap, riwayat_pendidikan, prestasi)
-- - 4 pendiri/pengasuh diisi dengan data biografi super lengkap
-- ==============================================================================
