// ============================================
// NAVIGATION CONFIGURATION
// ============================================

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
  FolderOpen,
  Phone,
  Share2,
  DollarSign,
  Shirt,
  BarChart3,
  Clock,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  children?: NavItem[];
  disabled?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigationConfig: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'Penerimaan Santri',
    items: [
      {
        title: 'Pendaftaran',
        href: '/admissions',
        icon: GraduationCap,
        badge: 156,
      },
      {
        title: 'Pembayaran',
        href: '/payments',
        icon: CreditCard,
      },
      {
        title: 'Rekening Bank',
        href: '/bank-accounts',
        icon: Wallet,
      },
    ],
  },
  {
    title: 'Konten',
    items: [
      {
        title: 'Blog',
        href: '/blog',
        icon: Newspaper,
      },
      {
        title: 'Kategori',
        href: '/categories',
        icon: FolderOpen,
      },
      {
        title: 'Pengumuman',
        href: '/announcements',
        icon: Megaphone,
      },
      {
        title: 'Testimoni',
        href: '/testimonials',
        icon: MessageSquare,
      },
    ],
  },
  {
    title: 'Website',
    items: [
      {
        title: 'Pengaturan',
        href: '/website-settings',
        icon: Globe,
      },
      {
        title: 'Hero Section',
        href: '/hero-sections',
        icon: Sparkles,
      },
      {
        title: 'Visi & Misi',
        href: '/vision-mission',
        icon: Award,
      },
      {
        title: 'Sejarah',
        href: '/history',
        icon: BookOpen,
      },
      {
        title: 'Program',
        href: '/programs',
        icon: Calendar,
      },
      {
        title: 'Pendidikan',
        href: '/education',
        icon: GraduationCap,
      },
      {
        title: 'Fasilitas',
        href: '/facilities',
        icon: Building2,
      },
      {
        title: 'Ekstrakurikuler',
        href: '/extracurricular',
        icon: Award,
      },
      {
        title: 'Jadwal Harian',
        href: '/daily-schedule',
        icon: Clock,
      },
      {
        title: 'Biaya Pendidikan',
        href: '/tuition-fees',
        icon: DollarSign,
      },
      {
        title: 'Seragam',
        href: '/uniforms',
        icon: Shirt,
      },
      {
        title: 'Statistik',
        href: '/statistics',
        icon: BarChart3,
      },
      {
        title: 'FAQ',
        href: '/faq',
        icon: HelpCircle,
      },
    ],
  },
  {
    title: 'SDM',
    items: [
      {
        title: 'Tenaga Pengajar',
        href: '/teachers',
        icon: UserCheck,
      },
      {
        title: 'Jabatan',
        href: '/positions',
        icon: Award,
      },
    ],
  },
  {
    title: 'Media',
    items: [
      {
        title: 'Galeri',
        href: '/gallery',
        icon: ImageIcon,
      },
      {
        title: 'Dokumentasi',
        href: '/documentation',
        icon: FolderOpen,
      },
      {
        title: 'File Manager',
        href: '/files',
        icon: FolderOpen,
      },
    ],
  },
  {
    title: 'Komunikasi',
    items: [
      {
        title: 'Kontak Masuk',
        href: '/contacts',
        icon: MessageSquare,
        badge: 12,
      },
      {
        title: 'Contact Person',
        href: '/contact-persons',
        icon: Phone,
      },
      {
        title: 'Sosial Media',
        href: '/social-media',
        icon: Share2,
      },
      {
        title: 'Template WhatsApp',
        href: '/whatsapp-templates',
        icon: MessageSquare,
      },
    ],
  },
  {
    title: 'Dokumen',
    items: [
      {
        title: 'Template Surat',
        href: '/document-templates',
        icon: FileCode,
      },
    ],
  },
  {
    title: 'Sistem',
    items: [
      {
        title: 'Pengguna',
        href: '/users',
        icon: Users,
      },
      {
        title: 'Pengaturan',
        href: '/settings',
        icon: Settings,
      },
    ],
  },
];

// Flatten navigation for search
export const flattenedNav = navigationConfig.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    section: section.title,
  }))
);
