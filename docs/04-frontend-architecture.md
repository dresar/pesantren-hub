# Frontend Architecture & Component Guide

## 1. Overview

The frontend layer of **Pesantren Hub** is built with **React 18**, **TypeScript**, and **Vite**. It features a modern SPA (Single Page Application) design pattern, reactive UI state management, and optimized asset bundling.

---

## 2. Project Layout (`/src`)

```
src/
├── assets/         # Static visual assets, logos, fallback images
├── components/     # Reusable UI elements (Buttons, Cards, Inputs, Modals, Navbars)
├── config/         # Application constants, menu items, environment mappings
├── data/           # Mock data fallback, static metadata
├── hooks/          # Custom React hooks (useAuth, useFetch, useMediaQuery)
├── layouts/        # Page wrappers (PublicLayout, AdminLayout, DashboardLayout)
├── lib/            # Utility functions, axios client config (`api.ts`), formatters
├── pages/          # View components categorized by domain (Website, Admin, PSB, KMI)
├── services/       # Modular API service handlers
├── stores/         # Zustand global state stores (useAuthStore, useThemeStore)
├── types/          # TypeScript interface & type definitions
└── App.tsx         # Central application routing & provider setup
```

---

## 3. UI Design System & Styling Principles

### Aesthetic Philosophy
* **Modern Emerald & Dark Mode**: Tailored HSL color palette featuring deep emerald greens, sleek dark slate tones, subtle glassmorphism (`backdrop-blur`), and gold highlights suitable for Islamic educational institutions.
* **Typography**: Clean, readable sans-serif typography paired with elegant headers.
* **Interactive Micro-Animations**: Smooth hover transitions, scale-ups, and interactive card states.

---

## 4. Routing Architecture (`App.tsx`)

The application routes are structured into distinct access areas:

1. **Public Website Routes**:
   * `/` - Landing Page & Hero Overview
   * `/tentang` - About Pesantren & Vision
   * `/pendidikan` - Educational Programs & KMI Overview
   * `/psb` - Student Admissions Portal
   * `/publikasi` - Research Papers & Academic Journals
   * `/berita` - News & Blog Hub
   * `/galeri` - Media Gallery & Video Showcase
   * `/kontak` - Contact & Location

2. **Authentication Routes**:
   * `/login` - Portal Login
   * `/register` - Account Registration

3. **Admin & Portal Routes**:
   * `/admin` - Control Center Dashboard
   * `/admin/santri` - Santri Directory & Profile Management
   * `/admin/kmi` - Academic Schedule & Grade Management
   * `/admin/psb` - Admission Registrations & Validation
   * `/admin/pembayaran` - Billing & Financial Verification
   * `/admin/publikasi` - Research Article Approval & Volume Management

---

## 5. State Management Architecture

* **Auth State (`useAuthStore`)**: Manages user authentication tokens, current user object, role checks (`hasRole`), and automatic session expiry handling.
* **Theme Store (`useThemeStore`)**: Manages light/dark mode preference persistent across browser sessions.
* **Notification Store**: Handles dynamic toast notifications for API success/error feedback.

---

## 6. API Client Integration (`src/lib/api.ts`)

Axios is configured with centralized request & response interceptors:
* Automatically attaches `Authorization: Bearer <token>` to outbound requests.
* Intercepts 401 Unauthorized responses to trigger automatic session refresh or redirection to `/login`.
* Formats unified API error messages for frontend component consumption.
