// ============================================
// PESANTREN ADMIN PANEL - TYPE DEFINITIONS
// ============================================

// Base Types
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

// User Types
export type UserRole = 'admin' | 'staff' | 'teacher' | 'operator';

export interface User extends BaseEntity {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login?: string;
  date_joined: string;
}

export interface LoginHistory extends BaseEntity {
  user_id?: string;
  username: string;
  ip_address?: string;
  user_agent: string;
  status: 'success' | 'failed';
  error_message?: string;
}

// Santri (Student) Types
export type SantriStatus = 'pending' | 'verified' | 'accepted' | 'rejected';
export type Gender = 'L' | 'P';

export interface Santri extends BaseEntity {
  // Personal Data
  nama_lengkap: string;
  nama_panggilan: string;
  nisn: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: Gender;
  agama: string;
  kewarganegaraan: string;
  anak_ke?: number;
  jumlah_saudara?: number;
  bahasa_sehari_hari: string;
  golongan_darah: string;
  tinggi_badan?: number;
  berat_badan?: number;
  riwayat_penyakit?: string;
  tinggal_dengan: string;

  // Parent Data - Father
  nama_ayah: string;
  nik_ayah: string;
  tempat_lahir_ayah: string;
  tanggal_lahir_ayah?: string;
  agama_ayah: string;
  kewarganegaraan_ayah: string;
  pendidikan_ayah: string;
  pekerjaan_ayah: string;
  no_hp_ayah: string;
  status_ayah: string;

  // Parent Data - Mother
  nama_ibu: string;
  nik_ibu: string;
  tempat_lahir_ibu: string;
  tanggal_lahir_ibu?: string;
  agama_ibu: string;
  kewarganegaraan_ibu: string;
  pendidikan_ibu: string;
  pekerjaan_ibu: string;
  no_hp_ibu: string;
  status_ibu: string;

  // Address
  alamat_orangtua: string;
  alamat: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kode_pos: string;
  no_hp: string;
  email: string;

  // School Origin
  asal_sekolah: string;
  npsn_sekolah: string;
  kelas_terakhir: string;
  tahun_lulus: string;
  no_ijazah: string;

  // Admission
  kelas_diterima?: string;
  tanggal_diterima?: string;
  status: SantriStatus;
  catatan?: string;

  // Documents
  foto_santri?: string;
  foto_ktp?: string;
  foto_akta?: string;
  foto_ijazah?: string;
  surat_sehat?: string;
  foto_santri_approved: boolean;
  foto_ktp_approved: boolean;
  foto_akta_approved: boolean;
  foto_ijazah_approved: boolean;
  surat_sehat_approved: boolean;
}

// Payment Types
export type PaymentStatus = 'pending' | 'verified' | 'rejected';

export interface BankAccount extends BaseEntity {
  nama_bank: string;
  nama_bank_custom?: string;
  nomor_rekening: string;
  nama_pemilik_rekening: string;
  biaya_pendaftaran: number;
  is_active: boolean;
  keterangan?: string;
  order: number;
}

export interface Payment extends BaseEntity {
  santri_id: string;
  santri?: Santri;
  bank_pengirim: string;
  no_rekening_pengirim: string;
  nama_pemilik_rekening: string;
  rekening_tujuan: string;
  jumlah_transfer: number;
  bukti_transfer?: string;
  status: PaymentStatus;
  catatan?: string;
  verified_by_id?: string;
  verified_at?: string;
}

// Blog Types
export type PostStatus = 'draft' | 'published' | 'archived';

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  order: number;
}

export interface Tag extends BaseEntity {
  name: string;
  slug: string;
  order: number;
}

export interface BlogPost extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  video_file?: string;
  author_id: string;
  author?: User;
  category_id?: string;
  category?: Category;
  tags?: Tag[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  status: PostStatus;
  is_featured: boolean;
  published_at?: string;
  views_count: number;
  likes_count: number;
  shares_count: number;
}

export interface Testimonial extends BaseEntity {
  nama: string;
  foto?: string;
  jabatan: string;
  testimoni: string;
  rating: number;
  is_published: boolean;
  order: number;
}

export interface Announcement extends BaseEntity {
  judul: string;
  slug: string;
  konten: string;
  gambar?: string;
  status: PostStatus;
  is_penting: boolean;
  published_at?: string;
  meta_title: string;
  meta_description: string;
}

// Website Content Types
export interface WebsiteSettings extends BaseEntity {
  nama_pondok: string;
  arabic_name: string;
  alamat: string;
  logo?: string;
  favicon?: string;
  header_mobile_image?: string;
  header_mobile_height: number;
  no_telepon: string;
  email: string;
  website: string;
  facebook: string;
  instagram: string;
  twitter: string;
  tiktok: string;
  hero_title: string;
  hero_subtitle: string;
  hero_tagline: string;
  hero_cta_primary_text: string;
  hero_cta_primary_link: string;
  hero_cta_secondary_text: string;
  hero_cta_secondary_link: string;
  lokasi_pendaftaran: string;
  google_maps_link: string;
  google_maps_embed_code: string;
  qr_code_image?: string;
  deskripsi: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  maintenance_mode: boolean;
  maintenance_message: string;
}

