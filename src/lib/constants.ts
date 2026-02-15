import { NavItem } from '@/types';
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
  {
    label: 'Pendaftaran', href: '/pendaftaran',
    children: [
      { label: 'Informasi Pendaftaran', href: '/pendaftaran' },
      { label: 'Alur Pendaftaran', href: '/alur-pendaftaran' },
    ],
  },
  { label: 'Kontak', href: '/kontak' },
];