import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout";
import { ConfirmDialog } from "@/components/common";
import DashboardPage from "./pages/Dashboard";
import { AdmissionsPage, SantriFormPage } from "./pages/admissions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" richColors />
      <ConfirmDialog />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Admin Layout */}
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Admissions */}
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/admissions/new" element={<SantriFormPage />} />
            <Route path="/admissions/:id/edit" element={<SantriFormPage />} />
            
            {/* Placeholder routes for other modules */}
            <Route path="/payments" element={<PlaceholderPage title="Pembayaran" />} />
            <Route path="/bank-accounts" element={<PlaceholderPage title="Rekening Bank" />} />
            <Route path="/blog" element={<PlaceholderPage title="Blog" />} />
            <Route path="/categories" element={<PlaceholderPage title="Kategori" />} />
            <Route path="/announcements" element={<PlaceholderPage title="Pengumuman" />} />
            <Route path="/testimonials" element={<PlaceholderPage title="Testimoni" />} />
            <Route path="/website-settings" element={<PlaceholderPage title="Pengaturan Website" />} />
            <Route path="/hero-sections" element={<PlaceholderPage title="Hero Section" />} />
            <Route path="/vision-mission" element={<PlaceholderPage title="Visi & Misi" />} />
            <Route path="/history" element={<PlaceholderPage title="Sejarah" />} />
            <Route path="/programs" element={<PlaceholderPage title="Program" />} />
            <Route path="/education" element={<PlaceholderPage title="Pendidikan" />} />
            <Route path="/facilities" element={<PlaceholderPage title="Fasilitas" />} />
            <Route path="/extracurricular" element={<PlaceholderPage title="Ekstrakurikuler" />} />
            <Route path="/daily-schedule" element={<PlaceholderPage title="Jadwal Harian" />} />
            <Route path="/tuition-fees" element={<PlaceholderPage title="Biaya Pendidikan" />} />
            <Route path="/uniforms" element={<PlaceholderPage title="Seragam" />} />
            <Route path="/statistics" element={<PlaceholderPage title="Statistik" />} />
            <Route path="/faq" element={<PlaceholderPage title="FAQ" />} />
            <Route path="/teachers" element={<PlaceholderPage title="Tenaga Pengajar" />} />
            <Route path="/positions" element={<PlaceholderPage title="Jabatan" />} />
            <Route path="/gallery" element={<PlaceholderPage title="Galeri" />} />
            <Route path="/documentation" element={<PlaceholderPage title="Dokumentasi" />} />
            <Route path="/files" element={<PlaceholderPage title="File Manager" />} />
            <Route path="/contacts" element={<PlaceholderPage title="Kontak Masuk" />} />
            <Route path="/contact-persons" element={<PlaceholderPage title="Contact Person" />} />
            <Route path="/social-media" element={<PlaceholderPage title="Sosial Media" />} />
            <Route path="/whatsapp-templates" element={<PlaceholderPage title="Template WhatsApp" />} />
            <Route path="/document-templates" element={<PlaceholderPage title="Template Surat" />} />
            <Route path="/users" element={<PlaceholderPage title="Pengguna" />} />
            <Route path="/settings" element={<PlaceholderPage title="Pengaturan" />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Placeholder component for routes not yet implemented
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground max-w-md">
        Modul ini sedang dalam pengembangan. Silakan kembali lagi nanti.
      </p>
    </div>
  );
}

export default App;
