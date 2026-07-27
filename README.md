# 🏫 Pesantren Hub - Sistem Informasi Manajemen Pesantren Terpadu

![Pesantren Hub](asset/Macbook-Air-localhost.webp)

**Pesantren Hub** adalah platform manajemen akademik, administrasi, publikasi ilmiah, dan penerimaan santri baru (PSB) terpadu berbasis cloud yang dirancang khusus untuk memenuhi kebutuhan digitalisasi Pesantren modern.

---

## 📽️ Video Demonstrasi & Showcase Aplikasi

Saksikan rekaman simulasi dan navigasi interaktif aplikasi **Pesantren Hub**:

<video src="asset/Macbook-Air-localhost-ie2znc--2clx7h.webm" controls width="100%" preload="metadata">
  Your browser does not support the video tag.
</video>

> 💡 *Jika player video di atas tidak muncul secara otomatis di GitHub, Anda dapat memutar atau mengunduh video secara langsung [di sini](asset/Macbook-Air-localhost-ie2znc--2clx7h.webm).*

---

## 📚 Dokumen Arsitektur System Complete (6 File MD)

Dokumentasi arsitektur sistem dibuat secara lengkap dan mendalam dalam 6 file berikut:

1. 🏛️ **[01-architecture-overview.md](docs/01-architecture-overview.md)**
   * Ringkasan eksekutif, arsitektur decoupled, Diagram Mermaid, Stack Teknologi (React 18 + Vite, Hono API, Drizzle ORM, Neon PostgreSQL), dan model RBAC.
2. 🗄️ **[02-database-schema-data-models.md](docs/02-database-schema-data-models.md)**
   * ER Diagram, spesifikasi tabel lengkap (`users_user`, `santri`, `kmi_grades`, `psb_registrations`, `publication_articles`, `payments`, dll.).
3. ⚡ **[03-backend-api-endpoints.md](docs/03-backend-api-endpoints.md)**
   * Dokumentasi endpoint REST API lengkap untuk 13 modul utama (`/api/auth`, `/api/admin`, `/api/santri`, `/api/kmi`, `/api/psb`, `/api/publication`, `/api/payments`, dll.).
4. 🎨 **[04-frontend-architecture.md](docs/04-frontend-architecture.md)**
   * Struktur folder frontend (`/src`), rute aplikasi, Zustand state management, sistem desain UI Tailwind, dan API Interceptors (`api.ts`).
5. 🖼️ **[05-assets-ui-showcase.md](docs/05-assets-ui-showcase.md)**
   * Galeri tangkapan layar lengkap seluruh modul UI beserta deskripsi fungsionalitas dan inventaris asset gambar & video.
6. 🚀 **[06-deployment-operations.md](docs/06-deployment-operations.md)**
   * Panduan instalasi lokal, konfigurasi `.env`, migrasi Drizzle DB, deployment cPanel NodeJS (`entry-cpanel.ts`), dan serverless Vercel.

---

## 🖼️ Galeri Antarmuka Modul Utama

<details>
<summary><b>🔍 Klik untuk melihat seluruh Screenshot Modul Aplikasi</b></summary>

### 1. Halaman Utama (Hero Section)
![Homepage Hero Section](asset/Macbook-Air-localhost.webp)

### 2. Profil Lembaga & Informasi Pesantren
![About Institution Profile](<asset/Macbook-Air-localhost (1).webp>)

### 3. Akademik KMI & Kurikulum
![KMI Academic & Curriculum](<asset/Macbook-Air-localhost (2).webp>)

### 4. Portal Penerimaan Santri Baru (PSB)
![PSB Admission Portal](<asset/Macbook-Air-localhost (3).webp>)

### 5. Hub Publikasi & Jurnal Ilmiah
![Publication Hub](<asset/Macbook-Air-localhost (4).webp>)

### 6. Control Panel Admin - Manajemen Data Santri
![Admin Santri Management](<asset/Macbook-Air-localhost (5).webp>)

### 7. Galeri Media & Dokumentasi Kegiatan
![Media Gallery](<asset/Macbook-Air-localhost (6).webp>)

### 8. Portal Berita & Artikel Blog
![Blog News Portal](<asset/Macbook-Air-localhost (7).webp>)

### 9. Portal Pembayaran Tuition & Verifikasi Tagihan
![Payment Portal](<asset/Macbook-Air-localhost (8).webp>)

### 10. Pengaturan Profil & Sistem
![User Profile & Settings](<asset/Macbook-Air-localhost (9).webp>)

</details>

---

## 🛠️ Modul & Fitur Utama

| Modul | Deskripsi Fitur |
| :--- | :--- |
| **Pendidikan & KMI** | Pengelolaan mata pelajaran KMI, jadwal pelajaran, penilaian (rapor digital), dan daftar kelas. |
| **PSB (Penerimaan Santri Baru)** | Form pendaftaran online, unggah dokumen (KTP/KK/Ijazah), seleksi wawancara, dan status kelulusan. |
| **Manajemen Santri** | Data induk santri, wali santri, riwayat pelanggaran/prestasi, kamar asrama, dan status aktif. |
| **Publikasi & Jurnal** | Platform karya ilmiah & jurnal pesantren, alur peer-review, ruang kolaborasi riset, dan ekspor PDF. |
| **Keuangan & Pembayaran** | Pembayaran SPP/uang pangkal online, verifikasi bukti transfer oleh admin, dan histori transaksi. |
| **Konten & Berita** | Manajemen berita, pengumuman, galeri foto/kegiatan, dan slider banner dinamis. |

---

## ⚡ Panduan Memulai Cepat (Quick Start)

### 1. Clone & Install Dependensi
```bash
git clone https://github.com/dresar/pesantren-hub.git
cd pesantren-hub

# Install dependensi frontend
npm install

# Install dependensi backend API
cd server
npm install
```

### 2. Konfigurasi Database & Environment
Buat file `server/.env` dan isi koneksi Neon PostgreSQL:
```env
DATABASE_URL=postgresql://user:password@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your_jwt_secret
```

### 3. Migrasi Database & Jalankan Server Dev
```bash
# Push schema ke database
cd server
npm run db:push

# Jalankan frontend & backend bersamaan
cd ..
npm run dev:all
```

Akses aplikasi di browser pada `http://localhost:5173`.
