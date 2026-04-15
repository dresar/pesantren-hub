import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is MISSING.');
  console.info('Wait... proceeding initialization anyway (this might be a build process or environment delay).');
}

// ── Vercel Serverless Configuration ──────────────────────────────────────────
// In serverless environments, WebSocket is required for the Pool driver.
// The 'ws' polyfill provides WebSocket support in Node.js (Vercel runtime).
// This keeps full compatibility with Drizzle relational queries, .execute(),
// .returning(), and all existing code patterns.
neonConfig.webSocketConstructor = ws as any;

// Use a minimal pool: each serverless instance gets its own pool.
// max: 1 is sufficient since each function invocation handles one request.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || '',
  max: 1,
});

export const db = drizzle(pool, { schema });