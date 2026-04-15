DELETE FROM blog_blogpost_tags;
DELETE FROM blog_blogpost WHERE id NOT IN (1);
DELETE FROM blog_category WHERE id != 1;
DELETE FROM blog_tag;

INSERT INTO blog_category (name, slug, "order", created_at) VALUES
('Berita Pesantren', 'berita-pesantren', 1, NOW()),
('Kegiatan Santri', 'kegiatan-santri', 2, NOW()),
('Pendidikan Islam', 'pendidikan-islam', 3, NOW()),
('Pengumuman', 'pengumuman', 4, NOW()),
('Prestasi', 'prestasi', 5, NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_tag (name, slug, "order", created_at) VALUES
('KMI', 'kmi', 1, NOW()),
('Tahfidz', 'tahfidz', 2, NOW()),
('Gontor', 'gontor', 3, NOW()),
('Bahasa Arab', 'bahasa-arab', 4, NOW()),
('Santri', 'santri', 5, NOW()),
('Pendaftaran', 'pendaftaran', 6, NOW()),
('Akreditasi', 'akreditasi', 7, NOW()),
('Prestasi', 'prestasi', 8, NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_blogpost (title, slug, content, excerpt, featured_image, meta_title, meta_description, meta_keywords, views_count, likes_count, shares_count, status, published_at, is_featured, author_id, category_id, created_at, updated_at) VALUES

('Penerimaan Santri Baru 2025/2026 Resmi Dibuka',
'penerimaan-santri-baru-2025-2026',
'Pondok Pesantren Modern Raudhatussalam Mahato dengan bangga mengumumkan pembukaan resmi Penerimaan Santri Baru (PSB) untuk tahun ajaran 2025/2026. Pendaftaran dibuka mulai 1 Mei 2025 hingga 30 Juni 2025.

Gelombang I dibuka 1-31 Mei 2025 dengan kuota 100 santri putra dan 80 santriwati. Gelombang II dibuka 1-30 Juni 2025 untuk mengisi sisa kuota.

Persyaratan pendaftaran meliputi fotokopi ijazah SD/MI, pas foto 3x4 (4 lembar), fotokopi akta kelahiran, fotokopi kartu keluarga, dan surat keterangan sehat dari dokter.

Calon santri akan mengikuti seleksi berupa ujian tertulis (Matematika, Bahasa Indonesia, Bahasa Arab dasar) dan wawancara. Pengumuman hasil seleksi akan disampaikan 2 minggu setelah ujian berlangsung.',
'Pendaftaran Santri Baru 2025/2026 resmi dibuka mulai 1 Mei hingga 30 Juni 2025. Daftar sekarang dan raih pendidikan Islam terbaik di Raudhatussalam Mahato.',
'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200',
'PSB 2025/2026 Raudhatussalam Mahato Dibuka',
'Pendaftaran Santri Baru 2025/2026 Raudhatussalam Mahato resmi dibuka mulai 1 Mei hingga 30 Juni 2025.',
'penerimaan santri baru 2025, psb pesantren riau, daftar pesantren rokan hulu',
847, 124, 43, 'published', NOW() - INTERVAL '3 days', true, 213, 
(SELECT id FROM blog_category WHERE slug='pengumuman' LIMIT 1),
NOW() - INTERVAL '3 days', NOW()),

('Tim Tahfidz Raudhatussalam Raih Juara 1 Musabaqah Tingkat Provinsi Riau',
'tim-tahfidz-raih-juara-1-provinsi-riau',
'Alhamdulillah, tim Tahfidz Al-Quran Pondok Pesantren Modern Raudhatussalam Mahato berhasil meraih Juara Pertama dalam Musabaqah Qiraatil Kutub dan Tahfidz Al-Quran Tingkat Provinsi Riau yang diselenggarakan di Pekanbaru, Sabtu (12/4/2025).

Tiga santri terbaik kami berhasil memukau para juri dengan bacaan yang tartil dan hafalan yang sempurna. Ahmad Firdaus (kelas V KMI) berhasil membawakan hafalan 20 juz dengan sangat meyakinkan, menjadi santri terbaik dalam kategori putra.

Ustadz Harun Ar-Rasyid selaku Kepala KMI menyampaikan rasa syukur dan bangganya. "Ini adalah bukti nyata bahwa sistem pembelajaran tahfidz yang kami terapkan di Raudhatussalam berjalan dengan baik. Semoga ini menjadi motivasi bagi santri-santri lainnya."

Penghargaan ini menambah daftar prestasi gemilang Raudhatussalam Mahato di kancah regional, memperkuat posisinya sebagai salah satu pesantren tahfidz terbaik di Sumatera.',
'Tim Tahfidz Raudhatussalam Mahato meraih Juara 1 Musabaqah Tahfidz Al-Quran Tingkat Provinsi Riau 2025.',
'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=1200',
'Juara 1 Musabaqah Tahfidz Provinsi Riau 2025',
'Tim Tahfidz Raudhatussalam Mahato meraih Juara 1 Musabaqah Tahfidz Tingkat Provinsi Riau 2025.',
'prestasi tahfidz pesantren riau, juara quran raudhatussalam, musabaqah tahfidz riau 2025',
1254, 287, 95, 'published', NOW() - INTERVAL '5 days', true, 214,
(SELECT id FROM blog_category WHERE slug='prestasi' LIMIT 1),
NOW() - INTERVAL '5 days', NOW()),

('Kegiatan Muhadharah Mingguan: Menempa Keberanian Santri di Atas Mimbar',
'muhadharah-mingguan-menempa-keberanian-santri',
'Setiap Kamis malam, seluruh santri Pondok Pesantren Modern Raudhatussalam Mahato berkumpul di Aula Utama untuk mengikuti kegiatan Muhadharah — latihan berpidato dalam tiga bahasa: Arab, Inggris, dan Indonesia.

Muhadharah adalah salah satu program unggulan dalam sistem KMI yang diadopsi dari Pondok Modern Darussalam Gontor. Santri berlatih menyampaikan gagasan secara lisan di hadapan ratusan teman-teman mereka.

Kegiatan ini dibagi menjadi beberapa kelompok. Kelompok dasar terdiri dari santri kelas I dan II yang berlatih dengan teks yang telah disiapkan guru. Kelompok menengah (kelas III-IV) sudah mulai menyusun teks sendiri. Kelompok atas (kelas V-VI) berpidato impromptu tanpa teks.

Santri kelas VI, Zaki Ramadhan, berbagi pengalamannya: "Awalnya sangat gugup. Tapi setelah berlatih bertahun-tahun, sekarang sudah terasa biasa. Muhadharah benar-benar membentuk kepercayaan diri saya."',
'Muhadharah mingguan di Raudhatussalam Mahato: program latihan berpidato tiga bahasa yang membentuk kepercayaan diri santri.',
'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=1200',
'Muhadharah Raudhatussalam: Latihan Pidato 3 Bahasa',
'Program Muhadharah mingguan di Raudhatussalam Mahato melatih santri berpidato dalam bahasa Arab, Inggris, dan Indonesia.',
'muhadharah pesantren, pidato santri tiga bahasa, kegiatan kmi gontor riau',
632, 98, 31, 'published', NOW() - INTERVAL '7 days', false, 219,
(SELECT id FROM blog_category WHERE slug='kegiatan-santri' LIMIT 1),
NOW() - INTERVAL '7 days', NOW()),

('Kunjungan Delegasi Pesantren dari Malaysia ke Raudhatussalam Mahato',
'kunjungan-delegasi-pesantren-malaysia',
'Pondok Pesantren Modern Raudhatussalam Mahato menerima kunjungan resmi dari delegasi Sekolah Menengah Arab Malaysia (SMAM) yang terdiri dari 12 orang termasuk kepala sekolah, wakil kepala kurikulum, dan 8 orang guru.

Kunjungan berlangsung selama dua hari (8-9 April 2025) dan mencakup observasi sistem pembelajaran KMI, pertukaran pengalaman dalam manajemen pesantren, dan dialog kebudayaan antarsantri kedua lembaga.

Kepala SMAM, Ustadz Mohd Hafiz Bin Abdullah, mengungkapkan kekagumannya terhadap sistem pembelajaran di Raudhatussalam. "Sistem KMI yang diimplementasikan di sini sangat komprehensif. Santri tidak hanya belajar ilmu agama, tapi juga bahasa, sains, dan keterampilan hidup."

KH. Zulkifli Ahmad, selaku Mudir Mahad, berharap kunjungan ini dapat menjadi awal dari kerjasama formal antara kedua lembaga, termasuk kemungkinan program pertukaran guru dan santri.',
'Delegasi Sekolah Menengah Arab Malaysia mengunjungi Raudhatussalam Mahato untuk studi banding sistem KMI Gontor.',
'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=1200',
'Kunjungan Delegasi Malaysia ke Raudhatussalam Mahato',
'Delegasi pesantren dari Malaysia berkunjung ke Raudhatussalam Mahato untuk studi banding sistem KMI.',
'kerjasama pesantren internasional, kunjungan malaysia raudhatussalam, studi banding kmi',
445, 67, 22, 'published', NOW() - INTERVAL '10 days', false, 216,
(SELECT id FROM blog_category WHERE slug='berita-pesantren' LIMIT 1),
NOW() - INTERVAL '10 days', NOW()),

('Program Bahasa Arab Intensif: Santri Baru Wajib Fasih Dalam 90 Hari',
'program-bahasa-arab-intensif-90-hari',
'Salah satu keunggulan Pondok Pesantren Modern Raudhatussalam Mahato adalah program Bahasa Arab Intensif yang dirancang khusus untuk santri baru. Dalam 90 hari pertama masa belajar, seluruh santri baru wajib mengikuti program immersive ini.

Program ini terinspirasi dari metode pembelajaran bahasa di Pondok Modern Gontor yang terbukti efektif menghasilkan santri yang mampu berkomunikasi aktif dalam bahasa Arab. Di Raudhatussalam, program ini disempurnakan dengan pendekatan modern.

Setiap hari santri mendapat minimal 4 jam pelajaran bahasa Arab, mulai dari kosakata dasar (mufradat), tata bahasa (nahwu-shorof), hingga percakapan (muhadatsah). Selain di kelas, santri juga diwajibkan berbahasa Arab di lingkungan asrama dengan sistem yang dipantau oleh santri senior.

Hasilnya? Rata-rata santri baru sudah bisa berkomunikasi dasar dalam bahasa Arab setelah 3 bulan. "Tidak ada cara lain selain immersion total," ujar Ustadz Harun Ar-Rasyid, Kepala KMI.',
'Program Bahasa Arab Intensif 90 hari di Raudhatussalam Mahato: santri baru wajib fasih berbahasa Arab dalam waktu singkat.',
'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1200',
'Program Bahasa Arab Intensif 90 Hari Raudhatussalam',
'Program Bahasa Arab Intensif 90 hari Raudhatussalam Mahato: metode immersive untuk penguasaan bahasa Arab santri baru.',
'belajar bahasa arab pesantren, bahasa arab intensif riau, kmi gontor bahasa arab',
789, 156, 52, 'published', NOW() - INTERVAL '12 days', false, 217,
(SELECT id FROM blog_category WHERE slug='pendidikan-islam' LIMIT 1),
NOW() - INTERVAL '12 days', NOW()),

('Peringatan Maulid Nabi 1446H: Ribuan Santri Bersholawat Bersama',
'peringatan-maulid-nabi-1446h',
'Pondok Pesantren Modern Raudhatussalam Mahato menyelenggarakan peringatan Maulid Nabi Muhammad SAW 1446H dengan penuh khidmat dan semarak. Acara berlangsung di lapangan utama pesantren dan dihadiri oleh lebih dari 2.000 santri, guru, wali santri, dan masyarakat sekitar.

Acara dimulai dengan pembacaan ayat suci Al-Quran oleh santri terbaik, dilanjutkan dengan pembacaan sholawat bersama yang dipimpin oleh tim hadroh pesantren. Lantunan sholawat yang merdu bergema dari seluruh penjuru lapangan, menciptakan suasana yang penuh kekhusyukan.

Mudir Mahad, KH. Zulkifli Ahmad, dalam ceramahnya yang berjudul "Meneladani Akhlak Rasulullah di Era Digital" mengajak seluruh santri untuk menjadikan Rasulullah SAW sebagai role model dalam kehidupan sehari-hari, termasuk dalam penggunaan teknologi yang bijak.

Acara ditutup dengan pembagian makanan kepada seluruh peserta dan masyarakat sekitar sebagai bentuk rasa syukur.',
'Peringatan Maulid Nabi 1446H di Raudhatussalam Mahato: ribuan santri dan masyarakat bersholawat bersama.',
'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=1200',
'Maulid Nabi 1446H Raudhatussalam Mahato 2025',
'Peringatan Maulid Nabi 1446H di Raudhatussalam Mahato dihadiri lebih dari 2.000 orang.',
'maulid nabi pesantren riau, peringatan maulid raudhatussalam, sholawat bersama santri mahato',
923, 201, 78, 'published', NOW() - INTERVAL '15 days', false, 221,
(SELECT id FROM blog_category WHERE slug='kegiatan-santri' LIMIT 1),
NOW() - INTERVAL '15 days', NOW()),

('Ujian Akhir KMI 2025: 98% Santri Lulus dengan Predikat Memuaskan',
'ujian-akhir-kmi-2025-98-persen-lulus',
'Hasil Ujian Akhir KMI (UA-KMI) tahun 2025 Pondok Pesantren Modern Raudhatussalam Mahato menunjukkan capaian yang membanggakan. Dari 127 santri kelas VI yang mengikuti ujian, 124 santri (97,6%) dinyatakan lulus dengan berbagai predikat.

Sebanyak 23 santri meraih predikat Mumtaz (Istimewa), 67 santri meraih predikat Jayyid Jiddan (Sangat Baik), dan 34 santri meraih predikat Jayyid (Baik). Hanya 3 santri yang belum berhasil dan akan mengikuti ujian remedial.

Kepala KMI, Ustadz Harun Ar-Rasyid, menegaskan bahwa hasil ini adalah yang terbaik dalam sejarah pesantren. "Kami terus berinovasi dalam metode pengajaran. Hasilnya nyata: kualitas lulusan kami terus meningkat setiap tahunnya."

Para lulusan sudah mulai mendapatkan berbagai tawaran beasiswa untuk melanjutkan studi ke berbagai universitas Islam, termasuk di Timur Tengah seperti Universitas Al-Azhar Mesir, Universitas Islam Madinah, dan Universitas Jordan.',
'Ujian Akhir KMI 2025: 98% santri Raudhatussalam Mahato lulus dengan predikat memuaskan, 23 santri raih Mumtaz.',
'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200',
'Ujian KMI 2025 Raudhatussalam: 98% Lulus',
'Hasil Ujian Akhir KMI 2025 Raudhatussalam Mahato: 98% santri lulus, 23 santri raih predikat Mumtaz.',
'ujian kmi 2025, kelulusan santri raudhatussalam, hasil ujian pesantren gontor riau',
567, 134, 41, 'published', NOW() - INTERVAL '20 days', false, 215,
(SELECT id FROM blog_category WHERE slug='prestasi' LIMIT 1),
NOW() - INTERVAL '20 days', NOW()),

('Fasilitas Baru: Laboratorium Bahasa Dilengkapi 40 Headset Digital',
'laboratorium-bahasa-baru-40-headset-digital',
'Pondok Pesantren Modern Raudhatussalam Mahato terus berbenah dalam meningkatkan fasilitas pembelajaran. Tahun ini, pesantren meresmikan laboratorium bahasa baru yang dilengkapi dengan 40 unit headset digital berkualitas tinggi dan sistem audio terpusat.

Laboratorium bahasa ini akan digunakan untuk pembelajaran listening dan speaking Bahasa Arab dan Bahasa Inggris yang lebih intensif dan terstruktur. Santri dapat berlatih mendengarkan native speaker dan langsung mempraktikkan percakapan.

H. Syafrudin Nasution, Ketua Yayasan, menjelaskan investasi ini merupakan bagian dari program modernisasi fasilitas pesantren yang direncanakan dalam 3 tahun ke depan. Total anggaran yang dialokasikan mencapai Rp 2,5 miliar untuk berbagai peningkatan infrastruktur.

"Kami tidak ingin tertinggal. Santri kami harus siap menghadapi tantangan global dengan kemampuan bahasa yang kuat," tegas H. Syafrudin dalam sambutan peresmian.',
'Laboratorium bahasa baru berteknologi digital diresmikan di Raudhatussalam Mahato untuk meningkatkan kemampuan bahasa santri.',
'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1200',
'Lab Bahasa Digital Baru Raudhatussalam Mahato',
'Laboratorium bahasa baru dengan 40 headset digital diresmikan di Raudhatussalam Mahato.',
'fasilitas pesantren modern, laboratorium bahasa pesantren riau, upgrade fasilitas raudhatussalam',
412, 89, 28, 'published', NOW() - INTERVAL '25 days', false, 222,
(SELECT id FROM blog_category WHERE slug='berita-pesantren' LIMIT 1),
NOW() - INTERVAL '25 days', NOW()),

('Safari Ramadhan: Santri Mengajar di 12 Desa Sekitar Pesantren',
'safari-ramadhan-santri-mengajar-12-desa',
'Selama bulan Ramadhan 1446H, sebanyak 156 santri kelas V dan VI Pondok Pesantren Modern Raudhatussalam Mahato diterjunkan ke 12 desa di Kecamatan Tambusai Utara dan sekitarnya untuk melaksanakan program Safari Ramadhan.

Program tahunan ini merupakan salah satu bentuk pengabdian masyarakat (khidmah ijtima''iyah) yang wajib diikuti santri senior sebagai bagian dari kurikulum KMI yang menekankan pentingnya mengamalkan ilmu di tengah masyarakat.

Selama dua minggu, para santri mengajar mengaji, memimpin sholat tarawih, menjadi imam sholat subuh, mengisi ceramah ba''da subuh dan ba''da maghrib, serta menghidupkan malam-malam Ramadhan dengan kegiatan keagamaan.

Warga Desa Mahato Jaya, Pak Rusli, mengungkapkan rasa syukurnya. "Anak-anak santri ini luar biasa. Pengajian kami jadi lebih ramai dan hidup sejak mereka datang. Semoga tahun depan mereka bisa kembali lagi."',
'156 santri senior Raudhatussalam mengajar di 12 desa sekitar pesantren selama Ramadhan dalam program Safari Ramadhan.',
'https://images.unsplash.com/photo-1590159763121-7c9fd312190d?auto=format&fit=crop&q=80&w=1200',
'Safari Ramadhan Santri Raudhatussalam di 12 Desa',
'Program Safari Ramadhan Raudhatussalam: 156 santri mengajar di 12 desa selama bulan Ramadhan.',
'safari ramadhan pesantren, pengabdian santri masyarakat, ramadhan raudhatussalam mahato',
678, 145, 56, 'published', NOW() - INTERVAL '30 days', false, 218,
(SELECT id FROM blog_category WHERE slug='kegiatan-santri' LIMIT 1),
NOW() - INTERVAL '30 days', NOW()),

('Gebyar Seni Islam 2025: Pertunjukan Budaya yang Memukau Ribuan Penonton',
'gebyar-seni-islam-2025',
'Gebyar Seni Islam 2025 Pondok Pesantren Modern Raudhatussalam Mahato berlangsung meriah selama dua hari penuh (22-23 Maret 2025) di lapangan utama pesantren. Acara ini menghadirkan berbagai pertunjukan seni budaya Islam yang memukau lebih dari 3.000 penonton.

Penampilan terbaik datang dari kolaborasi tim Nasyid putra-putri yang membawakan 12 lagu nasyid kontemporer dan klasik. Lagu-lagu seperti "Ya Hanana", "Tombo Ati", dan beberapa lagu karya santri sendiri berhasil membuat penonton terpukau dan ikut berlantunan bersama.

Selain nasyid, acara juga menampilkan pertunjukan kaligrafi hidup (3 dimensi), drama Arabic, tari Saman kolaborasi 60 santriwati, dan pameran hasil karya seni santri selama setahun terakhir.

Acara ini menjadi wahana ekspresi bakat dan kreativitas santri sekaligus membuktikan bahwa pesantren bukan hanya tempat belajar ilmu agama, tetapi juga pusat pengembangan seni budaya Islam yang kaya dan beragam.',
'Gebyar Seni Islam 2025 Raudhatussalam Mahato: dua hari penuh pertunjukan nasyid, kaligrafi, drama Arab, dan tari Saman.',
'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200',
'Gebyar Seni Islam 2025 Raudhatussalam Mahato',
'Gebyar Seni Islam 2025 Raudhatussalam Mahato: pertunjukan budaya Islam memukau 3.000 penonton.',
'seni islam pesantren, nasyid raudhatussalam, gebyar seni santri riau 2025',
534, 112, 39, 'published', NOW() - INTERVAL '40 days', false, 220,
(SELECT id FROM blog_category WHERE slug='kegiatan-santri' LIMIT 1),
NOW() - INTERVAL '40 days', NOW()),

('Bupati Rokan Hulu Kunjungi Pesantren dan Resmikan Gedung Asrama Baru',
'bupati-rokan-hulu-resmikan-gedung-asrama-baru',
'Bupati Kabupaten Rokan Hulu, H. Sukiman, SH, MH, mengunjungi Pondok Pesantren Modern Raudhatussalam Mahato dan meresmikan gedung asrama putra yang baru selesai dibangun. Peresmian berlangsung pada Selasa, 18 Maret 2025, dihadiri oleh jajaran Forkopimda, tokoh masyarakat, dan seluruh civitas pesantren.

Gedung asrama baru berlantai tiga ini memiliki kapasitas 200 santri putra dengan fasilitas yang jauh lebih baik dari sebelumnya: kamar tidur ber-AC, kamar mandi dalam yang bersih, ruang belajar mandiri setiap lantai, dan ruang komunal yang nyaman.

Dalam sambutannya, Bupati Sukiman menyatakan kebanggaannya terhadap perkembangan pesat Raudhatussalam Mahato. "Pesantren ini adalah aset penting Rokan Hulu. Pemerintah daerah berkomitmen untuk mendukung pengembangannya melalui berbagai program yang telah kami siapkan."

Beliau juga mengumumkan bahwa Pemerintah Kabupaten Rokan Hulu akan mengalokasikan dana bantuan operasional pesantren sebesar Rp 500 juta untuk tahun anggaran 2025.',
'Bupati Rokan Hulu meresmikan gedung asrama baru Raudhatussalam Mahato berkapasitas 200 santri.',
'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=1200',
'Peresmian Asrama Baru Raudhatussalam oleh Bupati Rokan Hulu',
'Bupati Rokan Hulu meresmikan gedung asrama baru Raudhatussalam Mahato berkapasitas 200 santri putra.',
'bupati rokan hulu kunjungi pesantren, asrama baru raudhatussalam, bantuan pesantren pemerintah riau',
389, 78, 25, 'published', NOW() - INTERVAL '45 days', false, 213,
(SELECT id FROM blog_category WHERE slug='berita-pesantren' LIMIT 1),
NOW() - INTERVAL '45 days', NOW()),

('Beasiswa Penuh untuk 20 Santri Berprestasi dari Yayasan Raudhatussalam',
'beasiswa-penuh-20-santri-berprestasi-2025',
'Kabar gembira bagi calon santri dari keluarga kurang mampu. Yayasan Pondok Pesantren Modern Raudhatussalam Mahato membuka program Beasiswa Penuh (Full Scholarship) untuk 20 santri berprestasi pada tahun ajaran 2025/2026.

Beasiswa ini mencakup seluruh biaya pendidikan selama 6 tahun (MTs-MA), biaya asrama, makan 3 kali sehari, seragam, dan perlengkapan belajar. Estimasi nilai beasiswa per santri mencapai Rp 36 juta per tahun.

Persyaratan penerima beasiswa adalah: nilai ujian SD/MI minimal 8,5 rata-rata, hafalan Al-Quran minimal 2 juz, berasal dari keluarga tidak mampu (dibuktikan dengan surat dari kelurahan/desa), dan berusia maksimal 14 tahun saat mendaftar.

Pendaftaran beasiswa dapat dilakukan bersamaan dengan pendaftaran PSB melalui website resmi pesantren atau datang langsung ke kantor panitia PSB di kompleks Raudhatussalam Mahato. Kuota sangat terbatas, mendaftar segera!',
'Yayasan Raudhatussalam Mahato buka beasiswa penuh untuk 20 santri berprestasi dari keluarga tidak mampu tahun 2025.',
'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200',
'Beasiswa Penuh 20 Santri Raudhatussalam 2025',
'Program beasiswa penuh Yayasan Raudhatussalam Mahato untuk 20 santri berprestasi dari keluarga tidak mampu.',
'beasiswa pesantren riau, beasiswa santri raudhatussalam 2025, beasiswa penuh pesantren rokan hulu',
1102, 234, 87, 'published', NOW() - INTERVAL '50 days', true, 214,
(SELECT id FROM blog_category WHERE slug='pengumuman' LIMIT 1),
NOW() - INTERVAL '50 days', NOW()),

('Santri Raudhatussalam Lolos Seleksi Pertukaran Pelajar ke Mesir',
'santri-raudhatussalam-lolos-seleksi-pertukaran-pelajar-mesir',
'Tiga santri terbaik Pondok Pesantren Modern Raudhatussalam Mahato berhasil lolos seleksi ketat program Pertukaran Pelajar Indonesia-Mesir yang diselenggarakan oleh Kementerian Agama RI bekerjasama dengan Universitas Al-Azhar Kairo.

Ketiganya adalah: Muhammad Faqih Ramadhan (kelas VI KMI), Fatimah Az-Zahra (kelas VI KMI putri), dan Ahmad Badr Al-Islam (kelas V KMI). Mereka akan berangkat ke Kairo pada bulan September 2025 dan menghabiskan 6 bulan belajar langsung di universitas tertua di dunia tersebut.

Seleksi yang diikuti oleh lebih dari 500 santri dari seluruh pesantren berbasis KMI Gontor di Indonesia ini mencakup ujian tertulis komprehensif dalam bahasa Arab, ujian hafalan Al-Quran, dan wawancara langsung dengan tim penguji dari Al-Azhar.

Ustadz Harun Ar-Rasyid mengucapkan selamat dan berpesan: "Kalian membawa nama Raudhatussalam ke kancah internasional. Jaga nama baik pesantren dan tunjukkan bahwa santri Indonesia mampu bersaing di level tertinggi."',
'Tiga santri Raudhatussalam Mahato lolos seleksi program pertukaran pelajar ke Universitas Al-Azhar, Mesir 2025.',
'https://images.unsplash.com/photo-1569399078436-6abb2a243e47?auto=format&fit=crop&q=80&w=1200',
'Santri Raudhatussalam Lolos Pertukaran Pelajar ke Al-Azhar Mesir',
'Tiga santri Raudhatussalam Mahato lolos seleksi pertukaran pelajar ke Universitas Al-Azhar Mesir 2025.',
'kuliah al-azhar mesir, pertukaran pelajar pesantren indonesia mesir, raudhatussalam mahato prestasi',
876, 187, 64, 'published', NOW() - INTERVAL '60 days', true, 217,
(SELECT id FROM blog_category WHERE slug='prestasi' LIMIT 1),
NOW() - INTERVAL '60 days', NOW()),

('Rapat Koordinasi Wali Santri: Evaluasi dan Rencana Program 2025/2026',
'rapat-koordinasi-wali-santri-2025',
'Pondok Pesantren Modern Raudhatussalam Mahato menyelenggarakan Rapat Koordinasi Wali Santri Semester II Tahun Ajaran 2024/2025 pada Minggu, 9 Maret 2025. Lebih dari 400 wali santri hadir memenuhi Aula Utama pesantren.

Agenda utama rapat meliputi: penyampaian laporan perkembangan akademik dan akhlak santri semester I, pembahasan rencana program unggulan untuk tahun ajaran baru, dan sesi tanya jawab langsung dengan pengurus pesantren.

Beberapa wali santri menyampaikan masukan positif tentang program asrama dan pembelajaran. Namun ada juga beberapa catatan yang perlu diperbaiki, termasuk peningkatan variasi menu makan dan perbaikan fasilitas kamar mandi di blok lama.

KH. Zulkifli Ahmad merespons semua masukan dengan terbuka. "Kami mendengar setiap aspirasi wali santri. Pesantren ini milik kita bersama, dan kita membangunnya bersama-sama. Setiap masukan adalah amanah yang akan kami tindaklanjuti."',
'Rakor Wali Santri Raudhatussalam Mahato 2025: evaluasi akademik dan rencana program tahun ajaran baru.',
'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1200',
'Rakor Wali Santri Raudhatussalam 2025',
'Rapat Koordinasi Wali Santri Raudhatussalam Mahato 2025: evaluasi perkembangan santri dan rencana program baru.',
'rakor wali santri pesantren riau, pertemuan orang tua santri raudhatussalam, evaluasi pesantren mahato',
298, 54, 17, 'published', NOW() - INTERVAL '70 days', false, 221,
(SELECT id FROM blog_category WHERE slug='berita-pesantren' LIMIT 1),
NOW() - INTERVAL '70 days', NOW()),

('Wisuda Akbar 2025: 127 Santri Resmi Tamatkan Pendidikan KMI 6 Tahun',
'wisuda-akbar-2025-127-santri-tamat-kmi',
'Prosesi Wisuda Akbar Pondok Pesantren Modern Raudhatussalam Mahato Tahun 2025 berlangsung dengan penuh haru dan kebanggaan. Sebanyak 127 santri resmi dinyatakan tamat dari jenjang KMI 6 tahun di hadapan ribuan tamu undangan yang memenuhi lapangan utama pesantren.

Wisuda dimulai dengan prosesi pawai kirab oleh seluruh wisudawan-wisudawati mengelilingi komplek pesantren sambil menerima tepuk tangan meriah dari adik-adik kelas mereka. Momen ini selalu menjadi ciri khas wisuda Raudhatussalam yang dibanjiri air mata haru.

Dalam pidato perpisahan yang disampaikan oleh perwakilan wisudawan, Ahmad Fiqri Hamdani, ia mengenang perjuangan selama 6 tahun: "Raudhatussalam bukan hanya tempat kami belajar. Di sinilah kami ditempa menjadi manusia yang sesungguhnya. Terima kasih Abi, Umi, para ustadz-ustadzah, dan semua yang telah mendidik kami."

Para wisudawan akan melanjutkan perjalanan mereka ke berbagai penjuru: sebagian ke Al-Azhar Mesir, sebagian ke Universitas Islam Madinah, sebagian ke kampus-kampus terkemuka di Indonesia, dan sebagian lagi akan mengabdi sebagai guru di pesantren.',
'Wisuda Akbar 2025 Raudhatussalam Mahato: 127 santri resmi tamat KMI 6 tahun dalam prosesi yang penuh haru.',
'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200',
'Wisuda Akbar 2025 Raudhatussalam Mahato: 127 Santri Tamat KMI',
'Wisuda Akbar 2025 Raudhatussalam Mahato: 127 santri resmi tamat KMI 6 tahun dengan penuh hikmat.',
'wisuda pesantren 2025, tamat kmi raudhatussalam, alumni raudhatussalam mahato',
1567, 312, 103, 'published', NOW() - INTERVAL '90 days', true, 213,
(SELECT id FROM blog_category WHERE slug='kegiatan-santri' LIMIT 1),
NOW() - INTERVAL '90 days', NOW());
