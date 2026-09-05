/**
 * LOCAL DEVELOPMENT SERVER
 * ─────────────────────────────────────────────────────────────────────────────
 * This file is ONLY used during local development via `npm run dev:api`.
 * For production (Vercel), the serverless entry point is at api/index.ts.
 *
 * It wraps the Hono app with @hono/node-server's serve() function.
 */
import 'dotenv/config';
import { serve } from '@hono/node-server';
import app from './index';

const PORT = Number(process.env.PORT) || 3008;

serve({
  fetch: app.fetch,
  port: PORT,
}, (info) => {
  console.log(`\n🚀 [DEV] Hono API Server running on http://localhost:${info.port}`);
  console.log(`   Routes: /api/auth, /api/admin, /api/core, /api/blog, ...`);
  console.log(`   Mode: LOCAL DEVELOPMENT (not for Vercel production)\n`);
});
