// Extended mock data for all modules
import type { 
  BankAccount, 
  Payment, 
  Category, 
  Tag, 
  BlogPost, 
  Testimonial, 
  Announcement,
  FAQ,
  Fasilitas,
  Ekstrakurikuler,
  JadwalHarian,
  BiayaPendidikan,
  Seragam,
  Statistik,
  HeroSection,
  SocialMedia,
  ContactPerson,
  Kontak,
  TenagaPengajar,
  BagianJabatan,
  Program,
  ProgramPendidikan,
  Media,
  Dokumentasi,
  WhatsAppTemplate,
  WhatsAppTemplateKategori,
  DocumentTemplate,
  User,
} from '@/types';

// Users
export const mockUsersExtended: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@pesantren.sch.id',
    first_name: 'Super',
    last_name: 'Admin',
    phone: '081234567890',
    role: 'admin',
    is_active: true,
    is_staff: true,
    is_superuser: true,
    date_joined: '2024-01-01T00:00:00Z',
    last_login: '2026-02-07T08:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    username: 'ustadz.ibrahim',
    email: 'ibrahim@pesantren.sch.id',
    first_name: 'Ibrahim',
    last_name: 'Al-Farisi',
    phone: '081234567891',
    role: 'teacher',
    is_active: true,
    is_staff: true,
    is_superuser: false,
    date_joined: '2024-03-15T00:00:00Z',
    last_login: '2026-02-06T14:30:00Z',
    created_at: '2024-03-15T00:00:00Z',
  },
  {
    id: '3',
    username: 'operator.psb',
    email: 'psb@pesantren.sch.id',
    first_name: 'Fatimah',
    last_name: 'Azzahra',
    phone: '081234567892',
    role: 'operator',
    is_active: true,
    is_staff: true,
    is_superuser: false,
    date_joined: '2024-06-01T00:00:00Z',
    last_login: '2026-02-07T07:45:00Z',
    created_at: '2024-06-01T00:00:00Z',
  },
  {
    id: '4',
    username: 'staff.keuangan',
    email: 'keuangan@pesantren.sch.id',
    first_name: 'Ahmad',
    last_name: 'Hidayat',
    phone: '081234567893',
    role: 'staff',
    is_active: true,
    is_staff: true,
    is_superuser: false,
    date_joined: '2024-04-01T00:00:00Z',
    last_login: '2026-02-05T10:00:00Z',
    created_at: '2024-04-01T00:00:00Z',
  },
  {
    id: '5',
    username: 'ustadzah.maryam',
    email: 'maryam@pesantren.sch.id',
    first_name: 'Maryam',
    last_name: 'Binti Yusuf',
    phone: '081234567894',
    role: 'teacher',
    is_active: false,
    is_staff: true,
    is_superuser: false,
    date_joined: '2024-02-01T00:00:00Z',
    created_at: '2024-02-01T00:00:00Z',
  },
];

