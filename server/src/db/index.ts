import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is MISSING.');
  console.info('Wait... proceeding initialization anyway (this might be a build process or environment delay).');
}

// Use stateless HTTP driver for Vercel Serverless compatibility.
// Unlike Pool, neon() is fully stateless — each query is an independent HTTP request
// to Neon's SQL-over-HTTP endpoint. No persistent TCP connections, no WebSocket upgrades,
// no connection pool state to leak across cold starts.
const sql = neon(process.env.DATABASE_URL || '');

export const db = drizzle(sql as NeonQueryFunction<boolean, boolean>, { schema });