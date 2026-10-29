# 🗺️ PROJECT_MAP: Pesantren Hub

> **Protokol Hemat Token Aktif**: File ini adalah peta navigasi utama. Wajib dibaca sebelum membuka file repo lainnya. Jaga agar tetap akurat dan di bawah 200 baris.

---

## 1. 🏗️ Tech Stack & Arsitektur
- **Frontend SPA**: React 18 + Vite (`:8080`), TypeScript, Tailwind CSS, Lucide Icons, Zustand, React Query, Axios (`src/lib/api.ts`).
- **Backend API**: Hono Framework (`:3008`), TypeScript, `@hono/node-server`, Drizzle ORM, Zod validator (`server/src/index.ts`).
- **Database**: PostgreSQL / Neon Serverless Postgres via Drizzle ORM (`server/src/db/schema.ts`).
- **Serverless Bridge**: Vercel serverless function (`api/index.ts` -> `handle(app)`).
- **Arsitektur**: Decoupled Client-Server. Frontend berbicara ke backend melalui `/api/*`.

---

## 2. 📁 Struktur Direktori
```text
pesantren-hub/
├── api/             # Vercel serverless entrypoint (index.ts)
├── docs/            # Dokumentasi arsitektur resmi (01 s/d 06 markdown)
├── public/          # Aset statis favicon, manifest, ilustrasi
├── server/          # Backend Hono API
│   ├── drizzle/     # Migrasi & snapshot Drizzle ORM
│   └── src/
│       ├── db/      # schema.ts (67 tabel PG), index.ts, migrate.ts
│       ├── middleware/ # Auth JWT & CORS middleware
│       ├── modules/ # 13 modul API (auth, admin, kmi, santri, psb, payments, ...)
│       └── server.ts # Local server entrypoint (port 3008)
└── src/             # Frontend React 18 SPA
    ├── components/  # Komponen UI atomik & reusable (Radix UI / Tailwind)
    ├── layouts/     # MainLayout, AdminLayout, AuthLayout, AppLayout
    ├── lib/         # api.ts (Axios), vercel-connect.ts (@vercel/connect), utils
    ├── pages/       # Halaman views (website, admin, kmi, author, admissions, blog)
    ├── stores/      # Zustand stores (auth-store, theme-store)
    └── App.tsx      # Routing utama (React Router v6)
```

---

## 3. 🌐 Peta Rute Frontend (`src/App.tsx`)

| Area / Kategori | URL Path | Halaman / Komponen | Keterangan |
| :--- | :--- | :--- | :--- |
| **Publik (Landing)** | `/` | `Home.tsx` | Hero banner, ringkasan program, berita & fasilitas |
| **Publik (Profil)** | `/sejarah`, `/profil/visi-misi`, `/profil/organisasi` | `Sejarah`, `VisiMisi`, `Organisasi` | Profil lengkap pesantren & struktur pengurus |
| **Publik (Akademik)**| `/program`, `/fasilitas`, `/kehidupan-santri/jadwal` | `ProgramPage`, `FasilitasPage`, `JadwalPage` | Kurikulum, sarana pesantren, jadwal santri |
| **Publik (PSB)** | `/pendaftaran`, `/alur-pendaftaran` | `PendaftaranPage`, `AlurPendaftaranPage` | Info & panduan penerimaan santri baru |
| **Publik (Publikasi)**| `/publikasi`, `/artikel`, `/jurnal` | `PublikasiPage`, `ArticleListPage`, `JournalListPage` | Hub riset ilmiah & jurnal pesantren |
| **Publik (Media)** | `/galeri`, `/blog`, `/kontak` | `GaleriPage`, `BlogPage`, `KontakPage` | Foto/video, berita kegiatan, form kontak |
| **Auth** | `/login`, `/register` | `LoginPage.tsx` | Autentikasi multi-role (JWT) |
| **Portal Santri/Wali**| `/santri/dashboard/:id`, `/app/status/:id` | `UserDashboardPage`, `StatusPendaftaranPage` | Dashboard santri, cek kelulusan, jadwal |
| **Portal Pembayaran**| `/app/pembayaran/:id` | `PaymentPage.tsx` | Pembayaran SPP / uang masuk, upload bukti |
| **Portal Author** | `/author/dashboard`, `/author/articles` | `AuthorDashboardPage`, `AuthorArticleListPage` | Manajemen draf karya ilmiah & kolaborasi |
| **Admin (Overview)** | `/admin/dashboard`, `/admin/sync` | `AdminDashboardPage`, `DataSyncPage` | Statistik total santri, pendapatan, audit log |
| **Admin (PSB)** | `/admin/admissions`, `/admin/admissions/results` | `AdmissionsPage`, `ExamResultsPage` | Verifikasi berkas PSB, jadwal & nilai ujian |
| **Admin (KMI LMS)** | `/admin/kmi/dashboard`, `/admin/kmi/mapel`, `/admin/kmi/nilai` | `KMIDashboardPage`, `KMIMapelPage`, `KMINilaiPage` | Kurikulum KMI, jadwal, absensi, rapor santri |
| **Admin (Keuangan)** | `/admin/financial-dashboard`, `/admin/payments` | `FinancialDashboard`, `PaymentsPage` | Verifikasi bukti bayar, tagihan, rekening |
| **Admin (Publikasi)**| `/admin/publication/articles`, `/admin/publication/volumes` | `AdminArticleListPage`, `AdminVolumePage` | Review artikel ilmiah, volume jurnal, reviewer |
| **Admin (CMS Konten)**| `/admin/blog/posts`, `/admin/gallery`, `/admin/website-settings` | `GenericResourcePage`, `GalleryListPage`, `WebsiteSettingsPage`| Berita, AI generator, fasilitas, jadwal harian |
| **Admin (Sistem)** | `/admin/users`, `/admin/settings`, `/admin/system-docs` | `UsersPage`, `SystemSettingsPage`, `DocumentationPage` | Manajemen akun RBAC, template surat, bugnotes |