// Bank Accounts
export const mockBankAccountsExtended: BankAccount[] = [
  {
    id: '1',
    nama_bank: 'BSI',
    nama_bank_custom: 'Bank Syariah Indonesia',
    nomor_rekening: '7012345678',
    nama_pemilik_rekening: 'Yayasan Pondok Pesantren',
    biaya_pendaftaran: 2500000,
    is_active: true,
    keterangan: 'Rekening utama pendaftaran',
    order: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    nama_bank: 'BRI',
    nama_bank_custom: 'Bank Rakyat Indonesia',
    nomor_rekening: '0012345678901234',
    nama_pemilik_rekening: 'Yayasan Pondok Pesantren',
    biaya_pendaftaran: 2500000,
    is_active: true,
    keterangan: 'Rekening alternatif',
    order: 2,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    nama_bank: 'Mandiri',
    nomor_rekening: '1234567890123',
    nama_pemilik_rekening: 'Yayasan Pondok Pesantren',
    biaya_pendaftaran: 2500000,
    is_active: false,
    keterangan: 'Rekening lama (nonaktif)',
    order: 3,
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Payments Extended
export const mockPaymentsExtended: Payment[] = [
  {
    id: '1',
    santri_id: '1',
    bank_pengirim: 'BCA',
    no_rekening_pengirim: '1234567890',
    nama_pemilik_rekening: 'Abdullah bin Ahmad',
    rekening_tujuan: '7012345678',
    jumlah_transfer: 2500000,
    status: 'verified',
    catatan: 'Pembayaran lunas',
    verified_by_id: '1',
    verified_at: '2024-07-02T10:00:00Z',
    created_at: '2024-07-01T14:00:00Z',
    updated_at: '2024-07-02T10:00:00Z',
  },
  {
    id: '2',
    santri_id: '2',
    bank_pengirim: 'Mandiri',
    no_rekening_pengirim: '1234567891',
    nama_pemilik_rekening: 'Rahman bin Salim',
    rekening_tujuan: '7012345678',
    jumlah_transfer: 2500000,
    status: 'pending',
    created_at: '2024-07-06T09:00:00Z',
    updated_at: '2024-07-06T09:00:00Z',
  },
  {
    id: '3',
    santri_id: '3',
    bank_pengirim: 'BSI',
    no_rekening_pengirim: '9876543210',
    nama_pemilik_rekening: 'Pratama Wijaya',
    rekening_tujuan: '7012345678',
    jumlah_transfer: 2500000,
    status: 'pending',
    created_at: '2024-07-08T11:00:00Z',
    updated_at: '2024-07-08T11:00:00Z',
  },
  {
    id: '4',
    santri_id: '4',
    bank_pengirim: 'BNI',
    no_rekening_pengirim: '5555666677',
    nama_pemilik_rekening: 'Sulaiman',
    rekening_tujuan: '7012345678',
    jumlah_transfer: 2500000,
    status: 'rejected',
    catatan: 'Jumlah transfer tidak sesuai',
    created_at: '2024-07-05T08:00:00Z',
    updated_at: '2024-07-05T15:00:00Z',
  },
];

// Categories
export const mockCategoriesExtended: Category[] = [
  { id: '1', name: 'Kegiatan', slug: 'kegiatan', order: 1, created_at: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'Pendidikan', slug: 'pendidikan', order: 2, created_at: '2024-01-01T00:00:00Z' },
  { id: '3', name: 'Prestasi', slug: 'prestasi', order: 3, created_at: '2024-01-01T00:00:00Z' },
  { id: '4', name: 'Pengumuman', slug: 'pengumuman', order: 4, created_at: '2024-01-01T00:00:00Z' },
  { id: '5', name: 'Berita', slug: 'berita', order: 5, created_at: '2024-01-15T00:00:00Z' },
  { id: '6', name: 'Kajian', slug: 'kajian', order: 6, created_at: '2024-02-01T00:00:00Z' },
];

// Tags
export const mockTagsExtended: Tag[] = [
  { id: '1', name: 'Ramadhan', slug: 'ramadhan', order: 1, created_at: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'Tahfidz', slug: 'tahfidz', order: 2, created_at: '2024-01-01T00:00:00Z' },
  { id: '3', name: 'Olahraga', slug: 'olahraga', order: 3, created_at: '2024-01-01T00:00:00Z' },
  { id: '4', name: 'Lomba', slug: 'lomba', order: 4, created_at: '2024-01-01T00:00:00Z' },
  { id: '5', name: 'Wisuda', slug: 'wisuda', order: 5, created_at: '2024-01-15T00:00:00Z' },
  { id: '6', name: 'Liburan', slug: 'liburan', order: 6, created_at: '2024-02-01T00:00:00Z' },
  { id: '7', name: 'Pesantren', slug: 'pesantren', order: 7, created_at: '2024-02-01T00:00:00Z' },
  { id: '8', name: 'Dakwah', slug: 'dakwah', order: 8, created_at: '2024-03-01T00:00:00Z' },
];

// Blog Posts Extended
export const mockBlogPostsExtended: BlogPost[] = [
  {
    id: '1',
    title: 'Keutamaan Menuntut Ilmu dalam Islam',
    slug: 'keutamaan-menuntut-ilmu-dalam-islam',
    content: '<p>Menuntut ilmu adalah kewajiban bagi setiap muslim. Rasulullah SAW bersabda: "Menuntut ilmu adalah kewajiban bagi setiap muslim."</p>',
    excerpt: 'Menuntut ilmu adalah kewajiban bagi setiap muslim...',
    author_id: '2',
    category_id: '2',
    meta_title: 'Keutamaan Menuntut Ilmu dalam Islam',
    meta_description: 'Artikel tentang keutamaan menuntut ilmu',
    meta_keywords: 'ilmu, islam, pendidikan',
    status: 'published',
    is_featured: true,
    published_at: '2024-06-15T10:00:00Z',
    views_count: 1250,
    likes_count: 89,
    shares_count: 34,
    created_at: '2024-06-15T09:00:00Z',
    updated_at: '2024-06-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Jadwal Penerimaan Santri Baru 2026',
    slug: 'jadwal-penerimaan-santri-baru-2026',
    content: '<p>Pendaftaran santri baru tahun ajaran 2026/2027 akan dibuka pada tanggal 1 Maret 2026.</p>',
    excerpt: 'Pendaftaran santri baru tahun ajaran 2026/2027...',
    author_id: '1',
    category_id: '4',
    meta_title: 'Jadwal Penerimaan Santri Baru 2026',
    meta_description: 'Informasi jadwal penerimaan santri baru',
    meta_keywords: 'pendaftaran, santri baru',
    status: 'published',
    is_featured: false,
    published_at: '2024-07-01T08:00:00Z',
    views_count: 3450,
    likes_count: 156,
    shares_count: 89,
    created_at: '2024-06-30T14:00:00Z',
    updated_at: '2024-07-01T08:00:00Z',
  },
  {
    id: '3',
    title: 'Prestasi Santri di Olimpiade Sains',
    slug: 'prestasi-santri-olimpiade-sains',
    content: '<p>Alhamdulillah, santri kita berhasil meraih medali emas di Olimpiade Sains Nasional.</p>',
    excerpt: 'Santri meraih prestasi gemilang di OSN...',
    author_id: '2',
    category_id: '3',
    meta_title: 'Prestasi Santri di Olimpiade Sains',
    meta_description: 'Prestasi santri di OSN',
    meta_keywords: 'prestasi, olimpiade, sains',
    status: 'published',
    is_featured: true,
    published_at: '2024-08-15T10:00:00Z',
    views_count: 890,
    likes_count: 234,
    shares_count: 67,
    created_at: '2024-08-15T09:00:00Z',
    updated_at: '2024-08-15T10:00:00Z',
  },
  {
    id: '4',
    title: 'Kegiatan Ramadhan 1447 H',
    slug: 'kegiatan-ramadhan-1447-h',
    content: '<p>Rangkaian kegiatan Ramadhan yang akan dilaksanakan di pesantren.</p>',
    excerpt: 'Program kegiatan selama bulan Ramadhan...',
    author_id: '1',
    category_id: '1',
    meta_title: 'Kegiatan Ramadhan',
    meta_description: 'Kegiatan Ramadhan di pesantren',
    meta_keywords: 'ramadhan, kegiatan',
    status: 'draft',
    is_featured: false,
    views_count: 0,
    likes_count: 0,
    shares_count: 0,
    created_at: '2024-09-01T08:00:00Z',
    updated_at: '2024-09-01T08:00:00Z',
  },
];

// Testimonials
export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    nama: 'H. Ahmad Syafii',
    foto: undefined,
    jabatan: 'Wali Santri',
    testimoni: 'Alhamdulillah, anak saya berkembang sangat baik di pesantren ini. Akhlaknya semakin baik dan hafalannya bertambah.',
    rating: 5,
    is_published: true,
    order: 1,
    created_at: '2024-03-01T00:00:00Z',
  },
  {
    id: '2',
    nama: 'Ibu Fatimah',
    jabatan: 'Wali Santriwati',
    testimoni: 'Lingkungan yang Islami dan pengajar yang berkompeten membuat anak saya betah belajar di sini.',
    rating: 5,
    is_published: true,
    order: 2,
    created_at: '2024-03-15T00:00:00Z',
  },
  {
    id: '3',
    nama: 'Muhammad Ridwan',
    jabatan: 'Alumni 2023',
    testimoni: 'Pesantren ini membentuk karakter saya menjadi lebih baik. Ilmu yang didapat sangat bermanfaat.',
    rating: 4,
    is_published: true,
    order: 3,
    created_at: '2024-04-01T00:00:00Z',
  },
];

// Announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    judul: 'Jadwal Ujian Semester Genap 2026',
    slug: 'jadwal-ujian-semester-genap-2026',
    konten: '<p>Ujian semester genap akan dilaksanakan pada tanggal 15-20 Juni 2026.</p>',
    status: 'published',
    is_penting: true,
    published_at: '2024-05-01T08:00:00Z',
    meta_title: 'Jadwal Ujian Semester',
    meta_description: 'Informasi jadwal ujian',
    created_at: '2024-05-01T08:00:00Z',
    updated_at: '2024-05-01T08:00:00Z',
  },
  {
    id: '2',
    judul: 'Libur Hari Raya Idul Fitri 1447 H',
    slug: 'libur-hari-raya-idul-fitri-1447-h',
    konten: '<p>Pesantren libur pada tanggal 1-7 Syawal 1447 H.</p>',
    status: 'published',
    is_penting: true,
    published_at: '2024-03-15T08:00:00Z',
    meta_title: 'Libur Idul Fitri',
    meta_description: 'Pengumuman libur',
    created_at: '2024-03-15T08:00:00Z',
    updated_at: '2024-03-15T08:00:00Z',
  },
  {
    id: '3',
    judul: 'Perubahan Jam Besuk',
    slug: 'perubahan-jam-besuk',
    konten: '<p>Jam besuk diubah menjadi setiap hari Ahad pukul 09.00 - 15.00 WIB.</p>',
    status: 'draft',
    is_penting: false,
    meta_title: 'Jam Besuk',
    meta_description: 'Perubahan jam besuk',
    created_at: '2024-06-01T08:00:00Z',
    updated_at: '2024-06-01T08:00:00Z',
  },
];

