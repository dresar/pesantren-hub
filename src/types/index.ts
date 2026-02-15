export interface WebsiteSettings {
  namaPondok?: string;
  arabicName?: string;
  alamat?: string;
  logo?: string;
  noTelepon?: string;
  email?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroTagline?: string;
  heroCtaPrimaryText?: string;
  heroCtaPrimaryLink?: string;
  heroCtaSecondaryText?: string;
  heroCtaSecondaryLink?: string;
  googleMapsEmbedCode?: string;
  qrCodeImage?: string;
  deskripsi?: string;
  favicon?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  headerMobileImage?: string;
  headerMobileHeight?: number;
  maintenanceMessage?: string;
  maintenanceMode?: boolean;
  announcementText?: string;
  announcementLink?: string;
  announcementActive?: boolean;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  lokasiPendaftaran?: string;
  googleMapsLink?: string;
}
export interface FaqItem {
  id: number;
  pertanyaan: string;
  jawaban: string;
  kategori: string;
  order: number;
  isPublished: boolean;
}
export interface SeragamItem {
  id: number;
  hari: string;
  seragamPutra: string;
  gambarPutra?: string;
  seragamPutri: string;
  gambarPutri?: string;
  order: number;
}
export interface RegistrationFlowItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}