export interface VisiMisi extends BaseEntity {
  visi: string;
  misi: string;
}

export interface SejarahTimeline extends BaseEntity {
  judul: string;
  icon: string;
  deskripsi: string;
  order: number;
}

export interface Program extends BaseEntity {
  nama: string;
  slug: string;
  deskripsi: string;
  gambar?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  status: string;
  is_featured: boolean;
  meta_title: string;
  meta_description: string;
  order: number;
}

export interface ProgramPendidikan extends BaseEntity {
  nama: string;
  akreditasi: string;
  icon: string;
  gambar?: string;
  order: number;
}

export interface Fasilitas extends BaseEntity {
  nama: string;
  icon: string;
  gambar?: string;
  order: number;
}

export interface Ekstrakurikuler extends BaseEntity {
  nama: string;
  icon: string;
  order: number;
}

export interface JadwalHarian extends BaseEntity {
  waktu: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  order: number;
}

export interface BiayaPendidikan extends BaseEntity {
  tipe: string;
  nama: string;
  jumlah: number;
  keterangan: string;
  order: number;
}

export interface Seragam extends BaseEntity {
  hari: string;
  kategori: string;
  seragam_putra: string;
  seragam_putri: string;
  seragam: string;
  order: number;
}

export interface TenagaPengajar extends BaseEntity {
  nama_lengkap: string;
  nama_panggilan: string;
  jenis_kelamin: Gender;
  foto?: string;
  tempat_lahir: string;
  tanggal_lahir?: string;
  alamat: string;
  no_hp: string;
  email: string;
  pendidikan_terakhir: string;
  universitas: string;
  tahun_lulus: string;
  bidang_keahlian: string;
  mata_pelajaran: string;
  pengalaman_mengajar: string;
  prestasi: string;
  riwayat_pendidikan: string;
  organisasi: string;
  karya_tulis: string;
  motto: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  bagian_jabatan_id?: string;
  bagian_jabatan?: BagianJabatan;
  order: number;
  is_published: boolean;
  is_featured: boolean;
}

export interface BagianJabatan extends BaseEntity {
  nama: string;
  deskripsi: string;
  order: number;
  is_active: boolean;
}

export interface FAQ extends BaseEntity {
  pertanyaan: string;
  jawaban: string;
  kategori: string;
  order: number;
  is_published: boolean;
}

export interface Statistik extends BaseEntity {
  judul: string;
  nilai: string;
  icon: string;
  deskripsi: string;
  warna: string;
  order: number;
  is_published: boolean;
}

export interface Media extends BaseEntity {
  tipe: 'image' | 'video';
  judul: string;
  sub_judul: string;
  gambar?: string;
  video_file?: string;
  featured_image?: string;
  order: number;
  is_published: boolean;
}

export interface Dokumentasi extends BaseEntity {
  judul: string;
  deskripsi: string;
  kategori: string;
  tanggal_kegiatan?: string;
  lokasi: string;
  order: number;
  is_published: boolean;
}

export interface HeroSection extends BaseEntity {
  title: string;
  subtitle: string;
  image?: string;
  order: number;
  is_active: boolean;
}

export interface ContactPerson extends BaseEntity {
  nama: string;
  foto?: string;
  no_hp: string;
  order: number;
  is_active: boolean;
}

export interface SocialMedia extends BaseEntity {
  platform: string;
  username: string;
  url: string;
  order: number;
  is_active: boolean;
}

export interface Kontak extends BaseEntity {
  nama: string;
  email: string;
  no_hp: string;
  subjek: string;
  pesan: string;
  status: 'unread' | 'read' | 'replied';
  balasan?: string;
}

export interface InformasiTambahan extends BaseEntity {
  judul: string;
  deskripsi: string;
  icon: string;
  warna: string;
  order: number;
  is_published: boolean;
}

export interface WhatsAppTemplateKategori extends BaseEntity {
  nama: string;
  slug: string;
  deskripsi: string;
  order: number;
  is_active: boolean;
}

export interface WhatsAppTemplate extends BaseEntity {
  nama: string;
  tipe: string;
  pesan: string;
  variabel: string;
  kategori_id?: string;
  kategori?: WhatsAppTemplateKategori;
  order: number;
}

// Document Template Types
export interface DocumentTemplate extends BaseEntity {
  nama: string;
  slug: string;
  deskripsi: string;
  html_template: string;
  css_template: string;
  ukuran_kertas: string;
  orientasi: 'portrait' | 'landscape';
  margin_top: string;
  margin_right: string;
  margin_bottom: string;
  margin_left: string;
  is_active: boolean;
  order: number;
}

// Dashboard Analytics Types
export interface DashboardStats {
  totalStudents: number;
  paymentsVerified: number;
  pendingRegistrations: number;
  blogPosts: number;
  activeTeachers: number;
  totalRevenue: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface RecentActivity {
  id: string;
  type: 'registration' | 'payment' | 'post' | 'announcement';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

// Table Types
export interface TableMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface TableFilter {
  field: string;
  value: string | number | boolean;
  operator?: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'like' | 'in';
}

export interface TableSort {
  field: string;
  direction: 'asc' | 'desc';
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file' | 'richtext';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
  disabled?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
