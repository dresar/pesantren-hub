/**
 * CPANEL PRODUCTION SERVER ENTRY POINT
 * ─────────────────────────────────────────────────────────────────────────────
 * This file is used for production deployment on cPanel.
 * It wraps the Hono app with @hono/node-server's serve() function.
 */
import 'dotenv/config';
import { serve } from '@hono/node-server';
import app from './index';

// Optimization for 3GB RAM:
// We suggest setting NODE_OPTIONS="--max-old-space-size=2048" in cPanel environment.

const PORT = Number(process.env.PORT) || 3008;

console.log(`\n📦 Initializing Pesantren Hub API (Production)...`);

serve({
  fetch: app.fetch,
  port: PORT,
}, (info) => {
  console.log(`\n🚀 [PRODUCTION] Hono API Server is live!`);
  console.log(`   Port: ${info.port}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`   RAM Limit: 2048MB (suggested)\n`);
});