// FAQ
export const mockFAQs: FAQ[] = [
  {
    id: '1',
    pertanyaan: 'Bagaimana cara mendaftar sebagai santri baru?',
    jawaban: 'Pendaftaran dapat dilakukan secara online melalui website kami atau datang langsung ke kantor pendaftaran.',
    kategori: 'Pendaftaran',
    order: 1,
    is_published: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    pertanyaan: 'Berapa biaya pendidikan per tahun?',
    jawaban: 'Biaya pendidikan bervariasi tergantung program yang dipilih. Silakan lihat halaman biaya pendidikan untuk informasi lengkap.',
    kategori: 'Biaya',
    order: 2,
    is_published: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    pertanyaan: 'Apakah ada program beasiswa?',
    jawaban: 'Ya, kami menyediakan program beasiswa bagi santri berprestasi dan santri dari keluarga kurang mampu.',
    kategori: 'Beasiswa',
    order: 3,
    is_published: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    pertanyaan: 'Kapan jam besuk orang tua?',
    jawaban: 'Jam besuk setiap hari Ahad pukul 09.00 - 15.00 WIB.',
    kategori: 'Umum',
    order: 4,
    is_published: true,
    created_at: '2024-01-15T00:00:00Z',
  },
];

// Fasilitas
export const mockFasilitas: Fasilitas[] = [
  { id: '1', nama: 'Masjid', icon: 'mosque', order: 1, created_at: '2024-01-01T00:00:00Z' },
  { id: '2', nama: 'Asrama Putra', icon: 'building', order: 2, created_at: '2024-01-01T00:00:00Z' },
  { id: '3', nama: 'Asrama Putri', icon: 'building', order: 3, created_at: '2024-01-01T00:00:00Z' },
  { id: '4', nama: 'Ruang Kelas', icon: 'school', order: 4, created_at: '2024-01-01T00:00:00Z' },
  { id: '5', nama: 'Perpustakaan', icon: 'library', order: 5, created_at: '2024-01-01T00:00:00Z' },
  { id: '6', nama: 'Laboratorium', icon: 'flask', order: 6, created_at: '2024-01-01T00:00:00Z' },
  { id: '7', nama: 'Lapangan Olahraga', icon: 'sports', order: 7, created_at: '2024-01-01T00:00:00Z' },
  { id: '8', nama: 'Kantin', icon: 'utensils', order: 8, created_at: '2024-01-01T00:00:00Z' },
];

// Ekstrakurikuler
export const mockEkstrakurikuler: Ekstrakurikuler[] = [
  { id: '1', nama: 'Tahfidz Al-Quran', icon: 'book-open', order: 1, created_at: '2024-01-01T00:00:00Z' },
  { id: '2', nama: 'Pramuka', icon: 'tent', order: 2, created_at: '2024-01-01T00:00:00Z' },
  { id: '3', nama: 'Pencak Silat', icon: 'sword', order: 3, created_at: '2024-01-01T00:00:00Z' },
  { id: '4', nama: 'Futsal', icon: 'football', order: 4, created_at: '2024-01-01T00:00:00Z' },
  { id: '5', nama: 'Kaligrafi', icon: 'pen-tool', order: 5, created_at: '2024-01-01T00:00:00Z' },
  { id: '6', nama: 'Jurnalistik', icon: 'newspaper', order: 6, created_at: '2024-01-01T00:00:00Z' },
  { id: '7', nama: 'English Club', icon: 'globe', order: 7, created_at: '2024-01-01T00:00:00Z' },
  { id: '8', nama: 'Komputer', icon: 'laptop', order: 8, created_at: '2024-01-01T00:00:00Z' },
];

