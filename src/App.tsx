import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AdminLayout } from "@/components/layout";
import { ConfirmDialog, TableSkeleton } from "@/components/common";
import DashboardPage from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Lazy load modules
const AdmissionsPage = lazy(() => import("./pages/admissions/AdmissionsPage"));
const SantriFormPage = lazy(() => import("./pages/admissions/SantriFormPage"));
const UsersPage = lazy(() => import("./pages/users/UsersPage"));
const PaymentsPage = lazy(() => import("./pages/payments/PaymentsPage"));
const BlogPage = lazy(() => import("./pages/blog/BlogPage"));
const BlogEditorPage = lazy(() => import("./pages/blog/BlogEditorPage"));
const FAQPage = lazy(() => import("./pages/website/FAQPage"));
const FacilitiesPage = lazy(() => import("./pages/website/FacilitiesPage"));
const ExtracurricularPage = lazy(() => import("./pages/website/ExtracurricularPage"));
const DailySchedulePage = lazy(() => import("./pages/website/DailySchedulePage"));

const queryClient = new QueryClient();

// Loading fallback
const PageLoader = () => (
  <div className="p-6">
    <TableSkeleton rows={8} columns={5} />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" richColors />
      <ConfirmDialog />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Admissions */}
            <Route path="/admissions" element={<Suspense fallback={<PageLoader />}><AdmissionsPage /></Suspense>} />
            <Route path="/admissions/new" element={<Suspense fallback={<PageLoader />}><SantriFormPage /></Suspense>} />
            <Route path="/admissions/:id/edit" element={<Suspense fallback={<PageLoader />}><SantriFormPage /></Suspense>} />
            
            {/* Payments */}
            <Route path="/payments" element={<Suspense fallback={<PageLoader />}><PaymentsPage /></Suspense>} />
            <Route path="/bank-accounts" element={<Suspense fallback={<PageLoader />}><PaymentsPage /></Suspense>} />
            
            {/* Users */}
            <Route path="/users" element={<Suspense fallback={<PageLoader />}><UsersPage /></Suspense>} />
            
            {/* Blog */}
            <Route path="/blog" element={<Suspense fallback={<PageLoader />}><BlogPage /></Suspense>} />
            <Route path="/blog/new" element={<Suspense fallback={<PageLoader />}><BlogEditorPage /></Suspense>} />
            <Route path="/blog/:id" element={<Suspense fallback={<PageLoader />}><BlogEditorPage /></Suspense>} />
            <Route path="/blog/:id/edit" element={<Suspense fallback={<PageLoader />}><BlogEditorPage /></Suspense>} />
            <Route path="/categories" element={<Suspense fallback={<PageLoader />}><BlogPage /></Suspense>} />
            <Route path="/announcements" element={<Suspense fallback={<PageLoader />}><BlogPage /></Suspense>} />
            <Route path="/testimonials" element={<Suspense fallback={<PageLoader />}><BlogPage /></Suspense>} />
            
            {/* Website Content */}
            <Route path="/faq" element={<Suspense fallback={<PageLoader />}><FAQPage /></Suspense>} />
            <Route path="/facilities" element={<Suspense fallback={<PageLoader />}><FacilitiesPage /></Suspense>} />
            <Route path="/extracurricular" element={<Suspense fallback={<PageLoader />}><ExtracurricularPage /></Suspense>} />
            <Route path="/daily-schedule" element={<Suspense fallback={<PageLoader />}><DailySchedulePage /></Suspense>} />
            
            {/* Reuse existing pages for similar content */}
            <Route path="/website-settings" element={<Suspense fallback={<PageLoader />}><FAQPage /></Suspense>} />
            <Route path="/hero-sections" element={<Suspense fallback={<PageLoader />}><FacilitiesPage /></Suspense>} />
            <Route path="/vision-mission" element={<Suspense fallback={<PageLoader />}><FAQPage /></Suspense>} />
            <Route path="/history" element={<Suspense fallback={<PageLoader />}><DailySchedulePage /></Suspense>} />
            <Route path="/programs" element={<Suspense fallback={<PageLoader />}><FacilitiesPage /></Suspense>} />
            <Route path="/education" element={<Suspense fallback={<PageLoader />}><FacilitiesPage /></Suspense>} />
            <Route path="/tuition-fees" element={<Suspense fallback={<PageLoader />}><DailySchedulePage /></Suspense>} />
            <Route path="/uniforms" element={<Suspense fallback={<PageLoader />}><DailySchedulePage /></Suspense>} />
            <Route path="/statistics" element={<Suspense fallback={<PageLoader />}><FacilitiesPage /></Suspense>} />
            <Route path="/teachers" element={<Suspense fallback={<PageLoader />}><UsersPage /></Suspense>} />
            <Route path="/positions" element={<Suspense fallback={<PageLoader />}><FacilitiesPage /></Suspense>} />
            <Route path="/gallery" element={<Suspense fallback={<PageLoader />}><FacilitiesPage /></Suspense>} />
            <Route path="/documentation" element={<Suspense fallback={<PageLoader />}><FacilitiesPage /></Suspense>} />
            <Route path="/files" element={<Suspense fallback={<PageLoader />}><FacilitiesPage /></Suspense>} />
            <Route path="/contacts" element={<Suspense fallback={<PageLoader />}><FAQPage /></Suspense>} />
            <Route path="/contact-persons" element={<Suspense fallback={<PageLoader />}><UsersPage /></Suspense>} />
            <Route path="/social-media" element={<Suspense fallback={<PageLoader />}><FacilitiesPage /></Suspense>} />
            <Route path="/whatsapp-templates" element={<Suspense fallback={<PageLoader />}><FAQPage /></Suspense>} />
            <Route path="/document-templates" element={<Suspense fallback={<PageLoader />}><FAQPage /></Suspense>} />
            <Route path="/settings" element={<Suspense fallback={<PageLoader />}><FAQPage /></Suspense>} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
