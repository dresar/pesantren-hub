import type {
  NavItem, Program, Facility, BlogPost, GalleryItem,
  ScheduleItem, Extracurricular, OrganizationMember,
  TimelineEvent, RegistrationRequirement, RegistrationFee,
  ContactInfo, Testimonial, Statistic, Notification, RegistrationStatus, SantriScheduleItem
} from '@/types';
export const navItems: NavItem[] = [
  { label: 'Beranda', href: '/' },
  {
    label: 'Profil', href: '/profil',
    children: [
      { label: 'Sejarah', href: '/profil/sejarah' },
      { label: 'Visi & Misi', href: '/profil/visi-misi' },
      { label: 'Struktur Organisasi', href: '/profil/organisasi' },
    ],
  },
  { label: 'Program', href: '/program' },
  { label: 'Fasilitas', href: '/fasilitas' },
  { label: 'Kehidupan Santri', href: '/kehidupan-santri',
    children: [
      { label: 'Jadwal Harian', href: '/kehidupan-santri/jadwal' },
      { label: 'Ekstrakurikuler', href: '/kehidupan-santri/ekstrakurikuler' },
      { label: 'Galeri', href: '/galeri' },
    ],
  },
  { label: 'Blog', href: '/blog' },
  { label: 'Pendaftaran', href: '/pendaftaran' },
  { label: 'Kontak', href: '/kontak' },
];
export const programs: Program[] = [
  {
    id: '1', title: 'SDIT (Sekolah Dasar Islam Terpadu)', slug: 'sdit',
    description: 'Program pendidikan dasar terpadu yang menggabungkan kurikulum nasional dengan pendidikan Islam komprehensif untuk membentuk fondasi iman dan ilmu sejak dini.',
    level: 'SD', duration: '6 Tahun', icon: 'GraduationCap',
    features: ['Kurikulum Nasional + Diniyah', 'Hafalan Al-Quran 5 Juz', 'Bahasa Arab & Inggris Dasar', 'Pembelajaran Aktif & Kreatif'],
    image: '/placeholder.svg',
  },
  {
    id: '2', title: 'MDTA (Madrasah Diniyah Takmiliyah Awaliyah)', slug: 'mdta',
    description: 'Program pendalaman ilmu agama Islam yang memperkuat pemahaman dasar-dasar keislaman, tajwid, fiqih, dan akhlak mulia.',
    level: 'Diniyah', duration: '4 Tahun', icon: 'BookOpen',
    features: ['Ilmu Tajwid & Tahfizh', 'Fiqih Ibadah', 'Akhlak & Adab Islami', 'Bahasa Arab Dasar'],
    image: '/placeholder.svg',
  },
  {
    id: '3', title: 'MTs (Madrasah Tsanawiyah)', slug: 'mts',
    description: 'Jenjang menengah pertama dengan kurikulum terpadu yang mempersiapkan santri menjadi generasi unggul dalam ilmu agama dan pengetahuan umum.',
    level: 'SMP', duration: '3 Tahun', icon: 'School',
    features: ['Kurikulum Kemenag + Pesantren', 'Hafalan Al-Quran 10 Juz', 'Pidato 3 Bahasa', 'Laboratorium IPA'],
    image: '/placeholder.svg',
  },
  {
    id: '4', title: 'MA (Madrasah Aliyah)', slug: 'ma',
    description: 'Jenjang menengah atas yang menghasilkan lulusan siap melanjutkan ke perguruan tinggi terbaik dalam dan luar negeri.',
    level: 'SMA', duration: '3 Tahun', icon: 'Award',
    features: ['Jurusan IPA & IPS', 'Persiapan UTBK/SNBT', 'Hafalan Al-Quran 15 Juz', 'Program Bahasa Intensif'],
    image: '/placeholder.svg',
  },
  {
    id: '5', title: 'KMI (Kulliyyatul Mu\'allimin Al-Islamiyyah)', slug: 'kmi',
    description: 'Program unggulan pendidikan kader ulama dan pemimpin umat dengan kurikulum gontor yang telah teruji menghasilkan alumni berkualitas.',
    level: 'Setara SMP-SMA', duration: '6 Tahun', icon: 'Star',
    features: ['Kurikulum Gontor', 'Bahasa Arab & Inggris Aktif', 'Kepemimpinan & Organisasi', 'Kitab Kuning & Ilmu Modern'],
    image: '/placeholder.svg',
  },
];
export const facilities: Facility[] = [
  { id: '1', title: 'Masjid Jami\'', slug: 'masjid', description: 'Masjid utama berkapasitas 1.500 jamaah dengan arsitektur Islami modern, dilengkapi sound system premium dan area wudhu yang luas.', icon: 'Landmark', image: '/placeholder.svg', features: ['Kapasitas 1.500 jamaah', 'Arsitektur Islami modern', 'Sound system premium', 'Area wudhu luas'] },
  { id: '2', title: 'Ruang Kelas Modern', slug: 'kelas', description: 'Ruang kelas ber-AC dengan smart board, proyektor, dan koneksi internet cepat untuk mendukung pembelajaran interaktif.', icon: 'Monitor', image: '/placeholder.svg', features: ['AC & ventilasi baik', 'Smart board interaktif', 'Proyektor HD', 'WiFi cepat'] },
  { id: '3', title: 'Asrama Santri', slug: 'asrama', description: 'Asrama nyaman dan bersih dengan pengawasan 24 jam, dilengkapi loker pribadi dan ruang belajar bersama.', icon: 'Home', image: '/placeholder.svg', features: ['Pengawasan 24 jam', 'Loker pribadi', 'Ruang belajar bersama', 'Kasur & lemari standar'] },
  { id: '4', title: 'Perpustakaan', slug: 'perpustakaan', description: 'Perpustakaan modern dengan koleksi 15.000+ buku, area baca nyaman, dan akses e-library digital.', icon: 'Library', image: '/placeholder.svg', features: ['15.000+ koleksi buku', 'E-library digital', 'Area baca nyaman', 'Ruang diskusi'] },
  { id: '5', title: 'Klinik Kesehatan', slug: 'klinik', description: 'Klinik kesehatan dengan tenaga medis profesional yang siap melayani santri 24 jam.', icon: 'Heart', image: '/placeholder.svg', features: ['Dokter & perawat', 'Layanan 24 jam', 'Obat-obatan lengkap', 'Ruang isolasi'] },
  { id: '6', title: 'Lapangan Olahraga', slug: 'lapangan', description: 'Fasilitas olahraga lengkap meliputi lapangan sepak bola, basket, badminton, dan trek lari.', icon: 'Dumbbell', image: '/placeholder.svg', features: ['Lapangan sepak bola', 'Court basket', 'Lapangan badminton', 'Trek lari 400m'] },
];
export const blogPosts: BlogPost[] = [
  { id: '1', title: 'Wisuda Santri Angkatan ke-15: Mencetak Generasi Emas', slug: 'wisuda-santri-angkatan-15', excerpt: 'Sebanyak 120 santri resmi diwisuda dalam acara yang dihadiri oleh Bupati Rokan Hulu dan tokoh pendidikan nasional.', content: 'Lorem ipsum dolor sit amet...', category: 'Berita', author: 'Admin', date: '2025-12-15', image: '/placeholder.svg', readTime: '5 menit' },
  { id: '2', title: 'Prestasi Membanggakan di Olimpiade Sains Nasional', slug: 'prestasi-osn-2025', excerpt: 'Santri Raudhatussalam berhasil meraih medali emas dan perak di ajang Olimpiade Sains Nasional 2025.', content: 'Lorem ipsum dolor sit amet...', category: 'Prestasi', author: 'Admin', date: '2025-11-20', image: '/placeholder.svg', readTime: '4 menit' },
  { id: '3', title: 'Kunjungan Duta Besar Mesir ke Pesantren', slug: 'kunjungan-dubes-mesir', excerpt: 'Duta Besar Mesir mengapresiasi program pendidikan terpadu dan kemampuan bahasa Arab para santri.', content: 'Lorem ipsum dolor sit amet...', category: 'Berita', author: 'Admin', date: '2025-10-10', image: '/placeholder.svg', readTime: '3 menit' },
  { id: '4', title: 'Tips Sukses Menghafal Al-Quran bagi Pemula', slug: 'tips-menghafal-quran', excerpt: 'Panduan praktis dan metode terbukti untuk memulai perjalanan menghafal Al-Quran dengan istiqamah.', content: 'Lorem ipsum dolor sit amet...', category: 'Artikel', author: 'Ustadz Ahmad', date: '2025-09-05', image: '/placeholder.svg', readTime: '7 menit' },
  { id: '5', title: 'Pembangunan Gedung Baru Tahap II Selesai', slug: 'pembangunan-gedung-baru', excerpt: 'Alhamdulillah, pembangunan gedung asrama putri dan laboratorium komputer telah rampung.', content: 'Lorem ipsum dolor sit amet...', category: 'Berita', author: 'Admin', date: '2025-08-22', image: '/placeholder.svg', readTime: '4 menit' },
  { id: '6', title: 'Juara 1 Pidato Bahasa Arab se-Sumatera', slug: 'juara-pidato-arab', excerpt: 'Santri kelas 5 KMI meraih juara pertama lomba pidato bahasa Arab tingkat Sumatera di Padang.', content: 'Lorem ipsum dolor sit amet...', category: 'Prestasi', author: 'Admin', date: '2025-07-18', image: '/placeholder.svg', readTime: '3 menit' },
];
export const galleryItems: GalleryItem[] = [
  { id: '1', title: 'Shalat Berjamaah di Masjid', category: 'Ibadah', image: '/placeholder.svg', aspectRatio: 'landscape' },
  { id: '2', title: 'Kegiatan Belajar Mengajar', category: 'Akademik', image: '/placeholder.svg', aspectRatio: 'square' },
  { id: '3', title: 'Latihan Pidato 3 Bahasa', category: 'Kegiatan', image: '/placeholder.svg', aspectRatio: 'portrait' },
  { id: '4', title: 'Upacara Bendera', category: 'Kegiatan', image: '/placeholder.svg', aspectRatio: 'landscape' },
  { id: '5', title: 'Pertandingan Olahraga', category: 'Olahraga', image: '/placeholder.svg', aspectRatio: 'square' },
  { id: '6', title: 'Wisuda Angkatan 2025', category: 'Acara', image: '/placeholder.svg', aspectRatio: 'landscape' },
  { id: '7', title: 'Pramuka', category: 'Kegiatan', image: '/placeholder.svg', aspectRatio: 'portrait' },
  { id: '8', title: 'Pencak Silat', category: 'Olahraga', image: '/placeholder.svg', aspectRatio: 'square' },
];
export const dailySchedule: ScheduleItem[] = [
  { time: '04:30', activity: 'Bangun & Persiapan Shalat Subuh', type: 'ibadah' },
  { time: '04:45', activity: 'Shalat Subuh Berjamaah', type: 'ibadah' },
  { time: '05:15', activity: 'Halaqah Al-Quran & Tahfizh', type: 'ibadah' },
  { time: '06:00', activity: 'Mandi, Sarapan & Persiapan', type: 'istirahat' },
  { time: '07:00', activity: 'Kegiatan Belajar Mengajar (KBM)', type: 'akademik' },
  { time: '12:00', activity: 'Shalat Dzuhur Berjamaah', type: 'ibadah' },
  { time: '12:30', activity: 'Makan Siang & Istirahat', type: 'istirahat' },
  { time: '14:00', activity: 'KBM Sesi Siang', type: 'akademik' },
  { time: '15:30', activity: 'Shalat Ashar Berjamaah', type: 'ibadah' },
  { time: '16:00', activity: 'Ekstrakurikuler / Olahraga', type: 'ekstrakurikuler' },
  { time: '17:30', activity: 'Mandi & Persiapan Maghrib', type: 'istirahat' },
  { time: '18:00', activity: 'Shalat Maghrib & Tadarus', type: 'ibadah' },
  { time: '19:15', activity: 'Shalat Isya Berjamaah', type: 'ibadah' },
  { time: '19:45', activity: 'Makan Malam', type: 'istirahat' },
  { time: '20:15', activity: 'Belajar Malam (Mudzakarah)', type: 'akademik' },
  { time: '22:00', activity: 'Istirahat / Tidur', type: 'istirahat' },
];
export const extracurriculars: Extracurricular[] = [
  { id: '1', title: 'Pramuka', description: 'Pembentukan karakter dan jiwa kepemimpinan melalui kegiatan kepanduan.', icon: 'Tent', category: 'Kepemimpinan' },
  { id: '2', title: 'Pidato 3 Bahasa', description: 'Latihan public speaking dalam bahasa Indonesia, Arab, dan Inggris.', icon: 'Mic', category: 'Bahasa' },
  { id: '3', title: 'Pencak Silat', description: 'Seni bela diri tradisional untuk membentuk fisik dan mental yang kuat.', icon: 'Swords', category: 'Olahraga' },
  { id: '4', title: 'Tilawatil Quran', description: 'Seni membaca Al-Quran dengan tartil dan lagu yang merdu.', icon: 'BookOpen', category: 'Keagamaan' },
  { id: '5', title: 'Sepak Bola', description: 'Pembinaan bakat olahraga dan sportivitas melalui sepak bola.', icon: 'Trophy', category: 'Olahraga' },
  { id: '6', title: 'Kaligrafi', description: 'Seni menulis indah huruf Arab sebagai ekspresi keimanan.', icon: 'Pen', category: 'Seni' },
  { id: '7', title: 'Jurnalistik', description: 'Melatih kemampuan menulis dan reportase untuk media pesantren.', icon: 'Newspaper', category: 'Media' },
  { id: '8', title: 'English Club', description: 'Klub bahasa Inggris untuk meningkatkan kemampuan komunikasi global.', icon: 'Globe', category: 'Bahasa' },
];
export const organizationMembers: OrganizationMember[] = [
  { id: '1', name: 'KH. Muhammad Yusuf, Lc., MA', position: 'Pimpinan Pondok', level: 0 },
  { id: '2', name: 'Ust. Abdul Rahman, S.Pd.I', position: 'Wakil Pimpinan', level: 1, parentId: '1' },
  { id: '3', name: 'Ust. Hasan Basri, M.Pd', position: 'Direktur Pendidikan', level: 2, parentId: '2' },
  { id: '4', name: 'Ustdz. Fatimah Zahra, S.Ag', position: 'Direktur Pengasuhan', level: 2, parentId: '2' },
  { id: '5', name: 'Ust. Ahmad Fauzi, S.E', position: 'Direktur Administrasi', level: 2, parentId: '2' },
  { id: '6', name: 'Ust. Rizki Ramadhan, S.Pd', position: 'Kepala MTs', level: 3, parentId: '3' },
  { id: '7', name: 'Ustdz. Nur Aisyah, M.Pd', position: 'Kepala MA', level: 3, parentId: '3' },
  { id: '8', name: 'Ust. Ilham Maulana, S.Pd.I', position: 'Kepala KMI', level: 3, parentId: '3' },
];
export const timeline: TimelineEvent[] = [
  { year: '2008', title: 'Pendirian Pondok Pesantren', description: 'Pondok Pesantren Modern Raudhatussalam didirikan di Tambusai Utara, Rokan Hulu, Riau, oleh para tokoh masyarakat dan ulama setempat.' },
  { year: '2010', title: 'Pembukaan Program MTs', description: 'Program Madrasah Tsanawiyah resmi dibuka dengan 45 santri angkatan pertama.' },
  { year: '2013', title: 'Akreditasi A untuk MTs', description: 'MTs Raudhatussalam meraih akreditasi A dari BAN-S/M sebagai bukti kualitas pendidikan.' },
  { year: '2015', title: 'Pembukaan Program MA & KMI', description: 'Madrasah Aliyah dan program KMI diresmikan untuk melengkapi jenjang pendidikan.' },
  { year: '2018', title: 'Wisuda Angkatan Pertama MA', description: 'Angkatan pertama MA diwisuda dengan 30 alumni yang diterima di PTN ternama.' },
  { year: '2020', title: 'Perluasan Kampus', description: 'Pembangunan gedung baru, asrama putri, dan fasilitas olahraga modern.' },
  { year: '2023', title: 'Program SDIT & MDTA', description: 'Pembukaan jenjang SDIT dan MDTA untuk menjangkau pendidikan Islam sejak usia dini.' },
  { year: '2025', title: 'Menuju Pesantren Digital', description: 'Implementasi sistem informasi terpadu dan e-learning untuk santri dan wali.' },
];
export const registrationRequirements: RegistrationRequirement[] = [
  { id: '1', title: 'Fotokopi Kartu Keluarga', description: '2 lembar yang telah dilegalisir' },
  { id: '2', title: 'Fotokopi Akte Kelahiran', description: '2 lembar yang telah dilegalisir' },
  { id: '3', title: 'Fotokopi Ijazah/SKL', description: '2 lembar ijazah terakhir yang dilegalisir' },
  { id: '4', title: 'Fotokopi Rapor', description: '2 semester terakhir yang dilegalisir' },
  { id: '5', title: 'Pas Foto', description: '3x4 (4 lembar) dan 4x6 (4 lembar) background merah' },
  { id: '6', title: 'Surat Keterangan Sehat', description: 'Dari dokter/puskesmas setempat' },
  { id: '7', title: 'Surat Keterangan Berkelakuan Baik', description: 'Dari sekolah asal' },
];
export const registrationFees: RegistrationFee[] = [
  { item: 'Biaya Pendaftaran', amount: 'Rp 350.000' },
  { item: 'Biaya Masuk (Infaq Pembangunan)', amount: 'Rp 5.500.000' },
  { item: 'SPP Bulanan', amount: 'Rp 1.200.000' },
  { item: 'Seragam Lengkap (3 stel)', amount: 'Rp 1.500.000' },
  { item: 'Kitab & Buku Pelajaran', amount: 'Rp 850.000' },
  { item: 'Perlengkapan Asrama', amount: 'Rp 750.000' },
];
export const contactInfo: ContactInfo = {
  address: 'Jl. Lintas Mahato, Desa Mahato, Kec. Tambusai Utara, Kab. Rokan Hulu, Riau 28557',
  phone: '(0762) 7123456',
  email: 'info@raudhatussalam.sch.id',
  whatsapp: '6281234567890',
  maps: 'https://maps.google.com',
  socialMedia: {
    instagram: '@raudhatussalam_official',
    facebook: 'PesantrenRaudhatussalam',
    youtube: 'Raudhatussalam Channel',
  },
};
export const testimonials: Testimonial[] = [
  { id: '1', name: 'H. Syamsul Bahri', role: 'Wali Santri Angkatan 2020', content: 'Alhamdulillah, anak saya berkembang pesat di Raudhatussalam. Tidak hanya ilmu agama, tapi juga karakter dan kemandirian yang luar biasa.', avatar: '/placeholder.svg' },
  { id: '2', name: 'Dr. Nurul Hidayah, M.Pd', role: 'Alumni Angkatan 2018', content: 'Pendidikan di pesantren ini membentuk saya menjadi pribadi yang tangguh. Sekarang saya bisa melanjutkan S3 di Universitas Al-Azhar, Mesir.', avatar: '/placeholder.svg' },
  { id: '3', name: 'Ir. Rudi Hartono', role: 'Wali Santri Angkatan 2022', content: 'Fasilitas yang lengkap dan guru-guru yang berkualitas membuat kami yakin menitipkan anak di pesantren ini. Sangat recommended!', avatar: '/placeholder.svg' },
];
export const statistics: Statistic[] = [
  { label: 'Santri Aktif', value: '850+', icon: 'Users' },
  { label: 'Tenaga Pengajar', value: '75+', icon: 'GraduationCap' },
  { label: 'Alumni', value: '1.200+', icon: 'Award' },
  { label: 'Tahun Berdiri', value: '17+', icon: 'Calendar' },
];
export const notifications: Notification[] = [
  { id: '1', title: 'Dokumen Diterima', message: 'Dokumen akte kelahiran Anda telah diverifikasi dan diterima.', date: '2026-02-13', read: false, type: 'success' },
  { id: '2', title: 'Jadwal Tes Masuk', message: 'Tes masuk dijadwalkan pada 20 Maret 2026 pukul 08:00 WIB.', date: '2026-02-12', read: false, type: 'info' },
  { id: '3', title: 'Pembayaran Tertunda', message: 'Biaya pendaftaran belum diterima. Harap selesaikan sebelum 28 Februari.', date: '2026-02-10', read: true, type: 'warning' },
  { id: '4', title: 'Selamat Bergabung!', message: 'Akun portal santri Anda telah aktif. Silakan lengkapi profil Anda.', date: '2026-02-08', read: true, type: 'info' },
  { id: '5', title: 'Update Kurikulum', message: 'Kurikulum semester genap 2026 telah dipublikasikan.', date: '2026-02-05', read: true, type: 'info' },
];
export const registrationStatus: RegistrationStatus = {
  currentStep: 2,
  steps: [
    { label: 'Pendaftaran Dibuat', status: 'done', date: '5 Feb 2026' },
    { label: 'Dokumen Disubmit', status: 'done', date: '8 Feb 2026' },
    { label: 'Verifikasi Berkas', status: 'current' },
    { label: 'Tes Masuk', status: 'upcoming' },
    { label: 'Pengumuman', status: 'upcoming' },
    { label: 'Daftar Ulang', status: 'upcoming' },
  ],
  summary: [
    { label: 'Nama Santri', value: 'Ahmad Fauzan' },
    { label: 'Program', value: 'MTs (Madrasah Tsanawiyah)' },
    { label: 'Tahun Ajaran', value: '2026/2027' },
    { label: 'No. Pendaftaran', value: 'RDS-2026-0142' },
    { label: 'Asal Sekolah', value: 'SDN 01 Tambusai Utara' },
  ],
};
export const weeklySchedule: SantriScheduleItem[] = [
  { time: '07:00 - 08:30', activity: 'Matematika', type: 'akademik', day: 'Senin' },
  { time: '08:30 - 10:00', activity: 'Bahasa Arab', type: 'akademik', day: 'Senin' },
  { time: '10:15 - 11:45', activity: 'Fiqih', type: 'akademik', day: 'Senin' },
  { time: '14:00 - 15:30', activity: 'IPA', type: 'akademik', day: 'Senin' },
  { time: '16:00 - 17:00', activity: 'Pramuka', type: 'ekstrakurikuler', day: 'Senin' },
  { time: '07:00 - 08:30', activity: 'Bahasa Inggris', type: 'akademik', day: 'Selasa' },
  { time: '08:30 - 10:00', activity: 'Tahfizh Al-Quran', type: 'ibadah', day: 'Selasa' },
  { time: '10:15 - 11:45', activity: 'Bahasa Indonesia', type: 'akademik', day: 'Selasa' },
  { time: '14:00 - 15:30', activity: 'IPS', type: 'akademik', day: 'Selasa' },
  { time: '16:00 - 17:00', activity: 'Pencak Silat', type: 'ekstrakurikuler', day: 'Selasa' },
  { time: '07:00 - 08:30', activity: 'Aqidah Akhlak', type: 'akademik', day: 'Rabu' },
  { time: '08:30 - 10:00', activity: 'Matematika', type: 'akademik', day: 'Rabu' },
  { time: '10:15 - 11:45', activity: 'Bahasa Arab', type: 'akademik', day: 'Rabu' },
  { time: '14:00 - 15:30', activity: 'Seni Budaya', type: 'akademik', day: 'Rabu' },
  { time: '16:00 - 17:00', activity: 'Tilawah', type: 'ibadah', day: 'Rabu' },
  { time: '07:00 - 08:30', activity: 'Hadits', type: 'akademik', day: 'Kamis' },
  { time: '08:30 - 10:00', activity: 'IPA', type: 'akademik', day: 'Kamis' },
  { time: '10:15 - 11:45', activity: 'Bahasa Inggris', type: 'akademik', day: 'Kamis' },
  { time: '14:00 - 15:30', activity: 'PKn', type: 'akademik', day: 'Kamis' },
  { time: '16:00 - 17:00', activity: 'Sepak Bola', type: 'ekstrakurikuler', day: 'Kamis' },
  { time: '07:00 - 08:30', activity: 'Tafsir', type: 'akademik', day: 'Jumat' },
  { time: '08:30 - 10:00', activity: 'Nahwu Sharaf', type: 'akademik', day: 'Jumat' },
  { time: '14:00 - 15:30', activity: 'Muhadharah', type: 'ekstrakurikuler', day: 'Jumat' },
  { time: '07:00 - 08:30', activity: 'Pidato 3 Bahasa', type: 'ekstrakurikuler', day: 'Sabtu' },
  { time: '08:30 - 10:00', activity: 'Kaligrafi', type: 'ekstrakurikuler', day: 'Sabtu' },
  { time: '10:15 - 11:45', activity: 'English Club', type: 'ekstrakurikuler', day: 'Sabtu' },
];