// Jadwal Harian
export const mockJadwalHarian: JadwalHarian[] = [
  { id: '1', waktu: '03:30 - 04:00', judul: 'Bangun & Tahajjud', deskripsi: 'Shalat tahajjud berjamaah', kategori: 'ibadah', order: 1, created_at: '2024-01-01T00:00:00Z' },
  { id: '2', waktu: '04:00 - 04:30', judul: 'Shalat Subuh', deskripsi: 'Shalat subuh berjamaah di masjid', kategori: 'ibadah', order: 2, created_at: '2024-01-01T00:00:00Z' },
  { id: '3', waktu: '04:30 - 05:30', judul: 'Tahfidz Quran', deskripsi: 'Setoran hafalan Al-Quran', kategori: 'pendidikan', order: 3, created_at: '2024-01-01T00:00:00Z' },
  { id: '4', waktu: '05:30 - 06:30', judul: 'Mandi & Sarapan', deskripsi: 'Persiapan pagi', kategori: 'istirahat', order: 4, created_at: '2024-01-01T00:00:00Z' },
  { id: '5', waktu: '07:00 - 12:00', judul: 'KBM Pagi', deskripsi: 'Kegiatan belajar mengajar formal', kategori: 'pendidikan', order: 5, created_at: '2024-01-01T00:00:00Z' },
  { id: '6', waktu: '12:00 - 13:00', judul: 'Shalat Dzuhur & Makan', deskripsi: 'Istirahat siang', kategori: 'istirahat', order: 6, created_at: '2024-01-01T00:00:00Z' },
  { id: '7', waktu: '13:00 - 15:00', judul: 'KBM Siang', deskripsi: 'Pelajaran diniyah', kategori: 'pendidikan', order: 7, created_at: '2024-01-01T00:00:00Z' },
  { id: '8', waktu: '15:00 - 17:00', judul: 'Ekstrakurikuler', deskripsi: 'Kegiatan pengembangan diri', kategori: 'kegiatan', order: 8, created_at: '2024-01-01T00:00:00Z' },
];

// Biaya Pendidikan
export const mockBiayaPendidikan: BiayaPendidikan[] = [
  { id: '1', tipe: 'pendaftaran', nama: 'Biaya Pendaftaran', jumlah: 500000, keterangan: 'Dibayar sekali', order: 1, created_at: '2024-01-01T00:00:00Z' },
  { id: '2', tipe: 'masuk', nama: 'Uang Pangkal', jumlah: 5000000, keterangan: 'Dibayar sekali saat masuk', order: 2, created_at: '2024-01-01T00:00:00Z' },
  { id: '3', tipe: 'bulanan', nama: 'SPP', jumlah: 1500000, keterangan: 'Per bulan', order: 3, created_at: '2024-01-01T00:00:00Z' },
  { id: '4', tipe: 'bulanan', nama: 'Makan', jumlah: 800000, keterangan: '3x sehari', order: 4, created_at: '2024-01-01T00:00:00Z' },
  { id: '5', tipe: 'tahunan', nama: 'Seragam', jumlah: 1200000, keterangan: 'Set lengkap', order: 5, created_at: '2024-01-01T00:00:00Z' },
  { id: '6', tipe: 'tahunan', nama: 'Buku & ATK', jumlah: 500000, keterangan: 'Per tahun ajaran', order: 6, created_at: '2024-01-01T00:00:00Z' },
];

// Hero Sections
export const mockHeroSections: HeroSection[] = [
  { id: '1', title: 'Selamat Datang di Pesantren', subtitle: 'Membentuk Generasi Qurani', order: 1, is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '2', title: 'Pendaftaran Santri Baru', subtitle: 'Tahun Ajaran 2026/2027', order: 2, is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '3', title: 'Prestasi Gemilang', subtitle: 'Santri Berprestasi Nasional', order: 3, is_active: false, created_at: '2024-01-01T00:00:00Z' },
];