---

## 4. ⚡ Peta Endpoint Backend API (`server/src/index.ts`)

| Prefix Modul | File Handler | Tanggung Jawab Utama |
| :--- | :--- | :--- |
| `/api/auth` | `modules/auth/` | Register, login JWT, logout, me, refresh token |
| `/api/admin` | `modules/admin/` | Dashboard metrics, user role update, audit log |
| `/api/users` | `modules/users/` | Profil pengguna, update identitas, ganti password |
| `/api/santri` | `modules/santri/` | Master data santri, wali santri, status asrama |
| `/api/kmi` | `modules/kmi/` | Rumpun mapel, jadwal kelas, absensi, input nilai & rapor |
| `/api/psb` | `modules/admissions/` | Pendaftaran santri baru, unggah berkas, seleksi ujian |
| `/api/payments` | `modules/payments/` | Generate tagihan, submit bukti transfer, verifikasi admin |
| `/api/publication` | `modules/publication/` | Submission jurnal/artikel, peer review, kolaborasi riset |
| `/api/blog` | `modules/blog/` | CRUD postingan berita, kategori, tag, pengumuman |
| `/api/upload` | `modules/upload/` | Upload media (Cloudinary / ImageKit / disk lokal) |
| `/api/media` | `modules/media/` | Dashboard aset media, log file media |
| `/api/notifications` | `modules/notifications/` | Notifikasi in-app untuk santri, admin & author |
| `/api/core` | `modules/core/` | Hero section, visi misi, timeline sejarah, kontak, settings |

---

## 5. 🗄️ Model Data Utama (`server/src/db/schema.ts`)
- **User & RBAC**: `users_user`, `users_loginhistory`, `notifications`.
- **Publikasi & Riset**: `publication_profiles`, `publication_articles`, `publication_categories`, `publication_volumes`, `publication_collaborations`, `publication_discussions`.
- **Santri & PSB**: `admissions_santri`, `admissions_exam_schedules`, `admissions_exam_results`, `admissions_parents`.
- **Keuangan**: `payments_bankaccount`, `payments_payment`.
- **CMS Website**: `blog_blogpost`, `blog_category`, `core_herosection`, `core_visimisi`, `core_sejarahtimeline`, `core_program`, `core_fasilitas`, `core_jadwalharian`, `core_kontak`, `core_websitesettings`.
- **Sistem**: `system_settings`, `document_settings`, `document_templates`, `admin_panel_bugnote`.

---

## 6. 🚀 Menjalankan Aplikasi & Pengujian
```bash
# 1. Dev Frontend (:8080)
npm run dev

# 2. Dev Backend Hono API (:3008)
cd server && npm run dev

# 3. Dev Sekaligus (Frontend + Backend)
npm run dev:all

# 4. Build Produksi
npm run build              # Frontend static export ke dist/
cd server && npm run build # Backend bundle CPanel / Node
```
