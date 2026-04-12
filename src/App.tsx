import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner, toast as notify } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { AdminLayout } from "@/components/layout";
import { ConfirmDialog, TableSkeleton } from "@/components/common";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SantriProtectedRoute from "@/components/auth/SantriProtectedRoute";
import AuthorProtectedRoute from "@/components/auth/AuthorProtectedRoute";
import DataPrefetcher from "@/components/common/DataPrefetcher";
import ThemeProvider from "@/components/ThemeProvider";
import { api } from "@/lib/api";
import MainLayout from "@/layouts/MainLayout";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AdminDashboardPage from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import GenericResourcePage from "./pages/GenericResourcePage";
const GenericResourceFormPage = lazy(() => import("./pages/GenericResourceFormPage"));
const GenericAIGeneratorPage = lazy(() => import("./pages/ai/GenericAIGeneratorPage"));
const Home = lazy(() => import("./pages/Home"));
const Sejarah = lazy(() => import("./pages/Sejarah"));
const ProfilKami = lazy(() => import("./pages/ProfilKami"));
const VisiMisi = lazy(() => import("./pages/VisiMisi"));
const Organisasi = lazy(() => import("./pages/Organisasi"));
const OrganisasiListPage = lazy(() => import("./pages/website/organisasi/OrganisasiListPage"));
const OrganisasiFormPage = lazy(() => import("./pages/website/organisasi/OrganisasiFormPage"));
const PublicProgramPage = lazy(() => import("./pages/ProgramPage"));
const ProgramDetail = lazy(() => import("./pages/ProgramDetail"));
const FasilitasPage = lazy(() => import("./pages/FasilitasPage"));
const FasilitasDetail = lazy(() => import("./pages/FasilitasDetail"));
const JadwalPage = lazy(() => import("./pages/JadwalPage"));
const EkstrakurikulerPage = lazy(() => import("./pages/EkstrakurikulerPage"));
const GaleriPage = lazy(() => import("./pages/GaleriPage"));
const PublicBlogPage = lazy(() => import("./pages/BlogPage"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const KontakPage = lazy(() => import("./pages/KontakPage"));
const PendaftaranPage = lazy(() => import("./pages/PendaftaranPage"));
const AlurPendaftaranPage = lazy(() => import("./pages/website/AlurPendaftaranPage"));
const DailySchedulePage = lazy(() => import("./pages/website/DailySchedulePage")); // Fixed route
const DailyScheduleFormPage = lazy(() => import("./pages/website/DailyScheduleFormPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const DataSyncPage = lazy(() => import("./pages/auth/DataSyncPage"));
const UserDashboardPage = lazy(() => import("./pages/DashboardPage"));
const FormPendaftaranPage = lazy(() => import("./pages/FormPendaftaranPage"));
const StatusPendaftaranPage = lazy(() => import("./pages/StatusPendaftaranPage"));
const UserSchedulePage = lazy(() => import("./pages/admissions/UserSchedulePage"));
const JadwalSantriPage = lazy(() => import("./pages/JadwalSantriPage"));
const NotifikasiPage = lazy(() => import("./pages/NotifikasiPage"));
const PengaturanPage = lazy(() => import("./pages/PengaturanPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const AdmissionsPage = lazy(() => import("./pages/admissions/AdmissionsPage"));
const SantriFormPage = lazy(() => import("./pages/admissions/SantriFormPage"));
const SantriDetailPage = lazy(() => import("./pages/admissions/SantriDetailPage"));
const SantriDocumentsPage = lazy(() => import("./pages/admissions/SantriDocumentsPage"));
const ExamSchedulesPage = lazy(() => import("./pages/admissions/ExamSchedulesPage"));
const ExamScheduleFormPage = lazy(() => import("./pages/admissions/ExamScheduleFormPage"));
const ExamResultsPage = lazy(() => import("./pages/admissions/ExamResultsPage"));
const ExamResultFormPage = lazy(() => import("./pages/admissions/ExamResultFormPage"));
const UsersPage = lazy(() => import("./pages/users/UsersPage"));
const ProfilePage = lazy(() => import("./pages/users/ProfilePage"));
const PaymentsPage = lazy(() => import("./pages/payments/PaymentsPage"));
const PaymentDetailPage = lazy(() => import("./pages/payments/PaymentDetailPage"));
const FinancialDashboard = lazy(() => import("./pages/financial/FinancialDashboard"));
const BlogEditorPage = lazy(() => import("./pages/blog/BlogEditorPage"));
const BlogAIGeneratorPage = lazy(() => import("./pages/blog/BlogAIGeneratorPage"));
const VisiMisiPage = lazy(() => import("./pages/website/visimisi/VisiMisiPage"));
const HeroListPage = lazy(() => import("./pages/website/hero/HeroListPage"));
const HeroFormPage = lazy(() => import("./pages/website/hero/HeroFormPage"));
const ProgramListPage = lazy(() => import("./pages/website/programs/ProgramListPage"));
const ProgramFormPage = lazy(() => import("./pages/website/programs/ProgramFormPage"));
const HistoryListPage = lazy(() => import("./pages/website/history/HistoryListPage"));
const HistoryFormPage = lazy(() => import("./pages/website/history/HistoryFormPage"));
const FounderListPage = lazy(() => import("./pages/website/founders/FounderListPage"));
const FounderFormPage = lazy(() => import("./pages/website/founders/FounderFormPage"));
const FacilitiesListPage = lazy(() => import("./pages/website/facilities/FacilitiesListPage"));
const FacilitiesFormPage = lazy(() => import("./pages/website/facilities/FacilitiesFormPage"));
const EducationListPage = lazy(() => import("./pages/website/education/EducationListPage"));
const EducationFormPage = lazy(() => import("./pages/website/education/EducationFormPage"));
const WebsiteSettingsPage = lazy(() => import("./pages/website/settings/WebsiteSettingsPage"));
const UniformListPage = lazy(() => import("./pages/website/uniforms/UniformListPage"));
const HomePageManager = lazy(() => import("./pages/website/home/HomePageManager"));
const FormConfigPage = lazy(() => import("./pages/website/settings/FormConfigPage"));
const AnnouncementListPage = lazy(() => import("./pages/blog/announcements/AnnouncementListPage"));
const AnnouncementFormPage = lazy(() => import("./pages/blog/announcements/AnnouncementFormPage"));
const TestimonialListPage = lazy(() => import("./pages/blog/testimonials/TestimonialListPage"));
const TestimonialFormPage = lazy(() => import("./pages/blog/testimonials/TestimonialFormPage"));
const CategoryListPage = lazy(() => import("./pages/blog/categories/CategoryListPage"));
const CategoryFormPage = lazy(() => import("./pages/blog/categories/CategoryFormPage"));
const TagListPage = lazy(() => import("./pages/blog/tags/TagListPage"));
const TagFormPage = lazy(() => import("./pages/blog/tags/TagFormPage"));
const TeacherListPage = lazy(() => import("./pages/hr/teachers/TeacherListPage"));
const TeacherFormPage = lazy(() => import("./pages/hr/teachers/TeacherFormPage"));
const GalleryListPage = lazy(() => import("./pages/media/gallery/GalleryListPage"));
const GalleryFormPage = lazy(() => import("./pages/media/gallery/GalleryFormPage"));
const DocumentationListPage = lazy(() => import("./pages/media/documentation/DocumentationListPage"));
const DocumentationFormPage = lazy(() => import("./pages/media/documentation/DocumentationFormPage"));
const MediaDashboardPage = lazy(() => import("./pages/media/MediaDashboardPage"));
const MediaAddAccountPage = lazy(() => import("./pages/media/MediaAddAccountPage"));
const MediaSettingsPage = lazy(() => import("./pages/media/MediaSettingsPage"));
const WhatsAppTemplateListPage = lazy(() => import("./pages/communication/whatsapp/WhatsAppTemplateListPage"));
const WhatsAppTemplateFormPage = lazy(() => import("./pages/communication/whatsapp/WhatsAppTemplateFormPage"));
const SystemSettingsPage = lazy(() => import("./pages/system/SystemSettingsPage"));
const DocumentSettingsPage = lazy(() => import("./pages/system/DocumentSettingsPage"));
const DocumentTemplateManager = lazy(() => import("./pages/system/DocumentTemplateManager"));

const ArticleListPage = lazy(() => import("./pages/publication/ArticleListPage"));
const ArticleDetailPage = lazy(() => import("./pages/publication/ArticleDetailPage"));
const JournalListPage = lazy(() => import("./pages/publication/JournalListPage"));
const JournalDetailPage = lazy(() => import("./pages/publication/JournalDetailPage"));
const PublicationRegisterPage = lazy(() => import("./pages/publication/PublicationRegisterPage"));

const AuthorDashboardPage = lazy(() => import("./pages/author/AuthorDashboardPage"));
const AuthorArticleListPage = lazy(() => import("./pages/author/AuthorArticleListPage"));
const AuthorJournalListPage = lazy(() => import("./pages/author/AuthorJournalListPage"));
const AuthorArticleFormPage = lazy(() => import("./pages/author/AuthorArticleFormPage"));
const AuthorProfilePage = lazy(() => import("./pages/author/AuthorProfilePage"));
const AuthorCollaborationsPage = lazy(() => import("./pages/author/AuthorCollaborationsPage"));
const AuthorCollaborationDetailPage = lazy(() => import("./pages/author/AuthorCollaborationDetailPage"));
const AuthorDiscussionsPage = lazy(() => import("./pages/author/AuthorDiscussionsPage"));

const AdminArticleListPage = lazy(() => import("./pages/admin/publication/AdminArticleListPage"));
const AdminJournalListPage = lazy(() => import("./pages/admin/publication/AdminJournalListPage"));
const AdminAuthorVerificationPage = lazy(() => import("./pages/admin/publication/AdminAuthorVerificationPage"));
const AdminPublicationDashboard = lazy(() => import("./pages/admin/publication/AdminPublicationDashboard"));
const AdminPublicationCategoryPage = lazy(() => import("./pages/admin/publication/AdminPublicationCategoryPage"));
const AdminVolumePage = lazy(() => import("./pages/admin/publication/AdminVolumePage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      gcTime: 1000 * 60 * 60 * 24, 
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});
persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24, 
});
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
const SantriRedirect = () => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user.role !== 'santri' && user.role !== 'user') {
    return <Navigate to="/dashboard" replace />;
  }
  const userIdentifier = (user as any).username || user.id;
  let targetPath = '/santri/dashboard/' + userIdentifier;
  if (location.pathname.includes('/app/form-pendaftaran')) {
    targetPath = '/app/form-pendaftaran/' + userIdentifier;
  } else if (location.pathname.includes('/app/status')) {
    targetPath = '/app/status/' + userIdentifier;
  } else if (location.pathname.includes('/app/jadwal-ujian')) {
    targetPath = '/app/jadwal-ujian/' + userIdentifier;
  } else if (location.pathname.includes('/app/jadwal')) {
    targetPath = '/app/jadwal/' + userIdentifier;
  } else if (location.pathname.includes('/app/notifikasi')) {
    targetPath = '/app/notifikasi/' + userIdentifier;
  } else if (location.pathname.includes('/app/jadwal-tes')) {
    targetPath = '/app/jadwal-tes/' + userIdentifier;
  } else if (location.pathname.includes('/app/hasil-seleksi')) {
    targetPath = '/app/hasil-seleksi/' + userIdentifier;
  } else if (location.pathname.includes('/app/pengaturan')) {
    targetPath = '/app/pengaturan/' + userIdentifier;
  } else if (location.pathname.includes('/app/pembayaran')) {
    targetPath = '/app/pembayaran/' + userIdentifier;
  }
  return <Navigate to={targetPath} replace />;
};
const PageLoader = () => (
  <div className="p-6 min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);
import { AnimatePresence, motion } from "framer-motion";
import PublicPreloader from "@/components/common/PublicPreloader";
import { useState } from "react";

const App = () => {
  const [showPreloader, setShowPreloader] = useState(() => {
     // Check immediately to avoid flicker if already visited
     return !sessionStorage.getItem('hasVisited');
  });

  useEffect(() => {
    // MySQL check removed as requested
  }, []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" richColors />
          <ConfirmDialog />
          
          <AnimatePresence mode="wait">
            {showPreloader ? (
              <PublicPreloader key="preloader" onComplete={() => setShowPreloader(false)} />
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                <BrowserRouter
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                  }}
                >
                  <DataPrefetcher />
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
              {}
              <Route path="/" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/sejarah" element={<MainLayout><Sejarah /></MainLayout>} />
              <Route path="/profil" element={<Navigate to="/sejarah" replace />} />
              <Route path="/profil/sejarah" element={<Navigate to="/sejarah" replace />} />
              <Route path="/profil/visi-misi" element={<MainLayout><VisiMisi /></MainLayout>} />
              <Route path="/profil/organisasi" element={<MainLayout><Organisasi /></MainLayout>} />
              <Route path="/program" element={<MainLayout><PublicProgramPage /></MainLayout>} />
              <Route path="/program/:slug" element={<MainLayout><ProgramDetail /></MainLayout>} />
              <Route path="/fasilitas" element={<MainLayout><FasilitasPage /></MainLayout>} />
              <Route path="/fasilitas/:slug" element={<MainLayout><FasilitasDetail /></MainLayout>} />
              <Route path="/kehidupan-santri" element={<Navigate to="/kehidupan-santri/jadwal" replace />} />
              <Route path="/kehidupan-santri/jadwal" element={<MainLayout><JadwalPage /></MainLayout>} />
              <Route path="/kehidupan-santri/ekstrakurikuler" element={<MainLayout><EkstrakurikulerPage /></MainLayout>} />
              <Route path="/galeri" element={<MainLayout><GaleriPage /></MainLayout>} />
              <Route path="/blog" element={<MainLayout><PublicBlogPage /></MainLayout>} />
              <Route path="/blog/:slug" element={<MainLayout><BlogDetail /></MainLayout>} />
              <Route path="/artikel" element={<MainLayout><ArticleListPage /></MainLayout>} />
              <Route path="/artikel/:slug" element={<MainLayout><ArticleDetailPage /></MainLayout>} />
              <Route path="/jurnal" element={<MainLayout><JournalListPage /></MainLayout>} />
              <Route path="/jurnal/:id" element={<MainLayout><JournalDetailPage /></MainLayout>} />
              <Route path="/publikasi/register" element={<MainLayout><PublicationRegisterPage /></MainLayout>} />
              <Route path="/kontak" element={<MainLayout><KontakPage /></MainLayout>} />
              <Route path="/pendaftaran" element={<MainLayout><PendaftaranPage /></MainLayout>} />
              <Route path="/alur-pendaftaran" element={<MainLayout><AlurPendaftaranPage /></MainLayout>} />
              <Route path="/alur" element={<Navigate to="/alur-pendaftaran" replace />} />
              {}
              <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
              {}
              <Route path="/register" element={<AuthLayout><LoginPage /></AuthLayout>} />
              {}
              <Route path="/admin/login" element={<Navigate to="/login" replace />} />
              {}
              <Route path="/admin" element={<Navigate to="/login" replace />} />
              {}
              <Route element={<SantriProtectedRoute />}>
                 {}
                 <Route path="/santri/dashboard/:santriId" element={<AppLayout><UserDashboardPage /></AppLayout>} />
                 <Route path="/app/form-pendaftaran/:santriId" element={<AppLayout><FormPendaftaranPage /></AppLayout>} />
                 <Route path="/app/status/:santriId" element={<AppLayout><StatusPendaftaranPage /></AppLayout>} />
                 <Route path="/app/jadwal/:santriId" element={<AppLayout><JadwalSantriPage /></AppLayout>} />
                 <Route path="/app/jadwal-ujian/:santriId" element={<AppLayout><UserSchedulePage /></AppLayout>} />
                 <Route path="/app/notifikasi/:santriId" element={<AppLayout><NotifikasiPage /></AppLayout>} />
                 <Route path="/app/pengaturan/:santriId" element={<AppLayout><PengaturanPage /></AppLayout>} />
                 <Route path="/app/pembayaran/:santriId" element={<AppLayout><PaymentPage /></AppLayout>} />
              </Route>
              
              <Route element={<AuthorProtectedRoute />}>
                 <Route path="/author/dashboard" element={<AppLayout><AuthorDashboardPage /></AppLayout>} />
                 <Route path="/author/articles" element={<AppLayout><AuthorArticleListPage /></AppLayout>} />
                 <Route path="/author/articles/new" element={<AppLayout><AuthorArticleFormPage /></AppLayout>} />
                 <Route path="/author/articles/:id/edit" element={<AppLayout><AuthorArticleFormPage /></AppLayout>} />
                 <Route path="/author/journals" element={<AppLayout><AuthorJournalListPage /></AppLayout>} />
                 <Route path="/author/profile" element={<AppLayout><AuthorProfilePage /></AppLayout>} />
                 <Route path="/author/collaborations" element={<AppLayout><AuthorCollaborationsPage /></AppLayout>} />
                 <Route path="/author/collaborations/:id" element={<AppLayout><AuthorCollaborationDetailPage /></AppLayout>} />
                 <Route path="/author/discussions" element={<AppLayout><AuthorDiscussionsPage /></AppLayout>} />
              </Route>
              
              {/* Santri Redirects */}
              <Route path="/santri/dashboard" element={<SantriRedirect />} />
              <Route path="/app/*" element={<SantriRedirect />} />
              {}
              <Route path="/admin" element={<Navigate to="/admin/sync" replace />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/admin/sync" element={<DataSyncPage />} />
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                  <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
                  
                  <Route path="/admin/publication/dashboard" element={<AdminPublicationDashboard />} />
                  <Route path="/admin/publication/articles" element={<AdminArticleListPage />} />
                  <Route path="/admin/publication/journals" element={<AdminJournalListPage />} />
                  <Route path="/admin/publication/categories" element={<AdminPublicationCategoryPage />} />
                  <Route path="/admin/publication/volumes" element={<AdminVolumePage />} />
                  <Route path="/admin/publication/authors" element={<AdminAuthorVerificationPage />} />
                  {}
                  <Route path="/admin/admissions" element={<AdmissionsPage />} />
                  <Route path="/admin/admissions/new" element={<SantriFormPage />} />
                  <Route path="/admin/admissions/documents" element={<SantriDocumentsPage />} />
                  <Route path="/admin/admissions/schedules" element={<ExamSchedulesPage />} />
                  <Route path="/admin/admissions/schedules/new" element={<ExamScheduleFormPage />} />
                  <Route path="/admin/admissions/schedules/:id/edit" element={<ExamScheduleFormPage />} />
                  <Route path="/admin/admissions/results" element={<ExamResultsPage />} />
                  <Route path="/admin/admissions/results/new" element={<ExamResultFormPage />} />
                  <Route path="/admin/admissions/results/:id/edit" element={<ExamResultFormPage />} />
                  <Route path="/admin/admissions/:id" element={<SantriDetailPage />} />
                  <Route path="/admin/admissions/:id/edit" element={<SantriFormPage />} />
                  {}
                  <Route path="/admissions" element={<Navigate to="/admin/admissions" replace />} />
                  <Route path="/admissions/*" element={<Navigate to="/admin/admissions" replace />} />
                  {}
                  <Route path="/admin/financial-dashboard" element={<FinancialDashboard />} />
                  <Route path="/admin/payments" element={<PaymentsPage />} />
                  <Route path="/admin/payments/:id" element={<PaymentDetailPage />} />
                  {}
                  <Route path="/financial-dashboard" element={<Navigate to="/admin/financial-dashboard" replace />} />
                  <Route path="/payments" element={<Navigate to="/admin/payments" replace />} />
                  <Route path="/payments/*" element={<Navigate to="/admin/payments" replace />} />
                  <Route path="/bank-accounts" element={<Navigate to="/admin/bank-accounts" replace />} />
                  {}
                  <Route path="/admin/users" element={<UsersPage />} />
                  <Route path="/admin/profile" element={<ProfilePage />} />
                  {}
                  <Route path="/users" element={<Navigate to="/admin/users" replace />} />
                  <Route path="/profile" element={<Navigate to="/admin/profile" replace />} />
                  {}
                  <Route path="/admin/blog" element={<Navigate to="/admin/blog/posts" replace />} />
                  <Route path="/admin/blog/posts" element={<GenericResourcePage resource="blogBlogpost" title="Artikel & Berita" basePath="/admin/blog/posts" viewMode="grid" />} />
                  <Route path="/admin/blog/generate-ai" element={<BlogAIGeneratorPage />} />
                  <Route path="/admin/blog/posts/new" element={<BlogEditorPage />} />
                  <Route path="/admin/blog/posts/:id/edit" element={<BlogEditorPage />} />
                  {}
                  <Route path="/admin/announcements" element={<AnnouncementListPage />} />
                  <Route path="/admin/announcements/new" element={<AnnouncementFormPage />} />
                  <Route path="/admin/announcements/:id/edit" element={<AnnouncementFormPage />} />
                  {}
                  <Route path="/announcements" element={<Navigate to="/admin/announcements" replace />} />
                  <Route path="/announcements/*" element={<Navigate to="/admin/announcements" replace />} />
                  <Route path="/admin/blog/categories" element={<CategoryListPage />} />
                  <Route path="/admin/blog/categories/new" element={<CategoryFormPage />} />
                  <Route path="/admin/blog/categories/:id/edit" element={<CategoryFormPage />} />
                  {}
                  <Route path="/blog/categories" element={<Navigate to="/admin/blog/categories" replace />} />
                  <Route path="/blog/categories/*" element={<Navigate to="/admin/blog/categories" replace />} />
                  <Route path="/admin/blog/tags" element={<TagListPage />} />
                  <Route path="/admin/blog/tags/new" element={<TagFormPage />} />
                  <Route path="/admin/blog/tags/:id/edit" element={<TagFormPage />} />
                  {}
                  <Route path="/blog/tags" element={<Navigate to="/admin/blog/tags" replace />} />
                  <Route path="/blog/tags/*" element={<Navigate to="/admin/blog/tags" replace />} />
                  {}
                  <Route path="/admin/testimonials" element={<TestimonialListPage />} />
                  <Route path="/admin/testimonials/new" element={<TestimonialFormPage />} />
                  <Route path="/admin/testimonials/:id/edit" element={<TestimonialFormPage />} />
                  {}
                  <Route path="/testimonials" element={<Navigate to="/admin/testimonials" replace />} />
                  <Route path="/testimonials/*" element={<Navigate to="/admin/testimonials" replace />} />
                  {}
                  <Route path="/admin/faq" element={<GenericResourcePage resource="faq" title="FAQ" basePath="/admin/faq" />} />
                  <Route path="/admin/faq/new" element={<GenericResourceFormPage resource="faq" title="FAQ" basePath="/admin/faq" />} />
                  <Route path="/admin/faq/:id/edit" element={<GenericResourceFormPage resource="faq" title="FAQ" basePath="/admin/faq" />} />
                  <Route path="/admin/ai-generator" element={<GenericAIGeneratorPage />} />
                  <Route path="/admin/extracurricular" element={<GenericResourcePage resource="ekstrakurikuler" title="Ekstrakurikuler" basePath="/admin/extracurricular" />} />
                  <Route path="/admin/extracurricular/new" element={<GenericResourceFormPage resource="ekstrakurikuler" title="Ekstrakurikuler" basePath="/admin/extracurricular" />} />
                  <Route path="/admin/extracurricular/:id/edit" element={<GenericResourceFormPage resource="ekstrakurikuler" title="Ekstrakurikuler" basePath="/admin/extracurricular" />} />
                  <Route path="/admin/daily-schedule" element={<DailySchedulePage />} />
                  <Route path="/admin/daily-schedule/new" element={<DailyScheduleFormPage />} />
                  <Route path="/admin/daily-schedule/:id/edit" element={<DailyScheduleFormPage />} />
                  <Route path="/admin/website-settings" element={<WebsiteSettingsPage />} />
                  <Route path="/admin/registration-flow" element={<GenericResourcePage resource="registrationFlow" title="Alur Pendaftaran" basePath="/admin/registration-flow" />} />
                  <Route path="/admin/registration-flow/new" element={<GenericResourceFormPage resource="registrationFlow" title="Alur Pendaftaran" basePath="/admin/registration-flow" />} />
                  <Route path="/admin/registration-flow/:id/edit" element={<GenericResourceFormPage resource="registrationFlow" title="Alur Pendaftaran" basePath="/admin/registration-flow" />} />
                  <Route path="/admin/form-config" element={<FormConfigPage />} />
                  <Route path="/admin/home-settings" element={<HomePageManager />} />
                  {/* === REDIRECTS === */}              <Route path="/faq" element={<Navigate to="/admin/faq" replace />} />
                  <Route path="/extracurricular" element={<Navigate to="/admin/extracurricular" replace />} />
                  <Route path="/daily-schedule" element={<Navigate to="/admin/daily-schedule" replace />} />
                  <Route path="/website-settings" element={<Navigate to="/admin/website-settings" replace />} />
                  <Route path="/registration-flow" element={<Navigate to="/admin/registration-flow" replace />} />
                  <Route path="/home-settings" element={<Navigate to="/admin/home-settings" replace />} />
                  {}
                  <Route path="/admin/hero-sections" element={<HeroListPage />} />
                  <Route path="/admin/hero-sections/new" element={<HeroFormPage />} />
                  <Route path="/admin/hero-sections/:id/edit" element={<HeroFormPage />} />
                  {}
                  <Route path="/hero-sections" element={<Navigate to="/admin/hero-sections" replace />} />
                  <Route path="/hero-sections/*" element={<Navigate to="/admin/hero-sections" replace />} />
                  {}
                  <Route path="/admin/vision-mission" element={<VisiMisiPage />} />
                  <Route path="/vision-mission" element={<Navigate to="/admin/vision-mission" replace />} />
                  {}
                  <Route path="/admin/history" element={<HistoryListPage />} />
                  <Route path="/admin/history/new" element={<HistoryFormPage />} />
                  <Route path="/admin/history/:id/edit" element={<HistoryFormPage />} />
                  {}
                  <Route path="/history" element={<Navigate to="/admin/history" replace />} />
                  <Route path="/history/*" element={<Navigate to="/admin/history" replace />} />
                  {}
                  <Route path="/admin/media" element={<MediaDashboardPage />} />
                  <Route path="/admin/media/add-account" element={<MediaAddAccountPage />} />
                  <Route path="/admin/media/settings" element={<MediaSettingsPage />} />
                  <Route path="/admin/media/*" element={<Navigate to="/admin/media" replace />} />
                  <Route path="/media" element={<Navigate to="/admin/media" replace />} />
                  <Route path="/media/*" element={<Navigate to="/admin/media" replace />} />
                  {}
                  <Route path="/admin/website/founders" element={<FounderListPage />} />
                  <Route path="/admin/website/founders/new" element={<FounderFormPage />} />
                  <Route path="/admin/website/founders/:id/edit" element={<FounderFormPage />} />
                  {}
                  <Route path="/admin/programs" element={<ProgramListPage />} />
                  <Route path="/admin/programs/new" element={<ProgramFormPage />} />
                  <Route path="/admin/programs/:id/edit" element={<ProgramFormPage />} />
                  {}
                  <Route path="/programs" element={<Navigate to="/admin/programs" replace />} />
                  <Route path="/programs/*" element={<Navigate to="/admin/programs" replace />} />
                  {}
                  <Route path="/admin/facilities" element={<FacilitiesListPage />} />
                  <Route path="/admin/facilities/new" element={<FacilitiesFormPage />} />
                  <Route path="/admin/facilities/:id/edit" element={<FacilitiesFormPage />} />
                  {}
                  <Route path="/facilities" element={<Navigate to="/admin/facilities" replace />} />
                  <Route path="/facilities/*" element={<Navigate to="/admin/facilities" replace />} />
                  {/* ORGANISASI */}
                  <Route path="/admin/organisasi" element={<OrganisasiListPage />} />
                  <Route path="/admin/organisasi/new" element={<OrganisasiFormPage />} />
                  <Route path="/admin/organisasi/:id/edit" element={<OrganisasiFormPage />} />
                  <Route path="/organisasi" element={<Navigate to="/admin/organisasi" replace />} />
                  {/* END ORGANISASI */}
                  <Route path="/admin/education" element={<EducationListPage />} />
                  <Route path="/admin/education/new" element={<EducationFormPage />} />
                  <Route path="/admin/education/:id/edit" element={<EducationFormPage />} />
                  {}
                  <Route path="/education" element={<Navigate to="/admin/education" replace />} />
                  <Route path="/education/*" element={<Navigate to="/admin/education" replace />} />
                  <Route path="/admin/tuition-fees" element={<GenericResourcePage resource="biayaPendidikan" title="Biaya Pendidikan" basePath="/admin/tuition-fees" />} />
                  <Route path="/admin/tuition-fees/new" element={<GenericResourceFormPage resource="biayaPendidikan" title="Biaya Pendidikan" basePath="/admin/tuition-fees" />} />
                  <Route path="/admin/tuition-fees/:id/edit" element={<GenericResourceFormPage resource="biayaPendidikan" title="Biaya Pendidikan" basePath="/admin/tuition-fees" />} />
                  <Route path="/admin/uniforms" element={<UniformListPage />} />
                  <Route path="/admin/uniforms/new" element={<GenericResourceFormPage resource="seragam" title="Seragam" basePath="/admin/uniforms" />} />
                  <Route path="/admin/uniforms/:id/edit" element={<GenericResourceFormPage resource="seragam" title="Seragam" basePath="/admin/uniforms" />} />
                  <Route path="/admin/statistics" element={<GenericResourcePage resource="statistik" title="Statistik" basePath="/admin/statistics" />} />
                  <Route path="/admin/statistics/new" element={<GenericResourceFormPage resource="statistik" title="Statistik" basePath="/admin/statistics" />} />
                  <Route path="/admin/statistics/:id/edit" element={<GenericResourceFormPage resource="statistik" title="Statistik" basePath="/admin/statistics" />} />
                  {}
                  <Route path="/tuition-fees" element={<Navigate to="/admin/tuition-fees" replace />} />
                  <Route path="/uniforms" element={<Navigate to="/admin/uniforms" replace />} />
                  <Route path="/statistics" element={<Navigate to="/admin/statistics" replace />} />
                  {}
                  <Route path="/admin/teachers" element={<TeacherListPage />} />
                  <Route path="/admin/teachers/new" element={<TeacherFormPage />} />
                  <Route path="/admin/teachers/:id/edit" element={<TeacherFormPage />} />
                  <Route path="/admin/positions" element={<GenericResourcePage resource="bagianJabatan" title="Jabatan & Posisi" />} />
                  {}
                  <Route path="/teachers" element={<Navigate to="/admin/teachers" replace />} />
                  <Route path="/teachers/*" element={<Navigate to="/admin/teachers" replace />} />
                  <Route path="/positions" element={<Navigate to="/admin/positions" replace />} />
                  <Route path="/admin/gallery" element={<GalleryListPage />} />
                  <Route path="/admin/gallery/new" element={<GalleryFormPage />} />
                  <Route path="/admin/gallery/:id/edit" element={<GalleryFormPage />} />
                  {}
                  <Route path="/gallery" element={<Navigate to="/admin/gallery" replace />} />
                  <Route path="/gallery/*" element={<Navigate to="/admin/gallery" replace />} />
                  <Route path="/admin/documentation" element={<DocumentationListPage />} />
                  <Route path="/admin/documentation/new" element={<DocumentationFormPage />} />
                  <Route path="/admin/documentation/:id/edit" element={<DocumentationFormPage />} />
                  {}
                  <Route path="/documentation" element={<Navigate to="/admin/documentation" replace />} />
                  <Route path="/documentation/*" element={<Navigate to="/admin/documentation" replace />} />
                  <Route path="/admin/media" element={<MediaDashboardPage />} />
                  {}
                  <Route path="/admin/contacts" element={<GenericResourcePage resource="kontak" title="Kontak Masuk" />} />
                  <Route path="/admin/contact-persons" element={<GenericResourcePage resource="contactPersons" title="Contact Person" />} />
                  <Route path="/admin/social-media" element={<GenericResourcePage resource="socialMedia" title="Sosial Media" />} />
                  <Route path="/admin/whatsapp-templates" element={<WhatsAppTemplateListPage />} />
                  <Route path="/admin/whatsapp-templates/new" element={<WhatsAppTemplateFormPage />} />
                  <Route path="/admin/whatsapp-templates/:id/edit" element={<WhatsAppTemplateFormPage />} />
                  <Route path="/admin/settings" element={<SystemSettingsPage />} />
                  <Route path="/admin/document-settings" element={<DocumentSettingsPage />} />
                  <Route path="/admin/document-templates" element={<DocumentTemplateManager />} />
                  {}
                  <Route path="/contacts" element={<Navigate to="/admin/contacts" replace />} />
                  <Route path="/contact-persons" element={<Navigate to="/admin/contact-persons" replace />} />
                  <Route path="/social-media" element={<Navigate to="/admin/social-media" replace />} />
                  <Route path="/whatsapp-templates" element={<Navigate to="/admin/whatsapp-templates" replace />} />
                  <Route path="/whatsapp-templates/*" element={<Navigate to="/admin/whatsapp-templates" replace />} />
                  <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />
                </Route>
              </Route>
              <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
                </Routes>
              </Suspense>
            </BrowserRouter>
            </motion.div>
          )}
          </AnimatePresence>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
export default App;