// Social Media
export const mockSocialMedia: SocialMedia[] = [
  { id: '1', platform: 'Instagram', username: '@pesantren_official', url: 'https://instagram.com/pesantren_official', order: 1, is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '2', platform: 'Facebook', username: 'Pesantren Official', url: 'https://facebook.com/pesantren', order: 2, is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '3', platform: 'YouTube', username: 'Pesantren Channel', url: 'https://youtube.com/@pesantren', order: 3, is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '4', platform: 'TikTok', username: '@pesantren', url: 'https://tiktok.com/@pesantren', order: 4, is_active: false, created_at: '2024-01-01T00:00:00Z' },
];

// Contact Persons
export const mockContactPersons: ContactPerson[] = [
  { id: '1', nama: 'Ustadz Ahmad', no_hp: '081234567890', order: 1, is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '2', nama: 'Ustadzah Fatimah', no_hp: '081234567891', order: 2, is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '3', nama: 'Admin PSB', no_hp: '081234567892', order: 3, is_active: true, created_at: '2024-01-01T00:00:00Z' },
];

// Kontak (Inbox)
export const mockKontak: Kontak[] = [
  { id: '1', nama: 'Budi Santoso', email: 'budi@email.com', no_hp: '081111111111', subjek: 'Informasi Pendaftaran', pesan: 'Saya ingin menanyakan tentang prosedur pendaftaran santri baru.', status: 'unread', created_at: '2024-07-01T10:00:00Z', updated_at: '2024-07-01T10:00:00Z' },
  { id: '2', nama: 'Siti Aminah', email: 'siti@email.com', no_hp: '082222222222', subjek: 'Biaya Pendidikan', pesan: 'Mohon informasi rincian biaya pendidikan.', status: 'read', created_at: '2024-06-28T14:00:00Z', updated_at: '2024-06-29T09:00:00Z' },
  { id: '3', nama: 'Ahmad Fauzan', email: 'ahmad@email.com', no_hp: '083333333333', subjek: 'Jadwal Kunjungan', pesan: 'Apakah bisa berkunjung ke pesantren hari Sabtu?', status: 'replied', balasan: 'Silakan berkunjung hari Sabtu pukul 09.00 WIB.', created_at: '2024-06-25T08:00:00Z', updated_at: '2024-06-25T15:00:00Z' },
];

