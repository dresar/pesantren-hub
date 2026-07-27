# Backend API Endpoints & Route Reference

## 1. Overview

The Pesantren Hub API is built using **Hono** framework and mounted under the `/api` prefix. All endpoints enforce standard JSON payloads, CORS policies, and structured error responses.

---

## 2. Global API Conventions

### Base URL
`http://localhost:5000/api` (Development) or `https://domain.com/api` (Production)

### Response Standard Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Standard Format
```json
{
  "error": "Error description message",
  "name": "ErrorName",
  "path": "/api/module/endpoint",
  "timestamp": "2026-07-27T13:39:00.000Z"
}
```

---

## 3. Module Endpoint Reference

### 3.1 Auth Module (`/api/auth`)
* `POST /api/auth/register` - Create a new user account.
* `POST /api/auth/login` - Authenticate user credentials and return JWT token.
* `POST /api/auth/logout` - Invalidate user token / clear auth cookie.
* `GET /api/auth/me` - Fetch currently authenticated user profile.
* `POST /api/auth/refresh` - Refresh session JWT token.

### 3.2 Admin Module (`/api/admin`)
* `GET /api/admin/dashboard` - Get overall system statistics (total santri, admissions, revenues).
* `GET /api/admin/users` - List all registered accounts with role filter.
* `PUT /api/admin/users/:id/role` - Update user role & access permissions.
* `GET /api/admin/audit-logs` - Retrieve security and system activity logs.

### 3.3 Santri Management (`/api/santri`)
* `GET /api/santri` - List all santri with pagination & search filter.
* `POST /api/santri` - Register a new santri student profile.
* `GET /api/santri/:id` - Fetch detailed santri information & academic records.
* `PUT /api/santri/:id` - Update santri profile, class assignment, or status.
* `DELETE /api/santri/:id` - Soft delete santri profile.

### 3.4 KMI Academic Module (`/api/kmi`)
* `GET /api/kmi/subjects` - List KMI curriculum subjects.
* `POST /api/kmi/subjects` - Create a new subject entry.
* `GET /api/kmi/schedules` - Retrieve class timetables.
* `POST /api/kmi/grades` - Input student grades for midterm/final exams.
* `GET /api/kmi/report-card/:santriId` - Generate KMI digital report card (Rapor).

### 3.5 PSB Admissions Module (`/api/psb`)
* `POST /api/psb/register` - Public student admission form submission.
* `GET /api/psb/registrations` - Admin view of pending registration submissions.
* `GET /api/psb/registrations/:id` - Fetch candidate details and uploaded documents.
* `PUT /api/psb/registrations/:id/status` - Update admission status (`accepted`, `rejected`, `testing`).

### 3.6 Publication Hub Module (`/api/publication`)
* `GET /api/publication/articles` - List published research papers & articles.
* `POST /api/publication/articles` - Submit draft paper for peer review.
* `GET /api/publication/articles/:slug` - Read specific article details.
* `PUT /api/publication/articles/:id/status` - Editor approval/rejection endpoint.
* `GET /api/publication/volumes` - List journal volumes & releases.
* `POST /api/publication/collaborations` - Create a research group workspace.

### 3.7 Payments Module (`/api/payments`)
* `GET /api/payments/bills` - Fetch student fee bills and payment status.
* `POST /api/payments/confirm` - Upload proof of payment for manual verification.
* `GET /api/payments/verify` - Admin endpoint to approve or reject pending payments.

### 3.8 Blog & Content Module (`/api/blog`)
* `GET /api/blog/posts` - Fetch news and articles with category filter.
* `POST /api/blog/posts` - Publish or draft a blog post.
* `DELETE /api/blog/posts/:id` - Remove blog post.

### 3.9 Upload & Media Module (`/api/upload` & `/api/media`)
* `POST /api/upload` - File upload handler (Images, PDFs, Documents).
* `GET /api/media` - List stored media files & asset metadata.
* `DELETE /api/media/:id` - Delete media file entry.

### 3.10 Core & Notifications (`/api/core` & `/api/notifications`)
* `GET /api/core/settings` - Public site config (Hero text, contact, social links).
* `PUT /api/core/settings` - Admin site configuration updater.
* `GET /api/notifications` - Retrieve logged user notifications.
* `PUT /api/notifications/read` - Mark notifications as read.
