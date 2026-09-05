# Deployment & Operational Guide

## 1. Environment Setup & Configuration

### Prerequisites
* **Node.js**: v18.x or higher
* **npm**: v9.x or higher
* **PostgreSQL Database**: Neon DB or standard PostgreSQL instance

---

## 2. Environment Variables (.env)

Ensure both frontend and server environment variables are properly initialized.

### Server `.env` (`server/.env`)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Connection (Neon Postgres)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Authentication Secrets
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# File Storage Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760 # 10MB in bytes
```

### Frontend `.env` (`.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_TITLE=Pesantren Hub
```

---

## 3. Database Migration & Schema Sync

Pesantren Hub uses **Drizzle Kit** to manage schema migrations.

```bash
# Navigate to server directory
cd server

# Generate Drizzle migration files
npm run db:generate

# Push schema directly to Neon DB
npm run db:push

# Run seed script for initial master data
npm run db:seed
```

---

## 4. Local Development Execution

```bash
# In project root:
# Run frontend dev server
npm run dev

# In server directory:
# Run Hono API server with tsx hot-reload
cd server
npm run dev
```

Or run all concurrently using the root package runner:
```bash
npm run dev:all
```

---

## 5. Deployment Options

### Option A: cPanel / Shared Hosting Target
The repository includes pre-configured entry points for cPanel NodeJS application deployments (`server/src/entry-cpanel.ts`).

1. Build backend bundle:
   ```bash
   cd server
   npm run build:cpanel
   ```
2. Upload `app.cjs` and `package.json` to cPanel NodeJS App directory.
3. Build Vite static frontend:
   ```bash
   npm run build
   ```
4. Copy `/dist` contents to public Webroot (`public_html`).

### Option B: Cloud Serverless (Vercel / Railway / Render)
* **Frontend**: Deploy root directory to Vercel connected to Git repository. Build command: `npm run build`, Output directory: `dist`.
* **Backend API**: Deploy `server` directory as a web service with start command `node dist/index.js` or serverless handler.

---

## 6. Maintenance & Performance Checklist

* **Database Indexing**: Ensure foreign keys (`user_id`, `santri_id`, `article_id`) are indexed in `schema.ts`.
* **CORS Whitelisting**: Set `FRONTEND_URL` in server `.env` to match exact production client domain.
* **File Upload Cleaning**: Monitor `server/uploads` directory for orphaned media files.
* **HTTPS & SSL**: Always enforce HTTPS in production for JWT token security.
