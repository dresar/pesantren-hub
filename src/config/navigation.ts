import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  FileText,
  Settings,
  Building2,
  ImageIcon,
  MessageSquare,
  HelpCircle,
  Bell,
  Calendar,
  BookOpen,
  Award,
  Newspaper,
  Megaphone,
  UserCheck,
  Wallet,
  Globe,
  Sparkles,
  FileCode,
  Tag,
  FolderOpen,
  Phone,
  Share2,
  DollarSign,
  Shirt,
  BarChart3,
  Clock,
  Home,
  type LucideIcon,
} from 'lucide-react';
export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  children?: NavItem[];
  disabled?: boolean;
  roles?: string[]; 
}
export interface NavSection {
  title: string;
  items: NavItem[];
  icon?: LucideIcon;
  roles?: string[]; 
}
export const santriNavigation: NavSection[] = [
  {
    title: 'Santri',
    items: [
      {
        title: 'Dashboard',
        href: '/santri/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Form Pendaftaran',
        href: '/app/form-pendaftaran',
        icon: FileText,
      },
      {
        title: 'Status Pendaftaran',
        href: '/app/status',
        icon: Clock,
      },
      {
        title: 'Pembayaran',
        href: '/app/pembayaran',
        icon: CreditCard,
      },
      {
        title: 'Jadwal Pelajaran',
        href: '/app/jadwal',
        icon: BookOpen,
      },
      {
        title: 'Jadwal Ujian',
        href: '/app/jadwal-ujian',
        icon: Calendar,
      },
      {
        title: 'Notifikasi',
        href: '/app/notifikasi',
        icon: Bell,
      },
      {
        title: 'Pengaturan',
        href: '/app/pengaturan',
        icon: Settings,
      },
    ],
  },
];
export const navigationConfig: NavSection[] = [
  {
    title: 'Overview',
    icon: LayoutDashboard,
    roles: ['admin', 'superadmin', 'staff'],
    items: [
      {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Dashboard Keuangan',
        href: '/admin/financial-dashboard',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Manajemen Santri',
    icon: Users,
    roles: ['admin', 'superadmin', 'staff', 'petugaspendaftaran'],
    items: [
      {
        title: 'Daftar Santri',
        href: '/admin/admissions',
        icon: Users,
      },
      {
        title: 'List Dokumen Santri',
        href: '/admin/admissions/documents',
        icon: FileText,
      },
      {
        title: 'Jadwal Seleksi',
        href: '/admin/admissions/schedules',
        icon: Calendar,
      },
      {
        title: 'Hasil Seleksi',
        href: '/admin/admissions/results',
        icon: Award,
      },
      {
        title: 'Pengaturan Akun User',
        href: '/admin/users',
        icon: UserCheck,
      },
    ],
  },
  {
    title: 'Keuangan',
    icon: Wallet,
    roles: ['admin', 'superadmin', 'bendahara'],
    items: [
      {
        title: 'Pembayaran',
        href: '/admin/payments',
        icon: CreditCard,
      },
    ],
  },
  {
    title: 'Konten Website',
    icon: Globe,
    roles: ['admin', 'superadmin'],
    items: [
      {
        title: 'Blog & Artikel',
        href: '/admin/blog/posts',
        icon: Newspaper,
      },
      {
        title: 'Kategori',
        href: '/admin/blog/categories',
        icon: FolderOpen,
      },
      {
        title: 'Tag',
        href: '/admin/blog/tags',
        icon: Tag,
      },
      {
        title: 'Pengumuman',
        href: '/admin/announcements',
        icon: Megaphone,
      },
      {
        title: 'Testimoni',
        href: '/admin/testimonials',
        icon: MessageSquare,
      },
    ],
  },
  {
    title: 'Website',
    icon: Settings,
    roles: ['admin', 'superadmin'],
    items: [
      {
        title: 'Halaman Depan',
        href: '/admin/home-settings',
        icon: Home,
      },
      {
        title: 'Pengaturan',
        href: '/admin/website-settings',
        icon: Globe,
      },
      {
        title: 'Alur Pendaftaran',
        href: '/admin/registration-flow',
        icon: Clock,
      },
      {
        title: 'Hero Section',
        href: '/admin/hero-sections',
        icon: Sparkles,
      },
      {
        title: 'Visi & Misi',
        href: '/admin/vision-mission',
        icon: Award,
      },
      {
        title: 'Sejarah',
        href: '/admin/history',
        icon: BookOpen,
      },
      {
        title: 'Pendiri & Pengasuh',
        href: '/admin/website/founders',
        icon: Users,
      },
      {
        title: 'Program',
        href: '/admin/programs',
        icon: Calendar,
      },
      {
        title: 'Pendidikan',
        href: '/admin/education',
        icon: GraduationCap,
      },
      {
        title: 'Fasilitas',
        href: '/admin/facilities',
        icon: Building2,
      },
      {
        title: 'Ekstrakurikuler',
        href: '/admin/extracurricular',
        icon: Award,
      },
      {
        title: 'Jadwal Harian',
        href: '/admin/daily-schedule',
        icon: Clock,
      },
      {
        title: 'Biaya Pendidikan',
        href: '/admin/tuition-fees',
        icon: DollarSign,
      },
      {
        title: 'Seragam',
        href: '/admin/uniforms',
        icon: Shirt,
      },
      {
        title: 'Statistik',
        href: '/admin/statistics',
        icon: BarChart3,
      },
      {
        title: 'FAQ',
        href: '/admin/faq',
        icon: HelpCircle,
      },
    ],
  },
  {
    title: 'SDM',
    icon: UserCheck,
    roles: ['admin', 'superadmin'],
    items: [
      {
        title: 'Tenaga Pengajar',
        href: '/admin/teachers',
        icon: UserCheck,
      },
      {
        title: 'Jabatan',
        href: '/admin/positions',
        icon: Award,
      },
    ],
  },
  {
    title: 'Media',
    icon: ImageIcon,
    roles: ['admin', 'superadmin'],
    items: [
      {
        title: 'Galeri',
        href: '/admin/gallery',
        icon: ImageIcon,
      },
      {
        title: 'Dokumentasi',
        href: '/admin/documentation',
        icon: FolderOpen,
      },
      {
        title: 'File Manager',
        href: '/admin/files',
        icon: FolderOpen,
      },
    ],
  },
  {
    title: 'Komunikasi',
    icon: MessageSquare,
    roles: ['admin', 'superadmin'],
    items: [
      {
        title: 'Kontak Masuk',
        href: '/admin/contacts',
        icon: MessageSquare,
      },
      {
        title: 'Contact Person',
        href: '/admin/contact-persons',
        icon: Phone,
      },
      {
        title: 'Sosial Media',
        href: '/admin/social-media',
        icon: Share2,
      },
      {
        title: 'Template WhatsApp',
        href: '/admin/whatsapp-templates',
        icon: MessageSquare,
      },
    ],
  },
  {
    title: 'Dokumen',
    icon: FileCode,
    roles: ['admin', 'superadmin'],
    items: [
      {
        title: 'Template Surat',
        href: '/admin/document-templates',
        icon: FileCode,
      },
    ],
  },
  {
    title: 'Sistem',
    icon: Settings,
    roles: ['admin', 'superadmin'],
    items: [
      {
        title: 'Profil Saya',
        href: '/admin/profile',
        icon: UserCheck,
      },
      {
        title: 'Pengguna',
        href: '/admin/users',
        icon: Users,
      },
      {
        title: 'Pengaturan',
        href: '/admin/settings',
        icon: Settings,
      },
    ],
  },
];
export const flattenedNav = navigationConfig.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    section: section.title,
  }))
);