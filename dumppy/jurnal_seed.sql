-- Insert 5 Jurnal Publikasi Ilmiah Terbaru
-- Menggunakan dummy user yang sudah ada dan kategori jurnal

-- Pastikan kategori 'Jurnal Keislaman' dan 'Jurnal Pendidikan' ada
INSERT INTO publication_categories (name, slug, type, description, created_at, updated_at)
VALUES 
  ('Jurnal Keislaman', 'jurnal-keislaman', 'journal', 'Karya ilmiah kajian keislaman.', NOW(), NOW()),
  ('Jurnal Pendidikan', 'jurnal-pendidikan', 'journal', 'Karya ilmiah kajian pendidikan.', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- INSERT data artikel jurnal
INSERT INTO publication_articles (
  title, slug, excerpt, content, featured_image, pdf_file,
  status, type, author_id, category_id, views_count,
  keywords, created_at, updated_at, approved_at
)
VALUES
(
  'Integrasi Kurikulum KMI Gontor dalam Pendidikan Pesantren Modern',
  'integrasi-kurikulum-kmi-gontor-pendidikan-pesantren-modern',
  'Penelitian komprehensif mengenai penerapan kurikulum Kulliyatu-l-Muallimin Al-Islamiyah (KMI) Gontor di berbagai pesantren modern di Sumatera, studi kasus Raudhatussalam Mahato.',
  '<p>Pendidikan pesantren terus mengalami evolusi tanpa menghilangkan identitas klasiknya...</p><p>Metodologi yang digunakan adalah deskriptif kualitatif. Hasil observasi menunjukkan peningkatan kedisiplinan bahasa dan akhlak.</p>',
  'https://images.unsplash.com/photo-1577563908411-5079b6a1d00d?q=80&w=2070',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'approved', 'journal',
  (SELECT id FROM users_user WHERE email LIKE '%@%' LIMIT 1 OFFSET 0),
  (SELECT id FROM publication_categories WHERE slug = 'jurnal-pendidikan'),
  315, 'kurikulum KMI, pesantren modern, pendidikan', NOW() - INTERVAL '30 days', NOW(), NOW() - INTERVAL '29 days'
),
(
  'Efektivitas Metode Tasmi dalam Menjaga Hafalan Al-Quran Santriwati',
  'efektivitas-metode-tasmi-menjaga-hafalan-al-quran-santriwati',
  'Sebuah kajian lapangan terkait pengaruh rutinitas tasmi terhadap kuantitas dan kualitas hafalan santriwati tahfidz.',
  '<p>Menjaga hafalan (mutqin) lebih sulit dibandingkan menambah hafalan baru...</p><p>Kajian ini membandingkan kelompok yang rutin tasmi mingguan dan yang tidak. Hasilnya menunjukkan retensi memori 85% lebih tinggi pada kelompok tasmi.</p>',
  'https://images.unsplash.com/photo-1609599006353-e629aaab31ce?q=80&w=2070',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'approved', 'journal',
  (SELECT id FROM users_user WHERE email LIKE '%@%' LIMIT 1 OFFSET 1),
  (SELECT id FROM publication_categories WHERE slug = 'jurnal-keislaman'),
  128, 'tahfidz al-quran, metode tasmi, santriwati', NOW() - INTERVAL '15 days', NOW(), NOW() - INTERVAL '14 days'
),
(
  'Digitalisasi Pesantren: Tantangan Manajemen Administrasi Era 5.0',
  'digitalisasi-pesantren-tantangan-manajemen-administrasi-era-50',
  'Jurnal analisis adaptasi pondok pesantren tradisional dan modern terhadap sistem informasi manajemen (SIM) untuk operasional sehari-hari.',
  '<p>Transisi menuju sistem paperless menjadi krusial di era Society 5.0...</p><p>Infrastruktur IT pesantren saat ini menjadi bahasan utama pada paper ini, menyoroti gap antara kesiapan SDM dan ekspektasi teknologi.</p>',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'approved', 'journal',
  (SELECT id FROM users_user WHERE email LIKE '%@%' LIMIT 1 OFFSET 2),
  (SELECT id FROM publication_categories WHERE slug = 'jurnal-pendidikan'),
  432, 'digitalisasi pesantren, manajemen pendidikan, era 5.0', NOW() - INTERVAL '60 days', NOW(), NOW() - INTERVAL '58 days'
),
(
  'Relevansi Fiqih Muamalah Mahiyah dalam Praktik Koperasi Pesantren',
  'relevansi-fiqih-muamalah-mahiyah-koperasi-pesantren',
  'Studi kasus implementasi akad syariah dalam kegiatan jual-beli di koperasi pondok pesantren dan dampaknya pada perekonomian internal.',
  '<p>Pesantren tidak hanya tempat belajar, namun wadah mempraktikkan fiqih muamalah secara riil...</p><p>Jurnal ini menganalisis implementasi akad mudharabah dan murabahah di Kopontren (Koperasi Pondok Pesantren).</p>',
  'https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=2070',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'approved', 'journal',
  (SELECT id FROM users_user WHERE email LIKE '%@%' LIMIT 1 OFFSET 0),
  (SELECT id FROM publication_categories WHERE slug = 'jurnal-keislaman'),
  221, 'fiqih muamalah, koperasi santri, ekonomi syariah', NOW() - INTERVAL '5 days', NOW(), NOW() - INTERVAL '3 days'
),
(
  'Psikologi Pembelajaran Bahasa Arab dengan Metode Langsung (Thariqah Mubasyirah)',
  'psikologi-pembelajaran-bahasa-arab-metode-langsung',
  'Analisis respon kognitif dan afektif santri madrasah tsanawiyah terhadap penerapan metode langsung dalam kelas muhadatsah.',
  '<p>Bahasa Arab adalah mahkota pesantren. Penguasaannya memerlukan metode yang komprehensif...</p><p>Metode langsung mendesak otak santri untuk berpikir langsung dalam bahasa tujuan, menghilangkan proses translasi mental.</p>',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'approved', 'journal',
  (SELECT id FROM users_user WHERE email LIKE '%@%' LIMIT 1 OFFSET 1),
  (SELECT id FROM publication_categories WHERE slug = 'jurnal-pendidikan'),
  511, 'bahasa arab, metode langsung, psikologi pendidikan', NOW() - INTERVAL '45 days', NOW(), NOW() - INTERVAL '44 days'
);