// Tenaga Pengajar
export const mockTenagaPengajar: TenagaPengajar[] = [
  {
    id: '1',
    nama_lengkap: 'Ustadz Ibrahim Al-Farisi, Lc., M.A.',
    nama_panggilan: 'Ustadz Ibrahim',
    jenis_kelamin: 'L',
    tempat_lahir: 'Madinah',
    tanggal_lahir: '1985-03-15',
    alamat: 'Komplek Pesantren',
    no_hp: '081234567891',
    email: 'ibrahim@pesantren.sch.id',
    pendidikan_terakhir: 'S2',
    universitas: 'Universitas Islam Madinah',
    tahun_lulus: '2012',
    bidang_keahlian: 'Tafsir dan Hadits',
    mata_pelajaran: 'Al-Quran, Hadits, Tafsir',
    pengalaman_mengajar: '12 tahun',
    prestasi: 'Hafidz 30 Juz',
    riwayat_pendidikan: 'S1 Al-Azhar, S2 Madinah',
    organisasi: 'MUI',
    karya_tulis: 'Tafsir Al-Muyassar',
    motto: 'Ilmu adalah cahaya',
    whatsapp: '081234567891',
    facebook: '',
    instagram: '@ustadz.ibrahim',
    twitter: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
    order: 1,
    is_published: true,
    is_featured: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    nama_lengkap: 'Ustadzah Maryam, S.Pd.I.',
    nama_panggilan: 'Ustadzah Maryam',
    jenis_kelamin: 'P',
    tempat_lahir: 'Jakarta',
    tanggal_lahir: '1990-07-20',
    alamat: 'Komplek Pesantren',
    no_hp: '081234567892',
    email: 'maryam@pesantren.sch.id',
    pendidikan_terakhir: 'S1',
    universitas: 'UIN Jakarta',
    tahun_lulus: '2015',
    bidang_keahlian: 'Bahasa Arab',
    mata_pelajaran: 'Nahwu, Shorof, Balaghah',
    pengalaman_mengajar: '8 tahun',
    prestasi: '',
    riwayat_pendidikan: 'S1 UIN Jakarta',
    organisasi: '',
    karya_tulis: '',
    motto: 'Belajar tiada henti',
    whatsapp: '081234567892',
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
    order: 2,
    is_published: true,
    is_featured: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Bagian Jabatan
export const mockBagianJabatan: BagianJabatan[] = [
  { id: '1', nama: 'Pimpinan', deskripsi: 'Jajaran pimpinan pesantren', order: 1, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '2', nama: 'Pengasuhan', deskripsi: 'Bagian pengasuhan santri', order: 2, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '3', nama: 'Pendidikan', deskripsi: 'Bagian kurikulum dan pendidikan', order: 3, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '4', nama: 'Keuangan', deskripsi: 'Bagian administrasi keuangan', order: 4, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

// Programs
export const mockPrograms: Program[] = [
  { id: '1', nama: 'Program Tahfidz', slug: 'program-tahfidz', deskripsi: 'Program menghafal Al-Quran 30 Juz', status: 'active', is_featured: true, meta_title: 'Program Tahfidz', meta_description: 'Hafal 30 Juz', order: 1, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '2', nama: 'Program Intensif Bahasa', slug: 'program-bahasa', deskripsi: 'Intensif Bahasa Arab dan Inggris', status: 'active', is_featured: true, meta_title: 'Program Bahasa', meta_description: 'Bahasa Arab & Inggris', order: 2, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '3', nama: 'Pesantren Kilat Ramadhan', slug: 'pesantren-kilat', deskripsi: 'Program singkat selama Ramadhan', tanggal_mulai: '2026-03-01', tanggal_selesai: '2026-03-30', status: 'upcoming', is_featured: false, meta_title: 'Pesantren Kilat', meta_description: 'Program Ramadhan', order: 3, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

// Program Pendidikan
export const mockProgramPendidikan: ProgramPendidikan[] = [
  { id: '1', nama: 'MTs (Setara SMP)', akreditasi: 'A', icon: 'school', order: 1, created_at: '2024-01-01T00:00:00Z' },
  { id: '2', nama: 'MA (Setara SMA)', akreditasi: 'A', icon: 'graduation-cap', order: 2, created_at: '2024-01-01T00:00:00Z' },
  { id: '3', nama: 'Takhassus (Pasca MA)', akreditasi: '-', icon: 'book', order: 3, created_at: '2024-01-01T00:00:00Z' },
];

// Statistik
export const mockStatistik: Statistik[] = [
  { id: '1', judul: 'Total Santri', nilai: '1,247', icon: 'users', deskripsi: 'Santri aktif', warna: 'primary', order: 1, is_published: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '2', judul: 'Pengajar', nilai: '86', icon: 'user-check', deskripsi: 'Ustadz & Ustadzah', warna: 'success', order: 2, is_published: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '3', judul: 'Hafidz', nilai: '245', icon: 'book-open', deskripsi: 'Penghafal 30 Juz', warna: 'accent', order: 3, is_published: true, created_at: '2024-01-01T00:00:00Z' },
  { id: '4', judul: 'Tahun Berdiri', nilai: '1985', icon: 'calendar', deskripsi: '39 tahun pengabdian', warna: 'info', order: 4, is_published: true, created_at: '2024-01-01T00:00:00Z' },
];

// Seragam
export const mockSeragam: Seragam[] = [
  { id: '1', hari: 'Senin', kategori: 'formal', seragam_putra: 'Baju putih, celana hitam, peci', seragam_putri: 'Gamis putih, jilbab putih', seragam: '', order: 1, created_at: '2024-01-01T00:00:00Z' },
  { id: '2', hari: 'Selasa', kategori: 'formal', seragam_putra: 'Baju batik, celana hitam, peci', seragam_putri: 'Gamis batik, jilbab coklat', seragam: '', order: 2, created_at: '2024-01-01T00:00:00Z' },
  { id: '3', hari: 'Rabu', kategori: 'formal', seragam_putra: 'Baju hijau, celana hitam, peci', seragam_putri: 'Gamis hijau, jilbab hijau', seragam: '', order: 3, created_at: '2024-01-01T00:00:00Z' },
  { id: '4', hari: 'Kamis', kategori: 'formal', seragam_putra: 'Koko putih, sarung', seragam_putri: 'Gamis putih, jilbab putih', seragam: '', order: 4, created_at: '2024-01-01T00:00:00Z' },
  { id: '5', hari: 'Jumat', kategori: 'formal', seragam_putra: 'Jubah, peci', seragam_putri: 'Gamis, jilbab syari', seragam: '', order: 5, created_at: '2024-01-01T00:00:00Z' },
];

// WhatsApp Template Kategori
export const mockWATemplateKategori: WhatsAppTemplateKategori[] = [
  { id: '1', nama: 'Pendaftaran', slug: 'pendaftaran', deskripsi: 'Template untuk proses pendaftaran', order: 1, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '2', nama: 'Pembayaran', slug: 'pembayaran', deskripsi: 'Template untuk konfirmasi pembayaran', order: 2, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '3', nama: 'Informasi', slug: 'informasi', deskripsi: 'Template informasi umum', order: 3, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

// WhatsApp Templates
export const mockWATemplates: WhatsAppTemplate[] = [
  { id: '1', nama: 'Konfirmasi Pendaftaran', tipe: 'auto', pesan: 'Assalamualaikum {nama}, pendaftaran Anda telah kami terima. Silakan tunggu konfirmasi selanjutnya.', variabel: 'nama', kategori_id: '1', order: 1, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '2', nama: 'Pembayaran Diterima', tipe: 'auto', pesan: 'Alhamdulillah, pembayaran sebesar Rp {jumlah} telah kami terima. Jazakallahu khairan.', variabel: 'jumlah', kategori_id: '2', order: 2, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '3', nama: 'Pengingat Pembayaran', tipe: 'manual', pesan: 'Assalamualaikum, kami mengingatkan bahwa pembayaran SPP bulan {bulan} belum diterima.', variabel: 'bulan', kategori_id: '2', order: 3, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

// Document Templates
export const mockDocumentTemplates: DocumentTemplate[] = [
  { id: '1', nama: 'Kartu Santri', slug: 'kartu-santri', deskripsi: 'Template kartu identitas santri', html_template: '<div>...</div>', css_template: '.card { ... }', ukuran_kertas: 'A6', orientasi: 'landscape', margin_top: '10mm', margin_right: '10mm', margin_bottom: '10mm', margin_left: '10mm', is_active: true, order: 1, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '2', nama: 'Surat Keterangan', slug: 'surat-keterangan', deskripsi: 'Template surat keterangan aktif', html_template: '<div>...</div>', css_template: '.letter { ... }', ukuran_kertas: 'A4', orientasi: 'portrait', margin_top: '25mm', margin_right: '20mm', margin_bottom: '25mm', margin_left: '25mm', is_active: true, order: 2, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '3', nama: 'Bukti Pembayaran', slug: 'bukti-pembayaran', deskripsi: 'Template kwitansi pembayaran', html_template: '<div>...</div>', css_template: '.receipt { ... }', ukuran_kertas: 'A5', orientasi: 'portrait', margin_top: '15mm', margin_right: '15mm', margin_bottom: '15mm', margin_left: '15mm', is_active: true, order: 3, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

// Media
export const mockMedia: Media[] = [
  { id: '1', tipe: 'image', judul: 'Gedung Utama', sub_judul: 'Tampak depan gedung pesantren', order: 1, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '2', tipe: 'image', judul: 'Masjid', sub_judul: 'Masjid pesantren', order: 2, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '3', tipe: 'video', judul: 'Profil Pesantren', sub_judul: 'Video profil resmi', order: 3, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

// Dokumentasi
export const mockDokumentasi: Dokumentasi[] = [
  { id: '1', judul: 'Wisuda Santri 2025', deskripsi: 'Dokumentasi acara wisuda santri angkatan 2025', kategori: 'Wisuda', tanggal_kegiatan: '2025-06-15', lokasi: 'Aula Pesantren', order: 1, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '2', judul: 'Perlombaan HUT RI', deskripsi: 'Berbagai lomba dalam rangka HUT RI', kategori: 'Lomba', tanggal_kegiatan: '2025-08-17', lokasi: 'Lapangan Pesantren', order: 2, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '3', judul: 'Khataman Al-Quran', deskripsi: 'Acara khataman santri tahfidz', kategori: 'Keagamaan', tanggal_kegiatan: '2025-05-01', lokasi: 'Masjid Pesantren', order: 3, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];
